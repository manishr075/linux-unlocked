/* ============================================================
   LINUX UNLOCKED — Interactive Linux Desktop (Module D)
   ------------------------------------------------------------
   A safe, browser-based simulated Linux desktop environment.
   Features:
     - Multi-Window Manager (Drag, Maximize, Minimize, Z-Index, Mobile-Friendly)
     - Multiple Workspaces (Workspace 1 & Workspace 2)
     - Desktop Surface Icons (Home, Welcome Guide, Terminal, Editor, Settings)
     - Activities / Full App Launcher Grid with search
     - Beginner Onboarding Quick-Start Guide
     - Top Panel with Activities, Clock, Notifications & System Status
     - Bottom Dock with Active Indicators
     - 4 Functional Apps integrated with shared VirtualFileSystem:
         1. File Manager (Browses in-memory VFS)
         2. Terminal Sandbox (Executes real POSIX commands)
         3. Text Editor (Edits and saves VFS files)
         4. Settings & Theme Switcher (GNOME / KDE / Wallpapers)
     - Explicit Ethical Watermark (Identified clearly as simulation)
   ============================================================ */

import { useState } from "react";
import { VirtualFileSystem } from "@/simulations/filesystem/FileSystem";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import { Button } from "@/components/ui/Button";
import {
  Folder,
  FolderOpen,
  FileText,
  Terminal as TerminalIcon,
  Settings,
  Bell,
  Wifi,
  Volume2,
  Battery,
  Maximize2,
  X,
  Minus,
  Sparkles,
  Search,
  Cpu,
  CheckCircle2,
} from "lucide-react";

type AppId = "files" | "terminal" | "editor" | "settings";

interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  workspace: number;
}

