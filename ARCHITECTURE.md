# LINUX UNLOCKED — System Architecture Blueprint

This document details the software architecture, data structures, graphics pipeline, sandboxing layer, and state management paradigms underpinning **LINUX UNLOCKED**.

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                 REACT 18 CLIENT                                   |
|                                                                                   |
|  [ LevelProvider ] <-------- Contextual Translator & Reading Level (Beg/Prac/Tech)|
|  [ useUIStore ]    <-------- Global UI Preferences (Zustand: theme, level, sound) |
+-----------------------------------------------------------------------------------+
       |                                      |                                  |
       v                                      v                                  v
+------------------+                 +------------------+               +------------------+
| THREE.JS ENGINE  |                 | SIMULATION LAYER |               | KNOWLEDGE ENGINE |
+------------------+                 +------------------+               +------------------+
| SceneManager     |                 | VirtualFileSystem|               | Atlas Database   |
| (DPR, RAF, GPU)  |                 | (In-Memory Tree) |               | (22 Categories)  |
|                  |                 |                  |               |                  |
| ExplodedArchScene|                 | ShellEngine      |               | Fuse.js Index    |
| (6 Stack Layers) |                 | (POSIX Evaluator)|               | (Client Search)  |
|                  |                 |                  |               |                  |
| Custom Shaders   |                 | DesktopManager   |               | Distro & HW Data |
| (GLSL Vertex/    |                 | (Multi-Window/   |               | (Curated Models) |
|  Fragment/Noise) |                 |  Workspaces)     |               |                  |
+------------------+                 +------------------+               +------------------+
       |                                      |                                  |
       +--------------------------------------+----------------------------------+
                                              |
                                              v
                              +-------------------------------+
                              |    PERSISTENCE & SECURITY     |
                              +-------------------------------+
                              | LocalStorage (Checklists)     |
                              | Strict Root VFS Sandboxing    |
                              | Zero Host / Network Access    |
                              +-------------------------------+
