/* ============================================================
   LINUX UNLOCKED — Compatibility Checker (Modules H & I)
   ------------------------------------------------------------
   Features:
     - Ethical UX: Honest user-driven query, zero fake scanning
     - Hardware Compatibility (Laptops, Wi-Fi, GPUs, Webcams, etc.)
     - Windows Application Compatibility (Native, Alternative, Blocker)
     - Sourced evidence, confidence ratings, and verification dates
   ============================================================ */

import { useState } from "react";
import { HARDWARE_DATABASE } from "@/content/hardwareData";
import { APPS_DATABASE, type AppStatus } from "@/content/appsData";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  Laptop,
  Search,
  ExternalLink,
  Package,
  Info,
} from "lucide-react";

export function CompatibilityPage() {
  const [activeTab, setActiveTab] = useState<"hardware" | "apps">("hardware");
  const [searchQuery, setSearchQuery] = useState("");
  const [hardwareCategory, setHardwareCategory] = useState("all");
  const [appStatusFilter, setAppStatusFilter] = useState<AppStatus | "all">("all");

  // Filtered hardware
  const filteredHardware = HARDWARE_DATABASE.filter((hw) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      hw.name.toLowerCase().includes(q) ||
      hw.componentType.toLowerCase().includes(q) ||
      hw.notes.toLowerCase().includes(q);
    const matchesCategory =
      hardwareCategory === "all" || hw.category === hardwareCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered apps
  const filteredApps = APPS_DATABASE.filter((app) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      app.name.toLowerCase().includes(q) ||
      app.categoryLabel.toLowerCase().includes(q) ||
      app.notes.toLowerCase().includes(q) ||
      (app.recommendedAlternative && app.recommendedAlternative.toLowerCase().includes(q));
    const matchesStatus =
      appStatusFilter === "all" || app.status === appStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Pill tone="cyan" className="mb-4">
          Modules H & I • Sourced Compatibility
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Check Your Hardware & Software.
        </h1>
        <p className="mt-3 text-base text-ink-secondary md:text-lg">
          Get verified, evidence-backed answers on laptop components, Wi-Fi cards, graphics drivers,
          and Windows software before changing a single file on your computer.
        </p>

        {/* Ethical Transparency Banner */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-line-subtle bg-surface/70 p-4 text-left text-xs text-ink-secondary backdrop-blur-glass">
          <Info size={18} className="text-cyan shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink-primary font-semibold">Honest Computing Notice:</strong>{" "}
            Web browsers cannot and should not scan your motherboard, PCI buses, or firmware for security reasons.
            Instead of pretending to scan your computer, we provide a search engine backed by verified kernel telemetry,
            official distribution certification programs, and upstream maintainers.
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 inline-flex rounded-xl border border-line-subtle bg-surface/70 p-1.5 backdrop-blur-glass">
          <button
            onClick={() => {
              setActiveTab("hardware");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === "hardware"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Laptop size={16} /> Hardware Compatibility
          </button>
          <button
            onClick={() => {
              setActiveTab("apps");
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === "apps"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Package size={16} /> Windows Applications Matrix
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-12 space-y-8 animate-fadeIn">
        {/* Search & Filter Bar */}
        <GlassPanel className="p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === "hardware"
                    ? "Search laptop model (ThinkPad, XPS, Framework), Wi-Fi chip, or GPU..."
                    : "Search Windows app (Photoshop, Office, Valorant, DaVinci, Steam)..."
                }
                className="w-full rounded-xl border border-line-subtle bg-void py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder-ink-muted focus:border-cyan focus:outline-none"
              />
            </div>

            {/* Category / Status Selectors */}
            {activeTab === "hardware" ? (
              <select
                value={hardwareCategory}
                onChange={(e) => setHardwareCategory(e.target.value)}
                className="rounded-xl border border-line-subtle bg-void px-3 py-2 text-xs font-semibold text-ink-primary focus:border-cyan focus:outline-none"
                aria-label="Filter hardware by component"
              >
                <option value="all">All Components</option>
                <option value="laptop">Laptops & Systems</option>
                <option value="wifi-bluetooth">Wi-Fi & Bluetooth</option>
                <option value="gpu">Graphics Cards (GPUs)</option>
                <option value="audio">Audio & Sound</option>
                <option value="webcam">Webcams</option>
                <option value="fingerprint">Fingerprint Readers</option>
              </select>
            ) : (
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value as AppStatus | "all")}
                className="rounded-xl border border-line-subtle bg-void px-3 py-2 text-xs font-semibold text-ink-primary focus:border-cyan focus:outline-none"
                aria-label="Filter software by compatibility status"
              >
                <option value="all">All Statuses</option>
                <option value="native">Native Linux Support</option>
                <option value="alternative">Great Alternatives Available</option>
                <option value="blocker">Known Hard Blockers</option>
              </select>
            )}
          </div>
        </GlassPanel>

        {/* Tab 1: Hardware Items List */}
        {activeTab === "hardware" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-ink-muted px-2">
              <span>Showing {filteredHardware.length} verified hardware components</span>
              <span>All evidence verified against Linux kernel standards</span>
            </div>

            <div className="grid gap-4">
              {filteredHardware.map((hw) => {
                const isPlatinum = hw.status === "platinum";
                const isGold = hw.status === "gold";
                const isSilver = hw.status === "silver";

                return (
                  <GlassPanel
                    key={hw.id}
                    className={`p-6 border-l-4 transition-all hover:border-line ${
                      isPlatinum
                        ? "border-l-success"
                        : isGold
                        ? "border-l-cyan"
                        : isSilver
                        ? "border-l-warning"
                        : "border-l-error"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan">
                            {hw.componentType}
                          </span>
                          <span className="rounded bg-elevated px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                            Min: {hw.kernelVersion}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-ink-primary">
                          {hw.name}
                        </h3>

                        <p className="mt-2 text-xs md:text-sm text-ink-secondary leading-relaxed max-w-3xl">
                          {hw.notes}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono">
                          <span className="rounded border border-line-subtle bg-base px-2.5 py-1 text-ink-secondary">
                            Driver: <strong>{hw.driverRequired}</strong>
                          </span>
                          <span className="rounded border border-line-subtle bg-base px-2.5 py-1 text-ink-secondary">
                            Confidence: <strong>{hw.confidence}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                        <span
                          className={`rounded-full px-3 py-1 font-mono text-xs font-bold border ${
                            isPlatinum
                              ? "bg-success/15 text-success border-success/30"
                              : isGold
                              ? "bg-cyan/15 text-cyan border-cyan/30"
                              : isSilver
                              ? "bg-warning/15 text-warning border-warning/30"
                              : "bg-error/15 text-error border-error/30"
                          }`}
                        >
                          {hw.statusLabel}
                        </span>

                        <a
                          href={hw.evidence}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-cyan hover:underline"
                        >
                          Upstream Evidence <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </GlassPanel>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Windows Software Matrix */}
        {activeTab === "apps" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-ink-muted px-2">
              <span>Showing {filteredApps.length} Windows software profiles</span>
              <span>Categorized by Native, Alternative, and Known Blockers</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredApps.map((app) => {
                const isNative = app.status === "native";
                const isAlternative = app.status === "alternative";
                const isBlocker = app.status === "blocker";

                return (
                  <Card
                    key={app.id}
                    glass
                    className={`flex flex-col justify-between border-t-4 ${
                      isNative
                        ? "border-t-success"
                        : isAlternative
                        ? "border-t-cyan"
                        : isBlocker
                        ? "border-t-error"
                        : "border-t-warning"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                          {app.categoryLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            isNative
                              ? "bg-success/15 text-success"
                              : isAlternative
                              ? "bg-cyan/15 text-cyan"
                              : "bg-error/15 text-error"
                          }`}
                        >
                          {app.statusLabel}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-ink-primary">
                        {app.name}
                      </h3>

                      <p className="mt-2 text-xs text-ink-secondary leading-relaxed">
                        {app.notes}
                      </p>

                      {app.recommendedAlternative && (
                        <div className="mt-3 rounded-lg border border-line-subtle bg-base/60 p-2.5 text-xs">
                          <span className="font-semibold text-cyan block mb-0.5">
                            Recommended Linux Alternative:
                          </span>
                          <span className="text-ink-primary font-medium">
                            {app.recommendedAlternative}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-line-subtle text-[11px] text-ink-muted flex items-center justify-between">
                      <span>Verified: {app.lastVerified}</span>
                      <span className="font-mono">{app.compatibilityMethod}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
