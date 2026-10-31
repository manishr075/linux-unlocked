/* ============================================================
   LINUX UNLOCKED — Precision Processor & Motherboard Boot Scene
   ============================================================
   A precision-rendered computing-themed boot visualization:
   - Layered PCB motherboard substrate with circuit traces
   - CPU socket with LGA gold contacts and ceramic carrier
   - Exposed silicon micro-die with custom physically correct
     view-space Fresnel & circuit pulse GLSL shader
   - Dual high-speed RAM DIMM modules with memory chips
   - Surface-mount diagnostic LEDs that sequence through
     hardware POST and kernel initialization
   ============================================================ */

import * as THREE from "three";
import type { SceneModule, SceneContext } from "@/three/core/SceneManager";

// --- GLSL Shaders with Physically Consistent View-Space Coordinates ---

const cpuDieVertexShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPulse;

  void main() {
    vUv = uv;
    // Mathematically consistent View-Space transformations
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const cpuDieFragmentShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uPulse;
  uniform vec3 uColorBase;
  uniform vec3 uColorTraces;
  uniform vec3 uColorPulse;

  // Procedural micro-circuit grid
  float microGrid(vec2 p, float scale) {
    vec2 g = fract(p * scale);
    float l = step(0.92, g.x) + step(0.92, g.y);
    return clamp(l, 0.0, 1.0);
  }

  void main() {
    vec3 normal = normalize(vViewNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Physically accurate Fresnel in View Space
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.0);

    // Micro-circuit traces across the silicon die
    float grid1 = microGrid(vUv, 28.0);
    float grid2 = microGrid(vUv, 7.0);

    // Electrical data packets traveling along x and y coordinates
    float pulseX = sin(vUv.x * 32.0 - uTime * 4.0);
    float pulseY = cos(vUv.y * 32.0 - uTime * 3.5);
    float pulseWaves = smoothstep(0.7, 0.98, pulseX * pulseY) * (0.6 + 0.4 * uPulse);

    // Composite colors
    vec3 color = uColorBase;
    color += uColorTraces * (grid1 * 0.2 + grid2 * 0.45);
    color += uColorPulse * pulseWaves * 1.8;
    color += uColorTraces * fresnel * 0.75;

    gl_FragColor = vec4(color, 0.95);
  }
`;

export interface BootSceneOptions {
  /** 0 → 1 progress driven externally (e.g. by GSAP ScrollTrigger). */
  getProgress?: () => number;
}

export function createBootScene(options: BootSceneOptions = {}): SceneModule {
  let rootGroup: THREE.Group;
  let dieMesh: THREE.Mesh;
  let dieShaderMat: THREE.ShaderMaterial;
  let ledMaterials: THREE.MeshBasicMaterial[] = [];
  let traceLineSegments: THREE.LineSegments;
  const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  return {
    id: "boot-sequence",

    init(ctx: SceneContext) {
      const { scene, camera } = ctx;
      rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // 1. Motherboard PCB Substrate
      const pcbGeom = new THREE.BoxGeometry(4.8, 4.4, 0.08);
      disposables.push(pcbGeom);
      const pcbMat = new THREE.MeshStandardMaterial({
        color: 0x07090e,
        roughness: 0.85,
        metalness: 0.2,
      });
      disposables.push(pcbMat);
      const pcb = new THREE.Mesh(pcbGeom, pcbMat);
      pcb.position.z = -0.05;
      rootGroup.add(pcb);

      // 2. CPU Socket Base (LGA socket boundary)
      const socketGeom = new THREE.BoxGeometry(2.5, 2.5, 0.1);
      disposables.push(socketGeom);
      const socketMat = new THREE.MeshStandardMaterial({
        color: 0x12151e,
        roughness: 0.6,
        metalness: 0.4,
      });
      disposables.push(socketMat);
      const socket = new THREE.Mesh(socketGeom, socketMat);
      socket.position.set(0, 0.1, 0.04);
      rootGroup.add(socket);

      // Gold pins / contacts rim around socket
      const pinRimGeom = new THREE.RingGeometry(1.28, 1.34, 4);
      disposables.push(pinRimGeom);
      const pinRimMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
      });
      disposables.push(pinRimMat);
      const pinRim = new THREE.Mesh(pinRimGeom, pinRimMat);
      pinRim.rotation.z = Math.PI / 4;
      pinRim.position.set(0, 0.1, 0.1);
      rootGroup.add(pinRim);

      // 3. Central Silicon Die with Custom GLSL Shader
      const dieGeom = new THREE.BoxGeometry(1.5, 1.5, 0.08);
      disposables.push(dieGeom);
      dieShaderMat = new THREE.ShaderMaterial({
        vertexShader: cpuDieVertexShader,
        fragmentShader: cpuDieFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 0 },
          uColorBase: { value: new THREE.Color("#090d16") },
          uColorTraces: { value: new THREE.Color("#22d3ee") },
          uColorPulse: { value: new THREE.Color("#38bdf8") },
        },
        transparent: true,
      });
      disposables.push(dieShaderMat);
      dieMesh = new THREE.Mesh(dieGeom, dieShaderMat);
      dieMesh.position.set(0, 0.1, 0.13);
      rootGroup.add(dieMesh);

      // Die metallic rim (heat spreader lip)
      const rimGeom = new THREE.BoxGeometry(1.64, 1.64, 0.06);
      disposables.push(rimGeom);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.9,
        roughness: 0.2,
      });
      disposables.push(rimMat);
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.position.set(0, 0.1, 0.09);
      rootGroup.add(rim);

      // 4. Dual RAM DIMM Modules (Left & Right of CPU)
      const ramGeom = new THREE.BoxGeometry(0.35, 3.4, 0.12);
      disposables.push(ramGeom);
      const ramMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.3,
        roughness: 0.7,
      });
      disposables.push(ramMat);

      // Chip geometry for DIMMs
      const chipGeom = new THREE.BoxGeometry(0.24, 0.45, 0.06);
      disposables.push(chipGeom);
      const chipMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.5,
        roughness: 0.4,
      });
      disposables.push(chipMat);

      [-1.8, 1.8].forEach((xPos) => {
        const dimm = new THREE.Mesh(ramGeom, ramMat);
        dimm.position.set(xPos, 0.1, 0.07);
        rootGroup.add(dimm);

        // Add 4 memory IC chips on each DIMM
        for (let i = -1.2; i <= 1.2; i += 0.8) {
          const chip = new THREE.Mesh(chipGeom, chipMat);
          chip.position.set(xPos, 0.1 + i, 0.14);
          rootGroup.add(chip);
        }
      });

      // 5. High-Speed Bus Traces (connecting CPU to Memory & Chipset)
      const tracePoints: THREE.Vector3[] = [];
      // Horizontal traces from CPU to left/right RAM
      for (let y = -0.8; y <= 1.0; y += 0.25) {
        // Left bus
        tracePoints.push(new THREE.Vector3(-0.8, y + 0.1, 0.02));
        tracePoints.push(new THREE.Vector3(-1.6, y + 0.1, 0.02));
        // Right bus
        tracePoints.push(new THREE.Vector3(0.8, y + 0.1, 0.02));
        tracePoints.push(new THREE.Vector3(1.6, y + 0.1, 0.02));
      }
      // Vertical traces to PCIe edge connector at bottom
      for (let x = -1.2; x <= 1.2; x += 0.3) {
        tracePoints.push(new THREE.Vector3(x, -1.2, 0.02));
        tracePoints.push(new THREE.Vector3(x, -2.0, 0.02));
      }

      const traceGeom = new THREE.BufferGeometry().setFromPoints(tracePoints);
      disposables.push(traceGeom);
      const traceMat = new THREE.LineBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.45,
      });
      disposables.push(traceMat);
      traceLineSegments = new THREE.LineSegments(traceGeom, traceMat);
      rootGroup.add(traceLineSegments);

      // 6. Surface-Mount POST / Diagnostic LEDs (bottom right of CPU)
      const ledGeom = new THREE.BoxGeometry(0.08, 0.08, 0.05);
      disposables.push(ledGeom);
      const ledColors = [0xf59e0b, 0x38bdf8, 0x22d3ee, 0x10b981]; // CPU, DRAM, KERNEL, READY
      ledColors.forEach((color, idx) => {
        const mat = new THREE.MeshBasicMaterial({ color });
        disposables.push(mat);
        ledMaterials.push(mat);
        const led = new THREE.Mesh(ledGeom, mat);
        led.position.set(0.95 + idx * 0.18, -1.3, 0.04);
        rootGroup.add(led);
      });

      // 7. Lighting
      const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
      scene.add(ambientLight);

      const topKeyLight = new THREE.DirectionalLight(0x22d3ee, 1.5);
      topKeyLight.position.set(2, 3, 5);
      scene.add(topKeyLight);

      const rimLight = new THREE.PointLight(0xa855f7, 2, 10);
      rimLight.position.set(-3, -2, 3);
      scene.add(rimLight);

      // Initial orientation & camera framing
      rootGroup.rotation.x = -0.45;
      rootGroup.rotation.y = 0.25;
      rootGroup.rotation.z = -0.05;
      camera.position.set(0, -0.4, 5.2);
      camera.lookAt(0, 0, 0);
    },

    update(ctx: SceneContext) {
      const t = ctx.elapsed;
      const progress = options.getProgress?.() ?? 0;

      // Pulse uniform update
      const pulse = 0.5 + Math.sin(t * 2.0) * 0.3 + progress * 0.5;
      dieShaderMat.uniforms.uTime.value = t;
      dieShaderMat.uniforms.uPulse.value = pulse;

      // Gentle floating motherboard parallax
      rootGroup.rotation.y = 0.25 + Math.sin(t * 0.4) * 0.06;
      rootGroup.rotation.x = -0.45 + Math.cos(t * 0.3) * 0.04 - progress * 0.2;

      // POST Diagnostic LEDs sequential blink
      const cycle = Math.floor(t * 3) % 4;
      ledMaterials.forEach((mat, i) => {
        mat.opacity = (i <= cycle || progress > 0.3) ? 1.0 : 0.2;
      });

      // Subtle trace line opacity pulse
      (traceLineSegments.material as THREE.LineBasicMaterial).opacity = 0.35 + Math.sin(t * 3.0) * 0.15;

      // Camera distance eases slightly with progress
      ctx.camera.position.z = 5.2 - progress * 0.8;
      ctx.camera.lookAt(0, 0, 0);
    },

    onResize(width: number, height: number, ctx: SceneContext) {
      ctx.camera.fov = width < height ? 58 : 46;
      ctx.camera.updateProjectionMatrix();
    },

    dispose() {
      disposables.forEach((item) => item.dispose());
      ledMaterials = [];
    },
  };
}