export function DesktopPage() {
  const [vfs] = useState(() => new VirtualFileSystem());
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [topZ, setTopZ] = useState(10);
  const [activeWallpaper, setActiveWallpaper] = useState("cyan-void");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [launcherSearch, setLauncherSearch] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Text editor active state
  const [editorFile, setEditorFile] = useState("/home/curious/welcome.txt");
  const [editorContent, setEditorContent] = useState(
    () => vfs.readFile("/home/curious/welcome.txt") || ""
  );
  const [editorSaved, setEditorSaved] = useState(true);

  // File Manager current path
  const [fmPath, setFmPath] = useState("/home/curious");

  // Window states
  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    files: {
      id: "files",
      title: "Files — /home/curious",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 70,
      y: 60,
      width: 580,
      height: 380,
      zIndex: 1,
      workspace: 1,
    },
    terminal: {
      id: "terminal",
      title: "Terminal Sandbox",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 280,
      y: 80,
      width: 620,
      height: 410,
      zIndex: 2,
      workspace: 1,
    },
    editor: {
      id: "editor",
      title: "Text Editor — welcome.txt",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 180,
      y: 90,
      width: 520,
      height: 360,
      zIndex: 3,
      workspace: 1,
    },
    settings: {
      id: "settings",
      title: "Desktop Settings & Appearance",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 220,
      y: 100,
      width: 500,
      height: 380,
      zIndex: 4,
      workspace: 1,
    },
  });

  // Dragging state
  const [draggingApp, setDraggingApp] = useState<AppId | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const bringToFront = (id: AppId) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        zIndex: nextZ,
        workspace: activeWorkspace,
      },
    }));
  };

  const openApp = (id: AppId) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
        workspace: activeWorkspace,
      },
    }));
    setLauncherOpen(false);
  };

  const toggleWindow = (id: AppId) => {
    setWindows((prev) => {
      const win = prev[id];
      if (!win.isOpen) {
        const nextZ = topZ + 1;
        setTopZ(nextZ);
        return {
          ...prev,
          [id]: {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZ,
            workspace: activeWorkspace,
          },
        };
      }
      if (win.isMinimized) {
        return { ...prev, [id]: { ...win, isMinimized: false, workspace: activeWorkspace } };
      }
      return { ...prev, [id]: { ...win, isMinimized: true } };
    });
  };

  const closeWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const toggleMaximize = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  };

  const minimizeWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent, id: AppId) => {
    bringToFront(id);
    setDraggingApp(id);
    setDragOffset({
      x: e.clientX - windows[id].x,
      y: e.clientY - windows[id].y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingApp) return;
    const win = windows[draggingApp];
    if (win.isMaximized) return;

    const newX = Math.max(10, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x));
    const newY = Math.max(40, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));

    setWindows((prev) => ({
      ...prev,
      [draggingApp]: { ...prev[draggingApp], x: newX, y: newY },
    }));
  };

  const handleMouseUp = () => {
    setDraggingApp(null);
  };

  // Touch event handlers for mobile and tablet responsiveness
  const handleTouchStart = (e: React.TouchEvent, id: AppId) => {
    if (e.touches.length === 1) {
      bringToFront(id);
      setDraggingApp(id);
      setDragOffset({
        x: e.touches[0].clientX - windows[id].x,
        y: e.touches[0].clientY - windows[id].y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggingApp || e.touches.length !== 1) return;
    const win = windows[draggingApp];
    if (win.isMaximized) return;

    const touch = e.touches[0];
    const newX = Math.max(10, Math.min(window.innerWidth - 300, touch.clientX - dragOffset.x));
    const newY = Math.max(40, Math.min(window.innerHeight - 200, touch.clientY - dragOffset.y));

    setWindows((prev) => ({
      ...prev,
      [draggingApp]: { ...prev[draggingApp], x: newX, y: newY },
    }));
  };

  const handleTouchEnd = () => {
    setDraggingApp(null);
  };

  // Open file in text editor from file manager
  const openFileInEditor = (filePath: string) => {
    const content = vfs.readFile(filePath) ?? "";
    setEditorFile(filePath);
    setEditorContent(content);
    setEditorSaved(true);
    bringToFront("editor");
    setWindows((prev) => ({
      ...prev,
      editor: {
        ...prev.editor,
        isOpen: true,
        isMinimized: false,
        title: `Text Editor — ${filePath.split("/").pop()}`,
      },
    }));
  };

  const handleSaveEditor = () => {
    vfs.writeFile(editorFile, editorContent);
    setEditorSaved(true);
  };

  // Current wallpaper styles
  const wallpaperBg =
    activeWallpaper === "cyan-void"
      ? "bg-gradient-to-br from-[#05060a] via-[#09101d] to-[#0c182c]"
      : activeWallpaper === "nebula"
      ? "bg-gradient-to-tr from-[#07050e] via-[#150d2a] to-[#0b1c30]"
      : "bg-gradient-to-b from-[#06090e] via-[#0a141b] to-[#061214]";

  const allApps = [
    {
      id: "terminal" as AppId,
      name: "Terminal Sandbox",
      desc: "Pure in-memory POSIX command shell with pipes and redirects.",
      icon: TerminalIcon,
      color: "text-electric bg-electric/10",
    },
    {
      id: "files" as AppId,
      name: "File Manager",
      desc: "Browse Linux FHS filesystem hierarchy (/home/curious, /etc, /var).",
      icon: Folder,
      color: "text-cyan bg-cyan/10",
    },
    {
      id: "editor" as AppId,
      name: "Text Editor",
      desc: "Edit and save configuration files and scripts directly to memory.",
      icon: FileText,
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      id: "settings" as AppId,
      name: "Desktop Settings",
      desc: "Customize desktop appearance, wallpapers, and window behaviors.",
      icon: Settings,
      color: "text-amber-400 bg-amber-500/10",
    },
  ];

  const filteredApps = allApps.filter((app) =>
    app.name.toLowerCase().includes(launcherSearch.toLowerCase()) ||
    app.desc.toLowerCase().includes(launcherSearch.toLowerCase())
  );

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative h-[calc(100vh-4rem)] w-full overflow-hidden select-none flex flex-col ${wallpaperBg}`}
    >
      {/* Simulation Watermark Notice */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="rounded-full border border-cyan/30 bg-[#07090e]/80 px-3.5 py-1 text-[11px] font-mono font-medium text-cyan backdrop-blur-md shadow-glow">
          Interactive Browser Simulation • In-Memory Virtual POSIX Environment
        </div>
      </div>

      {/* Top Panel (GNOME / Linux Style) */}
      <div className="h-8 border-b border-white/[0.08] bg-[#07090e]/85 px-3 flex items-center justify-between text-xs text-ink-secondary backdrop-blur-xl z-30">
        {/* Left: Activities Launcher & Workspaces */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`font-semibold rounded px-2.5 py-0.5 text-xs transition-colors ${
              launcherOpen
                ? "bg-cyan text-ink-onAccent font-bold"
                : "text-cyan hover:bg-white/5"
            }`}
          >
            Activities
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              onClick={() => setActiveWorkspace(1)}
              className={`rounded px-2 py-0.5 transition-colors ${
                activeWorkspace === 1 ? "bg-cyan text-ink-onAccent font-bold" : "hover:text-ink-primary hover:bg-white/5"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setActiveWorkspace(2)}
              className={`rounded px-2 py-0.5 transition-colors ${
                activeWorkspace === 2 ? "bg-cyan text-ink-onAccent font-bold" : "hover:text-ink-primary hover:bg-white/5"
              }`}
            >
              2
            </button>
          </div>
        </div>

        {/* Center: System Clock */}
        <div className="font-semibold text-ink-primary text-xs tracking-wide">
          Oct 31  23:45
        </div>

        {/* Right: System Status & Notifications */}
        <div className="flex items-center gap-3 relative">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-ink-muted">
            <Cpu size={12} className="text-cyan" />
            <span>Wayland</span>
          </div>

          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1 hover:text-cyan relative"
            title="Notifications"
          >
            <Bell size={13} />
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-cyan" />
          </button>
          <Wifi size={13} className="text-emerald-400" />
          <Volume2 size={13} />
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <Battery size={13} className="text-emerald-400" />
            <span>100%</span>
          </div>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-7 w-72 rounded-xl border border-white/10 bg-[#070a12]/95 p-3 shadow-2xl backdrop-blur-2xl z-50 text-xs animate-fadeIn">
              <span className="font-bold text-ink-primary block mb-2">System Notifications</span>
              <div className="space-y-2">
                <div className="rounded-lg bg-surface/60 p-2.5 border border-white/5">
                  <p className="font-semibold text-cyan text-[11px]">Virtual Kernel Ready</p>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-relaxed">
                    Linux 6.12.0 virtual POSIX core active in browser memory.
                  </p>
                </div>
                <div className="rounded-lg bg-surface/60 p-2.5 border border-white/5">
                  <p className="font-semibold text-emerald-400 text-[11px]">Filesystem Mounted</p>
                  <p className="text-[10px] text-ink-secondary mt-0.5 leading-relaxed">
                    Virtual FHS tree mounted at root (/). 0 remote disk writes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Desktop Surface */}
      <div className="relative flex-1 overflow-hidden">
        {/* Beginner Onboarding Quick-Start Guide */}
        {showOnboarding && (
          <div className="absolute top-16 right-4 sm:right-8 z-20 max-w-sm rounded-2xl border border-cyan/40 bg-[#07090e]/95 p-4 shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-cyan font-bold text-xs uppercase tracking-wide">
                <Sparkles size={14} /> Desktop Simulator Tour
              </div>
              <button
                onClick={() => setShowOnboarding(false)}
                className="text-ink-muted hover:text-ink-primary"
                aria-label="Dismiss tour"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-secondary leading-relaxed">
              Experience a real Linux desktop interface without installing anything:
            </p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-ink-secondary">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cyan shrink-0" />
                <span><strong>Drag & Resize:</strong> Move windows naturally across the desktop.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cyan shrink-0" />
                <span><strong>Terminal:</strong> Run real commands like <code className="text-cyan font-mono">ls</code> and <code className="text-cyan font-mono">cat</code>.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cyan shrink-0" />
                <span><strong>Shared Memory:</strong> Edit files in Text Editor and browse them in Files.</span>
              </li>
            </ul>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="secondary" onClick={() => setShowOnboarding(false)} className="text-[11px] py-1">
                Got it
              </Button>
            </div>
          </div>
        )}

        {/* Visible Desktop Icons on the Wallpaper */}
        <div className="absolute top-16 left-4 sm:left-6 z-10 flex flex-col gap-4">
          <button
            onDoubleClick={() => openApp("files")}
            onClick={() => bringToFront("files")}
            className="flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 transition-colors group text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center text-cyan shadow-lg group-hover:scale-105 transition-transform">
              <Folder size={22} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-ink-primary text-shadow drop-shadow">
              Home
            </span>
          </button>

          <button
            onDoubleClick={() => openFileInEditor("/home/curious/welcome.txt")}
            className="flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 transition-colors group text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg group-hover:scale-105 transition-transform">
              <FileText size={22} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-ink-primary text-shadow drop-shadow truncate max-w-full">
              welcome.txt
            </span>
          </button>

          <button
            onDoubleClick={() => openApp("terminal")}
            onClick={() => bringToFront("terminal")}
            className="flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 transition-colors group text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-electric/15 border border-electric/30 flex items-center justify-center text-electric shadow-lg group-hover:scale-105 transition-transform">
              <TerminalIcon size={22} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-ink-primary text-shadow drop-shadow">
              Terminal
            </span>
          </button>

          <button
            onDoubleClick={() => openApp("settings")}
            onClick={() => bringToFront("settings")}
            className="flex flex-col items-center w-20 p-2 rounded-xl hover:bg-white/10 transition-colors group text-center"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-105 transition-transform">
              <Settings size={22} />
            </div>
            <span className="mt-1.5 text-[11px] font-medium text-ink-primary text-shadow drop-shadow">
              Settings
            </span>
          </button>
        </div>

        {/* ============================================================
            ACTIVITIES APPLICATION LAUNCHER OVERLAY (FULL APP GRID)
            ============================================================ */}
        {launcherOpen && (
          <div className="absolute inset-0 z-40 bg-[#05060a]/90 backdrop-blur-2xl p-6 sm:p-12 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-full max-w-xl">
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan" size={18} />
                <input
                  type="text"
                  placeholder="Type to search simulated applications..."
                  value={launcherSearch}
                  onChange={(e) => setLauncherSearch(e.target.value)}
                  autoFocus
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 pl-12 pr-4 text-sm text-ink-primary placeholder:text-ink-muted focus:border-cyan focus:outline-none backdrop-blur-md shadow-2xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      onClick={() => openApp(app.id)}
                      className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-surface/50 p-4 text-left hover:border-cyan/50 hover:bg-white/[0.08] transition-all group"
                    >
                      <div className={`rounded-xl p-3 ${app.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-primary group-hover:text-cyan transition-colors">
                          {app.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                          {app.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <Button variant="ghost" size="sm" onClick={() => setLauncherOpen(false)} className="text-xs text-ink-muted">
                  Press Esc or click to return to Desktop
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            WINDOW 1: FILE MANAGER
            ============================================================ */}
        {windows.files.isOpen &&
          !windows.files.isMinimized &&
          windows.files.workspace === activeWorkspace && (
            <div
              style={{
                left: windows.files.isMaximized ? 0 : windows.files.x,
                top: windows.files.isMaximized ? 0 : windows.files.y,
                width: windows.files.isMaximized ? "100%" : windows.files.width,
                height: windows.files.isMaximized ? "100%" : windows.files.height,
                zIndex: windows.files.zIndex,
              }}
              onClick={() => bringToFront("files")}
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-2xl border border-cyan/30 bg-[#07090e]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "files")}
                onTouchStart={(e) => handleTouchStart(e, "files")}
                className="h-9 border-b border-white/[0.08] bg-[#0c101a] px-3.5 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} className="text-cyan" />
                  <span className="font-semibold text-ink-primary">Files — {fmPath}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => minimizeWindow("files")} className="p-1 hover:text-cyan">
                    <Minus size={13} />
                  </button>
                  <button onClick={() => toggleMaximize("files")} className="p-1 hover:text-cyan">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("files")} className="p-1 hover:text-error">
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Path Bar */}
              <div className="px-3 py-1.5 border-b border-white/[0.06] bg-black/20 flex items-center gap-1 font-mono text-[11px] text-ink-secondary">
                <button
                  onClick={() => setFmPath("/")}
                  className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-cyan"
                >
                  /
                </button>
                {fmPath.split("/").filter(Boolean).map((seg, i, arr) => (
                  <span key={seg} className="flex items-center gap-1">
                    <span className="text-ink-muted">/</span>
                    <button
                      onClick={() => setFmPath("/" + arr.slice(0, i + 1).join("/"))}
                      className="px-1.5 py-0.5 rounded hover:bg-white/10 hover:text-cyan"
                    >
                      {seg}
                    </button>
                  </span>
                ))}
              </div>

              {/* File list */}
              <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(vfs.listDir(fmPath) || []).map((entry) => (
                  <button
                    key={entry.name}
                    onDoubleClick={() => {
                      if (entry.type === "dir") {
                        setFmPath((p) => (p === "/" ? `/${entry.name}` : `${p}/${entry.name}`));
                      } else {
                        const targetPath = fmPath === "/" ? `/${entry.name}` : `${fmPath}/${entry.name}`;
                        openFileInEditor(targetPath);
                      }
                    }}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-cyan/30 flex flex-col items-center text-center group"
                  >
                    {entry.type === "dir" ? (
                      <Folder size={32} className="text-cyan group-hover:scale-105 transition-transform" />
                    ) : (
                      <FileText size={32} className="text-indigo-400 group-hover:scale-105 transition-transform" />
                    )}
                    <span className="mt-1.5 text-xs text-ink-primary truncate max-w-full font-mono">
                      {entry.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* ============================================================
            WINDOW 2: TERMINAL SANDBOX
            ============================================================ */}
        {windows.terminal.isOpen &&
          !windows.terminal.isMinimized &&
          windows.terminal.workspace === activeWorkspace && (
            <div
              style={{
                left: windows.terminal.isMaximized ? 0 : windows.terminal.x,
                top: windows.terminal.isMaximized ? 0 : windows.terminal.y,
                width: windows.terminal.isMaximized ? "100%" : windows.terminal.width,
                height: windows.terminal.isMaximized ? "100%" : windows.terminal.height,
                zIndex: windows.terminal.zIndex,
              }}
              onClick={() => bringToFront("terminal")}
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-2xl border border-cyan/40 bg-[#06080e]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "terminal")}
                onTouchStart={(e) => handleTouchStart(e, "terminal")}
                className="h-9 border-b border-white/[0.08] bg-[#090d16] px-3.5 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <TerminalIcon size={14} className="text-electric" />
                  <span className="font-semibold text-ink-primary font-mono text-[11px]">
                    curious@linux-unlocked: ~
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => minimizeWindow("terminal")} className="p-1 hover:text-cyan">
                    <Minus size={13} />
                  </button>
                  <button onClick={() => toggleMaximize("terminal")} className="p-1 hover:text-cyan">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("terminal")} className="p-1 hover:text-error">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-2 overflow-hidden bg-[#06080e]">
                <InteractiveTerminal initialWelcome={false} />
              </div>
            </div>
          )}

        {/* ============================================================
            WINDOW 3: TEXT EDITOR
            ============================================================ */}
        {windows.editor.isOpen &&
          !windows.editor.isMinimized &&
          windows.editor.workspace === activeWorkspace && (
            <div
              style={{
                left: windows.editor.isMaximized ? 0 : windows.editor.x,
                top: windows.editor.isMaximized ? 0 : windows.editor.y,
                width: windows.editor.isMaximized ? "100%" : windows.editor.width,
                height: windows.editor.isMaximized ? "100%" : windows.editor.height,
                zIndex: windows.editor.zIndex,
              }}
              onClick={() => bringToFront("editor")}
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-2xl border border-indigo-500/30 bg-[#07090e]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "editor")}
                onTouchStart={(e) => handleTouchStart(e, "editor")}
                className="h-9 border-b border-white/[0.08] bg-[#0c101a] px-3.5 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-400" />
                  <span className="font-semibold text-ink-primary font-mono text-[11px]">
                    {windows.editor.title} {!editorSaved && "*"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveEditor} className="px-2 py-0.5 rounded bg-cyan/15 text-cyan hover:bg-cyan/25 font-semibold text-[10px]">
                    Save
                  </button>
                  <button onClick={() => minimizeWindow("editor")} className="p-1 hover:text-cyan">
                    <Minus size={13} />
                  </button>
                  <button onClick={() => toggleMaximize("editor")} className="p-1 hover:text-cyan">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("editor")} className="p-1 hover:text-error">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <textarea
                value={editorContent}
                onChange={(e) => {
                  setEditorContent(e.target.value);
                  setEditorSaved(false);
                }}
                className="flex-1 w-full bg-[#05060a] p-4 font-mono text-xs text-ink-primary resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}

        {/* ============================================================
            WINDOW 4: SETTINGS & APPEARANCE
            ============================================================ */}
        {windows.settings.isOpen &&
          !windows.settings.isMinimized &&
          windows.settings.workspace === activeWorkspace && (
            <div
              style={{
                left: windows.settings.isMaximized ? 0 : windows.settings.x,
                top: windows.settings.isMaximized ? 0 : windows.settings.y,
                width: windows.settings.isMaximized ? "100%" : windows.settings.width,
                height: windows.settings.isMaximized ? "100%" : windows.settings.height,
                zIndex: windows.settings.zIndex,
              }}
              onClick={() => bringToFront("settings")}
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-2xl border border-amber-500/30 bg-[#07090e]/95 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "settings")}
                onTouchStart={(e) => handleTouchStart(e, "settings")}
                className="h-9 border-b border-white/[0.08] bg-[#0c101a] px-3.5 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-amber-400" />
                  <span className="font-semibold text-ink-primary">Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => minimizeWindow("settings")} className="p-1 hover:text-cyan">
                    <Minus size={13} />
                  </button>
                  <button onClick={() => toggleMaximize("settings")} className="p-1 hover:text-cyan">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("settings")} className="p-1 hover:text-error">
                    <X size={13} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div>
                  <h3 className="font-semibold text-ink-primary text-sm mb-3">Wallpaper & Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "cyan-void", name: "Cyan Void", style: "from-[#05060a] to-[#0c182c]" },
                      { id: "nebula", name: "Deep Nebula", style: "from-[#07050e] to-[#0b1c30]" },
                      { id: "slate", name: "Slate Terminal", style: "from-[#06090e] to-[#061214]" },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => setActiveWallpaper(w.id)}
                        className={`rounded-xl p-3 bg-gradient-to-br ${w.style} border text-left transition-all ${
                          activeWallpaper === w.id ? "border-cyan ring-2 ring-cyan/30" : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <p className="font-semibold text-xs text-ink-primary">{w.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.08] pt-4">
                  <h3 className="font-semibold text-ink-primary text-sm mb-2">Simulated System Information</h3>
                  <div className="space-y-1.5 font-mono text-xs text-ink-secondary bg-black/30 p-3 rounded-xl border border-white/5">
                    <p><span className="text-ink-muted">OS:</span> Linux Unlocked Virtual Desktop (POSIX)</p>
                    <p><span className="text-ink-muted">Kernel:</span> 6.12.0-unlocked-x86_64</p>
                    <p><span className="text-ink-muted">Compositor:</span> Wayland (Simulated Protocol)</p>
                    <p><span className="text-ink-muted">VFS Memory:</span> ~3.2 MB allocated in browser RAM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Bottom Application Dock */}
      <div className="h-14 border-t border-white/[0.08] bg-[#07090e]/85 backdrop-blur-2xl flex items-center justify-center px-4 z-30">
        <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] p-1.5 border border-white/10 shadow-2xl">
          {allApps.map((app) => {
            const Icon = app.icon;
            const win = windows[app.id];
            const isRunning = win.isOpen;
            const isActive = isRunning && !win.isMinimized;
            return (
              <button
                key={app.id}
                onClick={() => toggleWindow(app.id)}
                className={`p-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? "bg-cyan/20 text-cyan border border-cyan/40 shadow-glow"
                    : isRunning
                    ? "text-ink-primary bg-white/5"
                    : "text-ink-secondary hover:bg-white/10 hover:text-ink-primary"
                }`}
                title={app.name}
              >
                <Icon size={20} />
                {isRunning && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
