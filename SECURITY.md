# Security Policy — Linux Unlocked

Linux Unlocked is an educational web platform built with TypeScript, React, Vite, and Three.js. It operates as a 100% static, client-side single page application with a ₹0 infrastructure footprint. It contains zero mandatory backends, databases, external telemetry, or tracking scripts.

This document describes the platform's security architecture, safety guarantees, threat model, and vulnerability reporting procedures.

---

## 1. Security Architecture & Threat Model

### A. Terminal and Process Execution Isolation
- **Purely In-Memory Simulation**: The terminal (`/terminal`) and interactive simulations do **NOT** execute real commands on the visitor's device, nor do they connect to a remote backend server, container, or shell daemon via WebSockets.
- **Zero Host Access**: There are no Node.js `child_process`, `eval()`, `Function()`, WebAssembly OS emulators, or system calls executed. All commands (`ls`, `cd`, `cat`, `mkdir`, `touch`, `rm`, `head`, `tail`, `grep`, `find`, `pwd`, `date`, `chmod`, `whoami`, etc.) are parsed using strict lexing and deterministic JavaScript handlers in `ShellEngine.ts`.
- **Zero Host Vulnerability**: Even if an adversary injects malicious bash commands or shell exploit payloads (`rm -rf /`, fork bombs, curl-to-bash pipelines), they operate exclusively against the virtual, mock filesystem representation in memory. The user's host operating system, files, and network are completely untouched.

### B. Virtual File System (VFS) Safety
- **Strict Root Clamping**: All path resolutions in `FileSystem.ts` (`resolvePath`) normalize target paths and clamp navigation strictly at root `/`. An adversary attempting directory traversal (`cd ../../../../../etc/passwd` or `cat ../../shadow`) cannot escape the simulated virtual tree.
- **Node Immutability Safeguards**: Core system paths (`/proc`, `/sys`) return virtual synthetic snapshots. File deletion (`rm`) checks directory node flags, handles recursive constraints safely, and never accesses the browser file system API (`window.showOpenFilePicker` is only used if explicitly initiated by user interaction for local file inspection, which Linux Unlocked does not use).

### C. Client-Side Data Storage & Privacy
- **Client-Side Only**: All user progression (quiz results, completed terminal challenges, user preferences) is stored strictly in the visitor's browser `localStorage` or `sessionStorage`.
- **Zero Telemetry / Zero Tracking**: Linux Unlocked collects no personal identifiable information (PII), analytics, cookies, session recordings, or device fingerprints.
- **Zero Secrets / API Keys**: No API keys, secret credentials, or administrative tokens exist in client bundles or environment files. The entire platform runs without third-party API dependencies.

### D. External Link Hardening
- All outgoing hyperlinks pointing to upstream Linux documentation (kernel.org, archlinux.org, gnu.org, debian.org, etc.) are explicitly configured with:
  ```html
  target="_blank" rel="noopener noreferrer"
  ```
  This prevents tab-napping attacks (`window.opener` abuse) and protects the visitor's referrer privacy.

### E. WebGL and GPU Safety
- The native Three.js 3D subsystem (`SceneManager.ts`) dynamically caps device pixel ratios (`Math.min(window.devicePixelRatio, 2)`), detects and handles WebGL context loss (`webglcontextlost`, `webglcontextrestored`), and monitors rendering visibility with `IntersectionObserver` to pause GPU loops when canvases are scrolled off-screen.
- Geometry and material allocations are properly disposed on unmount, preventing GPU memory leaks or browser tab crashes.

---

## 2. HTTP Security Headers

When deployed on Cloudflare Pages or any compliant static web server, Linux Unlocked enforces hardened HTTP security headers via `public/_headers`:

| Header | Configured Value | Security Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing attacks. |
| `X-Frame-Options` | `DENY` | Mitigates clickjacking attacks by forbidding iframe embedding. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects path and query parameters from leaking to external referrers. |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Explicitly disables unused browser hardware access. |
| `X-XSS-Protection` | `1; mode=block` | Legacy cross-site scripting filter activation. |
| `Cache-Control` | `max-age=31536000, immutable` | Applied to hashed assets (`/assets/*`) for performance and integrity. |

---

## 3. Supported Versions

Only the current main/master release on GitHub receives active security updates and dependency audits.

| Version / Branch | Supported |
|---|---|
| `master` / `main` | :white_check_mark: Active |
| `< 1.0.0` releases | :x: No longer maintained |

---

## 4. Reporting a Vulnerability

If you discover a security issue or unexpected behavior:

1. **Do not create a public issue** on GitHub.
2. Email the project maintainers with details, reproduction steps, and impact assessment.
3. We will acknowledge receipt within 48 hours and provide a timeline for remediation.
4. Once a fix is verified and deployed, credit will be given in the release notes (unless anonymity is requested).
