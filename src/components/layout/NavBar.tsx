import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { LevelSwitcher } from "@/components/translator/LevelSwitcher";

interface NavItem {
  to: string;
  label: string;
  zone: "experience" | "learn" | "choose";
}

const navItems: NavItem[] = [
  { to: "/", label: "Home", zone: "experience" },
  { to: "/discover", label: "Discover", zone: "experience" },
  { to: "/desktop", label: "Desktop", zone: "experience" },
  { to: "/atlas", label: "Atlas", zone: "learn" },
  { to: "/terminal", label: "Terminal", zone: "learn" },
  { to: "/distros", label: "Distros", zone: "choose" },
  { to: "/compatibility", label: "Compatibility", zone: "choose" },
  { to: "/migrate", label: "Migrate", zone: "choose" },
];

/** Sticky top navigation with four zones, level switcher, and mobile menu. */
export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-nav border-b border-line-subtle bg-base/80 backdrop-blur-glass">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 font-display text-sm font-bold tracking-wide">
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="6" fill="none" stroke="#22d3ee" strokeWidth="2" />
            <circle cx="16" cy="16" r="2.5" fill="#3b82f6" />
          </svg>
          <span className="text-ink-primary">LINUX</span>
          <span className="text-gradient">UNLOCKED</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-cyan"
                    : "text-ink-secondary hover:text-ink-primary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <LevelSwitcher compact />
          </div>
          <button
            className="rounded-md p-2 text-ink-secondary hover:text-ink-primary md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-line-subtle px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-cyan/10 text-cyan"
                      : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3">
            <LevelSwitcher />
          </div>
        </nav>
      )}
    </header>
  );
}
