/* ============================================================
   LINUX UNLOCKED — Cinematic Homepage (Module A)
   ------------------------------------------------------------
   Features:
     1. Cinematic Hero with Native Three.js Boot Sequence
     2. Scroll-Driven Native Three.js Exploded Architecture
        with GSAP ScrollTrigger timeline sync (bidirectional)
     3. Interactive Chapter Cards & Direct Layer Scrubbing
     4. 2D Accessible SVG/CSS Fallback for Reduced-Motion/Low-Tier
     5. Windows vs Linux Paradigm Comparison
     6. Honest Advantages vs Trade-offs Matrix with Persona Filter
     7. Deep Module Gateway Cards
   ============================================================ */

import { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ThreeCanvasHost } from "@/components/three/ThreeCanvasHost";
import { createBootScene } from "@/three/scenes/boot-sequence/BootScene";
import { createExplodedArchScene } from "@/three/scenes/exploded-arch/ExplodedArchScene";
import { useExplodedScroll } from "@/animation/useExplodedScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  ArrowRight,
  Terminal,
  BookOpen,
  Monitor,
  Cpu,
  Compass,
  Wrench,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  ChevronDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// Chapter metadata for the exploded architecture
const ARCHITECTURE_LAYERS = [
  {
    index: 0,
    title: "Layer 0: Silicon & Hardware Baseplate",
    subtitle: "The Physical Silicon Foundation",
    analogy: "The bedrock and structural foundation of a high-rise building.",
    tagline: "CPU Execution Rings, RAM Paging, & PCIe Interconnects",
    description:
      "Linux communicates directly with physical silicon through privileged CPU execution rings (Ring 0). It abstracts motherboards, multi-core CPUs (x86_64, ARM64, RISC-V), memory chips, and high-speed PCI Express buses into a uniform computing plane.",
    keyComponents: ["CPU Rings 0-3", "Physical Memory (RAM)", "PCIe Bus Lines", "Hardware Interrupts (IRQs)"],
    accent: "cyan",
  },
  {
    index: 1,
    title: "Layer 1: The Monolithic Linux Kernel",
    subtitle: "The Master Orchestrator",
    analogy: "The master conductor coordinating every instrument in a massive orchestra.",
    tagline: "CFS/EEVDF Scheduler, Virtual Filesystem (VFS), & Device Drivers",
    description:
      "The beating heart of the operating system. The kernel controls memory allocation, schedules process threads with microsecond latency, manages file operations through the VFS abstraction, and isolates system calls for rock-solid security.",
    keyComponents: ["Process Scheduler (EEVDF)", "Memory Management (Paging/Swap)", "VFS Abstraction", "Kernel Device Drivers"],
    accent: "cyan",
  },
  {
    index: 2,
    title: "Layer 2: Init System & Core Daemons",
    subtitle: "PID 1 — System Infrastructure",
    analogy: "The municipal utility management team keeping power, water, and routing running 24/7.",
    tagline: "systemd, udev, journald, & D-Bus Inter-Process Messaging",
    description:
      "When the kernel finishes booting, it hands control to PID 1 (predominantly systemd). PID 1 initializes hardware device nodes via udev, starts system services in parallel, collects logs, and routes IPC signals via D-Bus.",
    keyComponents: ["systemd (PID 1)", "udev Device Manager", "journald Logging", "D-Bus Message Broker"],
    accent: "electric",
  },
  {
    index: 3,
    title: "Layer 3: Display Server & Modern Audio",
    subtitle: "Multimedia & Visual Pipelines",
    analogy: "The high-definition multimedia switchboard transmitting live audio and visual signals.",
    tagline: "Wayland Compositor Protocol & PipeWire Audio Graph",
    description:
      "Modern Linux has replaced legacy 1980s X11 protocols with Wayland: a secure, tear-free display compositor protocol. Alongside it, PipeWire handles pro-audio and video streaming with ultra-low latency.",
    keyComponents: ["Wayland Compositor", "PipeWire Pro Audio", "Mesa 3D Graphics", "Vulkan & DRM/KMS"],
    accent: "electric",
  },
  {
    index: 4,
    title: "Layer 4: Desktop Environment & Shell",
    subtitle: "User Interface Modularity",
    analogy: "The fully customizable interior architecture and workstations of your house.",
    tagline: "GNOME Shell, KDE Plasma, Xfce, or Tiling Compositors (Hyprland)",
    description:
      "Unlike Windows or macOS where the visual interface is locked to the operating system, Linux lets you choose or replace your entire desktop environment. Pick an intuitive interface like KDE/GNOME or a keyboard-driven tiling window manager like Hyprland.",
    keyComponents: ["Window Compositor", "Application Launcher", "System Tray & Dock", "Theme Engine"],
    accent: "violet",
  },
  {
    index: 5,
    title: "Layer 5: Applications & Containers",
    subtitle: "Where You Work, Create & Play",
    analogy: "The tools, appliances, and instruments you use to build and create.",
    tagline: "Native Binaries, Flatpaks, Terminal Tools, & Podman/Docker Pods",
    description:
      "The software you interact with daily: Firefox, VS Code, Steam with Proton, Blender, and thousands of command-line tools. Modern packaging like Flatpak and containers isolate applications with granular permissions.",
    keyComponents: ["Web Browsers & Office", "Steam / Proton Gaming", "Terminal Emulators", "Containers (Docker/Podman)"],
    accent: "violet",
  },
];

