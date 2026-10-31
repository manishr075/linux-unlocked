/* ============================================================
   LINUX UNLOCKED — Distro Explorer (Module G)
   ------------------------------------------------------------
   Features:
     - 7 Tier-1 Linux Distributions (Mint, Ubuntu, Fedora, Debian, Arch, Zorin, Pop!_OS)
     - Interactive 6-Question Recommendation Quiz
     - Full Side-by-Side Comparison Matrix
     - Detailed Deep-Dive Hardware Specs & Trade-Offs
   ============================================================ */

import { useState } from "react";
import { DISTROS_DATA, type DistroData } from "@/content/distrosData";
import { DistroQuiz } from "@/components/distros/DistroQuiz";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import {
  Compass,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Laptop,
  Search,
  ArrowRight,
} from "lucide-react";

export function DistrosPage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "matrix" | "cards">("quiz");
  const [selectedDistro, setSelectedDistro] = useState<DistroData | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  const filteredDistros = DISTROS_DATA.filter((d) => {
    const q = searchFilter.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.defaultDesktop.toLowerCase().includes(q) ||
      d.packageFormat.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Pill tone="cyan" className="mb-4">
          Module G • Distribution Explorer
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Find Your Linux Distribution.
        </h1>
        <p className="mt-3 text-base text-ink-secondary md:text-lg">
          There is no single "best" Linux — only the distribution that best aligns with your hardware,
          workflows, and update expectations. Explore the 7 tier-1 distributions or take the guided quiz.
        </p>

        {/* View Switcher Tabs */}
        <div className="mt-8 inline-flex rounded-xl border border-line-subtle bg-surface/70 p-1.5 backdrop-blur-glass">
          <button
            onClick={() => {
              setActiveTab("quiz");
              setSelectedDistro(null);
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "quiz"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Sparkles size={16} /> Recommendation Quiz
          </button>
          <button
            onClick={() => {
              setActiveTab("matrix");
              setSelectedDistro(null);
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "matrix"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Layers size={16} /> Comparison Matrix
          </button>
          <button
            onClick={() => {
              setActiveTab("cards");
              setSelectedDistro(null);
            }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "cards"
                ? "bg-cyan text-void font-bold shadow-glow"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            <Compass size={16} /> All 7 Distributions
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="mt-12">
        {activeTab === "quiz" && (
          <DistroQuiz
            onSelectDistro={(slug) => {
              const d = DISTROS_DATA.find((item) => item.slug === slug);
              if (d) {
                setSelectedDistro(d);
                setActiveTab("cards");
              }
            }}
          />
        )}

        {activeTab === "matrix" && (
          /* Side-by-Side Comparison Matrix */
          <div className="animate-fadeIn space-y-6">
            <div className="overflow-x-auto rounded-2xl border border-line-subtle bg-base/80 backdrop-blur-md">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-line-subtle bg-surface/80">
                    <th className="p-4 font-bold text-ink-primary">Distribution</th>
                    <th className="p-4 font-bold text-ink-primary">Base Lineage</th>
                    <th className="p-4 font-bold text-ink-primary">Default Desktop</th>
                    <th className="p-4 font-bold text-ink-primary">Package Manager</th>
                    <th className="p-4 font-bold text-ink-primary">Release Model</th>
                    <th className="p-4 font-bold text-ink-primary">Beginner Friendly?</th>
                    <th className="p-4 font-bold text-ink-primary">Min RAM</th>
                    <th className="p-4 font-bold text-ink-primary">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle font-mono text-xs">
                  {DISTROS_DATA.map((distro) => (
                    <tr
                      key={distro.id}
                      className="hover:bg-surface/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDistro(distro);
                        setActiveTab("cards");
                      }}
                    >
                      <td className="p-4 font-sans font-bold text-ink-primary">
                        <span className="text-cyan hover:underline">{distro.name}</span>
                      </td>
                      <td className="p-4 text-ink-secondary">{distro.basedOn || "Independent"}</td>
                      <td className="p-4 text-ink-primary font-semibold">{distro.defaultDesktop}</td>
                      <td className="p-4 text-cyan">{distro.packageManager}</td>
                      <td className="p-4 text-ink-secondary">{distro.releaseModel}</td>
                      <td className="p-4">
                        {distro.beginnerFriendly ? (
                          <span className="inline-flex items-center gap-1 text-success font-semibold">
                            <CheckCircle2 size={14} /> Yes
                          </span>
                        ) : (
                          <span className="text-ink-muted">Intermediate</span>
                        )}
                      </td>
                      <td className="p-4 text-ink-secondary">{distro.hardwareRequirements.minRam}</td>
                      <td className="p-4 text-ink-muted">{distro.maintenanceLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-muted text-center">
              Click any distribution row to view full specifications, hardware minimums, and honest trade-offs.
            </p>
          </div>
        )}

        {activeTab === "cards" && (
          /* Cards Catalog View */
          <div className="animate-fadeIn space-y-8">
            {/* Search filter */}
            <div className="max-w-md mx-auto relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
              />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by name, desktop, or packaging..."
                className="w-full rounded-xl border border-line-subtle bg-void py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder-ink-muted focus:border-cyan focus:outline-none"
              />
            </div>

            {/* If a specific distro is selected for deep dive */}
            {selectedDistro ? (
              <GlassPanel className="p-8 md:p-12 border-2 border-cyan shadow-glow">
                <button
                  onClick={() => setSelectedDistro(null)}
                  className="mb-4 text-xs font-semibold text-cyan hover:underline inline-flex items-center gap-1"
                >
                  ← Back to all distributions
                </button>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-subtle pb-6">
                  <div>
                    <span className="font-mono text-xs uppercase font-bold text-cyan">
                      {selectedDistro.basedOn ? `Based on ${selectedDistro.basedOn}` : "Independent Core"}
                    </span>
                    <h2 className="text-3xl font-extrabold text-ink-primary md:text-5xl mt-1">
                      {selectedDistro.name}
                    </h2>
                    <p className="mt-2 text-base text-ink-secondary">
                      {selectedDistro.tagline}
                    </p>
                  </div>
                  <a
                    href={selectedDistro.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast ease-soft bg-cyan text-ink-onAccent hover:brightness-110 shadow-glow rounded-lg text-base px-6 py-3"
                  >
                    Official Download Site <ExternalLink size={16} />
                  </a>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-2">
                  {/* Pros */}
                  <div className="rounded-xl border border-line-subtle bg-base/50 p-6">
                    <h3 className="flex items-center gap-2 font-bold text-success text-base mb-4">
                      <CheckCircle2 size={18} /> Major Strengths
                    </h3>
                    <ul className="space-y-2.5 text-xs text-ink-secondary">
                      {selectedDistro.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success font-bold">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons & Tradeoffs */}
                  <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
                    <h3 className="flex items-center gap-2 font-bold text-warning text-base mb-4">
                      <AlertTriangle size={18} /> Honest Trade-offs to Know
                    </h3>
                    <p className="text-xs text-ink-secondary mb-4 italic leading-relaxed">
                      "{selectedDistro.tradeoffs}"
                    </p>
                    <ul className="space-y-2.5 text-xs text-ink-secondary">
                      {selectedDistro.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning font-bold">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Hardware Requirements Grid */}
                <div className="mt-8 rounded-xl border border-line-subtle bg-surface/60 p-6">
                  <h4 className="font-bold text-sm text-ink-primary mb-4 flex items-center gap-2">
                    <Laptop size={18} className="text-cyan" /> Hardware Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-xs">
                    <div>
                      <p className="text-ink-muted">Minimum RAM:</p>
                      <p className="font-bold text-ink-primary mt-0.5">{selectedDistro.hardwareRequirements.minRam}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Recommended RAM:</p>
                      <p className="font-bold text-cyan mt-0.5">{selectedDistro.hardwareRequirements.recRam}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Minimum Disk:</p>
                      <p className="font-bold text-ink-primary mt-0.5">{selectedDistro.hardwareRequirements.minDisk}</p>
                    </div>
                    <div>
                      <p className="text-ink-muted">Target Architecture:</p>
                      <p className="font-bold text-ink-primary mt-0.5">{selectedDistro.hardwareRequirements.cpu}</p>
                    </div>
                  </div>
                </div>
              </GlassPanel>
            ) : (
              /* Grid of all distros */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDistros.map((distro) => (
                  <Card
                    key={distro.id}
                    glass
                    hover
                    className="flex flex-col justify-between cursor-pointer"
                    onClick={() => setSelectedDistro(distro)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
                          {distro.packageFormat}
                        </span>
                        {distro.beginnerFriendly && (
                          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                            Beginner Friendly
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-ink-primary group-hover:text-cyan transition-colors">
                        {distro.name}
                      </h3>
                      <p className="mt-1 text-xs text-ink-secondary">
                        {distro.tagline}
                      </p>

                      <div className="mt-4 space-y-1.5 text-xs text-ink-muted border-t border-line-subtle pt-3">
                        <p><strong className="text-ink-secondary">Desktop:</strong> {distro.defaultDesktop}</p>
                        <p><strong className="text-ink-secondary">Package Manager:</strong> {distro.packageManager}</p>
                        <p><strong className="text-ink-secondary">Release:</strong> {distro.releaseModel}</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-line-subtle flex items-center justify-between text-xs">
                      <span className="text-ink-muted">Rec: {distro.hardwareRequirements.recRam} RAM</span>
                      <span className="font-semibold text-cyan inline-flex items-center gap-1 hover:underline">
                        Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
