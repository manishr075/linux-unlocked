/* ============================================================
   LINUX UNLOCKED — Cinematic Homepage (Production-Grade)
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
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { HomeTerminalPreview } from "@/components/home/HomeTerminalPreview";
import { ParadigmComparison } from "@/components/home/ParadigmComparison";
import { DistroQuickMatcher } from "@/components/home/DistroQuickMatcher";
import {
  ArrowRight,
  Terminal,
  BookOpen,
  Monitor,
  Compass,
  Wrench,
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";

// Chapter metadata for the exploded architecture with real Linux telemetry
const ARCHITECTURE_LAYERS = [
  {
    index: 0,
    title: "Layer 0: Silicon & Hardware Baseplate",
    subtitle: "Physical Silicon Foundation",
    analogy: "The bedrock and structural concrete foundation of a skyscraper.",
    tagline: "CPU Execution Rings, RAM Paging, & PCIe Interconnects",
    privilege: "Ring 0 (Physical Hardware)",
    telemetry: "MMU Page Tables • PCIe Gen 5 Bus • Direct APIC Interrupts",
    description:
      "Linux communicates directly with physical silicon through privileged CPU execution rings (Ring 0). It abstracts motherboards, multi-core CPUs (x86_64, ARM64, RISC-V), memory chips, and high-speed PCI Express buses into a uniform computing plane.",
    keyComponents: ["CPU Rings 0-3", "Physical Memory (RAM)", "PCIe Bus Lines", "Hardware Interrupts (IRQs)"],
    accent: "cyan",
  },
  {
    index: 1,
    title: "Layer 1: The Monolithic Linux Kernel",
    subtitle: "The Master Orchestrator",
    analogy: "The master conductor coordinating every musician in a massive orchestra.",
    tagline: "CFS/EEVDF Scheduler, Virtual Filesystem (VFS), & Device Drivers",
    privilege: "Ring 0 (Kernel Space)",
    telemetry: "Syscall Latency < 45ns • EEVDF Scheduler • Monolithic Architecture",
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
    privilege: "Ring 3 (PID 1 Root)",
    telemetry: "Process ID 1 • Parallel Unit Activation • D-Bus / kdbus IPC",
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
    privilege: "Ring 3 (User Session)",
    telemetry: "Tear-Free Wayland RFC • PipeWire Pro Audio Graph • DRM / KMS",
    description:
      "Modern Linux desktop environments increasingly default to Wayland for secure, tear-free display compositing and per-window isolation, while X11 and XWayland remain actively supported for legacy applications and specialized GPU workflows. Alongside it, PipeWire coordinates audio and video streaming with low latency.",
    keyComponents: ["Wayland Compositor", "PipeWire Pro Audio", "Mesa 3D Graphics", "Vulkan & DRM/KMS"],
    accent: "electric",
  },
  {
    index: 4,
    title: "Layer 4: Desktop Environment & Shell",
    subtitle: "User Interface Modularity",
    analogy: "The fully customizable interior architecture and workstations of your house.",
    tagline: "GNOME Shell, KDE Plasma, Xfce, or Tiling Compositors (Hyprland)",
    privilege: "Ring 3 (Desktop Userland)",
    telemetry: "Toolkit: GTK4 / Qt6 • Window Management: Dynamic Tiling & Floating",
    description:
      "Unlike Windows or macOS where the visual interface is locked to the operating system, Linux lets you choose or replace your entire desktop environment. Pick an intuitive interface like KDE/GNOME or a keyboard-driven tiling window manager like Hyprland.",
    keyComponents: ["Window Compositor", "Application Launcher", "System Tray & Dock", "Theme Engine"],
    accent: "violet",
  },
  {
    index: 5,
    title: "Layer 5: Applications & Containers",
    subtitle: "Where You Work, Create & Play",
    analogy: "The precision tools, appliances, and instruments you use to build and create.",
    tagline: "Native Binaries, Flatpaks, Terminal Tools, & Podman/Docker Pods",
    privilege: "Ring 3 (Sandboxed App Sandbox)",
    telemetry: "cgroups v2 Resource Limits • Flatpak Bubblewrap • Native OCI Pods",
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
  const { progressRef, activeLayer, scrollToLayer, setActiveLayer } = useExplodedScroll(
    explodedSectionRef,
    ARCHITECTURE_LAYERS.length
  );

  // Selected subsystem from 3D raycasting
  const [selectedSubsystem, setSelectedSubsystem] = useState<string | null>(null);

  // Perspective filter state for trade-offs
  const [selectedPerspective, setSelectedPerspective] = useState<Perspective>("all");

  // Hero boot scene factory
  const createHeroScene = useCallback(() => {
    return createBootScene();
  }, []);

  // Exploded architecture 3D scene factory
  const createArchScene = useCallback(() => {
    return createExplodedArchScene({
      getProgress: () => progressRef.current,
      onActiveLayerChange: (idx) => setActiveLayer(idx),
      onSelectSubsystem: (info) => setSelectedSubsystem(info.name),
    });
  }, [progressRef, setActiveLayer]);

  return (
    <div className="relative">
      {/* ============================================================
          SECTION 1: HERO (SPLIT LAYOUT: EDITORIAL LEFT, 3D RIGHT)
          ============================================================ */}
      <section className="relative min-h-[92vh] border-b border-white/[0.08] px-4 pt-8 pb-12 flex flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_70%_35%,rgba(34,211,238,0.14),transparent_65%)]" />

        <div className="relative z-base mx-auto max-w-7xl w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
            {/* Left Column: Product messaging & primary actions (7 cols) */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-cyan uppercase backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                THE INTERACTIVE GATEWAY TO LINUX
              </div>

              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-ink-primary leading-[1.08]">
                Understand Linux.
                <br />
                <span className="text-gradient">Experience it.</span>
                <br />
                Make it yours.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-ink-secondary leading-relaxed max-w-xl">
                Explore how Linux works, experiment in a safe environment, and discover whether it belongs on your computer — without installing anything.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    explodedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="gap-2"
                >
                  Explore Linux <Layers size={18} />
                </Button>

                <Link to="/terminal">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Terminal size={18} className="text-cyan" /> Try the Terminal
                  </Button>
                </Link>

                <Link to="/distros">
                  <Button size="lg" variant="ghost" className="gap-2 text-ink-secondary hover:text-ink-primary">
                    Find Your Distro <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Native Three.js Computing Boot Scene (5 cols) */}
            <div className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[480px] w-full relative rounded-2xl border border-white/[0.08] bg-[#070a12]/80 overflow-hidden shadow-2xl backdrop-blur-xl group">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-wider text-cyan">
                  CPU Boot Core • Ring 0
                </span>
              </div>

              <ThreeCanvasHost
                createScene={createHeroScene}
                className="h-full w-full"
                fallback={
                  <div className="flex h-full items-center justify-center bg-void p-6 text-center">
                    <div>
                      <Terminal className="mx-auto mb-2 text-cyan" size={36} />
                      <p className="text-xs text-ink-muted font-mono">2D Processor Visualization</p>
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators & Product Pillars */}
        <div className="relative z-base mx-auto max-w-7xl w-full pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass-card rounded-xl p-3.5 text-left">
              <p className="text-[11px] font-mono text-ink-muted uppercase">Architecture</p>
              <p className="text-sm font-semibold text-ink-primary mt-0.5">Monolithic Kernel</p>
              <p className="text-[11px] text-cyan mt-1">Direct Hardware (Ring 0)</p>
            </div>
            <div className="glass-card rounded-xl p-3.5 text-left">
              <p className="text-[11px] font-mono text-ink-muted uppercase">3D Engine</p>
              <p className="text-sm font-semibold text-ink-primary mt-0.5">Native Three.js</p>
              <p className="text-[11px] text-cyan mt-1">Direct WebGL Rendering</p>
            </div>
            <div className="glass-card rounded-xl p-3.5 text-left">
              <p className="text-[11px] font-mono text-ink-muted uppercase">Privacy & Sovereignty</p>
              <p className="text-sm font-semibold text-success mt-0.5">Zero Tracking</p>
              <p className="text-[11px] text-ink-muted mt-1">100% In-Memory Sandbox</p>
            </div>
            <div className="glass-card rounded-xl p-3.5 text-left">
              <p className="text-[11px] font-mono text-ink-muted uppercase">Comprehension</p>
              <p className="text-sm font-semibold text-ink-primary mt-0.5">Multi-Depth</p>
              <p className="text-[11px] text-electric mt-1">Beginner to Kernel Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: LIVE IN-BROWSER TERMINAL PREVIEW WIDGET
          ============================================================ */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 border-b border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan mb-3">
            <Terminal size={14} /> Zero-Installation Sandbox
          </div>
          <h2 className="text-3xl font-bold md:text-4xl text-ink-primary">
            Experiment with Linux commands right now
          </h2>
          <p className="mt-3 text-sm text-ink-secondary">
            Execute real POSIX commands in a deterministic virtual filesystem in memory. No server connections, no host risk.
          </p>
        </div>

        <HomeTerminalPreview />
      </section>

      {/* ============================================================
          SECTION 3: SCROLL-DRIVEN EXPLODED ARCHITECTURE (CENTERPIECE)
          ============================================================ */}
      <section
        ref={explodedSectionRef}
        className="relative bg-void border-b border-white/[0.08]"
        style={{ minHeight: "440vh" }}
      >
        {/* Sticky Desktop Split Layout Container */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
          {/* Compact Top Chapter Selector Bar */}
          <div className="w-full border-b border-white/[0.08] bg-[#07090e]/90 backdrop-blur-md px-4 py-2.5 z-20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan">LINUX ARCHITECTURE</span>
              <span className="text-ink-muted text-xs hidden sm:inline">•</span>
              <span className="text-xs text-ink-secondary hidden sm:inline">6-Layer Exploded Stack</span>
            </div>

            {/* Chapter Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {ARCHITECTURE_LAYERS.map((layer) => {
                const isActive = activeLayer === layer.index;
                return (
                  <button
                    key={layer.index}
                    onClick={() => scrollToLayer(layer.index)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all shrink-0 ${
                      isActive
                        ? "border border-cyan/50 bg-cyan/20 text-cyan shadow-[0_0_12px_rgba(34,211,238,0.25)] font-bold"
                        : "border border-white/[0.06] bg-surface/60 text-ink-muted hover:text-ink-primary hover:border-white/[0.15]"
                    }`}
                  >
                    <span className="font-mono mr-1">L{layer.index}</span>
                    <span className="hidden md:inline">{layer.title.split(":")[1]?.trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Stage: 68% 3D Viewport on Left, 32% Contextual Inspector Panel on Right */}
          <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
            {/* 3D Scene Viewport (68% width on desktop) */}
            <div className="relative w-full lg:w-[68%] h-[50vh] lg:h-full overflow-hidden">
              {!skip3D ? (
                <ThreeCanvasHost
                  createScene={createArchScene}
                  className="h-full w-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center p-6 bg-void text-center">
                  <div className="max-w-md">
                    <Layers className="mx-auto mb-3 text-cyan" size={40} />
                    <h3 className="text-lg font-bold">2D Architecture Mode</h3>
                    <p className="mt-1 text-xs text-ink-secondary">
                      Use the contextual inspector to explore kernel subsystems and hardware layers.
                    </p>
                  </div>
                </div>
              )}

              {/* 3D Picking Hint overlay */}
              <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-[#07090e]/80 px-3 py-1 text-[11px] text-ink-muted backdrop-blur-md">
                <Sparkles size={12} className="text-cyan" />
                <span>Click any 3D subsystem to inspect internals</span>
              </div>
            </div>

            {/* Contextual Inspector Panel (32% width on desktop) */}
            <div className="w-full lg:w-[32%] lg:border-l border-white/[0.08] bg-[#070a12]/95 backdrop-blur-2xl p-4 lg:p-6 flex flex-col justify-between overflow-y-auto z-10">
              {(() => {
                const currentLayer = ARCHITECTURE_LAYERS[activeLayer] || ARCHITECTURE_LAYERS[0];
                return (
                  <div className="space-y-4">
                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-cyan">
                          {currentLayer.privilege}
                        </span>
                        <span className="text-[11px] font-mono text-ink-muted">
                          Layer {currentLayer.index + 1} of 6
                        </span>
                      </div>
                      <h2 className="text-xl lg:text-2xl font-bold text-ink-primary mt-1">
                        {currentLayer.title}
                      </h2>
                      <p className="text-xs text-cyan font-medium mt-0.5">
                        {currentLayer.tagline}
                      </p>
                    </div>

                    {/* Selected Subsystem Callout */}
                    {selectedSubsystem && (
                      <div className="rounded-lg border border-cyan/30 bg-cyan/10 p-2.5 text-xs text-cyan flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                        <span><strong>Selected Component:</strong> {selectedSubsystem}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                      {currentLayer.description}
                    </p>

                    {/* Telemetry pill */}
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-xs text-ink-secondary">
                      <div className="flex items-center gap-2 text-ink-primary font-mono font-semibold mb-1">
                        <Activity size={14} className="text-cyan" /> Telemetry & Protocols
                      </div>
                      <p className="font-mono text-[11px] text-ink-muted leading-normal">
                        {currentLayer.telemetry}
                      </p>
                    </div>

                    {/* Everyday Analogy */}
                    <div className="rounded-lg bg-surface/60 border border-white/[0.05] p-3 text-xs text-ink-secondary">
                      <div className="flex items-center gap-2 text-ink-primary font-semibold mb-1">
                        <Info size={14} className="text-electric" /> Everyday Analogy
                      </div>
                      <p className="leading-relaxed">
                        {currentLayer.analogy}
                      </p>
                    </div>

                    {/* Subsystem Components */}
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-ink-muted mb-2">
                        Subsystems & Interfaces
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentLayer.keyComponents.map((comp) => (
                          <span
                            key={comp}
                            className="rounded-md border border-white/[0.08] bg-elevated/70 px-2 py-0.5 font-mono text-[11px] text-ink-primary"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Prev / Next Layer Navigation Buttons */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={activeLayer === 0}
                  onClick={() => scrollToLayer(Math.max(0, activeLayer - 1))}
                  className="text-xs"
                >
                  Previous Layer
                </Button>
                <span className="font-mono text-xs text-ink-muted">
                  L{activeLayer}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={activeLayer === ARCHITECTURE_LAYERS.length - 1}
                  onClick={() => scrollToLayer(Math.min(ARCHITECTURE_LAYERS.length - 1, activeLayer + 1))}
                  className="text-xs"
                >
                  Next Layer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: PARADIGM COMPARISON — LINUX VS WINDOWS INTERACTIVE
          ============================================================ */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 border-b border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Pill tone="cyan" className="mb-3">
            Core Mental Model Shift
          </Pill>
          <h2 className="text-3xl font-bold md:text-4xl text-ink-primary">
            What makes Linux fundamentally different?
          </h2>
          <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
            Linux is not a cosmetic clone of Windows. It is built on an entirely different philosophy of digital sovereignty, transparency, and architectural modularity.
          </p>
        </div>

        <ParadigmComparison />
      </section>

      {/* ============================================================
          SECTION 5: DISTRO QUICK MATCHER (30-SECOND TEASER)
          ============================================================ */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 border-b border-white/[0.08]">
        <DistroQuickMatcher />
      </section>

      {/* ============================================================
          SECTION 6: HONEST ADVANTAGES VS TRADE-OFFS MATRIX
          ============================================================ */}
      <section className="relative mx-auto max-w-5xl px-4 py-20 border-b border-white/[0.08]">
        <div className="glass-card rounded-2xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold md:text-3xl text-ink-primary">
              Honest Guidance: Advantages & Realistic Trade-offs
            </h2>
            <p className="mt-2 text-sm text-ink-secondary">
              We never promote Linux blindly. Explore realistic expectations tailored to your specific computing requirements.
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
                      ? "bg-cyan text-ink-onAccent font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                      : "bg-surface/80 text-ink-muted hover:text-ink-primary border border-white/[0.05]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Advantages Column */}
            <div className="rounded-xl border border-success/30 bg-success/[0.02] p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-success">
                <CheckCircle2 size={18} /> Proven Advantages
              </h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold mt-0.5">•</span>
                  <span>100% Free and Open Source — zero licensing fees, activations, or subscription paywalls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold mt-0.5">•</span>
                  <span>Complete privacy by default with zero behavioral telemetry sent to remote corporations.</span>
                </li>
                {(selectedPerspective === "all" || selectedPerspective === "developer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-0.5">•</span>
                    <span>First-class native container runtimes (Docker/Podman) without a heavy virtualization VM.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "gamer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-0.5">•</span>
                    <span>Valve Proton runs over 16,000+ Windows Steam games natively with zero complex tweaking.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "everyday") && (
                  <li className="flex items-start gap-2">
                    <span className="text-success font-bold mt-0.5">•</span>
                    <span>Immune to typical Windows `.exe` executable malware, cryptominers, and background spyware.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Trade-offs Column */}
            <div className="rounded-xl border border-warning/30 bg-warning/[0.02] p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-warning">
                <AlertTriangle size={18} /> Realistic Trade-offs
              </h3>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {(selectedPerspective === "all" || selectedPerspective === "gamer") && (
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                    <span>Multiplayer games requiring proprietary kernel-level anti-cheat (e.g. Valorant, Fortnite) do not run on Linux.</span>
                  </li>
                )}
                {(selectedPerspective === "all" || selectedPerspective === "everyday") && (
                  <li className="flex items-start gap-2">
                    <span className="text-warning font-bold mt-0.5">•</span>
                    <span>Adobe Creative Cloud (Photoshop, Premiere) requires alternatives like OnlyOffice, GIMP, Krita, or DaVinci Resolve.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold mt-0.5">•</span>
                  <span>Certain laptop peripherals (e.g., proprietary fingerprint scanners or Broadcom Wi-Fi chips) may need firmware installed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold mt-0.5">•</span>
                  <span>There is an initial learning curve if you choose to explore advanced terminal administration.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: COMPLETE PLATFORM GATEWAYS
          ============================================================ */}
      <section className="mx-auto max-w-7xl px-4 py-24 border-b border-white/[0.08]">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Pill tone="violet" className="mb-3">
            Exploration Modules
          </Pill>
          <h2 className="text-3xl font-bold text-ink-primary md:text-4xl">
            Everything you need to master Linux
          </h2>
          <p className="mt-2 text-sm text-ink-secondary">
            From understanding the kernel architecture to test-driving commands and planning a safe migration.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <Compass size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Discover Linux</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Explore kernel vs. userland boundaries, FHS 3.0 filesystem trees, desktop environments (GNOME, KDE), and permissions.
            </p>
            <Link to="/discover" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Launch Discovery Explorer <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <BookOpen size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Knowledge Atlas</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              A 22-domain reference library with fuzzy search, upstream citations, and multi-depth level translations.
            </p>
            <Link to="/atlas" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Browse Knowledge Atlas <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <Terminal size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Terminal Playground</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              POSIX-compliant in-memory shell engine with pipelines, redirects, rm, head, tail, grep, and 8 guided missions.
            </p>
            <Link to="/terminal" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Open Terminal Simulator <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <Monitor size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Simulated Desktop</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Experience a simulated Linux desktop in your browser. Launch the file manager, terminal app, and drag windows.
            </p>
            <Link to="/desktop" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Launch Desktop Sandbox <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <Layers size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Distro Recommendation</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Compare Ubuntu, Fedora, Mint, Debian, Arch, and more. Take our interactive 6-question recommendation quiz.
            </p>
            <Link to="/distros" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Find Your Distro <ArrowRight size={14} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan border border-cyan/20">
                <Wrench size={22} />
              </div>
              <h3 className="text-lg font-bold text-ink-primary">Migration Planner</h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Verify hardware & software compatibility and plan a safe dual-boot or full migration with zero data loss.
            </p>
            <Link to="/migrate" className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline">
              Start Migration Plan <ArrowRight size={14} />
            </Link>
          </Card>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: INVITATION CTA
          ============================================================ */}
      <section className="relative bg-gradient-to-b from-void to-base py-24 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <Sparkles size={28} className="text-cyan" />
          </div>
          <h2 className="text-4xl font-extrabold md:text-5xl text-ink-primary tracking-tight">
            Experience Linux safely today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-secondary leading-relaxed">
            Zero installation required, zero corporate tracking, zero financial commitment. Begin with intuitive analogies or dive straight into low-level operating system architecture.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link to="/discover">
              <Button size="lg" className="gap-2">
                Begin Discovery Journey <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/terminal">
              <Button size="lg" variant="secondary" className="gap-2">
                <Terminal size={18} /> Open Terminal Simulator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
