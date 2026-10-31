import { useLevel } from "@/state/LevelProvider";
import type { LearningLevel } from "@/types";
import { Pill } from "@/components/ui/Pill";

const levelLabels: Record<LearningLevel, string> = {
  beginner: "Beginner",
  practical: "Practical",
  technical: "Technical",
};

const levelDescriptions: Record<LearningLevel, string> = {
  beginner: "Plain language and analogies",
  practical: "Step-by-step instructions and commands",
  technical: "System internals and architecture",
};

/** Global learning-level switcher. Persists via the UI store. */
export function LevelSwitcher({ compact = false }: { compact?: boolean }) {
  const { level, setLevel, levels } = useLevel();

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-line-subtle bg-surface p-0.5">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            aria-pressed={l === level}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              l === level
                ? "bg-cyan text-ink-onAccent"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {levelLabels[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        Learning level
      </span>
      <div className="flex gap-2">
        {levels.map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            aria-pressed={l === level}
            className={`flex-1 rounded-lg border p-3 text-left transition-all duration-normal ease-soft ${
              l === level
                ? "border-cyan/40 bg-cyan/10 shadow-glow"
                : "border-line-subtle bg-surface hover:border-line-strong"
            }`}
          >
            <div className="mb-0.5 font-semibold">{levelLabels[l]}</div>
            <div className="text-xs text-ink-secondary">
              {levelDescriptions[l]}
            </div>
          </button>
        ))}
      </div>
      <Pill tone="cyan" className="mt-1">
        Currently: {levelLabels[level]}
      </Pill>
    </div>
  );
}
