import { useState } from "react";
import { FolderTree, Package, Shield, Settings, Check, X, ArrowRight } from "lucide-react";

interface ParadigmTopic {
  id: string;
  label: string;
  icon: typeof FolderTree;
  title: string;
  summary: string;
  windows: {
    approach: string;
    characteristics: string[];
    example: string;
  };
  linux: {
    approach: string;
    characteristics: string[];
    example: string;
  };
  whyItMatters: string;
}

const TOPICS: ParadigmTopic[] = [
  {
    id: "filesystem",
    label: "Filesystem & Hierarchy",
    icon: FolderTree,
    title: "Arbitrary Drive Letters vs Single Unified Root",
    summary:
      "Windows fragments disks into physical drive letters (C:, D:, E:). Linux mounts everything into a single, predictable root directory (/) where everything is treated as a file.",
    windows: {
      approach: "Partitioned Drive Letters",
      characteristics: [
        "Paths begin with drive letter: C:\\Users\\Name\\Documents",
        "Backslashes (\\) used for path separation",
        "Hidden system registry stores global configurations",
        "Disks must be assigned letters (C:, D:) to be accessed",
      ],
      example: "C:\\Program Files\\Application\\config.ini",
    },
    linux: {
      approach: "Unified Virtual Hierarchy (FHS 3.0)",
      characteristics: [
        "Paths begin at single root: /home/curious/Documents",
        "Forward slashes (/) used consistently",
        "Plain text configuration files in /etc (human-readable)",
        "Drives, USB sticks, and network shares mount anywhere as folders",
      ],
      example: "/etc/application/config.conf",
    },
    whyItMatters:
      "In Linux, 'Everything is a file'. You can back up or migrate complete application settings by simply copying plain text directories.",
  },
  {
    id: "software",
    label: "Software Installation",
    icon: Package,
    title: "Untrusted Download Portals vs Curated Cryptographic Repositories",
    summary:
      "Instead of hunting third-party websites for .exe installers, Linux uses package managers with cryptographically signed software repositories.",
    windows: {
      approach: "Installer Portals (.exe / .msi)",
      characteristics: [
        "Manual web browsing for download links",
        "Risk of bundled adware, toolbars, or trojans",
        "Each application runs its own background auto-updater",
        "Uninstallation often leaves orphaned registry keys",
      ],
      example: "setup_v2.4_installer.exe",
    },
    linux: {
      approach: "Cryptographically Verified Repositories",
      characteristics: [
        "Centralized repos verified via GPG keys",
        "One command updates entire OS and all apps together",
        "Sandboxed modern packaging via Flatpak with granular permissions",
        "Clean, zero-residue uninstallation",
      ],
      example: "sudo apt install vlc  /  flatpak install flathub org.videolan.VLC",
    },
    whyItMatters:
      "Zero installer malware risks, automatic dependency resolution, and complete updates completed in seconds without rebooting.",
  },
  {
    id: "updates",
    label: "Updates & Rebooting",
    icon: Settings,
    title: "Forced Disruptive Reboots vs Seamless Live Updates",
    summary:
      "Windows locks files in use and frequently enforces automatic restarts. Linux updates software while applications are running.",
    windows: {
      approach: "Forced Reboots & File Locks",
      characteristics: [
        "Files cannot be modified while running",
        "Updates often trigger unexpected reboots mid-work",
        "Lengths of 'Getting Windows Ready' screens on startup",
        "Telemetry and optional updates bundled together",
      ],
      example: "Restart required to complete updates (30 minutes remaining)",
    },
    linux: {
      approach: "Live In-Memory Patching",
      characteristics: [
        "Active binaries replaced in memory; restarts rarely needed",
        "Kernel livepatching allows zero-downtime updates",
        "Updates run in background without interrupting active work",
        "You decide exactly when and what packages update",
      ],
      example: "All packages updated seamlessly in 18 seconds",
    },
    whyItMatters:
      "Your computer stays yours. Linux never restarts without your explicit permission, making it the choice for 96%+ of all cloud servers.",
  },
  {
    id: "privacy",
    label: "Privacy & Sovereignty",
    icon: Shield,
    title: "Mandatory Cloud Account vs Sovereign Offline Computer",
    summary:
      "Windows 11 mandates Microsoft cloud accounts, behavioral diagnostics, and integrated advertisements. Linux operates 100% locally and privately.",
    windows: {
      approach: "Cloud-Tethered Telemetry",
      characteristics: [
        "Mandatory online Microsoft account on new installations",
        "Continuous behavioral telemetry beacons transmitted",
        "Start menu displays promotional ads and suggested apps",
        "Proprietary code base that cannot be audited",
      ],
      example: "Telemetry payload sent to remote telemetry servers",
    },
    linux: {
      approach: "Independent Digital Sovereignty",
      characteristics: [
        "Zero accounts required; computer operates 100% offline",
        "Zero default tracking or behavioral telemetry",
        "Zero advertisements or sponsor bloatware",
        "100% open-source: every line of code is publicly audited",
      ],
      example: "No remote telemetry connections. System is 100% local.",
    },
    whyItMatters:
      "Your computing activity, files, and documents belong to you. No corporate terms of service can disable or lock you out of your machine.",
  },
];