type Perspective = "all" | "everyday" | "developer" | "gamer" | "privacy";

export function HomePage() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const skip3D = reducedMotion || tier === "low";

  // Ref for the pinned exploded architecture section
  const explodedSectionRef = useRef<HTMLDivElement>(null);
  const { progress: archProgress, activeLayer, scrollToLayer } = useExplodedScroll(
    explodedSectionRef,
    ARCHITECTURE_LAYERS.length
  );

  // Perspective filter state for trade-offs
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective>("all");

  // Hero boot scene factory
  const createHeroScene = useCallback(() => {
    return createBootScene();
  }, []);

  // Exploded architecture 3D scene factory
  const progressRef = useRef(0);
  progressRef.current = archProgress;

  const createArchScene = useCallback(() => {
    return createExplodedArchScene({
      getProgress: () => progressRef.current,
    });
  }, []);

  return (
    <div className="relative">
      {/* ============================================================
          SECTION 1: CINEMATIC 3D HERO
          ============================================================ */}
      <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden border-b border-line-subtle px-4">
        {/* 3D Canvas Background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <ThreeCanvasHost
            createScene={createHeroScene}
            className="h-full w-full"
            fallback={
              <div className="flex h-full items-center justify-center bg-void">
                <div className="h-48 w-48 rounded-full border border-cyan/30 bg-cyan/5 blur-2xl" />
              </div>
            }
          />
        </div>

        {/* Hero Copy */}
        <div className="relative z-base mx-auto max-w-5xl py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-cyan uppercase backdrop-blur-sm">
            <Sparkles size={14} className="text-cyan animate-pulse" />
            The Gateway to Linux • 100% Free & Open
          </div>

          <h1 className="font-display text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            Your computer.
            <br />
            <span className="text-gradient">Your freedom.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-secondary md:text-xl">
            Experience the power, precision, and privacy of Linux right in your browser.
            Explore its architecture from silicon to software, practice in a safe sandbox,
            and decide if it's right for you — with zero installation.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="shadow-glow"
              onClick={() => {
                explodedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore 3D Architecture <Layers size={18} />
            </Button>

            <Link to="/terminal">
              <Button size="lg" variant="secondary">
                <Terminal size={18} /> Try the Terminal
              </Button>
            </Link>

            <Link to="/distros">
              <Button size="lg" variant="ghost">
                Distro Recommender <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          {/* Quick Pillar Badges */}
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-line-subtle bg-surface/60 p-3 backdrop-blur-glass">
              <p className="text-xs text-ink-muted">Infrastructure</p>
              <p className="text-sm font-semibold text-ink-primary">₹0 Development Budget</p>
            </div>
            <div className="rounded-lg border border-line-subtle bg-surface/60 p-3 backdrop-blur-glass">
              <p className="text-xs text-ink-muted">Graphics Engine</p>
              <p className="text-sm font-semibold text-cyan">Native Three.js + GLSL</p>
            </div>
            <div className="rounded-lg border border-line-subtle bg-surface/60 p-3 backdrop-blur-glass">
              <p className="text-xs text-ink-muted">Privacy Policy</p>
              <p className="text-sm font-semibold text-success">Zero Mandatory Accounts</p>
            </div>
            <div className="rounded-lg border border-line-subtle bg-surface/60 p-3 backdrop-blur-glass">
              <p className="text-xs text-ink-muted">Multi-Depth</p>
              <p className="text-sm font-semibold text-electric">Beginner to Kernel</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator prompt */}
        <div className="relative z-base pb-6 text-center">
          <p className="text-xs font-medium text-ink-muted tracking-wide uppercase">
            Scroll to explode architecture
          </p>
          <ChevronDown size={18} className="mx-auto mt-1 animate-bounce text-cyan" />
        </div>
      </section>

      {/* ============================================================
          SECTION 2: SCROLL-DRIVEN EXPLODED ARCHITECTURE (CENTERPIECE)
          ============================================================ */}
      <section
        ref={explodedSectionRef}
        className="relative bg-void"
        style={{ minHeight: "420vh" }}
      >
        {/* Sticky 3D Canvas Host Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* 3D Scene */}
          {!skip3D ? (
            <div className="absolute inset-0">
              <ThreeCanvasHost
                createScene={createArchScene}
                className="h-full w-full"
              />
            </div>
          ) : (
            /* Accessible 2D Fallback for Low-Tier / Reduced-Motion */
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-void">
              <div className="max-w-xl text-center">
                <Layers className="mx-auto mb-4 text-cyan" size={48} />
                <h3 className="text-2xl font-bold">Linux Stack (2D Architecture Mode)</h3>
                <p className="mt-2 text-sm text-ink-secondary">
                  Reduced motion or performance mode active. Explore the full layer breakdown using the interactive chapter cards below.
                </p>
              </div>
            </div>
          )}

          {/* Persistent Layer Scrubbing Navigation Pills */}
          <div className="absolute top-16 left-0 right-0 z-sticky mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-4 pointer-events-auto">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isActive = activeLayer === layer.index;
              return (
                <button
                  key={layer.index}
                  onClick={() => scrollToLayer(layer.index)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all backdrop-blur-md ${
                    isActive
                      ? "border border-cyan bg-cyan/20 text-cyan shadow-glow"
                      : "border border-line-subtle bg-surface/80 text-ink-muted hover:text-ink-primary hover:border-line"
                  }`}
                  aria-label={`Scroll to ${layer.title}`}
                >
                  {layer.index}: {layer.title.split(":")[1]?.trim() || layer.title}
                </button>
              );
            })}
          </div>

          {/* Active Chapter Card HUD */}
          <div className="pointer-events-none absolute bottom-8 left-4 right-4 z-sticky mx-auto max-w-3xl">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isCurrent = activeLayer === layer.index;
              if (!isCurrent) return null;

              return (
                <div
                  key={layer.index}
                  className="pointer-events-auto animate-fadeIn rounded-xl border border-line-accent/50 bg-surface/90 p-6 shadow-2xl backdrop-blur-glass"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan">
                        {layer.subtitle}
                      </span>
                      <h2 className="text-xl font-bold text-ink-primary md:text-2xl">
                        {layer.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
                      Scroll Progress: {Math.round(archProgress * 100)}%
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-base/60 p-2.5 text-xs text-ink-secondary">
                    <Info size={16} className="text-cyan shrink-0" />
                    <span>
                      <strong className="text-ink-primary">Everyday Analogy:</strong> {layer.analogy}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {layer.keyComponents.map((comp) => (
                      <span
                        key={comp}
                        className="rounded border border-line-subtle bg-elevated/70 px-2.5 py-1 font-mono text-xs text-ink-primary"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: PARADIGM COMPARISON — LINUX VS WINDOWS
          ============================================================ */}
      <section className="relative mx-auto max-w-7xl px-4 py-24">
        <div className="text-center">
          <Pill tone="cyan" className="mb-4">
            Mental Model Shift
          </Pill>
          <h2 className="text-3xl font-bold md:text-4xl">
            What makes Linux fundamentally different?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-secondary">
            Linux is not simply a free clone of Windows. It is built on an entirely different philosophy of ownership, modularity, and control.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card glass hover>
            <ShieldCheck className="mb-4 text-cyan" size={32} />
            <h3 className="text-lg font-bold">Digital Sovereignty</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              No mandatory online accounts, zero telemetry beacons, no surprise restarts during work, and no targeted advertisements inside your start menu.
            </p>
          </Card>

          <Card glass hover>
            <Layers className="mb-4 text-cyan" size={32} />
            <h3 className="text-lg font-bold">Total Modularity</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              Every component is replaceable: swap your desktop shell, window manager, audio server, or kernel without breaking the rest of your system.
            </p>
          </Card>

          <Card glass hover>
            <Zap className="mb-4 text-cyan" size={32} />
            <h3 className="text-lg font-bold">Package Management</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              Update your entire operating system, kernel, drivers, and every application with a single, verifiable command instead of browsing download portals.
            </p>
          </Card>

          <Card glass hover>
            <Cpu className="mb-4 text-cyan" size={32} />
            <h3 className="text-lg font-bold">Hardware Longevity</h3>
            <p className="mt-2 text-sm text-ink-secondary">
              Give a second life to laptops deemed "obsolete" by arbitrary Windows 11 hardware restrictions. Linux runs lean and responsive on modest specs.
            </p>
          </Card>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: HONEST ADVANTAGES VS TRADE-OFFS (PERSPECTIVE FILTER)
          ============================================================ */}
      <section className="relative mx-auto max-w-5xl px-4 py-16">
        <GlassPanel className="p-8 md:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Honest Guidance: The Good & The Trade-offs
            </h2>
            <p className="mt-2 text-sm text-ink-secondary">
              We never pressure visitors to switch. Explore realistic expectations based on your computing workflow.
            </p>

            {/* Filter Pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {(
                [
                  { id: "all", label: "All Users" },
                  { id: "everyday", label: "Everyday Users" },
                  { id: "developer", label: "Developers" },
                  { id: "gamer", label: "PC Gamers" },
                  { id: "privacy", label: "Privacy Advocates" },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPerspective(p.id)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    selectedPerspective === p.id
                      ? "bg-cyan text-void font-bold shadow-glow"
                      : "bg-surface text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {/* Advantages Column */}
            <div className="rounded-xl border border-line-subtle bg-base/50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-success">
                <CheckCircle2 size={20} /> Proven Advantages
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">•</span>
                  <span>100% Free and Open Source — zero licensing fees or subscription models.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">•</span>
                  <span>Complete privacy by default with no behavioral telemetry sent to remote corporations.</span>
                </li>
                {(selectedPerspective === "all" || selectedPerspective === "developer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">•</span>
                    <span>First-class container runtime (Docker/Podman) without running a heavy virtualization VM.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "gamer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">•</span>
                    <span>Valve Proton runs over 15,000+ Windows Steam games seamlessly without configuration.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "everyday") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold">•</span>
                    <span>Immune to typical Windows `.exe` executable malware and spyware vectors.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Trade-offs Column */}
            <div className="rounded-xl border border-line-subtle bg-base/50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-warning">
                <AlertTriangle size={20} /> Realistic Trade-offs
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-ink-secondary">
                {(selectedPerspective === "all" || selectedPerspective === "gamer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span>Multiplayer games requiring proprietary kernel-level anti-cheat (e.g. Valorant, Fortnite) do not run on Linux.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "everyday") && (
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold">•</span>
                    <span>Adobe Creative Cloud (Photoshop, Premiere) requires alternatives (GIMP, Krita, DaVinci Resolve).</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span>Certain niche laptop hardware (e.g., specific fingerprint scanners or proprietary Wi-Fi cards) may need manual driver firmware.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span>There is an initial learning curve if you choose to explore advanced command-line administration.</span>
                </li>
              </ul>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* ============================================================
          SECTION 5: THE COMPLETE PLATFORM GATEWAYS
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <Pill tone="violet" className="mb-3">
            Core Modules
          </Pill>
          <h2 className="text-3xl font-bold">Everything you need to master Linux</h2>
          <p className="mt-2 text-ink-secondary">
            From your very first command to planning a safe, dual-boot installation.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card glass hover>
            <Compass className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Discover Linux</h3>
            <p className="text-sm text-ink-secondary">
              What Linux is, the role of GNU, kernel architecture, open source history, and interactive system diagrams.
            </p>
            <Link to="/discover" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Explore Module <ArrowRight size={14} />
            </Link>
          </Card>

          <Card glass hover>
            <BookOpen className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Knowledge Atlas</h3>
            <p className="text-sm text-ink-secondary">
              A 22-category comprehensive library spanning fundamentals, kernel internals, networking, scripting, and administration.
            </p>
            <Link to="/atlas" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Browse Atlas <ArrowRight size={14} />
            </Link>
          </Card>

          <Card glass hover>
            <Terminal className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Terminal Playground</h3>
            <p className="text-sm text-ink-secondary">
              A sandboxed POSIX shell emulator with an in-memory virtual filesystem and gamified practical missions.
            </p>
            <Link to="/terminal" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Launch Terminal <ArrowRight size={14} />
            </Link>
          </Card>

          <Card glass hover>
            <Monitor className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Distro Explorer</h3>
            <p className="text-sm text-ink-secondary">
              Compare Ubuntu, Fedora, Mint, Debian, Arch, and more. Take our interactive 6-question recommendation quiz.
            </p>
            <Link to="/distros" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Find Your Distro <ArrowRight size={14} />
            </Link>
          </Card>

          <Card glass hover>
            <Cpu className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Compatibility Matrix</h3>
            <p className="text-sm text-ink-secondary">
              Verify your hardware components and favorite Windows software compatibility before touching a partition table.
            </p>
            <Link to="/compatibility" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Check Compatibility <ArrowRight size={14} />
            </Link>
          </Card>

          <Card glass hover>
            <Wrench className="mb-3 text-cyan" size={28} />
            <h3 className="mb-1 text-lg font-bold">Migration Planner</h3>
            <p className="text-sm text-ink-secondary">
              Personalized checklist covering pre-flight backups, live-USB testing, non-destructive dual-booting, and recovery.
            </p>
            <Link to="/migrate" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline">
              Start Migration Plan <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: FINAL INVITATION CTA
          ============================================================ */}
      <section className="border-t border-line-subtle bg-base py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold md:text-5xl">
            Experience Linux safely today.
          </h2>
          <p className="mt-4 text-lg text-ink-secondary">
            No installation, no telemetry, no paid plans. Start with simple analogies or dive straight into kernel internals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/discover">
              <Button size="lg">
                Begin Discovery Journey <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/distros">
              <Button size="lg" variant="secondary">
                Find My Distro Quiz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
