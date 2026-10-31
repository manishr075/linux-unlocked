import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TermLink } from "@/components/translator/TermLink";
import { Monitor } from "lucide-react";

interface DesktopEnvironment {
  id: string;
  name: string;
  creator: string;
  toolkit: string;
  ramFootprint: string;
  philosophy: string;
  interfaceStyle: string;
  defaultOn: string[];
  strengths: string[];
  mockupVisual: string;
}

const DESKTOPS: DesktopEnvironment[] = [
  {
    id: "gnome",
    name: "GNOME 47+",
    creator: "The GNOME Foundation",
    toolkit: "GTK 4 / Libadwaita",
    ramFootprint: "~850 MB - 1.2 GB Idle",
    philosophy: "Distraction-free computing. Eliminates desktop clutter in favor of a dynamic overview and multi-finger touch gestures.",
    interfaceStyle: "Clean top bar with Activities button, clock in center, dynamic workspaces that spawn automatically on demand.",
    defaultOn: ["Fedora Workstation", "Ubuntu", "Debian (Default)", "RHEL Workstation"],
    strengths: [
      "Industry-leading Wayland touchpad gestures (3-finger swipe workspaces)",
      "Uniform, beautiful modern design with Libadwaita",
      "Seamless integration with Google/Nextcloud online accounts",
      "Expansive ecosystem of community extensions",
    ],
    mockupVisual: "top-bar-centered",
  },
  {
    id: "kde",
    name: "KDE Plasma 6+",
    creator: "KDE Community",
    toolkit: "Qt 6 / Kirigami",
    ramFootprint: "~600 MB - 900 MB Idle",
    philosophy: "Simple by default, powerful when needed. Everything on your screen can be customized, relocated, or modified.",
    interfaceStyle: "Traditional bottom taskbar with pinned icons, system tray, and an Application Launcher start menu.",
    defaultOn: ["Kubuntu", "Fedora KDE Spin", "SteamOS (Desktop Mode)", "Manjaro KDE"],
    strengths: [
      "Exceptionally light on RAM despite rich visual blur and animations",
      "Total customization: change window buttons, panels, widgets, and themes",
      "KDE Connect: phone notifications, SMS, and clipboard syncing out of the box",
      "Dolphin: arguably the most powerful file manager in computing",
    ],
    mockupVisual: "bottom-taskbar",
  },
  {
    id: "cinnamon",
    name: "Cinnamon",
    creator: "The Linux Mint Team",
    toolkit: "GTK 3",
    ramFootprint: "~750 MB - 1.0 GB Idle",
    philosophy: "Zero learning curve for Windows switchers. Traditional desktop paradigms built for rock-solid daily reliability.",
    interfaceStyle: "Classic bottom panel with Start Menu, window list with titles, and desktop shortcut icons.",
    defaultOn: ["Linux Mint (Flagship)", "Fedora Cinnamon Spin"],
    strengths: [
      "Instant familiarity for anyone migrating from Windows 7, 10, or 11",
      "Reliable, predictable behavior with zero unexpected redesigns",
      "Modular Applets and Desklets to add weather, system monitors, or notes",
      "Very low learning curve — no terminal required for daily tasks",
    ],
    mockupVisual: "classic-windows",
  },
  {
    id: "hyprland",
    name: "Hyprland (Tiling Wayland Compositor)",
    creator: "Vaxry (Independent Open Source)",
    toolkit: "Custom C++ Wayland Compositor",
    ramFootprint: "~350 MB - 600 MB Idle",
    philosophy: "Keep your hands on the keyboard. Windows tile automatically into split layouts with fluid physics-based animations.",
    interfaceStyle: "Minimalist bar (Waybar), tiled terminal & editor grids, zero mouse clicks needed to manage windows.",
    defaultOn: ["Arch Linux (Custom)", "EndeavourOS Community Edition", "NixOS"],
    strengths: [
      "Blistering keyboard navigation and workspace switching speed",
      "Modern Wayland protocol with smooth fluid animations and rounded corners",
      "Saves enormous screen real estate on single laptops or ultrawide monitors",
      "Extreme efficiency for developers, programmers, and power users",
    ],
    mockupVisual: "tiling-grid",
  },
];

