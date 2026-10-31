/* ============================================================
   LINUX UNLOCKED — Exploded Architecture Scene (Centerpiece)
   ------------------------------------------------------------
   A real-time native Three.js 3D experience visualizing the 
   complete operating system stack from silicon to user space:

     Layer 0: Hardware Foundation (Motherboard PCB, CPU die, DDR5 RAM, PCIe, NVMe)
     Layer 1: Linux Monolithic Kernel (Scheduler, Memory, VFS, Drivers, Net, Syscalls)
     Layer 2: Init System & Daemons (PID 1 / systemd, udev, journald, D-Bus)
     Layer 3: Display Server & Audio (Wayland compositor, PipeWire graph, Mesa)
     Layer 4: Desktop Environment & Shell (Top panel, dock, window management)
     Layer 5: Userland Applications & Containers (Terminal, Browser, Flatpaks)

   Features:
     - 100% mathematically consistent View-Space GLSL Fresnel shaders
     - Interactive 3D Raycasting: click any layer to highlight & inspect
     - Smooth GSAP ScrollTrigger vertical expansion along Y-axis
     - High performance with efficient geometry and disposal cleanup
   ============================================================ */

import * as THREE from "three";
import type { SceneModule, SceneContext } from "@/three/core/SceneManager";

// --- GLSL Shaders with Consistent View-Space Transformations ---

const circuitVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const circuitFragmentShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  uniform float uTime;
  uniform float uActive;
  uniform vec3 uColorBase;
  uniform vec3 uColorGrid;
  uniform vec3 uColorPulse;

  float grid(vec2 st, float res) {
    vec2 g = fract(st * res);
    return step(0.96, g.x) + step(0.96, g.y);
  }

  void main() {
    float g1 = grid(vUv, 24.0);
    float g2 = grid(vUv, 6.0);

    float pulse = sin(vUv.x * 20.0 + uTime * 3.0) * cos(vUv.y * 20.0 + uTime * 2.5);
    pulse = smoothstep(0.7, 0.95, pulse) * (0.5 + 0.5 * uActive);

    vec3 normal = normalize(vViewNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 color = uColorBase;
    color += uColorGrid * (g1 * 0.25 + g2 * 0.6);
    color += uColorPulse * pulse * 1.5;
    color += uColorGrid * fresnel * 0.5;

    gl_FragColor = vec4(color, 0.95);
  }
`;

const kernelVertexShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform float uDisplacement;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    float n = noise(position * 2.0 + uTime * 0.5) * 0.08;
    vec3 newPos = position + normal * (n * uDisplacement);
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const kernelFragmentShader = /* glsl */ `
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColorCore;
  uniform vec3 uColorGlow;
  uniform float uBrightness;

  void main() {
    vec3 normal = normalize(vViewNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);
    
    float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + vViewPosition.y * 3.0);
    vec3 color = mix(uColorCore, uColorGlow, fresnel + pulse * 0.2);
    color *= uBrightness;

    gl_FragColor = vec4(color, 0.9);
  }
