export type HardwareCategory =
  | "laptop"
  | "wifi-bluetooth"
  | "gpu"
  | "audio"
  | "touchpad"
  | "webcam"
  | "printer"
  | "dock-monitors"
  | "sleep-resume"
  | "fingerprint";

export type CompatibilityStatus =
  | "platinum" // Out-of-the-box native
  | "gold"     // Supported with minor driver setup
  | "silver"   // Partial functionality
  | "blocker";  // Known unsupported / requires major hacks

export interface HardwareItem {
  id: string;
  name: string;
  category: HardwareCategory;
  componentType: string;
  status: CompatibilityStatus;
  statusLabel: string;
  confidence: "High (Verified)" | "Medium (Community)" | "Investigation Needed";
  driverRequired: string;
  kernelVersion: string;
  notes: string;
  evidence: string;
  lastVerified: string;
}

export const HARDWARE_DATABASE: HardwareItem[] = [
  // Laptops
  {
    id: "hw-lenovo-t14",
    name: "Lenovo ThinkPad T14 / E14 (AMD & Intel)",
    category: "laptop",
    componentType: "Complete Laptop",
    status: "platinum",
    statusLabel: "Flawless Out-of-the-Box",
    confidence: "High (Verified)",
    driverRequired: "Included in standard Linux kernel",
    kernelVersion: "Linux 5.15+",
    notes: "Lenovo officially certifies and pre-loads Linux on ThinkPads. Keyboard, TrackPoint, Wi-Fi, audio, and sleep work seamlessly.",
    evidence: "https://support.lenovo.com/us/en/solutions/pd031426",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-dell-xps-13",
    name: "Dell XPS 13 (Developer Edition)",
    category: "laptop",
    componentType: "Complete Laptop",
    status: "platinum",
    statusLabel: "Flawless Out-of-the-Box",
    confidence: "High (Verified)",
    driverRequired: "Included in standard Linux kernel",
    kernelVersion: "Linux 6.1+",
    notes: "Dell Developer Edition laptops ship with Ubuntu LTS pre-installed. All hardware certified by Canonical.",
    evidence: "https://ubuntu.com/certified/laptops",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-framework-13",
    name: "Framework Laptop 13 / 16 (Intel Core / AMD Ryzen)",
    category: "laptop",
    componentType: "Modular Laptop",
    status: "platinum",
    statusLabel: "Officially Supported",
    confidence: "High (Verified)",
    driverRequired: "Kernel native",
    kernelVersion: "Linux 6.5+",
    notes: "Framework provides official support guides for Fedora and Ubuntu. All expansion cards and fingerprint reader function cleanly.",
    evidence: "https://frame.work/linux",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-asus-zephyrus",
    name: "ASUS ROG Zephyrus G14 / G16 (NVIDIA Hybrid)",
    category: "laptop",
    componentType: "Gaming Laptop",
    status: "gold",
    statusLabel: "Supported with Driver Package",
    confidence: "High (Verified)",
    driverRequired: "asusctl / supergfxctl / nvidia-dkms",
    kernelVersion: "Linux 6.6+",
    notes: "Requires the community asus-linux.org utilities for RGB keyboard control and fan profiles. Pop!_OS or Fedora recommended for GPU switching.",
    evidence: "https://asus-linux.org",
    lastVerified: "2026-10-31",
  },

  // Wi-Fi & Bluetooth
  {
    id: "hw-intel-ax210",
    name: "Intel Wi-Fi 6E AX200 / AX210 / AX211",
    category: "wifi-bluetooth",
    componentType: "Wireless Network Card",
    status: "platinum",
    statusLabel: "Gold Standard Native",
    confidence: "High (Verified)",
    driverRequired: "iwlwifi (in-tree kernel driver)",
    kernelVersion: "Linux 5.10+",
    notes: "Intel upstream maintainers contribute drivers directly to the Linux kernel. Zero configuration required.",
    evidence: "https://www.intel.com/content/www/us/en/support/articles/000005511/wireless.html",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-realtek-8821ce",
    name: "Realtek RTL8821CE / RTL8852BE",
    category: "wifi-bluetooth",
    componentType: "Wireless Network Card",
    status: "gold",
    statusLabel: "Supported (Kernel or DKMS)",
    confidence: "High (Verified)",
    driverRequired: "rtw88 / rtw89 or rtl8821ce-dkms",
    kernelVersion: "Linux 6.2+",
    notes: "Newer kernels (6.2+) include native rtw88/rtw89 drivers. Older LTS distros may require installing 'rtl8821ce-dkms'.",
    evidence: "https://wireless.wiki.kernel.org/en/users/drivers/rtw88",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-broadcom-bcm4360",
    name: "Broadcom BCM4360 / BCM43142",
    category: "wifi-bluetooth",
    componentType: "Wireless Network Card",
    status: "gold",
    statusLabel: "Requires Driver Checkbox",
    confidence: "High (Verified)",
    driverRequired: "bcmwl-kernel-source / broadcom-sta-dkms",
    kernelVersion: "Any",
    notes: "Requires proprietary firmware. Linux Mint and Ubuntu prompt to install this during setup with one click if connected via Ethernet.",
    evidence: "https://wiki.debian.org/wl",
    lastVerified: "2026-10-31",
  },

  // GPUs
  {
    id: "hw-nvidia-rtx40",
    name: "NVIDIA GeForce RTX 30 / 40 Series",
    category: "gpu",
    componentType: "Dedicated GPU",
    status: "gold",
    statusLabel: "Supported with Driver Install",
    confidence: "High (Verified)",
    driverRequired: "nvidia-driver-550+ / nvidia-open kernel module",
    kernelVersion: "Linux 6.5+",
    notes: "Use your distribution's driver manager or Pop!_OS NVIDIA ISO. NVIDIA now releases open-source GPU kernel modules (open-gpu-kernel-modules). Wayland works with driver 555+.",
    evidence: "https://github.com/NVIDIA/open-gpu-kernel-modules",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-amd-rad-rdna3",
    name: "AMD Radeon RX 6000 / 7000 Series (RDNA 2/3)",
    category: "gpu",
    componentType: "Dedicated GPU",
    status: "platinum",
    statusLabel: "Flawless Out-of-the-Box",
    confidence: "High (Verified)",
    driverRequired: "amdgpu + Mesa RADV (In-tree)",
    kernelVersion: "Linux 6.0+",
    notes: "AMD maintains first-class open-source kernel drivers (`amdgpu`). Zero proprietary blobs to install. Exceptional Wayland and Vulkan performance.",
    evidence: "https://www.mesa3d.org",
    lastVerified: "2026-10-31",
  },

  // Audio, Sleep & Webcams
  {
    id: "hw-pipewire-sound",
    name: "Realtek / Intel High Definition Audio",
    category: "audio",
    componentType: "Sound Card & Codec",
    status: "platinum",
    statusLabel: "Native PipeWire Support",
    confidence: "High (Verified)",
    driverRequired: "snd_hda_intel + PipeWire",
    kernelVersion: "Linux 5.4+",
    notes: "Supported by modern PipeWire and ALSA audio stacks out of the box with Bluetooth LDAC and AptX codecs.",
    evidence: "https://pipewire.org",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-mipi-webcam",
    name: "Intel IPU6 MIPI Webcams (Ultra-thin Laptops)",
    category: "webcam",
    componentType: "Camera Sensor",
    status: "silver",
    statusLabel: "Partial / Distro Specific",
    confidence: "Medium (Community)",
    driverRequired: "intel-ipu6-dkms + v4l2loopback",
    kernelVersion: "Linux 6.8+",
    notes: "Standard USB (UVC) webcams work 100% natively. Certain ultra-thin 2023-2024 laptops using Intel IPU6 cameras require proprietary firmware packages.",
    evidence: "https://github.com/intel/ipu6-drivers",
    lastVerified: "2026-10-31",
  },
  {
    id: "hw-fingerprint-goodix",
    name: "Goodix / Validity Fingerprint Readers",
    category: "fingerprint",
    componentType: "Biometric Sensor",
    status: "silver",
    statusLabel: "Model Dependent",
    confidence: "Medium (Community)",
    driverRequired: "libfprint / fprintd",
    kernelVersion: "Linux 5.15+",
    notes: "Supported models work with `fprintd-enroll` for login. Proprietary Goodix SPI sensors in some consumer laptops lack Linux firmware.",
    evidence: "https://fprint.freedesktop.org/supported-devices.html",
    lastVerified: "2026-10-31",
  },
];