export function DesktopEnvironmentsShowcase() {
  const [activeDe, setActiveDe] = useState<DesktopEnvironment>(DESKTOPS[0]);

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Monitor className="text-cyan" size={22} />
            Desktop Environments (DEs): Choose Your Interface
          </h3>
          <p className="text-xs text-ink-secondary mt-1">
            In Linux, the desktop is not glued to the OS. Compare the visual shell, workflow, and RAM footprints.
          </p>
        </div>
        <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
          Modular Visual Shells
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mb-6">
        {DESKTOPS.map((de) => {
          const isSelected = activeDe.id === de.id;
          return (
            <button
              key={de.id}
              onClick={() => setActiveDe(de)}
              className={`rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? "border-cyan bg-cyan/15 text-cyan font-bold shadow-glow"
                  : "border-line-subtle bg-surface/60 text-ink-secondary hover:text-ink-primary hover:bg-surface"
              }`}
            >
              <span className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                {de.toolkit}
              </span>
              <span className="block text-sm font-semibold mt-0.5">
                {de.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected DE Detail */}
      <div className="rounded-xl border border-line-subtle bg-base/80 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-subtle pb-4">
          <div>
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
              {activeDe.creator}
            </span>
            <h4 className="text-2xl font-bold text-ink-primary mt-0.5">
              {activeDe.name}
            </h4>
          </div>
          <div className="flex gap-2">
            <span className="rounded border border-line-subtle bg-elevated px-2.5 py-1 font-mono text-xs text-cyan">
              RAM: {activeDe.ramFootprint}
            </span>
          </div>
        </div>

        {/* Mock Interface Wireframe */}
        <div className="my-6 rounded-xl border border-line-accent/40 bg-void p-4">
          <p className="text-[11px] font-mono text-ink-muted uppercase mb-2">
            Layout Paradigm: {activeDe.interfaceStyle}
          </p>

          {/* Wireframe Mockup */}
          {activeDe.mockupVisual === "top-bar-centered" && (
            <div className="h-36 rounded-lg border border-line-subtle bg-surface/40 flex flex-col justify-between p-2 relative overflow-hidden">
              <div className="flex items-center justify-between rounded bg-elevated px-3 py-1 text-[11px] font-mono text-ink-secondary border border-line-subtle">
                <span className="text-cyan font-bold">Activities</span>
                <span>Oct 31  21:40</span>
                <span>Network • Volume • Power</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-48 h-20 rounded border border-cyan/30 bg-cyan/5 p-2 text-center text-xs text-ink-muted flex items-center justify-center">
                  Focused Workspace
                </div>
              </div>
            </div>
          )}

          {activeDe.mockupVisual === "bottom-taskbar" && (
            <div className="h-36 rounded-lg border border-line-subtle bg-surface/40 flex flex-col justify-between p-2 relative overflow-hidden">
              <div className="flex-1 flex items-center justify-center gap-3">
                <div className="w-36 h-20 rounded border border-electric/30 bg-electric/5 p-2 text-xs text-ink-muted flex items-center justify-center">
                  Window 1
                </div>
                <div className="w-36 h-20 rounded border border-line-subtle bg-surface p-2 text-xs text-ink-muted flex items-center justify-center">
                  Window 2
                </div>
              </div>
              <div className="flex items-center justify-between rounded bg-elevated px-3 py-1 text-[11px] font-mono text-ink-secondary border border-line-subtle">
                <span className="text-electric font-bold">Application Menu</span>
                <span className="text-[10px] text-ink-muted">Pinned Tasks • Dolphin • Terminal</span>
                <span>SysTray • Clock</span>
              </div>
            </div>
          )}

          {activeDe.mockupVisual === "classic-windows" && (
            <div className="h-36 rounded-lg border border-line-subtle bg-surface/40 flex flex-col justify-between p-2 relative overflow-hidden">
              <div className="flex-1 p-2">
                <div className="w-14 h-14 rounded border border-line-subtle bg-surface/80 flex flex-col items-center justify-center text-[10px] text-ink-muted">
                  <Monitor size={16} className="text-cyan mb-1" />
                  Files
                </div>
              </div>
              <div className="flex items-center justify-between rounded bg-elevated px-3 py-1.5 text-[11px] font-mono text-ink-secondary border border-line-subtle">
                <span className="text-success font-bold">Menu</span>
                <span className="text-[10px] text-ink-muted">Active Window Title Bar</span>
                <span>Tray • Calendar</span>
              </div>
            </div>
          )}

          {activeDe.mockupVisual === "tiling-grid" && (
            <div className="h-36 rounded-lg border border-line-subtle bg-surface/40 flex flex-col justify-between p-2 relative overflow-hidden">
              <div className="flex items-center justify-between rounded bg-void px-3 py-0.5 text-[10px] font-mono text-violet border border-violet/30">
                <span>[1] [2] [3] [4]</span>
                <span>CPU: 8% | RAM: 420MB</span>
                <span>21:40</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2 my-1">
                <div className="rounded border border-violet/40 bg-violet/5 p-2 font-mono text-[10px] text-violet flex items-center justify-center">
                  Terminal (vim)
                </div>
                <div className="rounded border border-cyan/40 bg-cyan/5 p-2 font-mono text-[10px] text-cyan flex items-center justify-center">
                  Browser / Docs
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Philosophy & Strengths */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <span className="text-xs font-semibold text-cyan block mb-1">Design Philosophy:</span>
            <p className="text-xs text-ink-secondary leading-relaxed">
              {activeDe.philosophy}
            </p>
            <div className="mt-3">
              <span className="text-xs font-semibold text-ink-primary block mb-1">Pre-installed by Default On:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeDe.defaultOn.map((distro) => (
                  <span
                    key={distro}
                    className="rounded border border-line-subtle bg-surface px-2 py-0.5 font-mono text-xs text-ink-secondary"
                  >
                    {distro}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-electric block mb-1">Signature Strengths:</span>
            <ul className="space-y-1.5 text-xs text-ink-secondary">
              {activeDe.strengths.map((str) => (
                <li key={str} className="flex items-start gap-1.5">
                  <span className="text-electric font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-line-subtle pt-3 flex items-center justify-between text-xs text-ink-muted">
          <span>You can switch desktop environments at login anytime</span>
          <TermLink term="desktop environment">Learn in Translator</TermLink>
        </div>
      </div>
    </GlassPanel>
  );
}