```

---

## 2. Routing & Code-Splitting Architecture

Routing is managed via `react-router-dom` v7 with `createBrowserRouter`. To guarantee fast initial page loads, only the homepage bundle is loaded upfront. All other top-level modules are lazy-loaded on-demand with automatic chunk splitting:

| Route | Component | Lazy Chunk | Role |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Core Bundle | Cinematic 3D hero, scroll-pinned exploded stack, comparison |
| `/discover` | `DiscoverPage` | `DiscoverPage-*.js` | 13 core educational syllabus topics & interactive diagrams |
| `/desktop` | `DesktopPage` | `DesktopPage-*.js` | Multi-window desktop simulation with VFS-wired apps |
| `/atlas` | `AtlasPage` | `AtlasPage-*.js` | 22-category reference knowledge library & search |
| `/terminal` | `TerminalPage` | `TerminalPage-*.js` | Standalone terminal emulator with 8 guided missions |
| `/distros` | `DistrosPage` | `DistrosPage-*.js` | 7 distro profiles, comparison matrix, 6-question quiz |
| `/compatibility`| `CompatibilityPage`| `CompatibilityPage-*.js`| Hardware and software compatibility search & evidence |
| `/migrate` | `MigratePage` | `MigratePage-*.js` | 7-step safe migration wizard with destructive step modals |
| `/about` | `AboutPage` | `AboutPage-*.js` | Mission, ₹0 charter, upstream sources ledger, FAQ |
| `*` | `ComingSoon` | Core Bundle | Accessible 404 page fallback |

---

## 3. Native Three.js Graphics Architecture

Three.js experiences in Linux Unlocked are built directly on native WebGL primitives rather than declarative wrapper libraries. This ensures complete access to shader compilation, GPU memory lifecycle, instancing, and frame-rate optimization.

### 3.1 SceneManager Lifecycle Core (`src/three/core/SceneManager.ts`)
Each mounted 3D canvas is governed by an instance of `SceneManager`:
1. **Renderer Initialization:** Configured with `antialias: true`, `alpha: true`, and `powerPreference: "high-performance"`.
2. **DPR Clamping:** Clamps `devicePixelRatio` to a maximum of 2.0 (or 1.0 on low-tier mobile devices) to prevent GPU thermal throttling.
3. **Offscreen Optimization:** Employs an `IntersectionObserver` to pause `requestAnimationFrame` render loops when the canvas is scrolled out of viewport.
4. **WebGL Context Loss Recovery:** Attaches listeners to `webglcontextlost` and `webglcontextrestored`, pausing loops and safely reconstructing lightweight context.
5. **Deterministic GPU Disposal:** On unmounting, traverses the scene graph, explicitly disposing of all `BufferGeometry` instances, scalar materials, material arrays, textures, and invokes `renderer.dispose()`.

### 3.2 Exploded Architecture Scene (`src/three/scenes/exploded-arch/ExplodedArchScene.ts`)
The centerpiece 3D experience models the 6 structural layers of an operating system:
- **Layer 0 (Silicon Baseplate):** Procedural circuit trace grid rendered via custom GLSL `circuitVertexShader` and `circuitFragmentShader`. Computes dynamic electrical pulses and Fresnel grazing angle edge glow.
- **Layer 1 (Monolithic Kernel):** 3D procedural noise displacement (`kernelVertexShader`) pulsing across an inner core mesh with ring conduits.
- **Layer 2 (Init & Daemons):** Interconnected systemd unit nodes with orbiting IPC particle points.
- **Layer 3 (Display & Audio):** Dual Wayland compositor plane and PipeWire audio ring graph.
- **Layer 4 (Desktop Shell):** Window compositor frames and application dock geometries.
- **Layer 5 (User Space):** Isolated application spheres connected via laser conduits.

### 3.3 GSAP ScrollTrigger Synchronization (`src/animation/useExplodedScroll.ts`)
A pinned ScrollTrigger timeline monitors the 420vh scroll container. A bidirectional `scrub: 0.6` maps the normalized scroll progress `0.0 -> 1.0`:
- **At Progress 0.0:** Stack is compacted into a monolithic chassis with subtle breathing oscillations.
- **At Progress > 0.0:** Layers separate along the Y-axis using smooth lerp interpolation (`THREE.MathUtils.lerp`).
- **Camera Trajectory:** The camera dollies smoothly along a 3-dimensional spline, adjusting elevation and focal depth to frame the active layer.
- **Reversibility:** Scrolling upward reverses camera transforms and closes layer spacing with zero visual artifacts.

---

## 4. In-Memory POSIX Virtual Filesystem & Shell Simulation

### 4.1 Virtual File System (`src/simulations/filesystem/FileSystem.ts`)
The VFS is a tree-based in-memory data structure modeled in pure TypeScript:
```ts
interface VNode {
  name: string;
  type: "file" | "dir";
  content?: string;
  children?: Map<string, VNode>;
  permissions: number; // e.g., 0o755, 0o644
  owner: string;
  group: string;
  modifiedAt: Date;
}
```
- **Path Resolution:** Absolute (`/etc`), relative (`../Documents`), and tilde (`~/`) paths resolve against `currentDir`.
- **Root Enclosure Security:** Traversal cannot escape above root `/`. `cd ../../..` always resolves to `/`.
- **Pre-Populated Standard Hierarchy:** Bootstraps with `/bin`, `/etc` (os-release, hosts), `/var/log` (syslog with authentic SSH auth failure logs), and `/home/curious/` with documents and scripts.

### 4.2 Shell Evaluation Engine (`src/simulations/shell/ShellEngine.ts`)
A deterministic command parser executing client-side without any host system access:
- **Quote-Aware Operator Parsing:** `splitUnquoted` correctly distinguishes shell operators (`|`, `>`, `>>`) from strings enclosed in quotes (`"hello | world"`).
- **Pipelines:** Chains standard output from left to right in memory (`cat /var/log/syslog | grep "Failed" | head -n 2`).
- **Redirection:** Supports overwriting (`>`) and appending (`>>`) to existing or new files.
- **Flag Parsing:** Standard flags supported for commands (`ls -la`, `rm -rf`, `grep -i`, `head -n N`, `mkdir -p`).
- **Error Handling:** Standard POSIX exit codes (0 for success, 1 for generic error, 2 for syntax/misuse, 127 for command not found).

---

## 5. Knowledge Engine & Search Architecture

- **Taxonomy:** 22 categories categorized into 6 distinct domains (`foundations`, `system-core`, `command-line`, `networking-security`, `building-running`, `lifestyle-support`).
- **Fuse.js Indexing (`src/content/atlasSearch.ts`):** Client-side fuzzy search indexing titles (0.4 weight), tags (0.25 weight), summaries (0.2 weight), categories (0.1 weight), and body text (0.05 weight).
- **Multi-Depth Content Structure:** Each article provides three distinct authored depths (`beginner`, `practical`, `technical`) that toggle dynamically based on the global learning level.
- **Source Ledger:** Every article links directly to upstream standards documents (Linux kernel documentation, IEEE POSIX, systemd specifications, ArchWiki, Debian reference).

---

## 6. Desktop Window Manager (`src/pages/DesktopPage.tsx`)

A simulated multi-window environment running on top of the shared VFS:
- **Window State Machine:** Tracks `isOpen`, `isMinimized`, `isMaximized`, `x`, `y`, `width`, `height`, `zIndex`, and `workspace` (1 or 2).
- **Z-Index Layering:** Clicking any window brings it to the top of the stack.
- **Mobile Responsive Clamping:** On screens `< 768px`, windows automatically snap to viewport bounds (`max-md:!left-2 max-md:!top-2 max-md:!right-2 max-md:!bottom-16`) to keep all window controls accessible on touchscreens.
- **Cross-App Data Sharing:** Files edited and saved in the Text Editor reflect immediately in the File Manager and can be inspected via `cat` in the Terminal.
