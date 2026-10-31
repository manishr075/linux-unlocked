export type AppCategory =
  | "office"
  | "development"
  | "design"
  | "video-editing"
  | "gaming"
  | "browsing"
  | "communication"
  | "productivity"
  | "education";

export type AppStatus = "native" | "alternative" | "workaround" | "blocker";

export interface AppCompatibilityItem {
  id: string;
  name: string;
  category: AppCategory;
  categoryLabel: string;
  status: AppStatus;
  statusLabel: string;
  linuxNativeAvailable: boolean;
  recommendedAlternative?: string;
  compatibilityMethod: string;
  notes: string;
  lastVerified: string;
}

export const APPS_DATABASE: AppCompatibilityItem[] = [
  // Office
  {
    id: "app-msoffice",
    name: "Microsoft 365 / Microsoft Office",
    category: "office",
    categoryLabel: "Office & Documents",
    status: "alternative",
    statusLabel: "Use Alternatives or Web",
    linuxNativeAvailable: false,
    recommendedAlternative: "OnlyOffice Desktop / LibreOffice / Office Online",
    compatibilityMethod: "OnlyOffice provides 100% DOCX format fidelity; Office 365 web version works in browser.",
    notes: "Native Windows desktop installer does not run under Wine due to telemetry and modern licensing DRM. OnlyOffice and LibreOffice open, edit, and save DOCX/XLSX natively.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-onlyoffice",
    name: "OnlyOffice Desktop Editors",
    category: "office",
    categoryLabel: "Office & Documents",
    status: "native",
    statusLabel: "Native Linux Application",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Flatpak / .deb / .rpm package",
    notes: "Exceptional Microsoft Office formatting compatibility. Clean modern interface with tabs.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-libreoffice",
    name: "LibreOffice",
    category: "office",
    categoryLabel: "Office & Documents",
    status: "native",
    statusLabel: "Native Linux Application",
    linuxNativeAvailable: true,
    compatibilityMethod: "Included by default on almost all distributions",
    notes: "The flagship open-source office suite. Powerful spreadsheet macro support and PDF form editing.",
    lastVerified: "2026-10-31",
  },

  // Design
  {
    id: "app-photoshop",
    name: "Adobe Photoshop",
    category: "design",
    categoryLabel: "Design & Photo",
    status: "alternative",
    statusLabel: "Use Alternatives",
    linuxNativeAvailable: false,
    recommendedAlternative: "Krita / GIMP 3.0 / Photopea Web",
    compatibilityMethod: "Krita for digital painting and raster art; GIMP for photo retouching.",
    notes: "Adobe Creative Cloud desktop application is a known blocker on Linux due to Windows registry hooks. GIMP and Krita open PSD files natively.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-figma",
    name: "Figma",
    category: "design",
    categoryLabel: "Design & Photo",
    status: "native",
    statusLabel: "Native Desktop & Web",
    linuxNativeAvailable: true,
    compatibilityMethod: "Browser / Flatpak (Figma-Linux wrapper)",
    notes: "Figma runs with full performance in Firefox and Chromium with local font integration via font daemons.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-blender",
    name: "Blender 3D",
    category: "design",
    categoryLabel: "Design & 3D",
    status: "native",
    statusLabel: "Tier-1 Native Linux First",
    linuxNativeAvailable: true,
    compatibilityMethod: "Official native binary / Steam / Flatpak",
    notes: "Blender is developed natively on Linux. Often benchmarks 5-15% faster rendering on Linux compared to Windows!",
    lastVerified: "2026-10-31",
  },

  // Video Editing
  {
    id: "app-davinci",
    name: "DaVinci Resolve",
    category: "video-editing",
    categoryLabel: "Video & Audio",
    status: "native",
    statusLabel: "Native Linux Application",
    linuxNativeAvailable: true,
    compatibilityMethod: "Official installer from Blackmagic Design",
    notes: "Hollywood-grade video editing and color grading. Requires proprietary GPU drivers (NVIDIA CUDA or AMD ROCm).",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-kdenlive",
    name: "Kdenlive",
    category: "video-editing",
    categoryLabel: "Video & Audio",
    status: "native",
    statusLabel: "Native Open Source",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Flatpak / AppImage / Repo",
    notes: "Free, multi-track video editor powered by the MLT framework. Supports 4K editing and hardware encoding.",
    lastVerified: "2026-10-31",
  },

  // Gaming
  {
    id: "app-steam",
    name: "Steam & Proton",
    category: "gaming",
    categoryLabel: "PC Gaming",
    status: "native",
    statusLabel: "Native Linux Platform",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Linux Steam client with Proton compatibility layer",
    notes: "Valve's Proton translation layer runs over 15,000+ Windows Steam games seamlessly with near-identical FPS.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-valorant",
    name: "Valorant / Riot Games",
    category: "gaming",
    categoryLabel: "PC Gaming",
    status: "blocker",
    statusLabel: "Known Hard Blocker",
    linuxNativeAvailable: false,
    compatibilityMethod: "Dual-boot Windows or play compatible alternatives (CS2, Apex)",
    notes: "Requires Riot Vanguard kernel-level Windows driver (Ring 0 driver) that monitors Windows memory structures. Does not and will not run under Wine/Proton.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-epic-heroic",
    name: "Epic Games / GOG (Heroic Games Launcher)",
    category: "gaming",
    categoryLabel: "PC Gaming",
    status: "native",
    statusLabel: "Native Linux Client",
    linuxNativeAvailable: true,
    compatibilityMethod: "Heroic Games Launcher (Flatpak)",
    notes: "Native open-source launcher that downloads and launches your Epic and GOG games using Proton and Wine-GE.",
    lastVerified: "2026-10-31",
  },

  // Development
  {
    id: "app-vscode",
    name: "Visual Studio Code",
    category: "development",
    categoryLabel: "Development",
    status: "native",
    statusLabel: "Native Linux Application",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native .deb / .rpm / Flatpak or open-source VSCodium",
    notes: "First-class Linux support directly from Microsoft. Full extension marketplace and debugging support.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-docker",
    name: "Docker & Podman",
    category: "development",
    categoryLabel: "Development",
    status: "native",
    statusLabel: "Native Linux Kernel Core",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Linux daemon / Rootless Podman",
    notes: "Linux is the native home of containers. Zero virtualization VM overhead; runs at bare-metal speeds.",
    lastVerified: "2026-10-31",
  },

  // Communication & Browsing
  {
    id: "app-chrome",
    name: "Google Chrome / Firefox / Brave",
    category: "browsing",
    categoryLabel: "Web Browsing",
    status: "native",
    statusLabel: "Native Linux Application",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Linux packages with hardware video acceleration",
    notes: "Chrome, Firefox, Brave, and Edge all maintain official, native 64-bit Linux builds with full sync.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-discord",
    name: "Discord",
    category: "communication",
    categoryLabel: "Communication",
    status: "native",
    statusLabel: "Native Linux Client",
    linuxNativeAvailable: true,
    compatibilityMethod: "Native Flatpak / .deb package (or Vesktop for Wayland screen sharing)",
    notes: "Vesktop community client recommended on modern Wayland desktops for full audio and screen sharing.",
    lastVerified: "2026-10-31",
  },
  {
    id: "app-spotify",
    name: "Spotify",
    category: "communication",
    categoryLabel: "Media & Streaming",
    status: "native",
    statusLabel: "Official Native Client",
    linuxNativeAvailable: true,
    compatibilityMethod: "Official Flatpak / Snap from Spotify",
    notes: "Full desktop client with local media playback and media keys integration.",
    lastVerified: "2026-10-31",
  },
];
