/* ============================================================
   LINUX UNLOCKED — Interactive Linux Desktop (Module D)
   ------------------------------------------------------------
   A safe, browser-based simulated Linux desktop environment.
   Features:
     - Multi-Window Manager (Drag, Maximize, Minimize, Z-Index)
     - Multiple Workspaces (Workspace 1 & Workspace 2)
     - Top Panel with Activities, Clock, Notifications & System Status
     - Bottom Dock with Active Indicators
     - 4 Functional Apps:
         1. File Manager (Browses in-memory VFS)
         2. Terminal Sandbox (Executes real POSIX commands)
         3. Text Editor (Edits and saves VFS files)
         4. Settings & Theme Switcher (GNOME / KDE / Hyprland preview)
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
  const [desktopLayout, setDesktopLayout] = useState<"gnome" | "kde">("gnome");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Text editor active state
  const [editorFile, setEditorFile] = useState("/home/curious/welcome.txt");
  const [editorContent, setEditorContent] = useState(() => vfs.readFile("/home/curious/welcome.txt") || "");
  const [editorSaved, setEditorSaved] = useState(true);

  // File Manager current path
  const [fmPath, setFmPath] = useState("/home/curious");
  const [fmRefreshTrigger, setFmRefreshTrigger] = useState(0);

  // Window states
  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    files: {
      id: "files",
      title: "Files — /home/curious",
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 60,
      y: 70,
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
      x: 320,
      y: 120,
      width: 600,
      height: 400,
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
    setFmRefreshTrigger((t) => t + 1);
  };

  // Current wallpaper styles
  const wallpaperBg =
    activeWallpaper === "cyan-void"
      ? "bg-gradient-to-br from-[#05060a] via-[#09101d] to-[#0c182c]"
      : activeWallpaper === "nebula"
      ? "bg-gradient-to-tr from-[#07050e] via-[#150d2a] to-[#0b1c30]"
      : "bg-gradient-to-b from-[#06090e] via-[#0a141b] to-[#061214]";

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative h-[calc(100vh-3.5rem)] w-full overflow-hidden select-none flex flex-col ${wallpaperBg}`}
    >
      {/* Simulation Watermark Banner */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-sticky pointer-events-none">
        <div className="rounded-full border border-cyan/30 bg-base/80 px-4 py-1 text-[11px] font-medium text-cyan backdrop-blur-md shadow-glow">
          Interactive Web Simulation • In-Memory Virtual POSIX Environment
        </div>
      </div>

      {/* Top Panel (GNOME / Linux Style) */}
      <div className="h-8 border-b border-line-subtle bg-base/80 px-3 flex items-center justify-between text-xs text-ink-secondary backdrop-blur-glass z-nav">
        {/* Left: Activities & Workspaces */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => bringToFront("files")}
            className="font-bold text-cyan hover:text-ink-primary"
          >
            Activities
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <button
              onClick={() => setActiveWorkspace(1)}
              className={`rounded px-2 py-0.5 ${
                activeWorkspace === 1 ? "bg-cyan text-void font-bold" : "hover:text-ink-primary"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setActiveWorkspace(2)}
              className={`rounded px-2 py-0.5 ${
                activeWorkspace === 2 ? "bg-cyan text-void font-bold" : "hover:text-ink-primary"
              }`}
            >
              2
            </button>
          </div>
        </div>

        {/* Center: Clock */}
        <div className="font-semibold text-ink-primary text-xs">
          Oct 31  21:45
        </div>

        {/* Right: System Tray & Notifications */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1 hover:text-cyan relative"
            title="Notifications"
          >
            <Bell size={14} />
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-cyan" />
          </button>
          <Wifi size={14} className="text-success" />
          <Volume2 size={14} />
          <div className="flex items-center gap-1 text-[11px]">
            <Battery size={14} className="text-success" />
            <span>98%</span>
          </div>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 top-7 w-72 rounded-xl border border-line-subtle bg-base/95 p-3 shadow-2xl backdrop-blur-md z-modal text-xs animate-fadeIn">
              <span className="font-bold text-ink-primary block mb-2">Notifications</span>
              <div className="space-y-2">
                <div className="rounded-lg bg-surface/60 p-2 border border-line-subtle">
                  <p className="font-semibold text-cyan text-[11px]">Kernel Ready</p>
                  <p className="text-[10px] text-ink-secondary mt-0.5">
                    Linux 6.12.0 virtual core running smoothly in browser memory.
                  </p>
                </div>
                <div className="rounded-lg bg-surface/60 p-2 border border-line-subtle">
                  <p className="font-semibold text-success text-[11px]">Firewall Active</p>
                  <p className="text-[10px] text-ink-secondary mt-0.5">
                    Default UFW incoming traffic rules configured.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workspace Area: Floating Windows */}
      <div className="relative flex-1 overflow-hidden">
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
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-xl border border-line-accent/50 bg-base/90 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden text-xs"
            >
              {/* Header Bar */}
              <div
                onMouseDown={(e) => handleMouseDown(e, "files")}
                onTouchStart={(e) => handleTouchStart(e, "files")}
                className="h-8 border-b border-line-subtle bg-surface/90 px-3 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen size={14} className="text-cyan" />
                  <span className="font-semibold text-ink-primary">
                    Files — {fmPath}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => minimizeWindow("files")} className="p-1 hover:text-ink-primary">
                    <Minus size={12} />
                  </button>
                  <button onClick={() => toggleMaximize("files")} className="p-1 hover:text-ink-primary">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("files")} className="p-1 text-ink-muted hover:text-error">
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Breadcrumb Path Bar */}
              <div className="border-b border-line-subtle bg-surface/40 px-3 py-1.5 flex items-center gap-2 font-mono text-[11px]">
                <button
                  onClick={() => setFmPath("/home/curious")}
                  className="text-cyan hover:underline"
                >
                  ~ (home)
                </button>
                <span>/</span>
                <span>{fmPath.split("/").slice(3).join("/") || "curious"}</span>
              </div>

              {/* Folder Content Grid */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {(fmRefreshTrigger >= 0 ? vfs.listDir(fmPath) || [] : []).map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        if (item.type === "dir") {
                          setFmPath(vfs.resolvePath(`${fmPath}/${item.name}`));
                        } else {
                          openFileInEditor(`${fmPath}/${item.name}`);
                        }
                      }
                    }}
                    onDoubleClick={() => {
                      if (item.type === "dir") {
                        setFmPath(vfs.resolvePath(`${fmPath}/${item.name}`));
                      } else {
                        openFileInEditor(`${fmPath}/${item.name}`);
                      }
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-line hover:bg-surface/60 text-center transition-all"
                  >
                    {item.type === "dir" ? (
                      <Folder size={36} className="text-cyan mb-1.5" />
                    ) : (
                      <FileText size={36} className="text-electric mb-1.5" />
                    )}
                    <span className="font-medium text-ink-primary truncate max-w-full text-xs">
                      {item.name}
                    </span>
                    <span className="font-mono text-[10px] text-ink-muted">
                      {item.type === "dir" ? "folder" : `${item.content?.length || 0} bytes`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-line-subtle px-3 py-1 text-[10px] text-ink-muted flex justify-between bg-base/50">
                <span>Double-click files to open in Text Editor</span>
                <span>Virtual POSIX Tree</span>
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
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-xl border border-line-accent/50 bg-void shadow-2xl flex flex-col overflow-hidden text-xs"
            >
              {/* Header Bar */}
              <div
                onMouseDown={(e) => handleMouseDown(e, "terminal")}
                onTouchStart={(e) => handleTouchStart(e, "terminal")}
                className="h-8 border-b border-line-subtle bg-surface/90 px-3 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <TerminalIcon size={14} className="text-cyan" />
                  <span className="font-semibold text-ink-primary">
                    curious@linux-unlocked: ~ (Terminal)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => minimizeWindow("terminal")} className="p-1 hover:text-ink-primary">
                    <Minus size={12} />
                  </button>
                  <button onClick={() => toggleMaximize("terminal")} className="p-1 hover:text-ink-primary">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("terminal")} className="p-1 text-ink-muted hover:text-error">
                    <X size={12} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden p-1">
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
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-xl border border-line-accent/50 bg-base/95 shadow-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "editor")}
                onTouchStart={(e) => handleTouchStart(e, "editor")}
                className="h-8 border-b border-line-subtle bg-surface/90 px-3 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-cyan" />
                  <span className="font-semibold text-ink-primary">{windows.editor.title}</span>
                  {!editorSaved && <span className="text-[10px] text-warning">• Modified</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => minimizeWindow("editor")} className="p-1 hover:text-ink-primary">
                    <Minus size={12} />
                  </button>
                  <button onClick={() => toggleMaximize("editor")} className="p-1 hover:text-ink-primary">
                    <Maximize2 size={12} />
                  </button>
                  <button onClick={() => closeWindow("editor")} className="p-1 text-ink-muted hover:text-error">
                    <X size={12} />
                  </button>
                </div>
              </div>

              {/* Editor Toolbar */}
              <div className="border-b border-line-subtle bg-surface/40 px-3 py-1.5 flex items-center justify-between">
                <span className="font-mono text-[11px] text-ink-muted">{editorFile}</span>
                <Button size="sm" variant={editorSaved ? "ghost" : "primary"} onClick={handleSaveEditor}>
                  Save File
                </Button>
              </div>

              <textarea
                value={editorContent}
                onChange={(e) => {
                  setEditorContent(e.target.value);
                  setEditorSaved(false);
                }}
                className="flex-1 w-full bg-void p-4 font-mono text-xs text-ink-primary focus:outline-none resize-none"
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
              className="absolute max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16 max-md:!w-auto max-md:!h-auto rounded-xl border border-line-accent/50 bg-base/95 shadow-2xl flex flex-col overflow-hidden text-xs"
            >
              <div
                onMouseDown={(e) => handleMouseDown(e, "settings")}
                onTouchStart={(e) => handleTouchStart(e, "settings")}
                className="h-8 border-b border-line-subtle bg-surface/90 px-3 flex items-center justify-between cursor-move select-none"
              >
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-cyan" />
                  <span className="font-semibold text-ink-primary">Settings & Desktop Customization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => minimizeWindow("settings")} className="p-1 hover:text-ink-primary">
                    <Minus size={12} />
                  </button>
                  <button onClick={() => closeWindow("settings")} className="p-1 text-ink-muted hover:text-error">
                    <X size={12} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-sm text-ink-primary mb-2">Desktop Wallpaper:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "cyan-void", name: "Cyan Void" },
                      { id: "nebula", name: "Violet Nebula" },
                      { id: "matrix", name: "Dark Emerald" },
                    ].map((wp) => (
                      <button
                        key={wp.id}
                        onClick={() => setActiveWallpaper(wp.id)}
                        className={`rounded-lg border p-3 text-center transition-all ${
                          activeWallpaper === wp.id
                            ? "border-cyan bg-cyan/15 text-cyan font-bold shadow-glow"
                            : "border-line-subtle bg-surface/60 text-ink-secondary hover:border-line"
                        }`}
                      >
                        {wp.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-ink-primary mb-2">Desktop Layout Style:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDesktopLayout("gnome")}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        desktopLayout === "gnome"
                          ? "border-cyan bg-cyan/15 text-cyan font-bold"
                          : "border-line-subtle bg-surface/60 text-ink-secondary"
                      }`}
                    >
                      <span className="font-bold block">GNOME (Floating Dock)</span>
                      <span className="text-[11px] text-ink-muted">Modern centered dock with dynamic gestures</span>
                    </button>
                    <button
                      onClick={() => setDesktopLayout("kde")}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        desktopLayout === "kde"
                          ? "border-cyan bg-cyan/15 text-cyan font-bold"
                          : "border-line-subtle bg-surface/60 text-ink-secondary"
                      }`}
                    >
                      <span className="font-bold block">KDE Plasma / Windows Style</span>
                      <span className="text-[11px] text-ink-muted">Full-width bottom panel with application menu</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Bottom Dock / Taskbar */}
      <div className="pb-3 flex justify-center z-nav">
        <div className="rounded-2xl border border-line-subtle bg-base/80 p-2 flex items-center gap-2 backdrop-blur-glass shadow-2xl">
          <button
            onClick={() => toggleWindow("files")}
            className={`p-2.5 rounded-xl transition-all relative ${
              windows.files.isOpen && !windows.files.isMinimized
                ? "bg-cyan/20 text-cyan border border-cyan/40"
                : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
            }`}
            title="File Manager"
          >
            <Folder size={20} />
            {windows.files.isOpen && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan" />
            )}
          </button>

          <button
            onClick={() => toggleWindow("terminal")}
            className={`p-2.5 rounded-xl transition-all relative ${
              windows.terminal.isOpen && !windows.terminal.isMinimized
                ? "bg-cyan/20 text-cyan border border-cyan/40"
                : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
            }`}
            title="Terminal Sandbox"
          >
            <TerminalIcon size={20} />
            {windows.terminal.isOpen && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan" />
            )}
          </button>

          <button
            onClick={() => toggleWindow("editor")}
            className={`p-2.5 rounded-xl transition-all relative ${
              windows.editor.isOpen && !windows.editor.isMinimized
                ? "bg-cyan/20 text-cyan border border-cyan/40"
                : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
            }`}
            title="Text Editor"
          >
            <FileText size={20} />
            {windows.editor.isOpen && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan" />
            )}
          </button>

          <button
            onClick={() => toggleWindow("settings")}
            className={`p-2.5 rounded-xl transition-all relative ${
              windows.settings.isOpen && !windows.settings.isMinimized
                ? "bg-cyan/20 text-cyan border border-cyan/40"
                : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
            }`}
            title="Desktop Settings"
          >
            <Settings size={20} />
            {windows.settings.isOpen && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