export function ParadigmComparison() {
  const [activeTab, setActiveTab] = useState<string>("filesystem");
  const topic = TOPICS.find((t) => t.id === activeTab) || TOPICS[0];

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-white/[0.1] bg-surface/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/[0.08] pb-6">
        {TOPICS.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "border border-cyan/40 bg-cyan/15 text-cyan shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                  : "border border-white/[0.05] bg-base/60 text-ink-muted hover:border-white/[0.1] hover:text-ink-primary"
              }`}
            >
              <Icon size={16} className={isActive ? "text-cyan" : "text-ink-muted"} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan">
            {topic.label} Paradigm
          </span>
          <h3 className="mt-1 text-2xl font-bold text-ink-primary md:text-3xl">
            {topic.title}
          </h3>
          <p className="mt-3 text-sm text-ink-secondary leading-relaxed">
            {topic.summary}
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Windows Column */}
          <div className="rounded-xl border border-white/[0.08] bg-void/70 p-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="font-display text-sm font-bold text-ink-muted">Windows Model</span>
              <span className="rounded bg-white/[0.05] px-2 py-0.5 text-[11px] font-mono text-ink-muted">
                {topic.windows.approach}
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-ink-secondary">
              {topic.windows.characteristics.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <X size={14} className="text-red-400/80 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded bg-black/40 p-2.5 font-mono text-[11px] text-slate-400 border border-white/[0.05] truncate">
              {topic.windows.example}
            </div>
          </div>

          {/* Linux Column */}
          <div className="rounded-xl border border-cyan/30 bg-cyan/[0.03] p-5 shadow-[0_0_25px_rgba(34,211,238,0.06)]">
            <div className="flex items-center justify-between border-b border-cyan/20 pb-3">
              <span className="font-display text-sm font-bold text-cyan">Linux Model</span>
              <span className="rounded bg-cyan/15 px-2 py-0.5 text-[11px] font-mono text-cyan">
                {topic.linux.approach}
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-ink-secondary">
              {topic.linux.characteristics.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={14} className="text-cyan shrink-0 mt-0.5" />
                  <span className="text-slate-200">{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded bg-cyan/10 p-2.5 font-mono text-[11px] text-cyan border border-cyan/20 truncate">
              {topic.linux.example}
            </div>
          </div>
        </div>

        {/* Why it Matters Callout */}
        <div className="mt-6 rounded-xl border border-white/[0.08] bg-base/50 p-4 text-xs text-ink-secondary flex items-start gap-3">
          <span className="rounded-full bg-cyan/10 p-1 text-cyan shrink-0">
            <ArrowRight size={14} />
          </span>
          <div>
            <strong className="text-ink-primary font-semibold">Why this matters: </strong>
            <span>{topic.whyItMatters}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
