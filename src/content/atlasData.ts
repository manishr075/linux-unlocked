import type { AtlasCategory, ContentType, ArticleReference } from "@/types";

export type AtlasDomain =
  | "foundations"
  | "system-core"
  | "command-line"
  | "networking-security"
  | "building-running"
  | "lifestyle-support";

export interface AtlasArticleData {
  id: string;
  slug: string;
  category: AtlasCategory;
  domain: AtlasDomain;
  title: string;
  summary: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  contentType: ContentType;
  estimatedMinutes: number;
  prerequisites: string[];
  related: string[];
  tags: string[];
  lastVerified: string;
  verifiedAgainst: string;
  references: ArticleReference[];
  terminalMissionId?: string;
  interactiveDemo?: "terminal" | "architecture-3d" | "permissions";
  content: {
    beginner: string;
    practical: string;
    technical: string;
  };
}

export const ATLAS_DOMAINS: Record<
  AtlasDomain,
  { label: string; description: string; categories: AtlasCategory[] }
> = {
  foundations: {
    label: "Foundations",
    description: "Core Linux philosophies, distributions, and desktop paradigms.",
    categories: ["fundamentals", "distributions", "desktop-environments", "window-managers"],
  },
  "system-core": {
    label: "System Core",
    description: "Kernel architecture, process scheduling, filesystems, and permissions.",
    categories: ["kernel", "boot-recovery", "filesystem", "permissions"],
  },
  "command-line": {
    label: "Command Line",
    description: "Shell proficiency, scripting, package management, and software installation.",
    categories: ["terminal", "scripting", "package-management", "software-installation"],
  },
  "networking-security": {
    label: "Networking & Security",
    description: "Network protocols, firewalling, cryptography, and access control.",
    categories: ["networking", "security"],
  },
  "building-running": {
    label: "Building & Running",
    description: "Development environments, system administration, and containers.",
    categories: ["development", "programming", "servers-admin", "containers-virtualization"],
  },
  "lifestyle-support": {
    label: "Lifestyle & Support",
    description: "Gaming with Proton, multimedia creation, desktop customization, and troubleshooting.",
    categories: ["gaming", "multimedia", "troubleshooting", "customization"],
  },
};

export const CATEGORY_LABELS: Record<AtlasCategory, string> = {
  fundamentals: "Linux Fundamentals",
  kernel: "Kernel & Internals",
  terminal: "Terminal & Shell",
  scripting: "Shell Scripting",
  filesystem: "Filesystem Hierarchy",
  permissions: "Permissions & Ownership",
  networking: "Networking Subsystems",
  security: "Security & Hardening",
  "package-management": "Package Management",
  distributions: "Distributions & Lineage",
  "desktop-environments": "Desktop Environments",
  "window-managers": "Window Managers & Compositors",
  "software-installation": "Software Installation",
  development: "Development Environments",
  programming: "Programming on Linux",
  "servers-admin": "Servers & Administration",
  "containers-virtualization": "Containers & Virtualization",
  gaming: "Gaming & Proton",
  multimedia: "Multimedia & Creative Tools",
  troubleshooting: "Diagnostics & Troubleshooting",
  "boot-recovery": "Boot Process & Recovery",
  customization: "Desktop Customization & Ricing",
};

