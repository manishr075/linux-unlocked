/* ============================================================
   LINUX UNLOCKED — Master Global Navigation (Production-Grade)
   ------------------------------------------------------------
   Uncluttered, professional navigation with:
     - Clear human-centered pathways (Discover, Labs, Distros, Migrate)
     - Compact, contextual Learning Level dropdown
     - Global Atlas quick search (`/` hotkey)
     - Accessible mobile drawer with intentional user intent flows
   ============================================================ */

import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Compass,
  Monitor,
  BookOpen,
  Terminal,
  Layers,
  Laptop,
  ArrowRight,
  ChevronDown,
  GraduationCap,
  Check,
} from "lucide-react";
import { useLevel } from "@/state/LevelProvider";
import type { LearningLevel } from "@/types";

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const [migrateOpen, setMigrateOpen] = useState(false);
  const [levelMenuOpen, setLevelMenuOpen] = useState(false);
  const { level, setLevel, levels } = useLevel();
  const location = useLocation();

  const labsRef = useRef<HTMLDivElement>(null);
  const migrateRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    setLabsOpen(false);
    setMigrateOpen(false);
    setLevelMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (labsRef.current && !labsRef.current.contains(e.target as Node)) {
        setLabsOpen(false);
      }
      if (migrateRef.current && !migrateRef.current.contains(e.target as Node)) {
        setMigrateOpen(false);
      }
      if (levelRef.current && !levelRef.current.contains(e.target as Node)) {
        setLevelMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const levelInfo: Record<LearningLevel, { label: string; desc: string }> = {
    beginner: { label: "Beginner", desc: "Everyday analogies & zero jargon" },
    practical: { label: "Practical", desc: "Common workflows & useful commands" },
    technical: { label: "Technical", desc: "Kernel internals & system calls" },
  };

  return (
    <header className="sticky top-0 z-nav border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="group flex items-center gap-2.5 font-display text-sm font-bold tracking-tight focus-visible:outline-none"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="6" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
              <path d="M16 4v4M16 24v4M4 16h4M24 16h4" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold tracking-wider text-ink-primary">LINUX</span>
              <span className="text-gradient font-bold tracking-wider">UNLOCKED</span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-ink-muted uppercase mt-0.5">
              Your Computer • Your Freedom
            </span>
          </div>
        </NavLink>

        {/* Desktop Primary Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {/* 1. Discover */}
          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-white/[0.08] text-cyan border border-cyan/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
              }`
            }
          >
            Discover
          </NavLink>

          {/* 2. Atlas Knowledge */}
          <NavLink
            to="/atlas"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-white/[0.08] text-cyan border border-cyan/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
              }`
            }
          >
            Atlas
          </NavLink>

          {/* 3. Interactive Labs Dropdown */}
          <div ref={labsRef} className="relative">
            <button
              onClick={() => setLabsOpen(!labsOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                location.pathname === "/desktop" || location.pathname === "/terminal"
                  ? "bg-white/[0.08] text-cyan border border-cyan/30"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <span>Labs</span>
              <ChevronDown size={13} className={`transition-transform ${labsOpen ? "rotate-180" : ""}`} />
            </button>

            {labsOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#070a12]/95 p-2 shadow-2xl backdrop-blur-2xl z-dropdown animate-fadeIn">
                <Link
                  to="/desktop"
                  className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="rounded-lg bg-cyan/10 p-2 text-cyan group-hover:bg-cyan/20">
                    <Monitor size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary group-hover:text-cyan">
                      Simulated Desktop
                    </p>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Interactive virtual desktop with windows, file manager, and editor.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/terminal"
                  className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.06] transition-colors group mt-1"
                >
                  <div className="rounded-lg bg-electric/10 p-2 text-electric group-hover:bg-electric/20">
                    <Terminal size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary group-hover:text-electric">
                      Terminal Playground
                    </p>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Safe POSIX shell with guided progressive missions.
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 4. Distribution Matcher */}
          <NavLink
            to="/distros"
            className={({ isActive }) =>
              `rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "bg-white/[0.08] text-cyan border border-cyan/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
              }`
            }
          >
            Distros
          </NavLink>

          {/* 5. Migration & Compatibility Dropdown */}
          <div ref={migrateRef} className="relative">
            <button
              onClick={() => setMigrateOpen(!migrateOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                location.pathname === "/migrate" || location.pathname === "/compatibility"
                  ? "bg-white/[0.08] text-cyan border border-cyan/30"
                  : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <span>Migrate</span>
              <ChevronDown size={13} className={`transition-transform ${migrateOpen ? "rotate-180" : ""}`} />
            </button>

            {migrateOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#070a12]/95 p-2 shadow-2xl backdrop-blur-2xl z-dropdown animate-fadeIn">
                <Link
                  to="/migrate"
                  className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover:bg-emerald-500/20">
                    <ArrowRight size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary group-hover:text-emerald-400">
                      Migration Roadmap
                    </p>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Step-by-step Windows to Linux transition planner with safety checks.
                    </p>
                  </div>
                </Link>

                <Link
                  to="/compatibility"
                  className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-white/[0.06] transition-colors group mt-1"
                >
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 group-hover:bg-amber-500/20">
                    <Laptop size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-primary group-hover:text-amber-400">
                      Hardware & Software Check
                    </p>
                    <p className="text-[11px] text-ink-muted leading-relaxed">
                      Search verified hardware support and native Linux app alternatives.
                    </p>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions: Level Selector & Atlas Search */}
        <div className="flex items-center gap-2">
          {/* Quick Atlas Search Trigger */}
          <Link
            to="/atlas"
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-surface/60 px-2.5 py-1 text-xs text-ink-muted hover:text-ink-primary hover:border-cyan/40 transition-colors"
            title="Search Atlas Knowledge Base"
          >
            <Search size={13} className="text-cyan" />
            <span className="hidden lg:inline text-[11px]">Search Atlas</span>
            <kbd className="hidden sm:inline-block rounded border border-white/10 bg-black/40 px-1.5 py-0.2 font-mono text-[9px] text-ink-muted">
              /
            </kbd>
          </Link>

          {/* Learning Level Dropdown */}
          <div ref={levelRef} className="relative">
            <button
              onClick={() => setLevelMenuOpen(!levelMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-cyan/30 bg-cyan/10 px-2.5 py-1 text-xs font-medium text-cyan hover:bg-cyan/15 transition-colors"
            >
              <GraduationCap size={13} />
              <span className="capitalize">{level}</span>
              <ChevronDown size={11} className={`transition-transform ${levelMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {levelMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#070a12]/95 p-1.5 shadow-2xl backdrop-blur-2xl z-dropdown animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-mono text-ink-muted uppercase border-b border-white/5 mb-1">
                  Explanation Depth
                </div>
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLevel(l);
                      setLevelMenuOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 rounded-lg p-2 text-left transition-colors ${
                      level === l ? "bg-cyan/15 text-cyan" : "hover:bg-white/[0.05] text-ink-secondary"
                    }`}
                  >
                    <div className="mt-0.5">
                      {level === l ? <Check size={14} className="text-cyan" /> : <div className="w-3.5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold capitalize">{levelInfo[l].label}</p>
                      <p className="text-[10px] text-ink-muted leading-tight mt-0.5">{levelInfo[l].desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-ink-secondary hover:text-ink-primary md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-drawer bg-[#05060a]/95 backdrop-blur-2xl md:hidden overflow-y-auto p-4 border-t border-white/[0.08] animate-fadeIn">
          <div className="space-y-6 max-w-md mx-auto">
            {/* Level selection on mobile */}
            <div className="rounded-xl border border-white/10 bg-surface/60 p-3">
              <p className="text-xs font-mono text-ink-muted uppercase mb-2">Select Learning Level</p>
              <div className="grid grid-cols-3 gap-1.5">
                {levels.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`rounded-lg py-1.5 text-xs font-semibold capitalize transition-all ${
                      level === l
                        ? "bg-cyan text-ink-onAccent shadow-glow"
                        : "bg-base/80 text-ink-secondary border border-white/5"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Pathways */}
            <div className="space-y-2">
              <p className="text-[11px] font-mono text-ink-muted uppercase px-1">Learn & Explore</p>
              <Link
                to="/discover"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <Compass size={18} className="text-cyan" />
                <div>
                  <p className="text-sm font-semibold">Discover Linux</p>
                  <p className="text-xs text-ink-muted">Understand how the kernel and OS work</p>
                </div>
              </Link>
              <Link
                to="/atlas"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <BookOpen size={18} className="text-cyan" />
                <div>
                  <p className="text-sm font-semibold">Linux Atlas</p>
                  <p className="text-xs text-ink-muted">Verified knowledge library & learning paths</p>
                </div>
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-mono text-ink-muted uppercase px-1">Interactive Labs</p>
              <Link
                to="/desktop"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <Monitor size={18} className="text-cyan" />
                <div>
                  <p className="text-sm font-semibold">Simulated Desktop</p>
                  <p className="text-xs text-ink-muted">Test windows, file manager, and workspace switching</p>
                </div>
              </Link>
              <Link
                to="/terminal"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <Terminal size={18} className="text-electric" />
                <div>
                  <p className="text-sm font-semibold">Terminal Playground</p>
                  <p className="text-xs text-ink-muted">Safe in-browser shell with missions</p>
                </div>
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-mono text-ink-muted uppercase px-1">Choosing & Migration</p>
              <Link
                to="/distros"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <Layers size={18} className="text-violet" />
                <div>
                  <p className="text-sm font-semibold">Distribution Matcher</p>
                  <p className="text-xs text-ink-muted">Compare distros and find your best fit</p>
                </div>
              </Link>
              <Link
                to="/compatibility"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <Laptop size={18} className="text-amber-400" />
                <div>
                  <p className="text-sm font-semibold">Hardware & Software Check</p>
                  <p className="text-xs text-ink-muted">Check hardware compatibility and app alternatives</p>
                </div>
              </Link>
              <Link
                to="/migrate"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-surface/40 p-3 text-ink-primary hover:border-cyan/40"
              >
                <ArrowRight size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold">Migration Roadmap</p>
                  <p className="text-xs text-ink-muted">Step-by-step switch plan with zero data loss</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
