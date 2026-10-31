# LINUX UNLOCKED — Your Computer. Your Freedom.

> The browser-based educational gateway to Linux. Discover, experience, and master Linux without installing anything on your computer.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.187-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-purple.svg)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Budget](https://img.shields.io/badge/Budget-%E2%82%B90-success.svg)](#the-0-budget-charter)

---

## 1. Project Overview & Mission

**Linux Unlocked** is an independent, free, client-side educational platform designed to make Linux accessible, understandable, and enjoyable for everyone — from complete beginners who have never seen a terminal to experienced programmers and systems engineers.

### Core Philosophy
1. **Explain Without Propaganda:** Candidly present Linux advantages alongside genuine trade-offs (e.g. anti-cheat gaming barriers, proprietary creative software alternatives).
2. **Learn by Doing:** Provide real interactive 3D architecture models, in-memory terminal sandboxes, and simulated desktop environments rather than walls of text.
3. **Multi-Depth Learning:** Every core topic offers 3 distinct explanation depths:
   - **Beginner:** Real-world analogies and zero jargon.
   - **Practical:** Step-by-step commands and everyday workflows.
   - **Technical:** Kernel system calls, POSIX standards, and internal architecture.
4. **Ethical Transparency & Safety:** No fake hardware scanning; clear safeguards on destructive migration steps; zero mandatory accounts or telemetry.
5. **The ₹0 Budget Charter:** Engineered from the ground up to operate indefinitely on free static hosting with zero paid APIs, zero external AI subscriptions, and zero cloud database costs.

---

## 2. Key Modules & Features

- **Cinematic 3D Exploded Architecture (Module A):** Real-time native Three.js 3D stack visualizing the 6 layers of an operating system (Silicon, Monolithic Kernel, Init/systemd, Display/Wayland/PipeWire, Desktop Shell, Applications/Containers) with custom GLSL shaders and bidirectional GSAP scroll synchronization.
- **Linux Discovery Journey (Module B):** 13 core topics with interactive diagrams (Kernel vs. Userland, FHS Filesystem Tree, Permissions Calculator, Distro Family Tree, Desktop Environment Showcase).
- **Knowledge Atlas (Module C):** 22 categories across 6 domains with client-side Fuse.js fuzzy search, verified source citations, and learning paths.
- **Interactive Desktop Simulation (Module D):** Multi-window manager supporting dragging, minimize, maximize, dual workspaces, file manager, text editor, settings, and wallpaper switching.
- **Terminal Playground & In-Memory VFS (Module E):** Pure TypeScript sandboxed POSIX shell evaluating `pwd`, `ls`, `cd`, `mkdir`, `touch`, `rm`, `cat`, `head`, `tail`, `grep`, `find`, `chmod`, `cp`, `mv`, `whoami`, `uname`, `df`, `date`, `help`, pipes (`|`), and redirection (`>`, `>>`) with 8 guided missions.
- **Distribution Explorer (Module G):** 7 comprehensive distro profiles (Mint, Ubuntu, Fedora, Debian, Arch, Zorin, Pop!_OS) with an interactive 6-question recommendation quiz and comparison matrix.
- **Hardware & Software Compatibility (Modules H & I):** Curated database of laptops, Wi-Fi chipsets, GPUs, audio, and Windows applications with verified kernel evidence links and honest compatibility badges.
- **Safe Migration Planner (Module J):** 7-step interactive walkthrough with pre-migration audits, destructive step safeguard modals, and localStorage checklist persistence.
- **Transparency, Sources & Charter (Module K):** Mission charter, upstream documentation ledger (kernel.org, POSIX, freedesktop), and contribution guidelines.

---

## 3. Technology Stack

- **Runtime & UI:** React 18, TypeScript (Strict), Vite 7, Tailwind CSS
- **3D Graphics Engine:** Native Three.js (WebGLRenderer, BufferGeometry, ShaderMaterial, custom GLSL vertex/fragment shaders)
- **Animation & Motion:** GSAP 3 & ScrollTrigger (bidirectional scrubbing)
- **Client-Side Search:** Fuse.js fuzzy search engine
- **State Management:** Zustand, React Context
- **Testing Framework:** Vitest 5
- **Linting & Code Quality:** ESLint 9, TypeScript-ESLint

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (Node v20+ or v22 LTS recommended)
- **Package Manager:** npm v9+ (or pnpm / yarn)
- **Browser:** Modern Evergreen Browser with WebGL support (Chrome, Firefox, Safari, Edge)

---

## 5. Quickstart & Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd project

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

---

## 6. Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm test` | Runs the automated Vitest test suite (38 unit & simulation tests) |
| `npm run typecheck` | Executes strict TypeScript compiler verification (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint 9 across all TypeScript and React source files |
| `npm run build` | Produces optimized, code-split production bundle in `dist/` |
| `npm run preview` | Previews the production build locally via Vite preview |

---

## 7. Project Structure

```
project/
├── public/                 # Static assets, favicon, Cloudflare & GitHub Pages SPA rules
│   ├── _redirects         # Cloudflare Pages SPA rewrite rule (/* /index.html 200)
│   ├── _headers           # Security headers (CSP, nosniff, frame options)
│   ├── 404.html           # GitHub Pages client-side routing fallback
│   └── favicon.svg        # Cyan-accented Linux Unlocked logo mark
├── src/
│   ├── animation/          # GSAP ScrollTrigger timeline controller (useExplodedScroll.ts)
│   ├── app/                # Router configuration (AppRouter.tsx with lazy loading)
│   ├── components/
│   │   ├── atlas/         # Article viewer, learning roadmaps
│   │   ├── discovery/     # Interactive diagrams (Kernel, FHS, Perms, Family Tree, DEs)
│   │   ├── distros/       # Distro recommendation quiz & comparisons
│   │   ├── layout/        # AppShell, NavBar, Footer
│   │   ├── terminal/      # Sandboxed InteractiveTerminal UI
│   │   ├── three/         # ThreeCanvasHost container with WebGL lifecycle handling
│   │   ├── translator/    # TermLink and LevelSwitcher components
│   │   └── ui/            # UI components (Button, Card, GlassPanel, Pill, Modal, etc.)
│   ├── content/           # Typed static databases (Atlas, Distros, Hardware, Apps, Migration)
│   ├── hooks/             # Utility hooks (useDeviceTier, useReducedMotion)
│   ├── pages/             # Route pages (Home, Discover, Desktop, Atlas, Terminal, etc.)
│   ├── simulations/       # Sandboxed engines:
│   │   ├── filesystem/    # In-memory POSIX VirtualFileSystem (FileSystem.ts)
│   │   └── shell/         # Deterministic POSIX ShellEngine (ShellEngine.ts)
│   ├── state/             # Context providers & UI stores (LevelProvider, useUIStore)
│   ├── styles/            # Design tokens & Tailwind entry styles
│   ├── three/             # Native Three.js scenes & managers:
│   │   ├── core/          # SceneManager (RAF, DPR, GPU disposal, context loss)
│   │   └── scenes/        # ExplodedArchScene (GLSL shaders), BootScene
│   ├── types/             # Shared TypeScript interfaces & types
│   ├── App.tsx            # Application root wrapper
│   └── main.tsx           # React DOM client entry point
├── tests/                 # Automated test suites (38 tests)
│   ├── atlasSearch.test.ts
│   ├── distroQuiz.test.ts
│   ├── filesystem.test.ts
│   ├── missions.test.ts
│   └── shellEngine.test.ts
├── package.json           # Dependencies and build scripts
├── tailwind.config.js     # Design system color palette and token configuration
├── tsconfig.json          # TypeScript project references
└── vite.config.ts         # Vite build configuration with manual chunk splitting
```

---

## 8. Security & Sandboxing Architecture

- **No Remote Shells:** The terminal emulator runs 100% in-browser memory using a pure TypeScript POSIX evaluator. It cannot execute host commands or access your actual filesystem.
- **Root Enclosure:** The Virtual Filesystem prevents traversal beyond its simulated root (`/`). Attempts to `cd ../..` from root remain safely confined to `/`.
- **Zero Invasiveness:** The platform never scans or probes client hardware or local networks.
- **XSS & Link Hardening:** Zero use of `dangerouslySetInnerHTML` or `eval()`. All external outbound links enforce `target="_blank" rel="noopener noreferrer"`.
- **Privacy by Design:** Zero tracking cookies, zero analytics beacons, zero mandatory logins. Progress is stored strictly in client-side `localStorage`.

---

## 9. Known Limitations

- **Multithreading in Sandbox:** The in-memory shell evaluates pipelines sequentially through memory buffers rather than preemptive kernel threads.
- **Hardware Compatibility Data:** Hardware profiles reflect standard Linux kernel support and community verification; specific revision OEM motherboard BIOS quirks may still require manual verification.
- **3D Hardware Acceleration:** High-complexity Three.js layers adapt dynamically for low-power devices, but older integrated graphics without WebGL 2.0 support will display the accessible 2D architectural fallback.

---

## 10. License

This project is open-source and released under the **MIT License**.
All educational documentation and content is dedicated to the public good under creative commons principles.
