/* ============================================================
   LINUX UNLOCKED — Migration Planner (Module J)
   ------------------------------------------------------------
   A personalized, safety-first switching assistant.
   Features:
     - 4-Point Pre-Migration Readiness Self-Audit
     - 7 Step-by-Step Guides (Backup -> Live USB -> Dual Boot -> Post-Install)
     - Strict Safeguards & Warning Modals on Destructive Disk Operations
     - Browser LocalStorage Checklist Persistence
   ============================================================ */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MIGRATION_STEPS, type MigrationStep } from "@/content/migrationData";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  ShieldAlert,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from "lucide-react";

export function MigratePage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("linux_unlocked_migration_checklist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedStepId, setExpandedStepId] = useState<string>(MIGRATION_STEPS[0].id);
  const [dangerModalStep, setDangerModalStep] = useState<MigrationStep | null>(null);
  const [dangerConfirmed, setDangerConfirmed] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Self-Audit Checkbox state
  const [auditChecks, setAuditChecks] = useState({
    filesBackedUp: false,
    criticalAppsChecked: false,
    hardwareVerified: false,
    bitlockerKeySaved: false,
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "linux_unlocked_migration_checklist",
        JSON.stringify(completedSteps)
      );
    } catch {
      // ignore
    }
  }, [completedSteps]);

  const toggleStepCompleted = (step: MigrationStep) => {
    // If destructive and not already completed, show modal first!
    if (step.destructive && !completedSteps.includes(step.id)) {
      setDangerModalStep(step);
      setDangerConfirmed(false);
      return;
    }

    setCompletedSteps((prev) =>
      prev.includes(step.id) ? prev.filter((id) => id !== step.id) : [...prev, step.id]
    );
  };

  const confirmDestructiveStep = () => {
    if (!dangerModalStep) return;
    setCompletedSteps((prev) => [...prev, dangerModalStep.id]);
    setDangerModalStep(null);
  };

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const resetChecklist = () => {
    setCompletedSteps([]);
    try {
      localStorage.removeItem("linux_unlocked_migration_checklist");
    } catch {
      // ignore
    }
  };

  const progressPercent = Math.round(
    (completedSteps.length / MIGRATION_STEPS.length) * 100
  );

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Pill tone="cyan" className="mb-4">
          Module J • Migration Assistant
        </Pill>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Windows to Linux Migration Planner.
        </h1>
        <p className="mt-3 text-base text-ink-secondary md:text-lg">
          A step-by-step, safety-first roadmap to switch from Windows to Linux with zero data loss.
          Test your hardware in RAM, preserve backups, and set up your system with confidence.
        </p>

        {/* Overall Progress HUD */}
        <div className="mt-8 rounded-2xl border border-line-subtle bg-surface/70 p-6 backdrop-blur-glass">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <span className="font-mono text-xs uppercase text-ink-muted">
                Migration Readiness
              </span>
              <p className="text-2xl font-extrabold text-ink-primary">
                {completedSteps.length} of {MIGRATION_STEPS.length} Steps Complete ({progressPercent}%)
              </p>
            </div>
            {completedSteps.length > 0 && (
              <button
                onClick={resetChecklist}
                className="text-xs text-ink-muted hover:text-warning inline-flex items-center gap-1 transition-colors"
              >
                <RotateCcw size={13} /> Reset Checklist
              </button>
            )}
          </div>

          <div className="h-2 w-full rounded-full bg-void overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan to-electric transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        {/* Left Column: 4-Point Pre-Migration Self Audit */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel className="p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-line-subtle pb-3">
              <ShieldAlert className="text-cyan" size={20} />
              <h3 className="font-bold text-base text-ink-primary">
                Pre-Migration Audit
              </h3>
            </div>
            <p className="text-xs text-ink-secondary leading-relaxed mb-4">
              Before beginning, check off these critical prerequisites to guarantee a painless transition:
            </p>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 rounded-lg bg-base/60 p-3 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={auditChecks.filesBackedUp}
                  onChange={(e) =>
                    setAuditChecks({ ...auditChecks, filesBackedUp: e.target.checked })
                  }
                  className="rounded border-line text-cyan focus:ring-cyan mt-0.5"
                />
                <div>
                  <span className="font-semibold text-ink-primary block">
                    1. Files Backed Up Externally
                  </span>
                  <span className="text-ink-secondary text-[11px]">
                    Photos, documents, browser bookmarks, and passwords saved to an external USB or cloud.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg bg-base/60 p-3 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={auditChecks.criticalAppsChecked}
                  onChange={(e) =>
                    setAuditChecks({ ...auditChecks, criticalAppsChecked: e.target.checked })
                  }
                  className="rounded border-line text-cyan focus:ring-cyan mt-0.5"
                />
                <div>
                  <span className="font-semibold text-ink-primary block">
                    2. Software Parity Verified
                  </span>
                  <span className="text-ink-secondary text-[11px]">
                    Confirmed my daily software runs natively or has great alternatives (LibreOffice, OnlyOffice, GIMP, Proton).
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg bg-base/60 p-3 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={auditChecks.hardwareVerified}
                  onChange={(e) =>
                    setAuditChecks({ ...auditChecks, hardwareVerified: e.target.checked })
                  }
                  className="rounded border-line text-cyan focus:ring-cyan mt-0.5"
                />
                <div>
                  <span className="font-semibold text-ink-primary block">
                    3. Hardware Checked
                  </span>
                  <span className="text-ink-secondary text-[11px]">
                    Looked up my Wi-Fi, GPU, and printer on the <Link to="/compatibility" className="text-cyan underline">Compatibility Checker</Link>.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 rounded-lg bg-base/60 p-3 text-xs cursor-pointer hover:bg-base">
                <input
                  type="checkbox"
                  checked={auditChecks.bitlockerKeySaved}
                  onChange={(e) =>
                    setAuditChecks({ ...auditChecks, bitlockerKeySaved: e.target.checked })
                  }
                  className="rounded border-line text-cyan focus:ring-cyan mt-0.5"
                />
                <div>
                  <span className="font-semibold text-ink-primary block">
                    4. Fast Startup & BitLocker
                  </span>
                  <span className="text-ink-secondary text-[11px]">
                    Saved my 48-digit Windows BitLocker key and disabled Windows Fast Startup.
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6 pt-4 border-t border-line-subtle text-[11px] text-ink-muted">
              {Object.values(auditChecks).every(Boolean) ? (
                <div className="flex items-center gap-1.5 text-success font-semibold">
                  <CheckCircle2 size={16} /> Audit Complete! You are fully prepared to proceed.
                </div>
              ) : (
                <span>Complete all 4 audit checks for zero-risk switching.</span>
              )}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: The 7 Step-by-Step Migration Guides */}
        <div className="lg:col-span-8 space-y-4">
          {MIGRATION_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isExpanded = expandedStepId === step.id;

            return (
              <GlassPanel
                key={step.id}
                className={`transition-all border-l-4 ${
                  step.destructive
                    ? "border-l-warning"
                    : isCompleted
                    ? "border-l-success"
                    : "border-l-cyan"
                }`}
              >
                {/* Step Header */}
                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step)}
                        className="mt-1 text-ink-muted hover:text-cyan transition-colors"
                        title={isCompleted ? "Mark incomplete" : "Mark step complete"}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={22} className="text-success" />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
                            {step.category} • ~{step.estimatedMinutes} mins
                          </span>
                          {step.destructive && (
                            <span className="rounded bg-warning/20 border border-warning/40 px-2 py-0.5 text-[10px] font-bold text-warning uppercase">
                              Caution: Partition Step
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-ink-primary md:text-xl mt-1">
                          {step.title}
                        </h3>

                        <p className="mt-1 text-xs text-ink-secondary leading-relaxed">
                          {step.summary}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedStepId(isExpanded ? "" : step.id)}
                      className="rounded-lg border border-line-subtle bg-surface/70 px-3 py-1.5 text-xs font-semibold text-ink-secondary hover:text-ink-primary shrink-0 self-start sm:self-center flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <span>Collapse</span> <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          <span>Detailed Guide</span> <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expanded Walkthrough Instructions */}
                  {isExpanded && (
                    <div className="mt-6 border-t border-line-subtle pt-6 space-y-4 animate-fadeIn">
                      {/* Destructive Warning Alert */}
                      {step.destructive && step.warningNotice && (
                        <div className="rounded-xl border border-warning/50 bg-warning/10 p-4 text-xs text-warning flex items-start gap-3">
                          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                          <div>
                            <strong className="block font-bold mb-1">Notice:</strong>
                            <p className="text-ink-secondary leading-relaxed">
                              {step.warningNotice}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Step by step bullet list */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-semibold text-ink-primary block">
                          Step-by-Step Instructions:
                        </span>
                        {step.detailedGuide.map((line, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-ink-secondary leading-relaxed"
                          >
                            <span className="font-mono text-cyan font-bold">{idx + 1}.</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>

                      {/* Commands (if any) */}
                      {step.keyCommands && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-ink-primary block">
                            Key Commands:
                          </span>
                          {step.keyCommands.map((cmd) => (
                            <div
                              key={cmd}
                              className="flex items-center justify-between rounded-lg border border-line-subtle bg-void px-3 py-2 font-mono text-xs text-cyan"
                            >
                              <code>{cmd}</code>
                              <button
                                onClick={() => copyToClipboard(cmd)}
                                className="text-ink-muted hover:text-ink-primary ml-2"
                                title="Copy command"
                              >
                                {copiedCmd === cmd ? (
                                  <Check size={14} className="text-success" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommended Tools */}
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-ink-muted block mb-1.5">
                          Recommended Free & Open Tools:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.recommendedTools.map((tool) => (
                            <span
                              key={tool}
                              className="rounded border border-line-subtle bg-elevated px-2.5 py-1 text-xs text-ink-secondary"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Mark Completed Button */}
                      <div className="pt-4 border-t border-line-subtle flex justify-end">
                        <Button
                          size="sm"
                          variant={isCompleted ? "ghost" : "primary"}
                          onClick={() => toggleStepCompleted(step)}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 size={16} /> Completed (Click to Undo)
                            </>
                          ) : (
                            <>
                              <Check size={16} /> Mark Step as Done
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      </div>

      {/* Critical Destructive Step Safeguard Modal */}
      <Modal
        open={!!dangerModalStep}
        onClose={() => setDangerModalStep(null)}
        title="⚠️ Critical Confirmation: Disk Partitioning"
        className="max-w-lg border-2 border-warning"
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-primary leading-relaxed">
            You are about to mark <strong>Step 5 (Installation Strategy)</strong> as completed.
          </p>

          <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-xs text-warning leading-relaxed">
            <p className="font-bold mb-1">Destructive Disk Notice:</p>
            Modifying partition tables or selecting "Erase Disk" permanently deletes files. Before confirming, ensure you have:
            <ul className="list-disc list-inside mt-2 space-y-1 text-ink-secondary">
              <li>Copied your files to an external drive (Step 1).</li>
              <li>Tested your Wi-Fi and sound in the Live USB session (Step 4).</li>
              <li>Saved your Windows BitLocker key if dual-booting.</li>
            </ul>
          </div>

          <label className="flex items-start gap-2.5 rounded-lg border border-line-subtle bg-surface p-3 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={dangerConfirmed}
              onChange={(e) => setDangerConfirmed(e.target.checked)}
              className="rounded border-line text-warning focus:ring-warning mt-0.5"
            />
            <span className="font-semibold text-ink-primary">
              I have verified my external backup and understand the disk partitioning options.
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-3 border-t border-line-subtle">
            <Button variant="ghost" onClick={() => setDangerModalStep(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!dangerConfirmed}
              onClick={confirmDestructiveStep}
              className={!dangerConfirmed ? "opacity-50 cursor-not-allowed" : ""}
            >
              Confirm Step Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
