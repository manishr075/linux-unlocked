import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TermLink } from "@/components/translator/TermLink";
import { Folder, FolderOpen, FileText, HardDrive, Info } from "lucide-react";

interface FhsDirectory {
  path: string;
  name: string;
  purpose: string;
  windowsEquivalent: string;
  commonFiles: string[];
  analogy: string;
  badge: "essential" | "user" | "config" | "kernel" | "variable";
}

const DIRECTORIES: FhsDirectory[] = [
  {
    path: "/",
    name: "/ (Root Directory)",
    purpose: "The absolute top of the entire Linux filesystem tree. Every storage drive, USB thumb drive, network share, and partition is mounted somewhere beneath this single root.",
    windowsEquivalent: "This PC / Multiple Drive Letters (C:\\, D:\\, E:\\) consolidated into one singular tree.",
    commonFiles: ["vmlinuz", "initrd.img"],
    analogy: "The main lobby of a building — all hallways and rooms branch from here.",
    badge: "essential",
  },
  {
    path: "/home",
    name: "/home (User Personal Files)",
    purpose: "Where each human user gets their own private sandbox directory (e.g. /home/carla, /home/sam). Your personal downloads, pictures, documents, and application configurations live here.",
    windowsEquivalent: "C:\\Users\\<Username>",
    commonFiles: [".bashrc", ".config/", "Documents/", "Downloads/", "Desktop/"],
    analogy: "Your private apartment inside an apartment complex. Only you (and the building manager 'root') have the key.",
    badge: "user",
  },
  {
    path: "/etc",
    name: "/etc (System Configuration)",
    purpose: "Contains all system-wide, host-specific configuration files. Crucially, almost every Linux configuration is a readable, editable plain-text file — no opaque binary registries.",
    windowsEquivalent: "Windows Registry (HKLM) & C:\\Windows\\System32\\drivers\\etc",
    commonFiles: ["/etc/fstab", "/etc/hosts", "/etc/shadow", "/etc/passwd", "/etc/sudoers"],
    analogy: "The building's electrical circuit breakers and master control valves with clear printed labels.",
    badge: "config",
  },
  {
    path: "/usr",
    name: "/usr (User System Software & Shared Assets)",
    purpose: "The secondary software hierarchy containing non-essential user applications, libraries, documentation, and icons installed by the package manager.",
    windowsEquivalent: "C:\\Program Files & C:\\Program Files (x86)",
    commonFiles: ["/usr/bin/", "/usr/lib/", "/usr/share/", "/usr/include/"],
    analogy: "The central library and tool storage available for all building residents to use.",
    badge: "essential",
  },
  {
    path: "/var",
    name: "/var (Variable Data)",
    purpose: "Files that change dynamically as the system operates: system log files, package manager caches, database storage (MySQL/PostgreSQL), and web server documents.",
    windowsEquivalent: "C:\\ProgramData & C:\\Windows\\Logs",
    commonFiles: ["/var/log/syslog", "/var/log/journal/", "/var/cache/", "/var/spool/"],
    analogy: "The building security guard's logbook and the delivery package sorting room.",
    badge: "variable",
  },
  {
    path: "/bin",
    name: "/bin & /usr/bin (Essential Commands)",
    purpose: "Contains the executable binary programs and commands that all users run from the terminal.",
    windowsEquivalent: "C:\\Windows\\System32 (executable EXEs)",
    commonFiles: ["ls", "cat", "bash", "cp", "mv", "grep", "chmod", "curl"],
    analogy: "The toolbox in the maintenance closet with basic tools (hammers, screwdrivers).",
    badge: "essential",
  },
  {
    path: "/dev",
    name: "/dev (Hardware Device Nodes)",
    purpose: "Exposes hardware devices as special pseudo-files. In Unix philosophy, 'everything is a file'. Reading or writing to a /dev node talks directly to device drivers.",
    windowsEquivalent: "Windows Device Manager (\\Device\\HarddiskVolume, COM1)",
    commonFiles: ["/dev/sda (Disk)", "/dev/nvme0n1 (SSD)", "/dev/null", "/dev/urandom"],
    analogy: "Special intercoms wired directly to physical equipment in the basement.",
    badge: "kernel",
  },
  {
    path: "/proc",
    name: "/proc & /sys (Live Kernel Pseudo-Filesystems)",
    purpose: "Virtual filesystems that do not exist on disk! The kernel generates them on the fly in RAM to let you inspect running processes, CPU temperatures, memory stats, and tuning flags.",
    windowsEquivalent: "Windows Task Manager & Performance Monitor internals",
    commonFiles: ["/proc/cpuinfo", "/proc/meminfo", "/proc/version", "/sys/class/net/"],
    analogy: "Digital glass inspection windows into the computer's engine room displaying live diagnostic dials.",
    badge: "kernel",
  },
];

