/* ============================================================
   Boot Sequence Scene (Module A — cinematic homepage)
   ------------------------------------------------------------
   A real-time Three.js scene: a wireframe kernel "core" that
   pulses and assembles while boot-log text lines orbit it.
   Demonstrates the scene-manager lifecycle and a custom
   ShaderMaterial with fresnel + procedural noise glow.

   This is intentionally lightweight (low geometry count, single
   shader) so it runs well on mid-tier devices. Heavy scenes are
   built later, one at a time.
   ============================================================ */

import * as THREE from "three";
import type { SceneModule, SceneContext } from "@/three/core/SceneManager";

// --- GLSL snippets (kept inline for a single self-contained module) ---

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uPulse;

  // Simple 3D noise (hash-based, cheap)
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    // Subtle vertex displacement driven by noise + pulse
    float n = hash(position * 3.0 + uTime * 0.3) * 0.04;
    vec3 displaced = position + normal * (n + uPulse * 0.08);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  void main() {
    // Fresnel: brighter at grazing angles
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
    vec3 color = mix(uColorA, uColorB, fresnel);
    // Slow shimmer
    float shimmer = 0.5 + 0.5 * sin(uTime * 1.5 + vPosition.y * 4.0);
    color += vec3(0.05) * shimmer;
    gl_FragColor = vec4(color, 0.85);
  }
`;

export interface BootSceneOptions {
  /** 0 → 1 progress driven externally (e.g. by GSAP ScrollTrigger). */
  getProgress?: () => number;
}

export function createBootScene(options: BootSceneOptions = {}): SceneModule {
  // Module-local state (each mount gets its own).
  let core: THREE.Mesh;
  let wire: THREE.Mesh;
  let shaderMat: THREE.ShaderMaterial;
  let rings: THREE.Line[] = [];
  let particleGeom: THREE.BufferGeometry;
  let particleMat: THREE.PointsMaterial;
  let particles: THREE.Points;
  let group: THREE.Group;

  return {
    id: "boot-sequence",

    init(ctx: SceneContext) {
      const { scene, camera } = ctx;
      group = new THREE.Group();
      scene.add(group);

      // ---- Kernel "core": an icosahedron with a custom shader ----
      const coreGeom = new THREE.IcosahedronGeometry(1.6, 2);
      shaderMat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uColorA: { value: new THREE.Color("#0a0c12") },
          uColorB: { value: new THREE.Color("#22d3ee") },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });
      core = new THREE.Mesh(coreGeom, shaderMat);
      group.add(core);

      // Wireframe overlay for definition
      const wireGeom = new THREE.IcosahedronGeometry(1.7, 1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      wire = new THREE.Mesh(wireGeom, wireMat);
      group.add(wire);

      // ---- Orbiting rings (boot "tracks") ----
      for (let i = 0; i < 3; i++) {
        const radius = 2.6 + i * 0.4;
        const segments = 64;
        const points: THREE.Vector3[] = [];
        for (let j = 0; j <= segments; j++) {
          const a = (j / segments) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
        }
        const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
        const ringMat = new THREE.LineBasicMaterial({
          color: i === 0 ? 0x22d3ee : i === 1 ? 0x3b82f6 : 0x8b5cf6,
          transparent: true,
          opacity: 0.3,
        });
        const ring = new THREE.Line(ringGeom, ringMat);
        ring.rotation.x = (Math.PI / 3) * i;
        ring.rotation.z = (Math.PI / 6) * i;
        rings.push(ring);
        group.add(ring);
      }

      // ---- Particle field (neural network hint) ----
      const count = 400;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = 3 + Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      particleGeom = new THREE.BufferGeometry();
      particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particleMat = new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.03,
        transparent: true,
        opacity: 0.6,
      });
      particles = new THREE.Points(particleGeom, particleMat);
      group.add(particles);

      // ---- Lighting ----
      scene.add(new THREE.AmbientLight(0x1a2030, 1));
      const point = new THREE.PointLight(0x22d3ee, 1.5, 20);
      point.position.set(3, 2, 4);
      scene.add(point);

      camera.position.set(0, 0, 6);
    },

    update(ctx: SceneContext) {
      const t = ctx.elapsed;
      const progress = options.getProgress?.() ?? 0;

      // Pulse grows with scroll progress
      const pulse = 0.3 + Math.sin(t * 1.5) * 0.15 + progress * 0.5;
      shaderMat.uniforms.uTime.value = t;
      shaderMat.uniforms.uPulse.value = pulse;

      // Core rotation
      core.rotation.y = t * 0.3;
      core.rotation.x = t * 0.15;
      wire.rotation.y = -t * 0.2;
      wire.rotation.z = t * 0.1;

      // Rings orbit
      rings.forEach((ring, i) => {
        ring.rotation.y = t * (0.2 + i * 0.1);
        ring.rotation.x = t * 0.05 * (i + 1);
      });

      // Particles slow rotation
      particles.rotation.y = t * 0.05;
      particles.rotation.x = t * 0.03;

      // Camera eases in with progress
      ctx.camera.position.z = 6 - progress * 1.5;
      ctx.camera.lookAt(0, 0, 0);
    },

    onResize(width: number, height: number, ctx: SceneContext) {
      // Camera aspect handled by manager; adjust subtle FOV shift for portrait
      ctx.camera.fov = width < height ? 60 : 50;
      ctx.camera.updateProjectionMatrix();
    },

    dispose() {
      core.geometry.dispose();
      shaderMat.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      rings = [];
      particleGeom.dispose();
      particleMat.dispose();
    },
  };
}