export const ATLAS_ARTICLES: AtlasArticleData[] = [
  // --- Foundations ---
  {
    id: "art-fund-01",
    slug: "unix-philosophy",
    category: "fundamentals",
    domain: "foundations",
    title: "The Unix Philosophy: Small Tools, Infinite Power",
    summary: "Why Linux commands do one thing well and connect together through standard text streams.",
    difficulty: 1,
    contentType: "concept",
    estimatedMinutes: 5,
    prerequisites: [],
    related: ["terminal-pipes-redirects", "posix-standards"],
    tags: ["philosophy", "unix", "posix", "pipes", "coreutils"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "POSIX.1-2024 / IEEE 1003.1",
    references: [
      { title: "The Unix Philosophy (Doug McIlroy)", url: "https://en.wikipedia.org/wiki/Unix_philosophy", type: "official" },
      { title: "Bell Labs Technical Journal", url: "https://www.bell-labs.com", type: "official" },
    ],
    content: {
      beginner: `In modern computing, apps are often giant, monolithic suites. Microsoft Word tries to be a typewriter, a desktop publisher, an email tool, and an image editor all in one.

The Unix philosophy behind Linux does the exact opposite:
1. **Write programs that do one thing and do it well.**
2. **Write programs to work together.**
3. **Write programs to handle text streams, because that is a universal interface.**

Think of Linux commands like LEGO bricks. A single brick isn't a castle, but by snapping simple bricks together, you can build anything from a small car to a spaceship.`,
      practical: `Instead of inventing new file formats, Linux commands output simple plain text. This allows you to chain commands using the pipe operator (\`|\`):

\`\`\`bash
# Count how many failed login attempts occurred today:
cat /var/log/auth.log | grep "Failed password" | wc -l

# Find the 5 largest files in your downloads folder:
ls -lh ~/Downloads | sort -k5 -hr | head -n 5
\`\`\`

Here, \`cat\` only reads, \`grep\` only filters, \`sort\` only orders, and \`head\` only limits. None of these tools know about each other, yet together they solve complex workflows in seconds.`,
      technical: `The Unix philosophy is codified in POSIX (Portable Operating System Interface) standards. Its architectural power stems from standard file descriptor inheritance:
- Every process launches with three standard streams: \`stdin\` (0), \`stdout\` (1), and \`stderr\` (2).
- The shell creates pipes via the \`pipe()\` system call, connecting the write end of process A's stdout to the read end of process B's stdin using \`dup2()\`.
- Data flows in kernel memory buffers without touching the disk, preventing unnecessary disk I/O bottlenecks.`,
    },
  },
  {
    id: "art-distro-01",
    slug: "rolling-vs-point-release",
    category: "distributions",
    domain: "foundations",
    title: "Rolling Release vs. Point Release: Choosing Your Update Rhythm",
    summary: "The crucial difference between distributions that update continuously vs scheduled version upgrades.",
    difficulty: 2,
    contentType: "comparison",
    estimatedMinutes: 6,
    prerequisites: ["unix-philosophy"],
    related: ["debian-ecosystem", "arch-linux-deep-dive"],
    tags: ["distros", "updates", "rolling", "point-release", "debian", "arch"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Debian 12 / Arch Linux / Ubuntu 24.04",
    references: [
      { title: "Debian Release Model", url: "https://www.debian.org/releases/", type: "official" },
      { title: "Arch Linux Rolling Release Specification", url: "https://wiki.archlinux.org", type: "community" },
    ],
    content: {
      beginner: `When you buy a smartphone, you get iOS 17 or Android 14. A year later, you download a massive update for iOS 18. That is a **Point Release**.

In Linux, you get to choose between two completely different update philosophies:
- **Point Release:** The OS stays on fixed software versions for 2 to 5 years, only receiving security patches. You upgrade only when a new milestone is published (e.g. Ubuntu 22.04 -> 24.04).
- **Rolling Release:** There are no version numbers. Every day, the newest drivers and software packages are delivered as soon as developers build them. You install once and update forever.`,
      practical: `**Which one should you choose?**

- **Choose a Point Release (Ubuntu, Linux Mint, Debian, Fedora):**
  - If you need 100% predictable stability for work, client projects, or university.
  - If you dislike sudden changes to software interfaces.
  - If you are running home servers or media centers.

- **Choose a Rolling Release (Arch Linux, EndeavourOS, openSUSE Tumbleweed):**
  - If you have brand-new hardware (newest AMD/Intel/NVIDIA GPUs) needing the newest kernel.
  - If you are a developer wanting the latest compiler and library versions.
  - If you enjoy learning how packages assemble together.`,
      technical: `Under the hood:
- **Point Release QA:** Debian/Ubuntu freeze package versions during the feature freeze window. Patches are backported to specific package versions (\`package-1.2.3-4ubuntu2\`). ABI/API stability is guaranteed across the release lifetime.
- **Rolling Release QA:** Arch and Tumbleweed rely on upstream versioning. Package updates transition through \`[testing]\` repositories before moving to \`[core]\` and \`[extra]\`. Tools like \`openQA\` automate automated VM boot testing for every package snapshot before distribution to mirrors.`,
    },
  },

  // --- System Core ---
  {
    id: "art-kernel-01",
    slug: "linux-kernel-architecture",
    category: "kernel",
    domain: "system-core",
    title: "Inside the Monolithic Linux Kernel: Rings, Syscalls & VFS",
    summary: "How the Linux kernel balances monolithic performance with modular loadable drivers.",
    difficulty: 4,
    contentType: "documentation",
    estimatedMinutes: 8,
    prerequisites: ["unix-philosophy"],
    related: ["vfs-deep-dive", "process-scheduling-eevdf"],
    tags: ["kernel", "architecture", "ring0", "vfs", "monolithic", "modules"],
    interactiveDemo: "architecture-3d",
    lastVerified: "2026-10-31",
    verifiedAgainst: "Linux Kernel 6.12 LTS",
    references: [
      { title: "Linux Kernel Documentation", url: "https://www.kernel.org/doc/html/latest/", type: "kernel-doc" },
      { title: "The Linux Programming Interface (Michael Kerrisk)", url: "https://man7.org/tlpi/", type: "official" },
    ],
    content: {
      beginner: `The operating system is divided into two separate worlds for safety:
1. **User Space:** Where your web browser, video games, and text editors live. If an app crashes here, your computer stays on.
2. **Kernel Space:** The high-security control room with direct access to physical memory chips and processor instructions.

If an app in User Space wants to read a file or send data over Wi-Fi, it cannot touch the hardware directly. It must knock on the kernel's door and ask politely through a **system call**.`,
      practical: `You can observe the kernel in action right now using simple command line tools:

\`\`\`bash
# Inspect the active running kernel version:
uname -r

# View the hardware boot events logged by the kernel:
sudo dmesg | head -n 20

# List all currently loaded dynamic kernel modules (LKMs):
lsmod | head -n 10
\`\`\`

If you plug in a USB device, the kernel dynamically loads the appropriate driver module without restarting your computer!`,
      technical: `The Linux kernel is classified as a **monolithic kernel with dynamic module loading (LKM)**:
- All core subsystems — the CPU scheduler (EEVDF), virtual memory manager (VMM), IPC, networking stack, and filesystem layers — run within the same supervisor address space (Ring 0 on x86_64).
- System call transitions (\`syscall\` instruction) save register state, switch to kernel stack, validate user pointers, and dispatch to the syscall vector table in \`arch/x86/entry/syscall_64.c\`.
- The Virtual Filesystem (VFS) abstracts diverse block devices into standard \`inode\`, \`dentry\`, and \`file_operations\` structs, decoupling user POSIX calls from underlying filesystem drivers (ext4, btrfs, xfs).`,
    },
  },
  {
    id: "art-fs-01",
    slug: "linux-filesystem-hierarchy",
    category: "filesystem",
    domain: "system-core",
    title: "Filesystem Hierarchy Standard (FHS): The Unified Tree",
    summary: "Mastering the single root directory tree, mount points, and why Linux abandons drive letters.",
    difficulty: 2,
    contentType: "concept",
    estimatedMinutes: 6,
    prerequisites: ["unix-philosophy"],
    related: ["linux-permissions-chmod", "storage-mount-fstab"],
    tags: ["fhs", "filesystem", "root", "etc", "var", "home"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "FHS 3.0 Standard",
    references: [
      { title: "Filesystem Hierarchy Standard 3.0", url: "https://refspecs.linuxfoundation.org/FHS_3.0/fhs-3.0.html", type: "official" },
      { title: "Linux man-pages: hier(7)", url: "https://man7.org/linux/man-pages/man7/hier.7.html", type: "man-page" },
    ],
    content: {
      beginner: `In Windows, your storage is fractured into drive letters: \`C:\\\` for Windows, \`D:\\\` for a second SSD, and \`E:\\\` for a USB drive.

Linux unifies everything into a single, elegant tree starting at the root: \`/\`.
When you insert a USB thumb drive, Linux doesn't invent an \`F:\\\` drive; it simply attaches ("mounts") that drive to a folder inside the tree, like \`/media/usb\`. Everything is part of one unified family.`,
      practical: `Key directories every Linux user must know:
- \`/home/<user>\`: Your personal realm. Documents, downloads, desktop files, and personal app preferences in \`~/.config\`.
- \`/etc\`: System configuration files. Almost all are human-readable plain text!
- \`/var/log\`: System and service error logs.
- \`/usr/bin\`: Where command-line tools and software binaries live.

\`\`\`bash
# See all mounted storage partitions and remaining disk space:
df -h

# Inspect disk drive partitions and mount points:
lsblk
\`\`\``,
      technical: `Under POSIX, the directory hierarchy is governed by the Filesystem Hierarchy Standard (FHS 3.0):
- **VFS Mount Tables:** Stored in \`/proc/mounts\` (kernel internal) and configured via \`/etc/fstab\`.
- **Special Pseudo-filesystems:** \`/proc\` (procfs) and \`/sys\` (sysfs) are RAM-backed kernel memory mirrors providing programmatic interfaces to process descriptors (\`task_struct\`) and kernel device trees (kobjects).
- **UsrMerge:** Modern distros (Fedora, Arch, Debian 12+) symlink \`/bin\`, \`/sbin\`, and \`/lib\` into \`/usr/bin\` and \`/usr/lib\` to clean up legacy dual-root splits.`,
    },
  },
  {
    id: "art-perm-01",
    slug: "linux-permissions-chmod",
    category: "permissions",
    domain: "system-core",
    title: "Linux File Permissions: Mastering chmod, chown & Octal Modes",
    summary: "Demystifying Read, Write, Execute bits, numeric 755/644 modes, and ownership security.",
    difficulty: 2,
    contentType: "tutorial",
    estimatedMinutes: 7,
    prerequisites: ["linux-filesystem-hierarchy"],
    related: ["sudo-root-security", "selinux-apparmor"],
    tags: ["permissions", "chmod", "chown", "security", "octal"],
    interactiveDemo: "permissions",
    terminalMissionId: "mission-04-permissions",
    lastVerified: "2026-10-31",
    verifiedAgainst: "GNU coreutils 9.5",
    references: [
      { title: "GNU Coreutils chmod invocation", url: "https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html", type: "official" },
      { title: "POSIX chmod(1) Specification", url: "https://pubs.opengroup.org", type: "official" },
    ],
    content: {
      beginner: `Every file and folder in Linux has a strict lock attached to it. That lock answers three simple questions:
1. **Who owns this file?** (The User)
2. **What group does it belong to?** (The Group)
3. **What can people who aren't the owner do?** (Others / World)

For each group, there are three privileges:
- **Read (r):** Look inside the file.
- **Write (w):** Edit or delete the file.
- **Execute (x):** Run the file as a program.`,
      practical: `When you run \`ls -l\`, you see permissions like \`-rwxr-xr--\`:
- Position 1: \`-\` (regular file) or \`d\` (directory).
- Next 3: \`rwx\` (Owner can read, write, execute).
- Next 3: \`r-x\` (Group can read and execute).
- Last 3: \`r--\` (Others can only read).

\`\`\`bash
# Make a shell script executable:
chmod +x deploy.sh

# Set standard public web permissions (Owner: all, Others: read only):
chmod 755 myscript.sh

# Change file ownership to user 'sam' and group 'developers':
sudo chown sam:developers project.txt
\`\`\``,
      technical: `Discretionary Access Control (DAC) permission encoding:
- Permissions are stored in the file inode's \`st_mode\` field as an unsigned 16-bit integer.
- The low 9 bits represent standard rwx bits:
  - User: Read (0400), Write (0200), Execute (0100)
  - Group: Read (0040), Write (0020), Execute (0010)
  - Other: Read (0004), Write (0002), Execute (0001)
- Special bits:
  - **SetUID (04000):** Process runs with file owner's EUID (e.g. \`/usr/bin/passwd\`).
  - **SetGID (02000):** Files created inherit parent directory's group.
  - **Sticky Bit (01000):** On directories like \`/tmp\`, users may only delete files they own.`,
    },
  },

  // --- Command Line ---
  {
    id: "art-term-01",
    slug: "terminal-core-navigation",
    category: "terminal",
    domain: "command-line",
    title: "Terminal Fundamentals: Navigating the File System with Confidence",
    summary: "The essential survival commands: pwd, ls, cd, mkdir, touch, cat, cp, and mv.",
    difficulty: 1,
    contentType: "tutorial",
    estimatedMinutes: 6,
    prerequisites: [],
    related: ["terminal-pipes-redirects", "linux-filesystem-hierarchy"],
    tags: ["terminal", "commands", "pwd", "ls", "cd", "cp", "mv"],
    interactiveDemo: "terminal",
    terminalMissionId: "mission-01-navigation",
    lastVerified: "2026-10-31",
    verifiedAgainst: "GNU coreutils 9.5 / bash 5.2",
    references: [
      { title: "GNU Coreutils Manual", url: "https://www.gnu.org/software/coreutils/manual/", type: "official" },
    ],
    content: {
      beginner: `The terminal is not a retro relic from the 1970s; it is the fastest, most precise steering wheel for your computer. 

In a graphical file manager, moving 100 photos taken in May to a new folder requires clicking, dragging, and scrolling. In the terminal, it is a single line that executes in 2 milliseconds.

Never be afraid of the terminal — in LINUX UNLOCKED's Terminal Playground, you cannot break anything!`,
      practical: `The 5 commands you will use every single day:

\`\`\`bash
# 1. Where am I? (Print Working Directory)
pwd

# 2. What is inside this folder? (List)
ls -la

# 3. Change directory (Navigate)
cd Documents
cd ..          # Go up one folder
cd ~           # Go home

# 4. Create files and folders
mkdir projects
touch notes.txt

# 5. Copy and Move
cp notes.txt backup.txt
mv backup.txt ~/Documents/
\`\`\``,
      technical: `Internal command execution mechanics:
- \`cd\` is a shell builtin because a child process cannot mutate the current working directory (\`cwd\`) of its parent shell. It invokes the \`chdir()\` system call directly.
- External commands like \`ls\` and \`mkdir\` are resolved via the \`$PATH\` environment variable lookup. The shell calls \`fork()\` to duplicate the process space, then \`execve()\` to replace the child with the binary image.
- Wildcards (\`*.txt\`) are expanded by the shell (globbing) *before* passing argv to the executable, ensuring uniform wildcard handling across all programs.`,
    },
  },
  {
    id: "art-pkg-01",
    slug: "modern-package-formats",
    category: "package-management",
    domain: "command-line",
    title: "APT, DNF, Pacman & Flatpak: How Linux Installs Software",
    summary: "Traditional repository packages vs modern sandboxed application runtimes.",
    difficulty: 2,
    contentType: "comparison",
    estimatedMinutes: 7,
    prerequisites: ["unix-philosophy"],
    related: ["rolling-vs-point-release"],
    tags: ["packages", "apt", "dnf", "flatpak", "flathub", "pacman"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Flatpak 1.14 / APT 2.9 / DNF 5",
    references: [
      { title: "Flathub Official Documentation", url: "https://docs.flathub.org", type: "official" },
      { title: "Debian Package Management", url: "https://www.debian.org/doc/manuals/debian-reference/ch02.en.html", type: "official" },
    ],
    content: {
      beginner: `Think of traditional Linux package managers (\`apt\`, \`dnf\`) like an auto repair shop with shared parts bins. Every program shares common engine parts (libraries). This makes apps tiny to download and fast to run.

Think of **Flatpak** like a shipping container. The application comes in its own self-contained box with every library it needs inside. It works on any Linux computer without worrying about conflicting shared parts.`,
      practical: `**Everyday Package Commands:**

\`\`\`bash
# On Ubuntu / Debian / Linux Mint (APT):
sudo apt update && sudo apt install vlc

# On Fedora / Red Hat (DNF):
sudo dnf install vlc

# On Arch Linux (Pacman):
sudo pacman -S vlc

# Universal Sandboxed App (Flatpak):
flatpak install flathub org.videolan.VLC
\`\`\`

To update all installed software at once on Ubuntu: \`sudo apt update && sudo apt upgrade -y\`.`,
      technical: `Dependency management vs Sandboxing architecture:
- Traditional package managers solve Boolean Satisfiability (SAT) problems to guarantee that shared dynamic libraries (\`.so\` files) satisfy SONAME requirements across the dependency graph.
- **Flatpak Security Model:** Uses \`bubblewrap\` (unprivileged user namespaces) to construct a private mount namespace. The app cannot see \`/home\` or device nodes unless granted explicit portal permissions (XDG Desktop Portals for camera, files, mic).
- Flatpak deduplicates files across runtimes at the byte level using OSTree (a git-like filesystem object store).`,
    },
  },

  // --- Networking & Security ---
  {
    id: "art-sec-01",
    slug: "linux-security-hardening",
    category: "security",
    domain: "networking-security",
    title: "Linux Security Architecture: Why You Don't Need an Antivirus",
    summary: "Privilege separation, package signing, memory safety, and firewall basics.",
    difficulty: 3,
    contentType: "documentation",
    estimatedMinutes: 8,
    prerequisites: ["linux-permissions-chmod"],
    related: ["selinux-apparmor", "firewall-nftables"],
    tags: ["security", "antivirus", "malware", "firewall", "selinux", "sudo"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Linux Security Modules (LSM) / Kernel 6.12",
    references: [
      { title: "Linux Security Module Documentation", url: "https://docs.kernel.org/security/lsm.html", type: "kernel-doc" },
      { title: "CIS Linux Benchmark", url: "https://www.cisecurity.org/benchmark/ubuntu_linux", type: "official" },
    ],
    content: {
      beginner: `On Windows, almost everyone runs third-party antivirus software that scans files and consumes battery life. 

Why don't Linux desktop users run antivirus?
1. **No Drive-by Executables:** You cannot accidentally run a downloaded file by double-clicking it — files are not executable by default.
2. **Curated App Stores:** Software comes from verified, cryptographically signed repositories maintained by professionals.
3. **Privilege Walls:** Programs run with your limited user privileges. An infected browser cannot touch the operating system or other users' files without asking for your \`sudo\` password.`,
      practical: `**Three simple habits for impenetrable Linux security:**

1. **Keep the system updated:** Most vulnerabilities are patched within hours of discovery.
2. **Enable the built-in firewall (\`ufw\`):**
   \`\`\`bash
   sudo ufw enable
   sudo ufw status verbose
   \`\`\`
3. **Be vigilant with \`curl | sh\` commands:** Never copy-paste scripts from untrusted websites directly into a root terminal.`,
      technical: `The Linux security defense-in-depth model:
- **Discretionary Access Control (DAC):** POSIX UID/GID permissions check in kernel inode operations.
- **Mandatory Access Control (MAC):** Linux Security Modules (LSM) hook into kernel operations (e.g. SELinux type enforcement, AppArmor profile paths). Even root cannot read a file if SELinux policy forbids it.
- **Kernel Hardening Flags:** ASLR (Address Space Layout Randomization), Stack Canaries (\`-fstack-protector\`), KASLR, Landlock unprivileged sandboxing, and seccomp-bpf system call filtering.`,
    },
  },

  // --- Building & Running ---
  {
    id: "art-cont-01",
    slug: "containers-docker-podman",
    category: "containers-virtualization",
    domain: "building-running",
    title: "Containers on Linux: How Namespaces & cgroups Power Docker",
    summary: "Why containers are not virtual machines, but isolated Linux processes.",
    difficulty: 3,
    contentType: "concept",
    estimatedMinutes: 7,
    prerequisites: ["linux-kernel-architecture"],
    related: ["linux-security-hardening"],
    tags: ["containers", "docker", "podman", "namespaces", "cgroups", "devops"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Podman 5.2 / Docker 27.0 / OCI Spec",
    references: [
      { title: "Open Container Initiative (OCI) Runtime Spec", url: "https://opencontainers.org", type: "official" },
      { title: "Linux namespaces(7) man page", url: "https://man7.org/linux/man-pages/man7/namespaces.7.html", type: "man-page" },
    ],
    content: {
      beginner: `A **Virtual Machine (VM)** is like building an entire guest house in your backyard — complete with its own plumbing, electrical wiring, and security system. It uses gigabytes of RAM.

A **Container** is like renting a room in your existing house. The container shares your computer's existing engine (kernel) and electrical system, but gives the resident their own private room and private locked door. It starts in 0.1 seconds and uses almost no extra RAM.`,
      practical: `Run an isolated Nginx web server or Python environment with zero setup:

\`\`\`bash
# Run a temporary Python container and enter its shell:
podman run --rm -it python:3.12 bash

# Run a web server mapped to port 8080:
podman run -d -p 8080:80 nginx:alpine

# List running containers:
podman ps
\`\`\`

On Linux, Podman runs rootless — giving you enterprise containers without security risks!`,
      technical: `Under the hood, a container is simply a standard Linux process isolated by two native kernel features:
1. **Namespaces (What the process can SEE):**
   - \`pid\`: Container sees itself as PID 1.
   - \`net\`: Private virtual network interface, IP, routing table.
   - \`mnt\`: Private filesystem root (pivot_root into rootfs image).
   - \`user\`: Maps unprivileged user (UID 1000) to fake root inside container.
2. **Control Groups / cgroups v2 (What the process can USE):**
   - Hard limits on CPU cycles, memory allocation, and disk I/O throughput.
- Storage uses Copy-on-Write overlay filesystems (\`overlay2\`), sharing read-only base layers across thousands of containers.`,
    },
  },

  // --- Lifestyle & Support ---
  {
    id: "art-game-01",
    slug: "linux-gaming-proton",
    category: "gaming",
    domain: "lifestyle-support",
    title: "Gaming on Linux: How Valve Proton Transformed PC Gaming",
    summary: "Translating DirectX to Vulkan in real-time, anti-cheat barriers, and the Steam Deck revolution.",
    difficulty: 2,
    contentType: "tutorial",
    estimatedMinutes: 6,
    prerequisites: [],
    related: ["display-wayland-pipewire"],
    tags: ["gaming", "proton", "steam", "vulkan", "dxvk", "wine"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Proton 9.0 / SteamOS 3.6",
    references: [
      { title: "ProtonDB Community Compatibility Ledger", url: "https://www.protondb.com", type: "community" },
      { title: "Valve Proton GitHub Repository", url: "https://github.com/ValveSoftware/Proton", type: "official" },
    ],
    content: {
      beginner: `For decades, the biggest reason people stayed on Windows was video games. Game developers made games for Windows, and Linux was left out.

In 2018, Valve (creators of Steam) released **Proton**. Proton is a magic translation layer built directly into Steam. When a Windows game speaks DirectX (Windows graphics language), Proton translates it in real time into Vulkan (Linux graphics language).

Today, over 15,000 Windows games run on Linux with the click of a single 'Play' button — including on the world's most popular handheld, the Steam Deck!`,
      practical: `**How to play Windows games on Linux in 3 steps:**

1. Install Steam from your distro software center or package manager.
2. Open Steam **Settings** -> **Compatibility**.
3. Check: *"Enable Steam Play for all other titles"* and select the latest **Proton** version.

Now, almost your entire Windows Steam library is playable! Before buying, check **ProtonDB.com** to verify game ratings (Platinum, Gold, Silver, Borked).`,
      technical: `The Proton technological stack:
- **Wine (Wine Is Not an Emulator):** Re-implements Windows Win32, NTDLL, and DirectX APIs in user space.
- **DXVK & VKD3D-Proton:** Translates Direct3D 9/10/11 and Direct3D 12 API calls into native Vulkan draw commands with near-zero overhead.
- **Esync & Fsync:** Replaces slow Wine server synchronization primitives with Linux eventfd and futex2 kernel system calls, dramatically reducing CPU overhead in multi-threaded games.
- **The Anti-Cheat Barrier:** Kernel-mode anti-cheat systems (Riot Vanguard, BattlEye kernel mode) require Windows kernel hooks and do not run under Proton due to security boundaries.`,
    },
  },

  // --- Networking & Security ---
  {
    id: "art-net-01",
    slug: "linux-networking-stack",
    category: "networking",
    domain: "networking-security",
    title: "Linux Networking Subsystem: Sockets, Netfilter & WireGuard",
    summary: "How Linux processes packets, routes traffic, manages firewalls with nftables, and secures connections.",
    difficulty: 3,
    contentType: "concept",
    estimatedMinutes: 7,
    prerequisites: ["unix-philosophy"],
    related: ["linux-security-hardening", "containers-docker-podman"],
    tags: ["networking", "sockets", "tcp-ip", "netfilter", "nftables", "wireguard", "iproute2"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "Linux Kernel 6.12 Networking",
    references: [
      { title: "Linux Kernel Networking Documentation", url: "https://docs.kernel.org/networking/index.html", type: "kernel-doc" },
      { title: "WireGuard Fast & Modern VPN Protocol", url: "https://www.wireguard.com/papers/wireguard.pdf", type: "official" },
      { title: "iproute2 Documentation", url: "https://wiki.linuxfoundation.org/networking/iproute2", type: "official" },
    ],
    content: {
      beginner: `Think of your computer as a high-rise office building. The internet connection is the loading dock at the ground floor.

Every message (packet) arriving at the loading dock has an apartment number (called a Port Number: e.g. Port 80 for websites, Port 443 for secure web, Port 22 for remote terminal). 

The Linux kernel acts as the building's master mailroom dispatcher. It inspects every incoming envelope, ensures it wasn't tampered with, checks building security rules (Firewall), and hands it directly to the exact application waiting for it.`,
      practical: `**Essential Linux Networking Commands:**

1. Inspect active IP addresses and network interfaces:
\`\`\`bash
ip address show
# or quick summary:
ip -brief address
\`\`\`

2. Test DNS resolution and connectivity:
\`\`\`bash
ping -c 3 archlinux.org
\`\`\`

3. View active listening network ports:
\`\`\`bash
ss -tulwn
# t: tcp, u: udp, l: listening, w: raw, n: numeric ports
\`\`\`

4. Simple firewall rule management with UFW:
\`\`\`bash
sudo ufw enable
sudo ufw allow 22/tcp  # allow SSH
sudo ufw status verbose
\`\`\``,
      technical: `The Linux networking subsystem architecture:
- **Packet Reception & NAPI:** Network Interface Controllers (NICs) place incoming Ethernet frames into ring buffers in RAM via DMA. When traffic spikes, Linux switches from interrupt-driven processing to NAPI (polling mode) to prevent kernel livelock.
- **sk_buff (Socket Buffers):** The primary kernel abstraction structure representing a packet throughout all layers (L2 Ethernet, L3 IPv4/IPv6, L4 TCP/UDP).
- **Netfilter & nftables:** The kernel hook infrastructure located at PREROUTING, LOCAL_IN, FORWARD, LOCAL_OUT, and POSTROUTING. The modern \`nftables\` bytecode engine replaced legacy \`iptables\` for atomic state changes and unified rule compilation.
- **In-Kernel WireGuard:** Unlike legacy OpenVPN running in user space with expensive kernel-to-user context switches, WireGuard operates directly in kernel space using state-of-the-art cryptography (Noise protocol, Curve25519, ChaCha20-Poly1305) with linear line-rate throughput.`,
    },
  },

  // --- Boot Recovery & Diagnostics ---
  {
    id: "art-boot-01",
    slug: "linux-boot-troubleshooting",
    category: "boot-recovery",
    domain: "system-core",
    title: "From UEFI to Shell: The Complete Linux Boot Process & Recovery",
    summary: "Stage-by-stage journey from motherboard firmware to PID 1, and how to recover from an unbootable system.",
    difficulty: 4,
    contentType: "concept",
    estimatedMinutes: 8,
    prerequisites: ["linux-kernel-architecture", "linux-filesystem-hierarchy"],
    related: ["linux-filesystem-hierarchy", "unix-philosophy"],
    tags: ["boot", "uefi", "grub", "systemd", "initramfs", "dracut", "chroot", "recovery"],
    lastVerified: "2026-10-31",
    verifiedAgainst: "systemd v256 / GRUB 2.12",
    references: [
      { title: "systemd Bootup Process Architecture", url: "https://systemd.io/BOOTUP/", type: "official" },
      { title: "Arch Linux Boot Process Guide", url: "https://wiki.archlinux.org/title/Arch_boot_process", type: "community" },
      { title: "GNU GRUB Manual", url: "https://www.gnu.org/software/grub/manual/grub/grub.html", type: "official" },
    ],
    content: {
      beginner: `When you press your computer's power button, it doesn't just instantly start running apps. It goes through a handoff sequence:

1. **The Ignition (UEFI/BIOS):** Checks your physical RAM, SSD, and screen to make sure the hardware isn't broken.
2. **The Pilot (Bootloader / GRUB):** Asks you which operating system you want to start (Linux, Windows, or Recovery).
3. **The Engine (The Linux Kernel):** Loads into RAM, talks directly to your CPU and SSD controller.
4. **The Crew (systemd / PID 1):** Starts background services (Wi-Fi, Bluetooth, Login Screen) and displays your desktop.`,
      practical: `**How to rescue an unbootable Linux system using a Live USB:**

If an update fails or bootloader breaks, you can rescue your system in 4 steps without reinstalling:

1. Boot any Linux Live USB.
2. Open terminal and identify your root partition:
\`\`\`bash
lsblk -f
\`\`\`
3. Mount your installation and bind system devices:
\`\`\`bash
sudo mount /dev/nvme0n1p2 /mnt
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys
\`\`\`
4. Enter your system using chroot:
\`\`\`bash
sudo chroot /mnt
# You are now running inside your real system!
# Repair your kernel or reinstall GRUB:
grub-install /dev/nvme0n1
update-grub
exit
sudo reboot
\`\`\``,
      technical: `The Linux boot sequence technical breakdown:
- **Phase 1: UEFI Firmware & ESP:** The motherboard loads the EFI System Partition (FAT32) and executes the default binary (\`/EFI/BOOT/BOOTX64.EFI\` or \`/EFI/systemd/systemd-bootx64.efi\` or GRUB).
- **Phase 2: Bootloader (GRUB / systemd-boot):** Loads the compressed kernel image (\`vmlinuz\`) and initial RAM disk (\`initramfs\` or \`initrd\`) into memory, then executes kernel entry point (\`startup_64\`).
- **Phase 3: Early User Space (initramfs):** A minimal temporary rootfs in RAM created by \`dracut\` or \`mkinitcpio\`. Loads storage drivers (NVMe, AHCI), decrypts LUKS partitions, activates LVM, finds the real root UUID, and performs the \`switch_root\` syscall to pivot to the permanent root filesystem.
- **Phase 4: PID 1 (systemd):** Spawns with Process ID 1. Parses dependency unit graphs in parallel (\`basic.target\` -> \`network.target\` -> \`graphical.target\`), starts display managers (GDM/SDDM), and presents the Wayland greeter.`,
    },
  },
];