export function FilesystemTreeExplorer() {
  const [selectedDir, setSelectedDir] = useState<FhsDirectory>(DIRECTORIES[0]);

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line-subtle pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HardDrive className="text-cyan" size={22} />
            The Linux Filesystem Hierarchy (FHS)
          </h3>
          <p className="text-xs text-ink-secondary mt-1">
            Why there are no "C:\" drives in Linux. Click directories to explore how everything connects to a single root.
          </p>
        </div>
        <span className="rounded-full bg-cyan/10 px-3 py-1 font-mono text-xs font-semibold text-cyan">
          Single Unified Tree
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Directory Navigation Tree */}
        <div className="space-y-1.5 lg:col-span-5 border border-line-subtle rounded-xl bg-surface/50 p-3">
          <p className="px-2 py-1 text-xs font-mono font-semibold text-ink-muted uppercase">
            Directory Hierarchy Standard:
          </p>
          {DIRECTORIES.map((dir) => {
            const isSelected = selectedDir.path === dir.path;
            return (
              <button
                key={dir.path}
                type="button"
                onClick={() => setSelectedDir(dir)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-mono text-xs transition-colors ${
                  isSelected
                    ? "bg-cyan/15 text-cyan font-bold border border-cyan/30"
                    : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <FolderOpen size={16} className="text-cyan shrink-0" />
                  ) : (
                    <Folder size={16} className="text-ink-muted shrink-0" />
                  )}
                  <span>{dir.path}</span>
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider text-ink-muted">
                  {dir.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Directory Detail Card */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-line-accent/50 bg-base/80 p-6 shadow-lg backdrop-blur-md h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-line-subtle pb-3">
                <span className="font-mono text-base font-bold text-cyan flex items-center gap-2">
                  <FolderOpen size={18} />
                  {selectedDir.name}
                </span>
                <span className="rounded border border-line-subtle bg-elevated px-2 py-0.5 font-mono text-xs text-ink-muted uppercase">
                  {selectedDir.badge}
                </span>
              </div>

              <p className="mt-4 text-sm text-ink-primary leading-relaxed">
                {selectedDir.purpose}
              </p>

              {/* Windows Translation */}
              <div className="mt-4 rounded-lg border border-line-subtle bg-surface/70 p-3 text-xs">
                <span className="font-semibold text-electric uppercase tracking-wider block mb-1">
                  Windows Mental Model Equivalent:
                </span>
                <span className="font-mono text-ink-secondary">
                  {selectedDir.windowsEquivalent}
                </span>
              </div>

              {/* Everyday Analogy */}
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-cyan/5 border border-cyan/20 p-3 text-xs text-ink-secondary">
                <Info size={16} className="text-cyan shrink-0 mt-0.5" />
                <span>
                  <strong className="text-cyan">Everyday Analogy:</strong> {selectedDir.analogy}
                </span>
              </div>

              {/* Common Contents */}
              <div className="mt-4">
                <p className="text-xs font-mono font-semibold uppercase text-ink-muted">
                  Characteristic Files & Folders:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedDir.commonFiles.map((file) => (
                    <span
                      key={file}
                      className="inline-flex items-center gap-1 rounded border border-line-subtle bg-elevated px-2 py-0.5 font-mono text-xs text-ink-primary"
                    >
                      <FileText size={12} className="text-cyan" />
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-line-subtle pt-3 flex items-center justify-between text-xs text-ink-muted">
              <span>Standard: POSIX & Filesystem Hierarchy Standard (FHS 3.0)</span>
              <TermLink term="file system">Learn More</TermLink>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
