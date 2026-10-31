import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TermLink } from "@/components/translator/TermLink";
import { GitBranch } from "lucide-react";

interface DistroFamily {
  id: string;
  name: string;
  ancestor: string;
  packageFormat: string;
  packageManager: string;
  philosophy: string;
  children: { name: string; role: string; highlight: string }[];
  accentColor: string;
  bestFor: string;
}

const FAMILIES: DistroFamily[] = [
  {
    id: "debian",
    name: "Debian Ecosystem",
    ancestor: "Debian GNU/Linux (Founded 1993 by Ian Murdock)",
    packageFormat: ".deb",
    packageManager: "apt (Advanced Package Tool)",
    philosophy: "Uncompromising stability, strict free software guidelines, and thorough package testing.",
    accentColor: "border-cyan/40 text-cyan bg-cyan/10",
    bestFor: "Rock-solid desktop computing, home servers, and mission-critical production systems.",
    children: [
      { name: "Ubuntu", role: "Desktop & Cloud Standard", highlight: "Canonical's user-friendly release with extensive hardware support." },
      { name: "Linux Mint", role: "Beginner Gold Standard", highlight: "Familiar Windows-like Cinnamon desktop with strong privacy defaults and no account requirement." },
      { name: "Pop!_OS", role: "Creators & Gamers", highlight: "System76 distro with automatic NVIDIA GPU driver integration." },
      { name: "Zorin OS", role: "Windows Switcher Gateway", highlight: "Elegantly mimics Windows 10/11 interface and layout." },
    ],
  },
  {
    id: "redhat",
    name: "Red Hat / Fedora Ecosystem",
    ancestor: "Red Hat Linux (1994) → Fedora Project (2003)",
    packageFormat: ".rpm",
    packageManager: "dnf / rpm-ostree",
    philosophy: "Upstream innovation, cutting-edge kernel features, and enterprise-grade security (SELinux).",
    accentColor: "border-electric/40 text-electric bg-electric/10",
    bestFor: "Software developers, cloud architects, and sysadmins preparing for enterprise infrastructure.",
    children: [
      { name: "Fedora Workstation", role: "Developer Powerhouse", highlight: "Pure upstream GNOME experience, cutting-edge kernel, leading Wayland adoption." },
      { name: "Red Hat Enterprise (RHEL)", role: "Corporate Enterprise Core", highlight: "10-year enterprise lifecycle, strict regulatory certifications." },
      { name: "Rocky Linux / AlmaLinux", role: "Free Enterprise Rebuilds", highlight: "100% bug-for-bug compatible open-source RHEL alternatives." },
    ],
  },
  {
    id: "arch",
    name: "Arch Linux Ecosystem",
    ancestor: "Arch Linux (2002 by Judd Vinet)",
    packageFormat: ".pkg.tar.zst",
    packageManager: "pacman / AUR (Arch User Repository)",
    philosophy: "The 'KISS' principle (Keep It Simple, Stupid) — minimalist, unconfigured base, and continuous rolling releases.",
    accentColor: "border-violet/40 text-violet bg-violet/10",
    bestFor: "Enthusiasts who want to assemble their own tailored OS from scratch and have newest packages.",
    children: [
      { name: "EndeavourOS", role: "Arch Made Approachable", highlight: "Calamares GUI installer with friendly, active community support." },
      { name: "Manjaro", role: "Curated Arch Rolling", highlight: "Holds back packages by 1-2 weeks for extra driver and stability testing." },
      { name: "SteamOS 3.0", role: "Handheld Gaming OS", highlight: "Valve's immutable Arch-based operating system powering the Steam Deck." },
    ],
  },
  {
    id: "independent",
    name: "Independent & Specialized",
    ancestor: "Distinct codebases without parent lineages",
    packageFormat: "Varies (zypp, apk, xbps, nix)",
    packageManager: "zypper / apk / nix",
    philosophy: "Purpose-built engineering: containers, immutable roots, and reproducible system builds.",
    accentColor: "border-success/40 text-success bg-success/10",
    bestFor: "Niche optimizations: micro-containers, security auditing, and reproducible environments.",
    children: [
      { name: "openSUSE (Tumbleweed/Leap)", role: "Enterprise Polish & YaST", highlight: "Btrfs snapshots out-of-the-box: roll back a broken update in 10 seconds." },
      { name: "Alpine Linux", role: "Ultra-Lightweight Containers", highlight: "Microscopic 5MB base image running musl libc and busybox." },
      { name: "NixOS", role: "Declarative & Reproducible", highlight: "Entire OS state configured in a single declarative file." },
    ],
  },
];

export function DistroFamilyTree() {
  const [activeFamily, setActiveFamily] = useState<DistroFamily>(FAMILIES[0]);

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <GitBranch className="text-cyan" size={22} />
            The Linux Distribution Family Tree
          </h3>
          <p className="text-xs text-ink-secondary mt-1">
            Hundreds of distros exist, but almost all stem from four grand evolutionary branches.
          </p>
        </div>
        <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
          Lineage & Ecosystems
        </span>
      </div>

      {/* Family Selector Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-6">
        {FAMILIES.map((family) => {
          const isSelected = activeFamily.id === family.id;
          return (
            <button
              key={family.id}
              onClick={() => setActiveFamily(family)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? `border-cyan bg-cyan/15 text-cyan font-bold shadow-glow`
                  : "border-line-subtle bg-surface/60 text-ink-secondary hover:text-ink-primary hover:bg-surface"
              }`}
            >
              <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {family.packageFormat}
              </span>
              <span className="block text-sm font-semibold mt-0.5">
                {family.name.split(" ")[0]} Family
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Family Details Panel */}
      <div className="rounded-xl border border-line-subtle bg-base/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
              Lineage Foundation
            </span>
            <h4 className="text-xl font-bold text-ink-primary mt-0.5">
              {activeFamily.name}
            </h4>
            <p className="text-xs text-ink-secondary font-mono mt-0.5">
              Root: {activeFamily.ancestor}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded border border-line-subtle bg-elevated px-2.5 py-1 font-mono text-xs text-ink-primary">
              Format: {activeFamily.packageFormat}
            </span>
            <span className="rounded border border-line-subtle bg-elevated px-2.5 py-1 font-mono text-xs text-cyan">
              Manager: {activeFamily.packageManager}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-surface/60 p-3.5 border border-line-subtle">
            <span className="text-xs font-semibold text-cyan block mb-1">Core Philosophy:</span>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {activeFamily.philosophy}
            </p>
          </div>
          <div className="rounded-lg bg-surface/60 p-3.5 border border-line-subtle">
            <span className="text-xs font-semibold text-electric block mb-1">Best Suited For:</span>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {activeFamily.bestFor}
            </p>
          </div>
        </div>

        {/* Prominent Descendant Distros */}
        <div className="mt-6">
          <p className="text-xs font-mono font-semibold uppercase text-ink-muted mb-3">
            Major Descendants & Offspring:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeFamily.children.map((child) => (
              <div
                key={child.name}
                className="rounded-lg border border-line-subtle bg-elevated/70 p-3.5 hover:border-line transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-ink-primary">
                    {child.name}
                  </span>
                  <span className="rounded bg-surface px-2 py-0.5 text-[10px] font-mono text-cyan">
                    {child.role}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink-secondary">
                  {child.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-line-subtle pt-3 flex items-center justify-between text-xs text-ink-muted">
          <span>Explore individual distributions in the Distro Explorer</span>
          <TermLink term="distribution">Definition in Translator</TermLink>
        </div>
      </div>
    </GlassPanel>
  );
}
