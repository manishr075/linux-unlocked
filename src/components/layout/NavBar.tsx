import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
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
  Shield,
  Sparkles,
} from "lucide-react";
import { LevelSwitcher } from "@/components/translator/LevelSwitcher";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Compass;
  category: "Experience" | "Learn" | "Decide";
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", icon: Sparkles, category: "Experience" },
  { to: "/discover", label: "Discover", icon: Compass, category: "Experience" },
  { to: "/desktop", label: "Desktop", icon: Monitor, category: "Experience" },
  { to: "/atlas", label: "Atlas", icon: BookOpen, category: "Learn" },
  { to: "/terminal", label: "Terminal", icon: Terminal, category: "Learn" },
  { to: "/distros", label: "Distros", icon: Layers, category: "Decide" },
  { to: "/compatibility", label: "Compatibility", icon: Laptop, category: "Decide" },
  { to: "/migrate", label: "Migrate", icon: ArrowRight, category: "Decide" },
];

/** Production-grade top navigation header with glassmorphism, level switcher, search, and accessible mobile drawer. */
export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-nav border-b border-white/[0.08] bg-base/80 backdrop-blur-xl">
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
              Kernel to Userland
            </span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-white/[0.08] text-cyan border border-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions: Quick Search, Level Switcher, Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Atlas Search Trigger */}
          <Link
            to="/atlas"
            className="hidden items-center gap-2 rounded-lg border border-white/[0.08] bg-surface/80 px-2.5 py-1.5 text-xs text-ink-muted transition-colors hover:border-cyan/30 hover:text-ink-primary md:flex"
            title="Search Atlas Knowledge Base"
          >
            <Search size={14} className="text-cyan" />
            <span>Search Atlas</span>
            <kbd className="rounded border border-white/[0.12] bg-void/80 px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
              /
            </kbd>
          </Link>

          {/* Depth Level Switcher */}
          <div className="hidden sm:block">
            <LevelSwitcher compact />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-surface/80 text-ink-secondary hover:text-ink-primary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-t border-white/[0.08] bg-base/95 px-4 py-5 shadow-2xl backdrop-blur-2xl lg:hidden animate-fadeIn">
          <div className="mb-4">
            <LevelSwitcher />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "border-cyan/40 bg-cyan/10 text-cyan font-semibold shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                        : "border-white/[0.05] bg-surface/60 text-ink-secondary hover:border-white/[0.1] hover:text-ink-primary"
                    }`
                  }
                >
                  <Icon size={16} className="text-cyan shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <Shield size={13} className="text-success" /> 100% Client-Side • Free
            </span>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="text-cyan hover:underline"
            >
              Charter & Sources →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
