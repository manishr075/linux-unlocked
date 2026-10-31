export interface MigrationStep {
  id: string;
  stepNumber: number;
  title: string;
  category: "Backup" | "Preparation" | "Live USB" | "Installation" | "Post-Install" | "Recovery";
  estimatedMinutes: number;
  destructive: boolean;
  warningNotice?: string;
  summary: string;
  detailedGuide: string[];
  keyCommands?: string[];
  recommendedTools: string[];
}

export const MIGRATION_STEPS: MigrationStep[] = [
  {
    id: "step-01-backup",
    stepNumber: 1,
    title: "Step 1: Secure Your Files (3-2-1 Backup Strategy)",
    category: "Backup",
    estimatedMinutes: 20,
    destructive: false,
    summary: "Before modifying any partition tables, copy all personal documents, photos, and browser data to an external drive or cloud storage.",
    detailedGuide: [
      "Follow the 3-2-1 rule: Maintain 3 copies of your data, across 2 different media types, with 1 copy off-site (cloud).",
      "Copy your `C:\\Users\\<Username>` folders: Documents, Pictures, Music, Videos, Downloads, and Desktop to an external USB hard drive.",
      "Export your web browser bookmarks and password vaults (Bitwarden, 1Password, or CSV export).",
      "Back up game save files (especially titles that do not use Steam Cloud sync).",
      "Unplug your external backup drive from the computer before proceeding to avoid accidental format selection.",
    ],
    recommendedTools: ["External USB SSD / HDD", "Cloud Storage (Google Drive, OneDrive)", "Bitwarden Password Manager"],
  },
  {
    id: "step-02-live-usb",
    stepNumber: 2,
    title: "Step 2: Create a Bootable Live USB Drive",
    category: "Live USB",
    estimatedMinutes: 15,
    destructive: false,
    summary: "Download your chosen Linux distribution ISO, verify its SHA256 checksum, and flash it onto an empty 8GB+ USB thumb drive.",
    detailedGuide: [
      "Download the official 64-bit ISO image from your chosen distribution's website (e.g. Linux Mint Cinnamon or Fedora Workstation).",
      "Verify the ISO checksum: On Windows PowerShell, run `Get-FileHash -Algorithm SHA256 .\\linux-image.iso` to ensure the download is authentic and uncorrupted.",
      "Download a trusted, open-source flashing tool like Ventoy or BalenaEtcher.",
      "Insert an empty 8GB or larger USB flash drive. Note that flashing will erase the USB drive itself.",
      "Flash the ISO image to the USB drive and wait for verification to complete.",
    ],
    keyCommands: ["Get-FileHash -Algorithm SHA256 .\\linux-image.iso"],
    recommendedTools: ["Ventoy (Recommended: lets you drag-and-drop multiple ISOs)", "BalenaEtcher", "Rufus"],
  },
  {
    id: "step-03-uefi-fastboot",
    stepNumber: 3,
    title: "Step 3: Disable Windows Fast Startup & BitLocker Check",
    category: "Preparation",
    estimatedMinutes: 10,
    destructive: false,
    summary: "Windows 'Fast Startup' leaves NTFS hard drives in a semi-hibernated, locked state that prevents Linux from accessing partitions safely.",
    detailedGuide: [
      "In Windows, open Control Panel -> Hardware and Sound -> Power Options -> 'Choose what the power buttons do'.",
      "Click 'Change settings that are currently unavailable', then uncheck 'Turn on fast startup (recommended)' and click Save.",
      "If you plan to dual-boot alongside Windows with BitLocker enabled: back up your 48-digit BitLocker Recovery Key to your Microsoft account or write it down.",
      "Reboot your computer and enter your UEFI/BIOS menu (commonly F2, F12, Del, or Esc).",
      "Ensure SATA/NVMe controller mode is set to 'AHCI / NVMe' (not Intel RST RAID).",
    ],
    recommendedTools: ["Windows Power Options", "Microsoft BitLocker Recovery Portal"],
  },
  {
    id: "step-04-test-drive",
    stepNumber: 4,
    title: "Step 4: Boot the Live USB & 'Test Drive' Your Hardware",
    category: "Live USB",
    estimatedMinutes: 15,
    destructive: false,
    summary: "Experience Linux running entirely in your computer's RAM without writing a single byte to your hard drive.",
    detailedGuide: [
      "Plug in your Live USB and power on your computer while tapping your Boot Menu key (F12 on Dell/Lenovo, F9 on HP, F11 on MSI).",
      "Select your UEFI USB drive from the boot list.",
      "Choose 'Start Linux' from the boot menu. The desktop will load within 30 seconds.",
      "Test your physical hardware in the live session: Connect to Wi-Fi, open YouTube to test audio and video playback, test screen brightness and touchpad gestures.",
      "If everything works smoothly in the live session, it is guaranteed to work when installed!",
    ],
    recommendedTools: ["Live USB Desktop Session", "Built-in Browser & Settings"],
  },
  {
    id: "step-05-install",
    stepNumber: 5,
    title: "Step 5: Installation Strategy (Dual-Boot vs. Full Install)",
    category: "Installation",
    estimatedMinutes: 25,
    destructive: true,
    warningNotice:
      "CRITICAL: Choosing 'Erase disk and install Linux' permanently erases all existing Windows installations, partitions, and personal files. Ensure Step 1 (Backup) is 100% complete!",
    summary: "Choose whether to install Linux alongside Windows (Dual-Boot) or dedicate your entire computer to Linux.",
    detailedGuide: [
      "Double-click the 'Install Linux' shortcut on the Live desktop.",
      "Select your language, keyboard layout, and check 'Install multimedia codecs and third-party drivers'.",
      "Installation Type Selection:",
      "Option A (Dual-Boot): Choose 'Install alongside Windows Boot Manager'. The installer safely shrinks your Windows partition and allocates free space for Linux.",
      "Option B (Dedicated Linux): Choose 'Erase disk and install Linux' to turn your machine into a pure, clean Linux workstation.",
      "Create your username and a strong login password (you will use this for `sudo`).",
      "Click 'Install Now' and let the installer copy files (typically 5 to 15 minutes). When finished, restart and remove the USB drive.",
    ],
    recommendedTools: ["Distribution Calamares / Ubiquity Installer", "GParted Partition Editor"],
  },
  {
    id: "step-06-post-install",
    stepNumber: 6,
    title: "Step 6: First Boot & Post-Installation Essentials",
    category: "Post-Install",
    estimatedMinutes: 15,
    destructive: false,
    summary: "Run your first system update, enable the built-in firewall, and configure automated system restore snapshots.",
    detailedGuide: [
      "Boot into your new Linux installation and log in.",
      "Run system updates: Open your software update manager or run `sudo apt update && sudo apt upgrade -y` (or `sudo dnf upgrade`).",
      "Enable your firewall: Open terminal and type `sudo ufw enable`.",
      "Configure Timeshift (System Restore): Open Timeshift and configure daily or weekly automated Btrfs/RSYNC snapshots. If anything breaks in the future, you can roll back your system in 10 seconds.",
      "Install your favorite software from the Software Center or Flatpak: Firefox, Spotify, Steam, Discord, OnlyOffice, VS Code.",
    ],
    keyCommands: ["sudo apt update && sudo apt upgrade -y", "sudo ufw enable", "sudo ufw status"],
    recommendedTools: ["Timeshift System Restore", "Software Center / Flathub", "UFW Firewall"],
  },
  {
    id: "step-07-recovery",
    stepNumber: 7,
    title: "Step 7: Safety Net & Emergency Recovery Knowledge",
    category: "Recovery",
    estimatedMinutes: 10,
    destructive: false,
    summary: "Keep your Live USB in a drawer as an emergency rescue disk and know how to repair bootloaders.",
    detailedGuide: [
      "Never throw away or overwrite your Live USB. It is a complete portable rescue OS that can boot any PC to recover files or repair broken bootloaders.",
      "If Windows updates ever hide the GRUB boot menu on a dual-boot setup: Boot into UEFI/BIOS and set 'Linux Boot Manager' / 'GRUB' as Boot Priority #1.",
      "If a graphics driver update fails: You can select 'Advanced Options for Linux' -> 'Recovery Mode' from the boot screen to roll back or repair drivers.",
      "Remember: Linux does not crash randomly. Almost all issues can be diagnosed and fixed using system logs in `/var/log/` and `journalctl -xe`.",
    ],
    keyCommands: ["journalctl -xe", "sudo boot-repair"],
    recommendedTools: ["Live USB Rescue Disk", "Boot-Repair Utility", "Timeshift"],
  },
];
