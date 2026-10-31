/* ============================================================
   LINUX UNLOCKED — Linux Discovery (Module B)
   ------------------------------------------------------------
   Covers the 13 foundational Linux pillars with interactive
   diagrams, everyday analogies, multi-depth level awareness,
   and integrated Linux Translator terms.
   ============================================================ */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useLevel } from "@/state/LevelProvider";
import { TermLink } from "@/components/translator/TermLink";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { KernelUserlandDiagram } from "@/components/discovery/KernelUserlandDiagram";
import { FilesystemTreeExplorer } from "@/components/discovery/FilesystemTreeExplorer";
import { PermissionsCalculator } from "@/components/discovery/PermissionsCalculator";
import { DistroFamilyTree } from "@/components/discovery/DistroFamilyTree";
import { DesktopEnvironmentsShowcase } from "@/components/discovery/DesktopEnvironmentsShowcase";
import {
  Compass,
  Cpu,
  Layers,
  Terminal,
  Shield,
  GitBranch,
  Monitor,
  Package,
  HardDrive,
  UserCheck,
  EyeOff,
  Network,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function DiscoverPage() {
  const { level } = useLevel();
  const [activeTopic, setActiveTopic] = useState("what-is-linux");

  const topics = [
    { id: "what-is-linux", label: "What is Linux?", icon: Compass },
    { id: "vs-windows", label: "Linux vs. Windows", icon: Layers },
    { id: "open-source", label: "Open Source & Freedom", icon: Sparkles },
    { id: "kernel", label: "The Linux Kernel", icon: Cpu },
    { id: "gnu", label: "GNU & Linux", icon: Terminal },
    { id: "distros", label: "Distributions", icon: GitBranch },
    { id: "desktops", label: "Desktop Environments", icon: Monitor },
    { id: "packages", label: "Package Managers", icon: Package },
    { id: "filesystem", label: "Filesystem (FHS)", icon: HardDrive },
    { id: "permissions", label: "Permissions & Sudo", icon: UserCheck },
    { id: "security", label: "Security Architecture", icon: Shield },
    { id: "privacy", label: "Privacy by Design", icon: EyeOff },
    { id: "networking", label: "Networking Subsystem", icon: Network },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto">
        <Pill tone="cyan" className="mb-4">
          Module B • Guided Discovery
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
          Discover Linux.
          <br />
          <span className="text-gradient">From Philosophy to Architecture.</span>
        </h1>
        <p className="mt-4 text-base text-ink-secondary md:text-lg">
          Understand how Linux actually works, why it powers 96% of the web and top supercomputers,
          and how its modular structure gives you complete computing freedom.
        </p>
      </div>

      {/* Sticky Topic Navigation Ribbon */}
      <div className="sticky top-14 z-sticky my-8 -mx-4 overflow-x-auto border-y border-line-subtle bg-base/90 px-4 py-2.5 backdrop-blur-glass">
        <div className="flex gap-2 min-w-max">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTopic(t.id);
                  const el = document.getElementById(t.id);
                  if (el) {
                    const offset = 120;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = el.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                  }
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-cyan/15 text-cyan border border-cyan/40 shadow-glow"
                    : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-cyan" : "text-ink-muted"} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-24 mt-12">
        {/* ============================================================
            TOPIC 1: WHAT IS LINUX?
            ============================================================ */}
        <section id="what-is-linux" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Compass size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">1. What is Linux?</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-4 text-ink-secondary text-sm md:text-base leading-relaxed">
                <p>
                  At its most literal level, <strong>Linux</strong> is a <TermLink term="kernel">kernel</TermLink> — the core program that manages the conversation between your computer's physical silicon (CPU, memory, disks) and the software you run.
                </p>
                <p>
                  Created in 1991 by 21-year-old Finnish student Linus Torvalds as a hobby project, Linux was designed as a free, Unix-compatible operating system core. Combined with GNU utilities and modern graphical desktops, it became the foundation of modern digital infrastructure.
                </p>

                {level === "beginner" && (
                  <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4 text-sm text-ink-primary">
                    <p className="font-semibold text-cyan flex items-center gap-2">
                      <Info size={16} /> The Automobile Analogy
                    </p>
                    <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                      Think of the Linux kernel as a high-performance engine. By itself, an engine cannot drive you to work — you need a chassis, steering wheel, seats, and dashboard (GNU utilities and Desktop Environment). When you buy a complete car (Ubuntu or Linux Mint), you get the whole working package.
                    </p>
                  </div>
                )}

                {level === "technical" && (
                  <div className="rounded-xl border border-line-subtle bg-surface/70 p-4 text-xs font-mono text-ink-secondary">
                    <p className="font-bold text-cyan">Kernel Specifications:</p>
                    <p className="mt-1">
                      Monolithic, preemptible Unix-like kernel licensed under GPLv2. Written primarily in C with optional Rust subsystems. Features loadable kernel modules (LKMs), eBPF in-kernel virtual machine, and asynchronous I/O via io_uring.
                    </p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-line-subtle bg-base/60 p-4">
                  <p className="text-2xl font-extrabold text-cyan">100%</p>
                  <p className="text-xs text-ink-muted mt-1">Top 500 Supercomputers</p>
                  <p className="text-[11px] text-ink-secondary mt-1">Every single machine runs Linux.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/60 p-4">
                  <p className="text-2xl font-extrabold text-electric">96.3%</p>
                  <p className="text-xs text-ink-muted mt-1">Top 1M Web Servers</p>
                  <p className="text-[11px] text-ink-secondary mt-1">Powering Google, Amazon, Wikipedia.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/60 p-4">
                  <p className="text-2xl font-extrabold text-violet">3.5B+</p>
                  <p className="text-xs text-ink-muted mt-1">Active Android Devices</p>
                  <p className="text-[11px] text-ink-secondary mt-1">Android runs on the Linux kernel.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/60 p-4">
                  <p className="text-2xl font-extrabold text-success">Mars</p>
                  <p className="text-xs text-ink-muted mt-1">Ingenuity Helicopter</p>
                  <p className="text-[11px] text-ink-secondary mt-1">NASA's Mars rotorcraft runs Linux.</p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 2: LINUX VS WINDOWS
            ============================================================ */}
        <section id="vs-windows" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Layers className="text-cyan" /> 2. Linux versus Windows
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              A comparison of software architecture, update paradigms, and user control.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card glass className="border-t-4 border-t-cyan">
              <h3 className="text-lg font-bold text-cyan flex items-center gap-2">
                <CheckCircle2 size={18} /> The Linux Paradigm
              </h3>
              <ul className="mt-4 space-y-3 text-xs md:text-sm text-ink-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-cyan font-bold">•</span>
                  <span><strong>Complete Ownership:</strong> You own your machine. No accounts required, no telemetry, no tracking IDs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan font-bold">•</span>
                  <span><strong>Centralized Updates:</strong> One single command (`apt upgrade` or `dnf upgrade`) updates the OS, drivers, and every app.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan font-bold">•</span>
                  <span><strong>Zero Mandatory Reboots:</strong> Kernel updates can even be live-patched; apps update while running without reboots.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan font-bold">•</span>
                  <span><strong>Text-Based Configuration:</strong> Clear, human-readable config files in `/etc/` that can be backed up or version-controlled in Git.</span>
                </li>
              </ul>
            </Card>

            <Card glass className="border-t-4 border-t-line-strong">
              <h3 className="text-lg font-bold text-ink-primary flex items-center gap-2">
                <AlertTriangle size={18} className="text-warning" /> The Windows Paradigm
              </h3>
              <ul className="mt-4 space-y-3 text-xs md:text-sm text-ink-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Software as a Service:</strong> Forced Microsoft cloud accounts, advertising in Start Menu, integrated telemetry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Fragmented Installers:</strong> Hunting browser download buttons for `.exe` setups, manual updaters for each application.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Forced Disruptive Restarts:</strong> Updates lock your PC during work or shutdown cycles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warning font-bold">•</span>
                  <span><strong>Opaque Binary Registry:</strong> System settings stored in a fragile binary database (`regedit`) prone to corruption.</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* ============================================================
            TOPIC 3: OPEN SOURCE & DIGITAL SOVEREIGNTY
            ============================================================ */}
        <section id="open-source" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">3. Open Source & Digital Freedom</h2>
            </div>
            <p className="text-sm md:text-base text-ink-secondary leading-relaxed max-w-3xl">
              "Open source" means the source code — the human-readable instructions behind the program — is public. Anyone can inspect it for security vulnerabilities, modify it to add features, and redistribute their improvements.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">Freedom to Run</h4>
                <p className="mt-1 text-xs text-ink-secondary">You may run the program for any purpose, on as many computers as you want, forever, without paying subscriptions.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">Freedom to Study</h4>
                <p className="mt-1 text-xs text-ink-secondary">No secret backdoors or hidden algorithms. You can verify exactly what every line of code does.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">Freedom to Share</h4>
                <p className="mt-1 text-xs text-ink-secondary">Copy, give away, or sell your modifications under permissive licenses (GPL, MIT, Apache).</p>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 4: THE LINUX KERNEL (INTERACTIVE DIAGRAM)
            ============================================================ */}
        <section id="kernel" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Cpu className="text-cyan" /> 4. The Linux Kernel
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Explore how User Space communicates with privileged Kernel Space via the system call interface.
            </p>
          </div>
          <KernelUserlandDiagram />
        </section>

        {/* ============================================================
            TOPIC 5: GNU & LINUX
            ============================================================ */}
        <section id="gnu" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Terminal size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">5. GNU and Linux: The Partnership</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-12 text-sm text-ink-secondary leading-relaxed">
              <div className="lg:col-span-8 space-y-4">
                <p>
                  In 1983, Richard Stallman launched the <strong>GNU Project</strong> to create an entirely free Unix-like operating system. By 1990, the GNU Project had written compilers (`gcc`), text editors, shell interpreters (`bash`), and core file utilities (`ls`, `cat`, `grep`).
                </p>
                <p>
                  However, GNU was missing its kernel (the GNU Hurd was delayed). In 1991, Linus Torvalds released the Linux kernel. When programmers combined the GNU utilities with the Linux kernel, the first completely free, fully functional operating system was born.
                </p>
                <p className="text-xs text-ink-muted">
                  This is why free software advocates frequently refer to the full system as <em>GNU/Linux</em>.
                </p>
              </div>
              <div className="lg:col-span-4 rounded-xl border border-line-accent/40 bg-surface/60 p-4">
                <span className="font-mono text-xs text-cyan font-bold uppercase">The Equation:</span>
                <div className="mt-3 space-y-2 font-mono text-xs">
                  <div className="rounded bg-base/70 p-2 border border-line-subtle">
                    <strong>Linux</strong> = Hardware Drivers + Scheduler + Memory
                  </div>
                  <div className="text-center text-cyan font-bold">+</div>
                  <div className="rounded bg-base/70 p-2 border border-line-subtle">
                    <strong>GNU</strong> = bash + coreutils + glibc + gcc
                  </div>
                  <div className="text-center text-cyan font-bold">=</div>
                  <div className="rounded bg-cyan/15 p-2 border border-cyan/40 text-cyan font-bold text-center">
                    A Complete POSIX Operating System
                  </div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 6: DISTRIBUTIONS (INTERACTIVE FAMILY TREE)
            ============================================================ */}
        <section id="distros" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <GitBranch className="text-cyan" /> 6. Distributions (Distros)
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Why there isn't just "one" Linux. Explore the major lineages and how they evolved.
            </p>
          </div>
          <DistroFamilyTree />
        </section>

        {/* ============================================================
            TOPIC 7: DESKTOP ENVIRONMENTS (INTERACTIVE SHOWCASE)
            ============================================================ */}
        <section id="desktops" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Monitor className="text-cyan" /> 7. Desktop Environments & Window Managers
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Select, customize, or replace your entire user interface.
            </p>
          </div>
          <DesktopEnvironmentsShowcase />
        </section>

        {/* ============================================================
            TOPIC 8: PACKAGE MANAGERS
            ============================================================ */}
        <section id="packages" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Package size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">8. Package Managers: The App Stores of Linux</h2>
            </div>
            <p className="text-sm md:text-base text-ink-secondary leading-relaxed max-w-3xl">
              In Linux, you almost never open a web browser to download installer files. Instead, your distribution's <TermLink term="package manager">package manager</TermLink> connects to cryptographically signed <TermLink term="repository">repositories</TermLink>, automatically calculates and resolves all dependencies, and installs or updates software cleanly.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <span className="font-mono text-xs text-cyan font-bold uppercase">Debian / Ubuntu / Mint</span>
                <h4 className="mt-1 font-bold text-ink-primary">APT (`apt`)</h4>
                <p className="mt-2 text-xs text-ink-secondary">Manages `.deb` packages. Standard command: `sudo apt update && sudo apt install vlc`</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <span className="font-mono text-xs text-electric font-bold uppercase">Fedora / Red Hat</span>
                <h4 className="mt-1 font-bold text-ink-primary">DNF (`dnf`)</h4>
                <p className="mt-2 text-xs text-ink-secondary">Manages `.rpm` packages with robust sat-solver dependency resolution and transaction rollbacks.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <span className="font-mono text-xs text-violet font-bold uppercase">Arch Linux</span>
                <h4 className="mt-1 font-bold text-ink-primary">Pacman (`pacman`)</h4>
                <p className="mt-2 text-xs text-ink-secondary">Blisteringly fast package manager reading compressed `.tar.zst` packages directly.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <span className="font-mono text-xs text-success font-bold uppercase">Universal / Sandboxed</span>
                <h4 className="mt-1 font-bold text-ink-primary">Flatpak (`flathub`)</h4>
                <p className="mt-2 text-xs text-ink-secondary">Runs applications in secure user-namespace containers across any Linux distribution.</p>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 9: FILESYSTEM HIERARCHY (INTERACTIVE FHS TREE)
            ============================================================ */}
        <section id="filesystem" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <HardDrive className="text-cyan" /> 9. The Filesystem Hierarchy Standard (FHS)
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Explore how all disks and devices unify under a single root `/` folder.
            </p>
          </div>
          <FilesystemTreeExplorer />
        </section>

        {/* ============================================================
            TOPIC 10: PERMISSIONS & SUDO (INTERACTIVE CALCULATOR)
            ============================================================ */}
        <section id="permissions" className="scroll-mt-32">
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <UserCheck className="text-cyan" /> 10. Linux Permissions and Sudo
            </h2>
            <p className="text-sm text-ink-secondary mt-1">
              Calculate numeric `chmod` octal modes and understand why Linux is naturally malware-resistant.
            </p>
          </div>
          <PermissionsCalculator />
        </section>

        {/* ============================================================
            TOPIC 11: SECURITY ARCHITECTURE
            ============================================================ */}
        <section id="security" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">11. Security Architecture</h2>
            </div>
            <p className="text-sm md:text-base text-ink-secondary leading-relaxed max-w-3xl">
              Linux was engineered from day one as a multi-user operating system. Unlike early Windows where users ran as Administrator by default, Linux enforces strict privilege separation.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">No Drive-By EXE Execution</h4>
                <p className="mt-1 text-xs text-ink-secondary">Downloaded files cannot execute unless explicitly granted the execute bit (`+x`) by the human owner.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">Mandatory Access Control (MAC)</h4>
                <p className="mt-1 text-xs text-ink-secondary">SELinux and AppArmor confine processes so that even if a server program is exploited, it cannot escape its sandbox.</p>
              </div>
              <div className="rounded-xl border border-line-subtle bg-surface/60 p-4">
                <h4 className="font-bold text-ink-primary text-sm">Kernel Namespaces & cgroups</h4>
                <p className="mt-1 text-xs text-ink-secondary">Processes can be isolated into separate network, PID, and mount namespaces (the foundation of Docker and Flatpaks).</p>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 12: PRIVACY BY DESIGN
            ============================================================ */}
        <section id="privacy" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <EyeOff size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">12. Privacy by Design: Zero Telemetry</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-12 text-sm text-ink-secondary leading-relaxed">
              <div className="lg:col-span-8 space-y-3">
                <p>
                  Modern proprietary operating systems monetize user data: advertising IDs, keystroke analytics, search telemetry, and background tracking beacons.
                </p>
                <p>
                  In Linux, privacy is not an optional toggle buried under thirty menus — it is the default. Operating systems like Linux Mint, Debian, and Fedora transmit zero telemetry. Your files remain on your disk, and your network bandwidth belongs solely to you.
                </p>
              </div>
              <div className="lg:col-span-4 rounded-xl border border-success/30 bg-success/5 p-4 text-xs">
                <span className="font-bold text-success flex items-center gap-2">
                  <CheckCircle2 size={16} /> Privacy Guarantee
                </span>
                <p className="mt-2 text-ink-secondary leading-relaxed">
                  No online account required to install or use. No artificial activation servers. Your workstation remains completely functional even if disconnected from the internet indefinitely.
                </p>
              </div>
            </div>
          </GlassPanel>
        </section>

        {/* ============================================================
            TOPIC 13: NETWORKING
            ============================================================ */}
        <section id="networking" className="scroll-mt-32">
          <GlassPanel className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                <Network size={24} />
              </div>
              <h2 className="text-2xl font-bold md:text-3xl">13. Networking Subsystem</h2>
            </div>
            <p className="text-sm md:text-base text-ink-secondary leading-relaxed max-w-3xl">
              Linux is the backbone of the internet because its networking stack is peerless in speed and configurability. The Linux kernel features zero-copy packet transmission, stateful firewalling (`nftables`/`iptables`), software-defined bridges, and network namespaces.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              <span className="rounded border border-line-subtle bg-elevated px-3 py-1 text-ink-primary">`ip addr` (Inspect Interfaces)</span>
              <span className="rounded border border-line-subtle bg-elevated px-3 py-1 text-ink-primary">`ss -tulpn` (Active Sockets)</span>
              <span className="rounded border border-line-subtle bg-elevated px-3 py-1 text-ink-primary">`ssh user@host` (Encrypted Remote Shell)</span>
              <span className="rounded border border-line-subtle bg-elevated px-3 py-1 text-ink-primary">`nftables` (In-Kernel Packet Filter)</span>
            </div>
          </GlassPanel>
        </section>
      </div>

      {/* Discovery Next Steps Gateways */}
      <div className="mt-20 border-t border-line-subtle pt-12 text-center">
        <h3 className="text-2xl font-bold">Ready to apply what you've learned?</h3>
        <p className="mt-2 text-sm text-ink-secondary">
          Put concepts into practice in the safe terminal sandbox or find your matching distribution.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/terminal">
            <Button size="lg">
              <Terminal size={18} /> Launch Terminal Playground
            </Button>
          </Link>
          <Link to="/distros">
            <Button size="lg" variant="secondary">
              Find My Distro <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
