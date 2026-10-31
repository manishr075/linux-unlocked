/* ============================================================
   LINUX UNLOCKED — About, Sources & Contribution (Module K)
   ------------------------------------------------------------
   Features:
     - Project Mission & the 5 Core Architectural Pillars
     - The Strictly ₹0 Budget & Zero-Paid-Dependency Charter
     - Upstream Source Truth Ledger (Kernel, GNU, POSIX, ArchWiki)
     - Community Contribution Guidelines & Verification Schema
     - Comprehensive Frequently Asked Questions (FAQ)
   ============================================================ */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";
import {
  ShieldCheck,
  GitPullRequest,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export function AboutPage() {
  const location = useLocation();
  const getInitialTab = (): "about" | "sources" | "contribute" | "faq" => {
    if (location.pathname === "/sources") return "sources";
    if (location.pathname === "/contribute") return "contribute";
    return "about";
  };

  const [activeTab, setActiveTab] = useState<"about" | "sources" | "contribute" | "faq">(getInitialTab);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (location.pathname === "/sources") setActiveTab("sources");
    else if (location.pathname === "/contribute") setActiveTab("contribute");
    else if (location.pathname === "/about") setActiveTab("about");
  }, [location.pathname]);

  const FAQS = [
    {
      q: "Will trying Linux erase my Windows files or games?",
      a: "No! When you use our in-browser sandboxes (Terminal Playground, 3D Architecture, Desktop Simulator), nothing on your computer is modified. When you test a Live USB, Linux runs 100% in RAM without touching your hard drive. Only selecting 'Erase Disk' during an actual installation modifies partitions — and our Migration Planner provides safety checklists to prevent accidents.",
    },
    {
      q: "Can I play my Windows Steam games on Linux?",
      a: "Yes! Valve's Proton compatibility layer translates DirectX into Vulkan in real time. Over 15,000+ Windows Steam games run on Linux with the click of 'Play' (including Elden Ring, Baldur's Gate 3, Cyberpunk 2077). The only major exceptions are multiplayer titles requiring Windows kernel-level anti-cheat (such as Valorant and Fortnite).",
    },
    {
      q: "How does LINUX UNLOCKED operate with a strictly ₹0 budget?",
      a: "LINUX UNLOCKED is engineered from the ground up for zero-budget static resilience. We use native Three.js for real-time client-side WebGL rendering, local in-memory Virtual Filesystem simulations, client-side Fuse.js search, and static Markdown/JSON data models. There are no paid AI APIs, no mandatory databases, and no cloud hosting bills.",
    },
    {
      q: "What should I do if my Wi-Fi or graphics card doesn't work out of the box?",
      a: "Modern distributions like Linux Mint and Ubuntu include automated driver managers that detect proprietary Broadcom Wi-Fi and NVIDIA GPU cards with a single click. Our Compatibility Checker lets you verify your specific hardware chipsets before installing.",
    },
    {
      q: "What is the difference between Linux, GNU, and a Distribution?",
      a: "Linux is strictly the kernel (the engine talking to hardware). GNU provides essential command-line tools and C libraries (the chassis and steering wheel). A distribution (like Ubuntu, Mint, or Fedora) packages the kernel, GNU tools, desktop environment, and package manager into a complete operating system ready for daily use.",
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Pill tone="cyan" className="mb-4">
          Module K • Transparency & Sources
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Independent. Open. Factual.
        </h1>
        <p className="mt-3 text-base text-ink-secondary md:text-lg">
          LINUX UNLOCKED is built on the belief that digital sovereignty belongs to everyone.
          Explore our upstream sources, ₹0 budget charter, and community contribution guidelines.
        </p>

        {/* Tab Switcher */}
        <div className="mt-8 inline-flex rounded-xl border border-line-subtle bg-surface/70 p-1.5 backdrop-blur-glass">
          <button
            onClick={() => setActiveTab("about")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "about"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Mission & Charter
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "sources"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Upstream Sources Ledger
          </button>
          <button
            onClick={() => setActiveTab("contribute")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "contribute"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Contribution Guide
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "faq"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            Frequently Asked Questions
          </button>
        </div>
      </div>

      <div className="mt-12 animate-fadeIn">
        {/* ============================================================
            TAB 1: MISSION & CHARTER
            ============================================================ */}
        {activeTab === "about" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <GlassPanel className="p-8 md:p-12">
              <h2 className="text-2xl font-bold md:text-3xl text-ink-primary mb-4">
                The LINUX UNLOCKED Mission
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed italic border-l-4 border-cyan pl-4 my-6">
                "Make Linux understandable, accessible, and enjoyable for everyone, regardless of their technical background — while preserving absolute technical accuracy."
              </p>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Operating systems are the foundational digital infrastructure of modern human life. When computers are locked behind corporate walled gardens with forced telemetry, targeted advertisements, and planned obsolescence, users lose digital agency.
              </p>
              <p className="mt-4 text-sm text-ink-secondary leading-relaxed">
                LINUX UNLOCKED provides a risk-free runway: experience Linux inside your browser through native Three.js 3D architecture models, practice in a safe virtual terminal, and plan a confident migration with honest hardware and software compatibility guidance.
              </p>
            </GlassPanel>

            {/* The ₹0 Budget Charter */}
            <GlassPanel className="p-8 md:p-12 border-line-accent/40">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-cyan" size={24} />
                <h3 className="text-xl font-bold text-ink-primary">
                  The Strictly ₹0 Development Budget Charter
                </h3>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                Every line of code and every piece of content in LINUX UNLOCKED is designed to run indefinitely with zero operating costs:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line-subtle bg-base/50 p-4">
                  <span className="font-bold text-cyan text-sm block mb-1">Zero Paid APIs</span>
                  <p className="text-xs text-ink-secondary">No paid AI dependencies or closed proprietary external services. All search and simulations run 100% on the client.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/50 p-4">
                  <span className="font-bold text-electric text-sm block mb-1">Database-Free Core</span>
                  <p className="text-xs text-ink-secondary">Educational articles and distro profiles live as typed static JSON and Markdown committed directly to source control.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/50 p-4">
                  <span className="font-bold text-success text-sm block mb-1">100% Client-Side Graphics</span>
                  <p className="text-xs text-ink-secondary">Real-time WebGL rendering with native Three.js and custom GLSL shaders without expensive video streaming backends.</p>
                </div>
                <div className="rounded-xl border border-line-subtle bg-base/50 p-4">
                  <span className="font-bold text-violet text-sm block mb-1">Private & Anonymous</span>
                  <p className="text-xs text-ink-secondary">Zero tracking scripts, no third-party advertising cookies, and no mandatory user accounts.</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* ============================================================
            TAB 2: UPSTREAM SOURCES LEDGER
            ============================================================ */}
        {activeTab === "sources" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <GlassPanel className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-success" size={24} />
                <h2 className="text-2xl font-bold text-ink-primary">
                  Upstream Source Truth Ledger
                </h2>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                We do not invent Linux behavior or rely on outdated secondary blog posts. All content in LINUX UNLOCKED is verified against official upstream maintainer documentation:
              </p>
            </GlassPanel>

            <div className="grid gap-4">
              {[
                {
                  title: "The Linux Kernel Official Documentation",
                  url: "https://www.kernel.org/doc/html/latest/",
                  subsystem: "Kernel Internals, VFS, Memory Management, Scheduling (EEVDF)",
                  authority: "Linus Torvalds & Kernel Maintainers (GPLv2)",
                },
                {
                  title: "POSIX Standard Specifications (IEEE Std 1003.1-2024)",
                  url: "https://pubs.opengroup.org/onlinepubs/9799919799/",
                  subsystem: "Standard Shell Environment, Core System Calls, Path Resolution",
                  authority: "The Open Group / IEEE",
                },
                {
                  title: "GNU Operating System & Coreutils Reference Manual",
                  url: "https://www.gnu.org/software/coreutils/manual/",
                  subsystem: "coreutils (ls, cat, chmod, cp, mv), bash shell interpreter, glibc",
                  authority: "Free Software Foundation (FSF)",
                },
                {
                  title: "The ArchWiki Documentation Portal",
                  url: "https://wiki.archlinux.org",
                  subsystem: "Hardware Configuration, Gaming/Proton, Desktop Environments, Audio/PipeWire",
                  authority: "Arch Linux Documentation Team",
                },
                {
                  title: "Debian GNU/Linux Policy Manual",
                  url: "https://www.debian.org/doc/debian-policy/",
                  subsystem: "Package Hierarchy, FHS 3.0 Compliance, System Service Governance",
                  authority: "Debian Project",
                },
                {
                  title: "Freedesktop.org & Wayland Compositor Protocols",
                  url: "https://wayland.freedesktop.org",
                  subsystem: "Display Server Protocols, XDG Desktop Portals, PipeWire Multimedia",
                  authority: "X.Org Foundation & Freedesktop.org",
                },
              ].map((src, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-line-subtle bg-base/70 p-5 hover:border-cyan transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink-primary">{src.title}</h4>
                      <p className="text-xs text-cyan font-mono mt-0.5">{src.subsystem}</p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-cyan shrink-0"
                    >
                      Upstream Spec <ExternalLink size={13} />
                    </a>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-2 border-t border-line-subtle pt-2">
                    Governing Body: {src.authority}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: CONTRIBUTION GUIDELINES
            ============================================================ */}
        {activeTab === "contribute" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <GlassPanel className="p-8 md:p-12">
              <div className="flex items-center gap-2 mb-3">
                <GitPullRequest className="text-cyan" size={24} />
                <h2 className="text-2xl font-bold text-ink-primary">
                  How to Contribute to LINUX UNLOCKED
                </h2>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">
                LINUX UNLOCKED is open source under the MIT License. We welcome contributions from Linux educators, system administrators, kernel developers, and design enthusiasts.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-ink-primary flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan" /> 1. The Multi-Depth Authoring Rule
                  </h4>
                  <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                    Every educational article in the Atlas must include three distinct depths: <strong>Beginner</strong> (plain language, analogies, no unexplained jargon), <strong>Practical</strong> (commands, real-world examples, configuration paths), and <strong>Technical</strong> (kernel architecture, POSIX specs, official citations).
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-ink-primary flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan" /> 2. Factual Integrity & Source Linking
                  </h4>
                  <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                    Do not submit undocumented command flags or speculative claims. Every article and compatibility entry must cite official man-pages, kernel.org documentation, or vendor specs with an ISO verification date.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-ink-primary flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan" /> 3. Pure TypeScript & Modular Three.js
                  </h4>
                  <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                    All simulation engines (virtual filesystems, command parsers) and Three.js scene modules must remain pure, isolated TypeScript modules with strict memory disposal contracts.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* ============================================================
            TAB 4: FAQS
            ============================================================ */}
        {activeTab === "faq" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-line-subtle bg-base/80 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-ink-primary hover:text-cyan transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs md:text-sm text-ink-secondary leading-relaxed border-t border-line-subtle/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
