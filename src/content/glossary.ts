import type { GlossaryTerm } from "@/types";

/* Comprehensive glossary for the Linux Translator.
   Each entry powers the contextual translator: technical terms found in any
   article or page are clickable to reveal a short, level-aware definition. */
export const glossary: GlossaryTerm[] = [
  {
    term: "kernel",
    aliases: ["linux kernel"],
    shortDef:
      "The core program that talks to your hardware and manages everything else running on the computer.",
    levels: {
      beginner:
        "Think of the kernel as the conductor of an orchestra — it doesn't play instruments itself, but it tells every part of the computer when and how to play.",
      practical:
        "The kernel is the lowest-level software layer. It manages memory, CPU time, devices, and file access for every program. On Linux you rarely interact with it directly, but it powers everything.",
      technical:
        "The Linux kernel is a monolithic, preemptible Unix-like kernel. It provides system calls (syscalls), memory management, scheduling, device drivers, and virtual filesystem (VFS) abstraction. It is released under GPLv2.",
    },
    related: ["distribution", "GNU", "userspace", "systemd"],
  },
  {
    term: "distribution",
    aliases: ["distro"],
    shortDef:
      "A complete, ready-to-use Linux package that bundles the kernel, desktop, apps, and tools.",
    levels: {
      beginner:
        "A distribution (or 'distro') is like a brand of Linux — same engine inside, different look, apps, and settings. Mint, Ubuntu, and Fedora are all distributions.",
      practical:
        "A distribution bundles the Linux kernel, GNU userspace, a package manager, a desktop environment, and pre-installed applications. Different distros target different users and update at different cadences.",
      technical:
        "A distribution is an integrated set of packages built around a kernel, an init system, a package manager, and curated repositories. Differences include release models (rolling vs point), init systems (systemd, OpenRC), and package formats (deb, rpm, pacman).",
    },
    related: ["kernel", "package manager", "desktop environment"],
  },
  {
    term: "package manager",
    aliases: ["package management"],
    shortDef:
      "A tool that installs, updates, and removes software in a safe, organized way.",
    levels: {
      beginner:
        "Instead of hunting the web for installers, a package manager is an app store for Linux — you ask for a program and it downloads and installs it for you safely.",
      practical:
        "Package managers (apt, dnf, pacman) fetch software from curated repositories, resolve dependencies, and verify integrity. This is how almost all Linux software is installed.",
      technical:
        "Package managers track package metadata, dependency graphs, and file ownership. They interact with the distribution's repositories and verify GPG signatures. dpkg/rpm are low-level; apt/dnf are high-level frontends.",
    },
    related: ["distribution", "repository", "Flatpak"],
  },
  {
    term: "desktop environment",
    aliases: ["de"],
    shortDef:
      "The visual part of Linux you interact with — the taskbar, windows, settings, and apps.",
    levels: {
      beginner:
        "A desktop environment (DE) is the look and feel of your screen: the taskbar, start menu, window buttons, and settings app. GNOME and KDE Plasma are popular examples.",
      practical:
        "A DE provides the graphical shell (panels, window manager, launcher) and a suite of integrated apps (file manager, settings, terminal). Switching DEs changes your entire workflow appearance.",
      technical:
        "A DE typically bundles a window manager (Mutter, KWin), a display server protocol (Wayland/X11), panels, and integrated GTK/Qt applications. Some users opt for standalone window managers instead.",
    },
    related: ["window manager", "Wayland", "distribution"],
  },
  {
    term: "terminal",
    aliases: ["terminal emulator", "console"],
    shortDef:
      "A text-based screen where you type commands to control the computer.",
    levels: {
      beginner:
        "The terminal is a place where you type commands instead of clicking. It looks technical but it's just another way to talk to your computer.",
      practical:
        "A terminal emulator (gnome-terminal, alacritty, kitty) runs a shell. You type commands, the shell interprets them, and output is printed back. It's the fastest way to manage a Linux system.",
      technical:
        "A terminal emulator provides a PTY (pseudo-terminal) connected to a shell process. The shell (bash, zsh, fish) parses input, expands globs/variables, and executes builtins or external binaries via fork/exec.",
    },
    related: ["shell", "command", "bash"],
  },
  {
    term: "shell",
    aliases: ["bash", "zsh", "command line"],
    shortDef:
      "The program that reads your typed commands and runs them.",
    levels: {
      beginner:
        "The shell is the 'translator' between you and the computer — you type words, it turns them into actions.",
      practical:
        "bash is the default shell on most distros. It interprets commands, runs scripts, manages variables, and provides builtins like cd and echo.",
      technical:
        "The shell is a command interpreter providing job control, variable expansion, redirection, piping, and scripting. Common shells: bash, zsh, fish, dash. POSIX defines baseline shell behavior.",
    },
    related: ["terminal", "permissions", "script"],
  },
  {
    term: "open source",
    aliases: ["foss", "floss"],
    shortDef:
      "Software whose source code is freely available to read, change, and share.",
    levels: {
      beginner:
        "Open source means the recipe for the software is public — anyone can see how it works, improve it, and share their version.",
      practical:
        "Open-source software is released under licenses (GPL, MIT, Apache) that grant users the right to inspect, modify, and redistribute the source code. Linux and most of its ecosystem are open source.",
      technical:
        "Open source refers to licenses satisfying the OSI definition: free redistribution, source availability, derived works, and no discrimination. Linux uses the GPLv2; userspace tools use a mix of GPL, LGPL, MIT, Apache 2.0.",
    },
    related: ["GNU", "kernel"],
  },
  {
    term: "GNU",
    aliases: ["gnu project", "gnu/linux"],
    shortDef:
      "A collection of free software tools that, together with the Linux kernel, make a full operating system.",
    levels: {
      beginner:
        "GNU provides many of the programs that make Linux usable day to day. That's why some people say 'GNU/Linux'.",
      practical:
        "GNU is a project that provides the userspace tools (bash, coreutils, gcc, glibc) that pair with the Linux kernel to form a complete OS. Most distros are GNU+Linux.",
      technical:
        "The GNU Project, started in 1983 by Richard Stallman, provides compilers (GCC), the C library (glibc), core utilities (coreutils), and the bash shell. Combined with the Linux kernel, these form a POSIX-compliant operating system.",
    },
    related: ["kernel", "open source", "POSIX"],
  },
  {
    term: "repository",
    aliases: ["repo", "repos"],
    shortDef:
      "A curated online storage location where your package manager finds software.",
    levels: {
      beginner:
        "A repository (or 'repo') is a trusted library of software. Your system fetches apps from it instead of random websites.",
      practical:
        "Repositories are servers that host packages and metadata. Your package manager reads repo indexes to find available software and updates.",
      technical:
        "A repository contains a structured package pool and signed metadata (Packages/Sources for apt, repodata for dnf). Clients fetch metadata, verify signatures, and resolve dependencies against it.",
    },
    related: ["package manager", "distribution"],
  },
  {
    term: "Wayland",
    aliases: ["wayland compositor"],
    shortDef:
      "A modern protocol for displaying windows and graphics on Linux, replacing the older X11.",
    levels: {
      beginner:
        "Wayland is the newer way Linux draws windows on your screen. It's smoother, less laggy, and more secure than the old method.",
      practical:
        "Wayland is the default display protocol on most modern distros. It improves security (apps can't spy on each other's keystrokes) and supports HiDPI and multi-monitor scaling seamlessly.",
      technical:
        "Wayland is a display server protocol where the compositor is the display server. Unlike X11, there is no global input grab; each client renders its own buffers and the compositor composites them. XWayland provides backward compatibility for legacy X11 apps.",
    },
    related: ["desktop environment", "window manager", "PipeWire"],
  },
  {
    term: "file system",
    aliases: ["filesystem", "fhs"],
    shortDef:
      "How files and folders are organized and stored on a storage disk.",
    levels: {
      beginner:
        "A file system is how your computer stores and finds files — like a filing cabinet with labeled drawers.",
      practical:
        "Linux supports many file systems (ext4, btrfs, xfs). They define how data is stored, journaled, and recovered. ext4 is the most common default, while btrfs offers automatic snapshots.",
      technical:
        "A filesystem implements the VFS (Virtual Filesystem) interface in the kernel. ext4 uses extents and journaling; btrfs offers copy-on-write (CoW), subvolumes, and checksums; xfs scales for high-throughput enterprise storage.",
    },
    related: ["kernel", "permissions", "inode"],
  },
  {
    term: "permissions",
    aliases: ["file permissions", "chmod"],
    shortDef:
      "Rules that decide who can read, change, or run a file.",
    levels: {
      beginner:
        "Permissions are like locks on files — they decide who's allowed to look, change, or run them.",
      practical:
        "Every file has read (r), write (w), and execute (x) permissions for its owner, group, and others. The chmod command changes them (e.g., chmod 755 script.sh).",
      technical:
        "Linux file permissions are a discretionary access control (DAC) model: 3 permission bits (rwx) for user, group, and other. Additional bits include setuid (4000), setgid (2000), and sticky (1000). POSIX ACLs extend this for granular multi-user access.",
    },
    related: ["terminal", "file system", "sudo"],
  },
  {
    term: "systemd",
    aliases: ["init", "systemctl"],
    shortDef:
      "The system and service manager that initializes hardware, starts services, and manages processes as PID 1.",
    levels: {
      beginner:
        "systemd is the manager of the computer — when you turn it on, it starts the clock, networks, screen, and all background services.",
      practical:
        "You control systemd using `systemctl` (e.g. `systemctl start nginx`, `systemctl status bluetooth`). It handles dependencies, service auto-restarts, and logs via `journalctl`.",
      technical:
        "systemd is the default init system (PID 1) on most modern distributions. It replaces legacy SysVinit with parallel service activation using socket and D-Bus activation, cgroups for process tracking, and udev for dynamic device management.",
    },
    related: ["kernel", "journald", "cgroups"],
  },
  {
    term: "sudo",
    aliases: ["root", "superuser"],
    shortDef:
      "A command that allows permitted users to run programs with administrator (root) privileges.",
    levels: {
      beginner:
        "sudo stands for 'superuser do'. It's like 'Run as Administrator' on Windows, asking you for your password before doing something that changes the whole computer.",
      practical:
        "Prefixing a command with `sudo` (e.g., `sudo apt update`) runs it with root privileges. Configure permissions in `/etc/sudoers` with `visudo`.",
      technical:
        "sudo verifies the invoking user against `/etc/sudoers`, switches effective UID to 0 (root), logs the attempt, and preserves or sanitizes environment variables.",
    },
    related: ["permissions", "terminal"],
  },
  {
    term: "PipeWire",
    aliases: ["pipewire audio"],
    shortDef:
      "The modern audio and video processing engine and routing graph for Linux.",
    levels: {
      beginner:
        "PipeWire is the sound engine of modern Linux. It makes sure your speakers, headphones, microphone, and screen recordings work smoothly without crackling.",
      practical:
        "PipeWire replaces both PulseAudio (desktop sound) and JACK (pro audio) with a single low-latency audio server that supports Bluetooth codecs and sandboxed Flatpak audio routing.",
      technical:
        "PipeWire provides a graph-based processing architecture with real-time audio scheduling, SPA (Simple Plugin API) modules, and native drop-in compatibility daemons for PulseAudio, JACK, and ALSA clients.",
    },
    related: ["Wayland", "desktop environment"],
  },
  {
    term: "Flatpak",
    aliases: ["flatpaks"],
    shortDef:
      "A universal packaging system that runs applications in a secure, sandboxed container across any Linux distribution.",
    levels: {
      beginner:
        "Flatpak packages apps so they work on any version of Linux, bundled with everything they need to run safely without breaking your computer.",
      practical:
        "Download apps from Flathub using your software store or `flatpak install`. Apps run sandboxed with restricted access to your webcam, files, and network.",
      technical:
        "Flatpak uses bubblewrap (unprivileged user namespaces), cgroups, and OSTree for application sandboxing and deduplication, communicating with host desktops via XDG Desktop Portals.",
    },
    related: ["package manager", "distribution"],
  },
];
