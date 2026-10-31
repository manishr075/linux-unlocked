export interface DistroData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  basedOn: string | null;
  defaultDesktop: string;
  availableDesktops: string[];
  packageManager: string;
  packageFormat: string;
  releaseModel: "Point Release" | "Rolling Release" | "Semi-Rolling";
  beginnerFriendly: boolean;
  targetAudience: string;
  hardwareRequirements: {
    minRam: string;
    recRam: string;
    minDisk: string;
    recDisk: string;
    cpu: string;
  };
  pros: string[];
  cons: string[];
  tradeoffs: string;
  idealFor: string[];
  maintenanceLevel: "Zero / Low" | "Low" | "Medium" | "High";
  officialSite: string;
  lastVerified: string;
  sources: string[];
}

export const DISTROS_DATA: DistroData[] = [
  {
    id: "mint",
    slug: "linux-mint",
    name: "Linux Mint",
    tagline: "The gold standard for beginners and Windows switchers.",
    basedOn: "Ubuntu LTS / Debian",
    defaultDesktop: "Cinnamon",
    availableDesktops: ["Cinnamon", "MATE", "Xfce"],
    packageManager: "apt / Flatpak",
    packageFormat: ".deb / Flatpak",
    releaseModel: "Point Release",
    beginnerFriendly: true,
    targetAudience: "Windows switchers, students, and users seeking rock-solid reliability without headaches.",
    hardwareRequirements: {
      minRam: "2 GB",
      recRam: "4 GB - 8 GB",
      minDisk: "20 GB",
      recDisk: "50 GB SSD",
      cpu: "64-bit dual-core processor",
    },
    pros: [
      "Zero learning curve for Windows 7/10/11 users with familiar taskbar and Start Menu",
      "Out-of-the-box multimedia codecs, driver managers, and update utilities",
      "Completely telemetry-free with outstanding community documentation",
      "Built on rock-solid Ubuntu LTS base with 5 years of security updates",
    ],
    cons: [
      "Software packages are frozen to LTS versions (not the newest bleeding-edge software)",
      "Cinnamon desktop uses traditional visual style rather than smartphone-like gestures",
      "Wayland support is in preview; runs default X11 session for stability",
    ],
    tradeoffs:
      "You trade cutting-edge software releases for absolute rock-solid reliability. You will rarely if ever experience a broken update.",
    idealFor: ["First-time Linux users", "Daily office computing", "Reviving older laptops", "Non-technical family members"],
    maintenanceLevel: "Zero / Low",
    officialSite: "https://linuxmint.com",
    lastVerified: "2026-10-31",
    sources: ["https://linuxmint.com", "https://blog.linuxmint.com"],
  },
  {
    id: "ubuntu",
    slug: "ubuntu",
    name: "Ubuntu",
    tagline: "The world's most widely recognized Linux distribution.",
    basedOn: "Debian",
    defaultDesktop: "GNOME (Customized)",
    availableDesktops: ["GNOME", "KDE (Kubuntu)", "Xfce (Xubuntu)", "Budgie"],
    packageManager: "apt / snap",
    packageFormat: ".deb / Snap",
    releaseModel: "Point Release",
    beginnerFriendly: true,
    targetAudience: "General users, software developers, and cloud computing professionals.",
    hardwareRequirements: {
      minRam: "4 GB",
      recRam: "8 GB+",
      minDisk: "25 GB",
      recDisk: "60 GB SSD",
      cpu: "2 GHz dual-core processor",
    },
    pros: [
      "The default Linux target: almost all commercial software and tutorials assume Ubuntu",
      "Extensive commercial backing by Canonical with 5 to 10 years LTS enterprise support",
      "Automated proprietary graphics driver installation (NVIDIA/AMD)",
      "Massive worldwide community with immediate answers to every conceivable question",
    ],
    cons: [
      "Canonical heavily promotes Snap packages, which can have slower initial launch times",
      "Contains opt-in telemetry during initial setup",
      "Slightly heavier memory footprint than lightweight alternatives like Mint Xfce",
    ],
    tradeoffs:
      "You gain universal compatibility and third-party vendor support, but accept Canonical's opinionated push toward Snap application packaging.",
    idealFor: ["Software engineers", "DevOps & Cloud learners", "Beginners wanting maximum documentation", "Enterprise servers"],
    maintenanceLevel: "Low",
    officialSite: "https://ubuntu.com",
    lastVerified: "2026-10-31",
    sources: ["https://ubuntu.com/desktop", "https://wiki.ubuntu.com"],
  },
  {
    id: "fedora",
    slug: "fedora",
    name: "Fedora Workstation",
    tagline: "The innovator's operating system: cutting-edge, pure, and upstream.",
    basedOn: "Independent (Sponsored by Red Hat / IBM)",
    defaultDesktop: "GNOME (Pure Upstream)",
    availableDesktops: ["GNOME", "KDE Plasma Spin", "Cinnamon Spin", "i3 Tiling Spin"],
    packageManager: "dnf / Flatpak",
    packageFormat: ".rpm / Flatpak",
    releaseModel: "Point Release",
    beginnerFriendly: false,
    targetAudience: "Developers, sysadmins, Linux enthusiasts, and open-source purists.",
    hardwareRequirements: {
      minRam: "4 GB",
      recRam: "8 GB - 16 GB",
      minDisk: "20 GB",
      recDisk: "60 GB NVMe SSD",
      cpu: "Modern 64-bit multi-core processor",
    },
    pros: [
      "Pure upstream GNOME experience without heavy third-party modifications",
      "Pioneering technology: first to champion Wayland, PipeWire, and Btrfs snapshots",
      "Excellent enterprise preparation for Red Hat Enterprise Linux (RHEL)",
      "Strict open-source licensing principles with high security standards (SELinux enabled)",
    ],
    cons: [
      "Fast 6-month release cadence requires upgrading approximately once a year",
      "Proprietary multimedia codecs and NVIDIA drivers require enabling third-party RPM Fusion",
      "GNOME workflow requires learning touchpad gestures or keyboard shortcuts",
    ],
    tradeoffs:
      "You get the newest stable kernels and open-source innovations first, but must upgrade releases every 6 to 13 months.",
    idealFor: ["Developers and programmers", "Cloud & Kubernetes practitioners", "Wayland enthusiasts", "Linux power users"],
    maintenanceLevel: "Low",
    officialSite: "https://fedoraproject.org",
    lastVerified: "2026-10-31",
    sources: ["https://docs.fedoraproject.org"],
  },
  {
    id: "debian",
    slug: "debian",
    name: "Debian GNU/Linux",
    tagline: "The Universal Operating System — the rock on which Linux is built.",
    basedOn: "Independent (Pure Community Democratic Non-Profit)",
    defaultDesktop: "GNOME / Choose any at install",
    availableDesktops: ["GNOME", "KDE Plasma", "Xfce", "Cinnamon", "LXQt", "MATE"],
    packageManager: "apt",
    packageFormat: ".deb",
    releaseModel: "Point Release",
    beginnerFriendly: false,
    targetAudience: "Server administrators, embedded engineers, and users demanding 100% stability.",
    hardwareRequirements: {
      minRam: "1 GB - 2 GB",
      recRam: "4 GB",
      minDisk: "15 GB",
      recDisk: "30 GB",
      cpu: "Any 32-bit or 64-bit x86/ARM chip",
    },
    pros: [
      "Legendary, unmatched stability: systems can run for years without rebooting",
      "100% community-owned and governed by the Debian Social Contract",
      "Over 60,000 pre-compiled packages in official repositories",
      "Runs on almost every architecture on Earth, from Raspberry Pis to mainframes",
    ],
    cons: [
      "Software versions in Debian Stable are typically 1 to 2 years behind upstream",
      "Installer is functional and thorough, but less polished than Mint or Ubuntu",
      "Not suited for brand-new gaming hardware needing latest kernel versions",
    ],
    tradeoffs:
      "You trade having the latest software versions for absolute, mathematically proven system stability.",
    idealFor: ["Home servers & NAS", "Critical workstations", "Older computers", "Free software advocates"],
    maintenanceLevel: "Zero / Low",
    officialSite: "https://www.debian.org",
    lastVerified: "2026-10-31",
    sources: ["https://www.debian.org/intro/about"],
  },
  {
    id: "arch",
    slug: "arch-linux",
    name: "Arch Linux",
    tagline: "A lightweight, flexible, rolling-release distribution for tinkerers.",
    basedOn: "Independent",
    defaultDesktop: "None (You choose and install your own)",
    availableDesktops: ["KDE Plasma", "GNOME", "Hyprland", "i3", "Sway", "Any"],
    packageManager: "pacman",
    packageFormat: ".pkg.tar.zst",
    releaseModel: "Rolling Release",
    beginnerFriendly: false,
    targetAudience: "Enthusiasts, computer science students, and users wanting total bespoke control.",
    hardwareRequirements: {
      minRam: "1 GB (base system)",
      recRam: "8 GB - 16 GB",
      minDisk: "10 GB",
      recDisk: "50 GB SSD",
      cpu: "x86-64-v2 or higher processor",
    },
    pros: [
      "The Arch User Repository (AUR) has literally every piece of Linux software ever made",
      "True rolling release: install once and receive continuous daily updates forever",
      "Zero bloat: only software you explicitly install exists on your computer",
      "The ArchWiki is universally celebrated as the greatest Linux documentation in existence",
    ],
    cons: [
      "Installed from a command-line interface (no simple 'Next, Next, Finish' installer)",
      "Requires reading Arch news before major system updates to check for manual interventions",
      "Easy for a beginner to break if updating blindly without understanding packages",
    ],
    tradeoffs:
      "You achieve ultimate control, software freshness, and deep Linux knowledge, but you become your own system administrator.",
    idealFor: ["Linux enthusiasts", "Gamers wanting newest GPU drivers", "Minimalists", "Advanced developers"],
    maintenanceLevel: "High",
    officialSite: "https://archlinux.org",
    lastVerified: "2026-10-31",
    sources: ["https://wiki.archlinux.org"],
  },
  {
    id: "zorin",
    slug: "zorin-os",
    name: "Zorin OS",
    tagline: "Designed specifically to make your computer faster, more powerful, and secure.",
    basedOn: "Ubuntu LTS",
    defaultDesktop: "Zorin Desktop (Custom GNOME)",
    availableDesktops: ["Zorin Desktop (Windows/Mac layouts)", "Xfce (Lite)"],
    packageManager: "apt / Flatpak / snap",
    packageFormat: ".deb / Flatpak / Snap",
    releaseModel: "Point Release",
    beginnerFriendly: true,
    targetAudience: "Windows 10/11 and macOS migrants wanting a high-polish, drop-in replacement.",
    hardwareRequirements: {
      minRam: "2 GB",
      recRam: "4 GB - 8 GB",
      minDisk: "20 GB",
      recDisk: "40 GB SSD",
      cpu: "1 GHz dual-core processor",
    },
    pros: [
      "Zorin Appearance lets you switch the desktop to look identical to Windows 11, Windows Classic, or macOS with 1 click",
      "Built-in Windows App Support: detects double-clicked `.exe` files and automatically configures Wine",
      "Exceptional visual polish with smooth dark mode, fractional scaling, and accent colors",
      "Zorin Connect integrates seamlessly with your Android smartphone",
    ],
    cons: [
      "Offers a paid 'Pro' tier for extra desktop layouts (though core OS is 100% free and open)",
      "Updates on Ubuntu LTS cadence, meaning slower access to brand new kernel features",
      "Less suited for users wanting a lightweight minimal installation",
    ],
    tradeoffs:
      "You get the highest visual transition polish for Windows migrants, built on a dependable Ubuntu foundation.",
    idealFor: ["Windows 10/11 switchers", "Older laptops needing modernization", "Schools and offices", "Everyday users"],
    maintenanceLevel: "Zero / Low",
    officialSite: "https://zorin.com/os",
    lastVerified: "2026-10-31",
    sources: ["https://zorin.com/os/help"],
  },
  {
    id: "popos",
    slug: "pop-os",
    name: "Pop!_OS",
    tagline: "Engineered for STEM, makers, creative professionals, and PC gamers.",
    basedOn: "Ubuntu LTS",
    defaultDesktop: "COSMIC Desktop",
    availableDesktops: ["COSMIC Desktop", "GNOME"],
    packageManager: "apt / Flatpak",
    packageFormat: ".deb / Flatpak",
    releaseModel: "Semi-Rolling",
    beginnerFriendly: true,
    targetAudience: "Gamers, creators, STEM professionals, and developers using laptops with NVIDIA graphics.",
    hardwareRequirements: {
      minRam: "4 GB",
      recRam: "8 GB - 16 GB",
      minDisk: "25 GB",
      recDisk: "60 GB NVMe SSD",
      cpu: "64-bit multi-core processor",
    },
    pros: [
      "Dedicated ISO with proprietary NVIDIA drivers pre-installed and pre-configured",
      "Flawless graphics switching on gaming laptops (Integrated, Hybrid, Dedicated, Compute)",
      "Auto-tiling window management built into the top bar with keyboard shortcuts",
      "Flatpak integration enabled by default in the Pop!_Shop software center",
    ],
    cons: [
      "Created primarily to support System76 computers, though freely available for all PCs",
      "Currently transitioning to the Rust-based COSMIC desktop environment",
      "Heavier storage requirement out-of-the-box due to pre-packaged driver libraries",
    ],
    tradeoffs:
      "The best gaming laptop experience with NVIDIA GPUs, but tied to System76's proprietary desktop roadmap.",
    idealFor: ["PC Gamers with NVIDIA GPUs", "Machine learning & AI developers", "Creative professionals (Blender, DaVinci)", "Laptop power users"],
    maintenanceLevel: "Low",
    officialSite: "https://pop.system76.com",
    lastVerified: "2026-10-31",
    sources: ["https://support.system76.com"],
  },
];
