/* ============================================================
   Three.js scene-manager core.
   Every 3D experience in LINUX UNLOCKED is an isolated, reusable
   module that follows the lifecycle defined here:

     create → init(container) → animate loop
            → onResize → dispose (full GPU resource cleanup)

   The SceneManager owns the renderer, scene, and camera for ONE
   mounted scene. There is never a hidden global renderer. Each
   scene exposes a stable API so animation code (GSAP) can drive
   camera/object transforms without poking internals.

   Key responsibilities:
     - Cap device pixel ratio for performance.
     - Pause the render loop when off-screen (IntersectionObserver).
     - Handle WebGL context loss/restore.
     - Dispose all GPU resources on teardown.
   ============================================================ */

import * as THREE from "three";

export interface SceneContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  clock: THREE.Clock;
  /** Monotonic seconds since scene init — use in animation updates. */
  elapsed: number;
  /** Seconds since last frame. */
  delta: number;
}

export interface SceneModule {
  /** Unique id for debugging. */
  id: string;
  /** Build scene objects, add to scene, return disposables to track. */
  init(ctx: SceneContext): void;
  /** Called every frame while visible. Mutate objects here, not the renderer. */
  update?(ctx: SceneContext): void;
  /** Free any resources the module created beyond what the manager tracks. */
  dispose?(ctx: SceneContext): void;
  /** Optional: handle window resize (camera aspect, etc. handled by manager). */
  onResize?(width: number, height: number, ctx: SceneContext): void;
}

interface ManagerOptions {
  /** Extra DPR cap; default 2. Weaker on low-tier devices. */
  maxDpr?: number;
  /** Pause rendering when the canvas is off-screen. Default true. */
  pauseWhenOffscreen?: boolean;
  /** Background clear color. */
  clearColor?: number;
}

export class SceneManager {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private module: SceneModule;
  private animationId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;
  private isRunning = false;
  private disposed = false;
  private ctx: SceneContext;
  private maxDpr: number;
  private boundResize: () => void;
  private boundContextLost: (e: Event) => void;
  private boundContextRestored: () => void;

  constructor(
    container: HTMLElement,
    module: SceneModule,
    options: ManagerOptions = {},
  ) {
    this.container = container;
    this.module = module;
    this.maxDpr = options.maxDpr ?? 2;
    const pauseWhenOffscreen = options.pauseWhenOffscreen ?? true;

    // ---- Renderer ----
    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    container.appendChild(this.canvas);

    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      if (this.canvas.parentElement === container) {
        container.removeChild(this.canvas);
      }
      throw err;
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxDpr));
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    if (options.clearColor !== undefined) {
      this.renderer.setClearColor(options.clearColor, 0);
    }

    // ---- Scene & camera ----
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 8);

    const startTime = performance.now() * 0.001;
    let prevTime = startTime;
    this.clock = {
      getDelta: () => {
        const now = performance.now() * 0.001;
        const diff = now - prevTime;
        prevTime = now;
        return diff;
      },
      get elapsedTime() {
        return performance.now() * 0.001 - startTime;
      },
      start: () => {},
      stop: () => {},
    } as unknown as THREE.Clock;

    this.ctx = {
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      clock: this.clock,
      elapsed: 0,
      delta: 0,
    };

    // ---- Module init ----
    this.module.init(this.ctx);

    // ---- Event handlers ----
    this.boundResize = this.handleResize.bind(this);
    this.boundContextLost = this.handleContextLost.bind(this);
    this.boundContextRestored = this.handleContextRestored.bind(this);
    this.canvas.addEventListener("webglcontextlost", this.boundContextLost, false);
    this.canvas.addEventListener(
      "webglcontextrestored",
      this.boundContextRestored,
      false,
    );

    window.addEventListener("resize", this.boundResize);
    this.resizeObserver = new ResizeObserver(this.boundResize);
    this.resizeObserver.observe(container);

    if (pauseWhenOffscreen) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.isVisible = entries[0]?.isIntersecting ?? true;
          if (this.isVisible && this.isRunning) this.startLoop();
          else this.stopLoop();
        },
        { threshold: 0 },
      );
      this.intersectionObserver.observe(container);
    }

    this.isRunning = true;
    this.startLoop();
  }

  private startLoop(): void {
    if (this.animationId !== null || this.disposed) return;
    const tick = () => {
      if (this.disposed) return;
      this.animationId = requestAnimationFrame(tick);
      if (!this.isVisible) return;
      this.ctx.delta = this.clock.getDelta();
      this.ctx.elapsed = this.clock.elapsedTime;
      this.module.update?.(this.ctx);
      this.renderer.render(this.scene, this.camera);
    };
    this.animationId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animationId === null) return;
    cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  private handleResize(): void {
    if (this.disposed) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.maxDpr));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.module.onResize?.(w, h, this.ctx);
  }

  private handleContextLost(e: Event): void {
    e.preventDefault();
    this.stopLoop();
  }

  private handleContextRestored(): void {
    // Re-init module if it provides a way; otherwise just resume rendering.
    // Modules should be designed to rebuild lightweight state here.
    if (this.isRunning && this.isVisible) this.startLoop();
  }

  /** Cleanly tear down the scene and free all GPU resources. */
  dispose(): void {
    this.disposed = true;
    this.stopLoop();
    window.removeEventListener("resize", this.boundResize);
    this.canvas.removeEventListener("webglcontextlost", this.boundContextLost);
    this.canvas.removeEventListener("webglcontextrestored", this.boundContextRestored);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    this.module.dispose?.(this.ctx);

    // Dispose all scene resources
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      const material = (obj as THREE.Mesh).material;
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else if (material) {
        material.dispose();
      }
    });

    this.renderer.dispose();
    if (this.canvas.parentElement === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}
