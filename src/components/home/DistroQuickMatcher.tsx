import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Laptop, Code2, Cpu } from "lucide-react";

interface PersonaMatch {
  id: string;
  label: string;
  icon: typeof Laptop;
  distro: string;
  tagline: string;
  whyFit: string;
  packageManager: string;
  minRam: string;
  defaultDE: string;
}

const PERSONAS: PersonaMatch[] = [
  {
    id: "windows-migrator",
    label: "Transitioning from Windows",
    icon: Laptop,
    distro: "Linux Mint (Cinnamon)",
    tagline: "The smoothest, zero-friction desktop transition on Earth.",
    whyFit:
      "Includes a familiar Start Menu, traditional taskbar, full media codec support out of the box, and a rock-solid Ubuntu/Debian LTS base that never breaks.",
    packageManager: "APT / Flatpak",
    minRam: "2 GB (4 GB recommended)",
    defaultDE: "Cinnamon Desktop",
  },
  {
    id: "developer",
    label: "Software Engineer / DevOps",
    icon: Code2,
    distro: "Fedora Workstation",
    tagline: "Leading-edge technologies, pure upstream GNOME, enterprise-ready.",
    whyFit:
      "Direct upstream pipeline from Red Hat. Ships the latest Linux kernels, bleeding-edge Mesa drivers, native Podman/Docker containers, and modern Wayland display pipeline.",
    packageManager: "DNF / RPM / Flatpak",
    minRam: "4 GB recommended",
    defaultDE: "Pure GNOME 47+",
  },
  {
    id: "minimalist",
    label: "Old Laptop / Maximum Control",
    icon: Cpu,
    distro: "Debian Stable (XFCE)",
    tagline: "The rock-solid universal operating system with minimal overhead.",
    whyFit:
      "Idle RAM usage under 450 MB. Can run reliably on 10-year-old laptops without thermal throttling, supported by thousands of globally distributed mirrors.",
    packageManager: "APT",
    minRam: "1 GB RAM",
    defaultDE: "XFCE / Lightweight",
  },
];

export function DistroQuickMatcher() {
  const [selectedId, setSelectedId] = useState<string>("windows-migrator");
  const current = PERSONAS.find((p) => p.id === selectedId) || PERSONAS[0];

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.1] bg-surface/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan">
            30-Second Distro Teaser
          </span>
          <h3 className="mt-1 text-2xl font-bold text-ink-primary">
            Find Your Fast Match
          </h3>
        </div>
        <Link
          to="/distros"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline"
        >
          Take Complete 6-Question Quiz <ArrowRight size={14} />
        </Link>
      </div>

      {/* Persona Selector Buttons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PERSONAS.map((p) => {
          const Icon = p.icon;
          const isActive = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex items-center gap-2.5 rounded-xl p-3 text-left transition-all ${
                isActive
                  ? "border border-cyan/40 bg-cyan/15 text-cyan shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  : "border border-white/[0.05] bg-base/50 text-ink-muted hover:border-white/[0.1] hover:text-ink-primary"
              }`}
            >
              <Icon size={18} className={isActive ? "text-cyan shrink-0" : "text-ink-muted shrink-0"} />
              <span className="text-xs font-semibold">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Match Result Display */}
      <div className="mt-6 rounded-xl border border-cyan/30 bg-cyan/[0.03] p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan/20 pb-4">
          <div>
            <span className="text-xs font-mono font-medium text-cyan uppercase tracking-wider">
              Recommended Match
            </span>
            <h4 className="text-2xl font-bold text-ink-primary">{current.distro}</h4>
          </div>
          <Link
            to="/distros"
            className="rounded-lg bg-cyan px-3.5 py-1.5 text-xs font-semibold text-ink-onAccent hover:brightness-110 shadow-glow transition-all"
          >
            Explore in Catalog →
          </Link>
        </div>

        <p className="mt-3 text-sm font-medium text-slate-200">
          {current.tagline}
        </p>
        <p className="mt-2 text-xs text-ink-secondary leading-relaxed">
          {current.whyFit}
        </p>

        {/* Specs Pills */}
        <div className="mt-5 flex flex-wrap gap-2.5 pt-3 border-t border-white/[0.06] text-xs">
          <div className="rounded border border-white/[0.08] bg-base/60 px-2.5 py-1 text-ink-muted">
            Desktop: <strong className="text-ink-primary">{current.defaultDE}</strong>
          </div>
          <div className="rounded border border-white/[0.08] bg-base/60 px-2.5 py-1 text-ink-muted">
            Package Manager: <strong className="text-cyan font-mono">{current.packageManager}</strong>
          </div>
          <div className="rounded border border-white/[0.08] bg-base/60 px-2.5 py-1 text-ink-muted">
            Min RAM: <strong className="text-ink-primary">{current.minRam}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