`;

export interface ExplodedArchOptions {
  /** Callback to get current scroll progress (0.0 to 1.0). */
  getProgress?: () => number;
  /** Callback when the active focused layer changes (0 to 5). */
  onActiveLayerChange?: (layerIndex: number) => void;
  /** Callback when a 3D subsystem is clicked. */
  onSelectSubsystem?: (info: { layerIndex: number; name: string }) => void;
}

export function createExplodedArchScene(options: ExplodedArchOptions = {}): SceneModule {
  let rootGroup: THREE.Group;
  let layerGroups: THREE.Group[] = [];

  let circuitUniforms: { [key: string]: THREE.IUniform };
  let kernelUniforms: { [key: string]: THREE.IUniform };
  let dataConduits: THREE.LineSegments[] = [];
  let particleField: THREE.Points;

  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const materialsToDispose: THREE.Material[] = [];

  const LAYER_COUNT = 6;
  const MAX_Y_OFFSETS = [-3.2, -1.6, 0.0, 1.6, 3.2, 4.8];
  const COMPACT_ROT_Y = -Math.PI / 5;
  const EXPLODED_ROT_Y = -Math.PI / 7;

  let currentActiveLayer = -1;
  let clickCleanup: (() => void) | null = null;

  function trackGeom<T extends THREE.BufferGeometry>(geom: T): T {
    geometriesToDispose.push(geom);
    return geom;
  }

  function trackMat<T extends THREE.Material>(mat: T): T {
    materialsToDispose.push(mat);
    return mat;
  }

  /* -------------------------------------------------------------
     LAYER BUILDERS
     ------------------------------------------------------------- */

  // Layer 0: Hardware Foundation
  function buildHardwareLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 0, subsystemName: "Hardware Baseplate & Silicon" };

    // Base PCB slab
    const pcbGeom = trackGeom(new THREE.BoxGeometry(6.4, 0.2, 5.0));
    circuitUniforms = {
      uTime: { value: 0 },
      uActive: { value: 1.0 },
      uColorBase: { value: new THREE.Color("#070a12") },
      uColorGrid: { value: new THREE.Color("#22d3ee") },
      uColorPulse: { value: new THREE.Color("#38bdf8") },
    };
    const pcbMat = trackMat(
      new THREE.ShaderMaterial({
        vertexShader: circuitVertexShader,
        fragmentShader: circuitFragmentShader,
        uniforms: circuitUniforms,
        transparent: true,
      })
    );
    const pcbMesh = new THREE.Mesh(pcbGeom, pcbMat);
    pcbMesh.userData = { layerIndex: 0, subsystemName: "Dielectric PCB" };
    group.add(pcbMesh);

    // CPU Socket & Die
    const cpuSocketGeom = trackGeom(new THREE.BoxGeometry(1.6, 0.15, 1.6));
    const cpuSocketMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    const cpuSocket = new THREE.Mesh(cpuSocketGeom, cpuSocketMat);
    cpuSocket.position.set(-1.0, 0.15, 0);
    cpuSocket.userData = { layerIndex: 0, subsystemName: "LGA CPU Socket" };
    group.add(cpuSocket);

    // Golden CPU Heat Spreader / Core
    const cpuDieGeom = trackGeom(new THREE.BoxGeometry(1.1, 0.1, 1.1));
    const cpuDieMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.3,
        emissive: 0x78350f,
        emissiveIntensity: 0.4,
      })
    );
    const cpuDie = new THREE.Mesh(cpuDieGeom, cpuDieMat);
    cpuDie.position.set(-1.0, 0.25, 0);
    cpuDie.userData = { layerIndex: 0, subsystemName: "CPU Die (Ring 0 Access)" };
    group.add(cpuDie);

    // DDR5 RAM Slots & Sticks
    for (let i = 0; i < 4; i++) {
      const ramGeom = trackGeom(new THREE.BoxGeometry(0.12, 0.35, 2.2));
      const ramMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x0284c7 : 0x0f172a,
          metalness: 0.6,
          roughness: 0.3,
        })
      );
      const ram = new THREE.Mesh(ramGeom, ramMat);
      ram.position.set(0.8 + i * 0.3, 0.25, 0);
      ram.userData = { layerIndex: 0, subsystemName: `DDR5 DIMM Slot ${i + 1}` };
      group.add(ram);
    }

    // PCIe Bus Slots
    for (let i = 0; i < 2; i++) {
      const pcieGeom = trackGeom(new THREE.BoxGeometry(2.4, 0.12, 0.18));
      const pcieMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x334155,
          metalness: 0.5,
          roughness: 0.4,
        })
      );
      const pcie = new THREE.Mesh(pcieGeom, pcieMat);
      pcie.position.set(-0.6, 0.15, 1.4 + i * 0.5);
      pcie.userData = { layerIndex: 0, subsystemName: `PCIe 5.0 x16 Slot ${i + 1}` };
      group.add(pcie);
    }

    return group;
  }

  // Layer 1: Linux Kernel Monolithic Core
  function buildKernelLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 1, subsystemName: "Linux Monolithic Kernel Core" };

    // Central Volumetric Kernel Core
    const coreGeom = trackGeom(new THREE.IcosahedronGeometry(0.9, 3));
    kernelUniforms = {
      uTime: { value: 0 },
      uDisplacement: { value: 1.0 },
      uBrightness: { value: 1.2 },
      uColorCore: { value: new THREE.Color("#0c1527") },
      uColorGlow: { value: new THREE.Color("#22d3ee") },
    };
    const coreMat = trackMat(
      new THREE.ShaderMaterial({
        vertexShader: kernelVertexShader,
        fragmentShader: kernelFragmentShader,
        uniforms: kernelUniforms,
        transparent: true,
      })
    );
    const core = new THREE.Mesh(coreGeom, coreMat);
    core.position.set(0, 0, 0);
    core.userData = { layerIndex: 1, subsystemName: "Kernel Hub & Syscall Table" };
    group.add(core);

    // Surrounding Subsystem Satellites (Scheduler, VFS, Drivers, Net, Memory)
    const subsystems = [
      { name: "Process Scheduler", pos: [-1.8, 0, -1.0], color: 0x38bdf8 },
      { name: "Virtual Filesystem (VFS)", pos: [1.8, 0, -1.0], color: 0x818cf8 },
      { name: "Device Drivers & DRM", pos: [-1.8, 0, 1.0], color: 0x2dd4bf },
      { name: "TCP/IP & Network Stack", pos: [1.8, 0, 1.0], color: 0x34d399 },
      { name: "Memory Manager (Slab/Buddy)", pos: [0.0, 0, -1.8], color: 0xa855f7 },
    ];

    subsystems.forEach((sub) => {
      const subGeom = trackGeom(new THREE.BoxGeometry(0.8, 0.35, 0.8));
      const subMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: sub.color,
          metalness: 0.7,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85,
          emissive: sub.color,
          emissiveIntensity: 0.25,
        })
      );
      const mesh = new THREE.Mesh(subGeom, subMat);
      mesh.position.set(sub.pos[0], sub.pos[1], sub.pos[2]);
      mesh.userData = { layerIndex: 1, subsystemName: sub.name };
      group.add(mesh);

      // Connecting conduit to core
      const linePoints = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(sub.pos[0], sub.pos[1], sub.pos[2]),
      ];
      const lineGeom = trackGeom(new THREE.BufferGeometry().setFromPoints(linePoints));
      const lineMat = trackMat(
        new THREE.LineBasicMaterial({
          color: sub.color,
          transparent: true,
          opacity: 0.45,
        })
      );
      const line = new THREE.Line(lineGeom, lineMat);
      group.add(line);
    });

    // Wireframe perimeter ring
    const ringGeom = trackGeom(new THREE.TorusGeometry(2.6, 0.02, 16, 64));
    const ringMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.35,
      })
    );
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    return group;
  }

  // Layer 2: Init System & Daemons (systemd PID 1)
  function buildDaemonsLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 2, subsystemName: "Init System & Service Daemons" };

    // Central PID 1 (systemd) Tower
    const pid1Geom = trackGeom(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 6));
    const pid1Mat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.35,
      })
    );
    const pid1 = new THREE.Mesh(pid1Geom, pid1Mat);
    pid1.userData = { layerIndex: 2, subsystemName: "PID 1 Init Coordinator" };
    group.add(pid1);

    // Daemon Nodes (udev, journald, dbus, networkd, cron)
    const daemons = [
      { name: "systemd-udevd", pos: [-1.6, 0, -1.2] },
      { name: "systemd-journald", pos: [1.6, 0, -1.2] },
      { name: "D-Bus IPC Broker", pos: [-2.0, 0, 0.6] },
      { name: "systemd-networkd", pos: [2.0, 0, 0.6] },
      { name: "systemd-logind", pos: [0.0, 0, 1.8] },
    ];

    daemons.forEach((d) => {
      const dGeom = trackGeom(new THREE.OctahedronGeometry(0.32));
      const dMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x60a5fa,
          metalness: 0.5,
          roughness: 0.3,
          emissive: 0x2563eb,
          emissiveIntensity: 0.2,
        })
      );
      const dMesh = new THREE.Mesh(dGeom, dMat);
      dMesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      dMesh.userData = { layerIndex: 2, subsystemName: d.name };
      group.add(dMesh);

      // Bus connection to PID 1
      const lineGeom = trackGeom(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(d.pos[0], d.pos[1], d.pos[2]),
        ])
      );
      const lineMat = trackMat(
        new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.4,
        })
      );
      const line = new THREE.Line(lineGeom, lineMat);
      group.add(line);
    });

    return group;
  }

  // Layer 3: Display Server & Audio (Wayland / PipeWire)
  function buildDisplayLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 3, subsystemName: "Wayland Compositor & Audio Pipeline" };

    // Translucent Wayland Compositor Glass Plane
    const planeGeom = trackGeom(new THREE.PlaneGeometry(5.2, 3.8));
    const planeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0ea5e9,
        transmission: 0.88,
        opacity: 0.9,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        ior: 1.45,
        thickness: 0.5,
        side: THREE.DoubleSide,
      })
    );
    const plane = new THREE.Mesh(planeGeom, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.userData = { layerIndex: 3, subsystemName: "Wayland Compositor Surface" };
    group.add(plane);

    // Frame Border
    const frameGeom = trackGeom(new THREE.BoxGeometry(5.3, 0.05, 3.9));
    const frameMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      })
    );
    const frame = new THREE.Mesh(frameGeom, frameMat);
    group.add(frame);

    // PipeWire Audio Routing Node Points
    const audioPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      audioPoints.push(new THREE.Vector3(Math.cos(angle) * 1.6, 0.1, Math.sin(angle) * 1.0));
    }
    const audioGeom = trackGeom(new THREE.BufferGeometry().setFromPoints(audioPoints));
    const audioMat = trackMat(
      new THREE.PointsMaterial({
        color: 0x34d399,
        size: 0.16,
        transparent: true,
        opacity: 0.85,
      })
    );
    const audioMesh = new THREE.Points(audioGeom, audioMat);
    audioMesh.userData = { layerIndex: 3, subsystemName: "PipeWire Audio Graph Nodes" };
    group.add(audioMesh);

    return group;
  }

  // Layer 4: Desktop Environment & Shell (GNOME / KDE)
  function buildDesktopLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 4, subsystemName: "Desktop Environment Shell & Windows" };

    // Base Desktop Surface Frame
    const deskGeom = trackGeom(new THREE.PlaneGeometry(5.6, 4.0));
    const deskMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.3,
        roughness: 0.7,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      })
    );
    const desk = new THREE.Mesh(deskGeom, deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.userData = { layerIndex: 4, subsystemName: "Desktop Canvas" };
    group.add(desk);

    // Top Panel / Bar
    const barGeom = trackGeom(new THREE.BoxGeometry(5.4, 0.06, 0.3));
    const barMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.5,
        roughness: 0.3,
      })
    );
    const bar = new THREE.Mesh(barGeom, barMat);
    bar.position.set(0, 0.05, -1.75);
    bar.userData = { layerIndex: 4, subsystemName: "Top Panel & System Tray" };
    group.add(bar);

    // Floating Window Geometries
    const win1Geom = trackGeom(new THREE.BoxGeometry(2.0, 0.04, 1.4));
    const win1Mat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.15,
      })
    );
    const win1 = new THREE.Mesh(win1Geom, win1Mat);
    win1.position.set(-1.2, 0.1, 0.1);
    win1.userData = { layerIndex: 4, subsystemName: "Primary Window Frame" };
    group.add(win1);

    const win2Geom = trackGeom(new THREE.BoxGeometry(2.4, 0.04, 1.6));
    const win2Mat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.2,
      })
    );
    const win2 = new THREE.Mesh(win2Geom, win2Mat);
    win2.position.set(1.0, 0.12, -0.2);
    win2.userData = { layerIndex: 4, subsystemName: "Secondary Window Frame" };
    group.add(win2);

    // Dock Capsule at Bottom
    const dockGeom = trackGeom(new THREE.BoxGeometry(2.2, 0.08, 0.4));
    const dockMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.7,
        roughness: 0.2,
      })
    );
    const dock = new THREE.Mesh(dockGeom, dockMat);
    dock.position.set(0, 0.06, 1.65);
    dock.userData = { layerIndex: 4, subsystemName: "Application Dock" };
    group.add(dock);

    return group;
  }

  // Layer 5: User Applications & Container Ecosystem
  function buildAppsLayer(): THREE.Group {
    const group = new THREE.Group();
    group.userData = { layerIndex: 5, subsystemName: "User Applications & Containers" };

    const apps = [
      { name: "Terminal Emulator (pty)", pos: [-1.6, 0.2, -0.8], size: [1.6, 0.1, 1.2], color: 0x10b981 },
      { name: "Web Browser (Firefox)", pos: [1.4, 0.25, -0.6], size: [2.0, 0.1, 1.4], color: 0x38bdf8 },
      { name: "Code Editor (VS Code/Neovim)", pos: [-1.2, 0.3, 0.9], size: [1.8, 0.1, 1.3], color: 0x818cf8 },
      { name: "Flatpak / OCI Container Pod", pos: [1.5, 0.35, 1.1], size: [1.2, 0.25, 1.0], color: 0x06b6d4 },
    ];

    apps.forEach((app) => {
      const geom = trackGeom(new THREE.BoxGeometry(app.size[0], app.size[1], app.size[2]));
      const mat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x090d16,
          metalness: 0.7,
          roughness: 0.2,
          emissive: app.color,
          emissiveIntensity: 0.3,
        })
      );
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(app.pos[0], app.pos[1], app.pos[2]);
      mesh.userData = { layerIndex: 5, subsystemName: app.name };
      group.add(mesh);

      // Glowing Accent Border
      const wireGeom = trackGeom(new THREE.BoxGeometry(app.size[0] + 0.02, app.size[1] + 0.02, app.size[2] + 0.02));
      const wireMat = trackMat(
        new THREE.MeshBasicMaterial({
          color: app.color,
          wireframe: true,
          transparent: true,
          opacity: 0.7,
        })
      );
      const wire = new THREE.Mesh(wireGeom, wireMat);
      wire.position.set(app.pos[0], app.pos[1], app.pos[2]);
      group.add(wire);
    });

    return group;
  }

  // Inter-layer Vertical Conduits (System Call & Bus Visualizers)
  function buildDataConduits(): void {
    for (let i = 0; i < 4; i++) {
      const cornerX = (i % 2 === 0 ? 1 : -1) * 2.8;
      const cornerZ = (i < 2 ? 1 : -1) * 2.2;

      const points = [
        new THREE.Vector3(cornerX, MAX_Y_OFFSETS[0], cornerZ),
        new THREE.Vector3(cornerX, MAX_Y_OFFSETS[5] + 0.5, cornerZ),
      ];

      const geom = trackGeom(new THREE.BufferGeometry().setFromPoints(points));
      const mat = trackMat(
        new THREE.LineBasicMaterial({
          color: 0x22d3ee,
          transparent: true,
          opacity: 0.35,
        })
      );
      const conduit = new THREE.LineSegments(geom, mat);
      dataConduits.push(conduit);
      rootGroup.add(conduit);
    }
  }

  // Floating ambient process particles
  function buildProcessParticles(): THREE.Points {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8.0;
    }
    const geom = trackGeom(new THREE.BufferGeometry());
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = trackMat(
      new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.04,
        transparent: true,
        opacity: 0.6,
      })
    );
    return new THREE.Points(geom, mat);
  }

  return {
    id: "exploded-architecture",

    init(ctx: SceneContext) {
      const { scene, camera, renderer } = ctx;

      rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Build each of the 6 layers
      const l0 = buildHardwareLayer();
      const l1 = buildKernelLayer();
      const l2 = buildDaemonsLayer();
      const l3 = buildDisplayLayer();
      const l4 = buildDesktopLayer();
      const l5 = buildAppsLayer();

      layerGroups = [l0, l1, l2, l3, l4, l5];
      layerGroups.forEach((g) => rootGroup.add(g));

      // Build conduits and background process particles
      buildDataConduits();
      particleField = buildProcessParticles();
      rootGroup.add(particleField);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x0a101d, 1.8);
      scene.add(ambientLight);

      const mainSpot = new THREE.DirectionalLight(0x22d3ee, 2.2);
      mainSpot.position.set(6, 12, 8);
      scene.add(mainSpot);

      const secondaryLight = new THREE.DirectionalLight(0x8b5cf6, 1.4);
      secondaryLight.position.set(-6, -4, -6);
      scene.add(secondaryLight);

      // Initial camera setup
      camera.position.set(5.5, 3.5, 9.5);
      camera.lookAt(0, 0, 0);

      // Start in compact state
      rootGroup.rotation.y = COMPACT_ROT_Y;

      // Raycaster for interactive 3D subsystem picking
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const handleClick = (event: MouseEvent) => {
        const dom = renderer.domElement;
        const rect = dom.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(layerGroups, true);

        if (intersects.length > 0) {
          let target: THREE.Object3D | null = intersects[0].object;
          while (target && target.userData?.layerIndex === undefined && target.parent) {
            target = target.parent;
          }

          if (target && typeof target.userData?.layerIndex === "number") {
            const idx = target.userData.layerIndex;
            options.onActiveLayerChange?.(idx);
            if (target.userData.subsystemName) {
              options.onSelectSubsystem?.({
                layerIndex: idx,
                name: target.userData.subsystemName,
              });
            }
          }
        }
      };

      renderer.domElement.addEventListener("click", handleClick);
      clickCleanup = () => {
        renderer.domElement.removeEventListener("click", handleClick);
      };
    },

    update(ctx: SceneContext) {
      const t = ctx.elapsed;
      const progress = Math.max(0, Math.min(1, options.getProgress?.() ?? 0));

      // Update shader uniforms
      if (circuitUniforms) {
        circuitUniforms.uTime.value = t;
        circuitUniforms.uActive.value = 1.0 - progress * 0.4;
      }
      if (kernelUniforms) {
        kernelUniforms.uTime.value = t;
        kernelUniforms.uDisplacement.value = 0.5 + progress * 0.8;
      }

      // Smooth layer explosion interpolation (Y-offsets)
      layerGroups.forEach((layer, idx) => {
        const compactY = (idx - 2.5) * 0.25;
        const explodedY = MAX_Y_OFFSETS[idx];
        layer.position.y = THREE.MathUtils.lerp(compactY, explodedY, progress);
        layer.rotation.y = Math.sin(t * 0.5 + idx * 0.4) * 0.02 * (1 - progress);
      });

      // Synchronize overall root rotation based on scroll
      const targetRotY = THREE.MathUtils.lerp(COMPACT_ROT_Y, EXPLODED_ROT_Y, progress);
      rootGroup.rotation.y = targetRotY + Math.sin(t * 0.3) * 0.04;
      rootGroup.rotation.x = 0.15 + Math.cos(t * 0.25) * 0.02;

      // Conduit opacity increases as layers separate
      dataConduits.forEach((conduit) => {
        (conduit.material as THREE.LineBasicMaterial).opacity = 0.15 + progress * 0.45;
      });

      // Slow particle field drift
      particleField.rotation.y = t * 0.02;

      // Dynamic Camera Path tracking the active layer
      const targetCameraY = THREE.MathUtils.lerp(3.5, 2.0 + progress * 2.5, progress);
      const targetCameraZ = THREE.MathUtils.lerp(9.5, 8.0, progress);
      const targetCameraX = THREE.MathUtils.lerp(5.5, 4.5, progress);

      ctx.camera.position.x = THREE.MathUtils.lerp(ctx.camera.position.x, targetCameraX, 0.05);
      ctx.camera.position.y = THREE.MathUtils.lerp(ctx.camera.position.y, targetCameraY, 0.05);
      ctx.camera.position.z = THREE.MathUtils.lerp(ctx.camera.position.z, targetCameraZ, 0.05);
      ctx.camera.lookAt(0, progress * 1.5, 0);

      // Determine active focused layer for UI callback
      const activeIdx = Math.min(5, Math.floor(progress * LAYER_COUNT));
      if (activeIdx !== currentActiveLayer) {
        currentActiveLayer = activeIdx;
        options.onActiveLayerChange?.(activeIdx);
      }
    },

    onResize(width: number, height: number, ctx: SceneContext) {
      ctx.camera.fov = width < 768 ? 62 : 48;
      ctx.camera.updateProjectionMatrix();
    },

    dispose() {
      if (clickCleanup) {
        clickCleanup();
        clickCleanup = null;
      }

      geometriesToDispose.forEach((g) => g.dispose());
      geometriesToDispose.length = 0;

      materialsToDispose.forEach((m) => m.dispose());
      materialsToDispose.length = 0;

      dataConduits = [];
      layerGroups = [];
    },
  };
}
