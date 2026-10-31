/* ============================================================
   LINUX UNLOCKED — Terminal Playground (Module E)
   ------------------------------------------------------------
   A safe, interactive in-browser terminal sandbox.
   Features:
     - POSIX Shell Engine with pipes (|) and redirects (> / >>)
     - Hierarchical in-memory Virtual Filesystem (VFS)
     - 8 Guided Progressive Missions with automated validation
     - Built-in Quick Command Cheat Sheet
     - LocalStorage progress persistence
   ============================================================ */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { InteractiveTerminal } from "@/components/terminal/InteractiveTerminal";
import {
  TERMINAL_MISSIONS,
  type GuidedMission,
} from "@/content/terminalMissions";
import { VirtualFileSystem } from "@/simulations/filesystem/FileSystem";
import type { CommandResult } from "@/simulations/shell/ShellEngine";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Pill } from "@/components/ui/Pill";
import {
  CheckCircle2,
  Circle,
  HelpCircle,
  Award,
  Sparkles,
} from "lucide-react";

export function TerminalPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const missionParam = searchParams.get("mission");

  // Active mission state
  const [activeMission, setActiveMission] = useState<GuidedMission>(() => {
    if (missionParam) {
      const match = TERMINAL_MISSIONS.find((m) => m.id === missionParam);
      if (match) return match;
    }
    return TERMINAL_MISSIONS[0];
  });

  // Completed missions list
  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("linux_unlocked_completed_missions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showHint, setShowHint] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Synchronize URL param with mission
  useEffect(() => {
    if (missionParam) {
      const match = TERMINAL_MISSIONS.find((m) => m.id === missionParam);
      if (match) setActiveMission(match);
    }
  }, [missionParam]);

  const selectMission = (m: GuidedMission) => {
    setActiveMission(m);
    setSearchParams({ mission: m.id });
    setShowHint(false);
    setJustCompleted(false);
  };

  // Callback triggered on every shell execution
  const handleCommandExecuted = (
    cmd: string,
    result: CommandResult,
    vfs: VirtualFileSystem
  ) => {
    if (!activeMission) return;

    const isAlreadyDone = completedMissions.includes(activeMission.id);
    const passed = activeMission.validate(vfs, result.stdout, cmd);

    if (passed && !isAlreadyDone) {
      const updated = [...completedMissions, activeMission.id];
      setCompletedMissions(updated);
      setJustCompleted(true);
      try {
        localStorage.setItem(
          "linux_unlocked_completed_missions",
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }
    }
  };

  const isCurrentMissionDone = completedMissions.includes(activeMission.id);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill tone="cyan">Module E • Safe Sandbox</Pill>
            <span className="text-xs font-mono text-ink-muted">
              Missions Completed: {completedMissions.length}/{TERMINAL_MISSIONS.length}
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Terminal Playground
          </h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Practice real Linux commands inside a safe in-memory virtual filesystem. Zero risk, 100% genuine POSIX behavior.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="rounded-xl border border-line-subtle bg-surface/70 px-4 py-2 flex items-center gap-3 backdrop-blur-glass">
          <Award className="text-cyan" size={24} />
          <div>
            <p className="text-xs text-ink-muted">Playground Rank</p>
            <p className="text-sm font-bold text-ink-primary">
              {completedMissions.length === 0
                ? "Terminal Novice"
                : completedMissions.length < 4
                ? "Junior Explorer"
                : completedMissions.length < 8
                ? "Command Craftsman"
                : "Terminal Grandmaster"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Terminal CLI */}
        <div className="lg:col-span-8 space-y-4">
          <InteractiveTerminal onCommandExecuted={handleCommandExecuted} />

          {/* Quick Command Reference Bar */}
          <div className="rounded-xl border border-line-subtle bg-surface/60 p-4 text-xs text-ink-secondary">
            <span className="font-semibold text-ink-primary block mb-2">
              Available Simulated Commands:
            </span>
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">pwd</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">ls [-l, -a]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">cd [dir]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">mkdir [-p]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">touch [file]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">cat [file]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">echo "text"</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">chmod [mode]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">grep [pattern]</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">cp / mv</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">find</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">pipes (|)</span>
              <span className="rounded bg-elevated px-2 py-0.5 text-cyan">redirect (&gt;, &gt;&gt;)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Guided Missions & Objective HUD */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Mission Card */}
          <GlassPanel className="p-6 border-line-accent/50 shadow-xl">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
                  Active Challenge
                </span>
                <h3 className="font-bold text-lg text-ink-primary mt-0.5">
                  {activeMission.title}
                </h3>
              </div>

              {isCurrentMissionDone ? (
                <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-bold text-success border border-success/30">
                  <CheckCircle2 size={14} /> Solved
                </span>
              ) : (
                <span className="rounded bg-elevated px-2 py-0.5 font-mono text-[11px] text-ink-muted">
                  Diff: {activeMission.difficulty}/5
                </span>
              )}
            </div>

            {/* Completion Banner */}
            {justCompleted && (
              <div className="mb-4 rounded-xl border border-success/40 bg-success/15 p-3.5 text-xs text-success animate-bounce">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={16} /> Mission Objective Achieved!
                </p>
                <p className="mt-1 text-ink-secondary">
                  Fantastic job! You've mastered this command pattern. Pick the next challenge below.
                </p>
              </div>
            )}

            <p className="text-xs text-ink-secondary leading-relaxed mb-4">
              {activeMission.description}
            </p>

            {/* Objectives */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-ink-primary block">
                Mission Objectives:
              </span>
              {activeMission.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-base/60 p-2.5 text-xs text-ink-secondary"
                >
                  <span className="font-mono text-cyan font-bold">•</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>

            {/* Hints Toggle */}
            <div className="border-t border-line-subtle pt-3">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
              >
                <HelpCircle size={14} /> {showHint ? "Hide Hints" : "Need a Hint?"}
              </button>

              {showHint && (
                <div className="mt-2 space-y-1.5 rounded-lg border border-line-subtle bg-void/60 p-3 text-xs text-ink-muted">
                  {activeMission.hints.map((hint, idx) => (
                    <p key={idx}>💡 {hint}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Why This Matters */}
            <div className="mt-4 rounded-lg bg-surface/40 p-3 text-[11px] text-ink-muted leading-relaxed">
              <span className="font-semibold text-ink-secondary block mb-0.5">
                Behind the Command:
              </span>
              {activeMission.explanation}
            </div>
          </GlassPanel>

          {/* Missions List Navigator */}
          <GlassPanel className="p-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink-muted mb-3 px-2">
              Mission Roster ({completedMissions.length}/{TERMINAL_MISSIONS.length} Complete)
            </h4>

            <div className="space-y-1.5">
              {TERMINAL_MISSIONS.map((m, idx) => {
                const isSelected = activeMission.id === m.id;
                const isDone = completedMissions.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => selectMission(m)}
                    className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-cyan/15 text-cyan border border-cyan/40 font-bold"
                        : "text-ink-secondary hover:bg-surface hover:text-ink-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <span className="font-mono text-ink-muted text-[10px]">
                        {idx + 1}.
                      </span>
                      <span className="truncate">{m.title.split(":")[1]?.trim() || m.title}</span>
                    </div>

                    {isDone ? (
                      <CheckCircle2 size={16} className="text-success shrink-0" />
                    ) : (
                      <Circle size={16} className="text-ink-muted shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
