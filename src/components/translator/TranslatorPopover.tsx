import { useTranslator } from "@/state/TranslatorProvider";
import { Modal } from "@/components/ui/Modal";
import type { LearningLevel } from "@/types";
import { LEARNING_LEVELS } from "@/types";

const levelLabels: Record<LearningLevel, string> = {
  beginner: "Beginner",
  practical: "Practical",
  technical: "Technical",
};

/** Popover that reveals the definition of the currently active glossary term.
 *  Driven by TranslatorProvider state. */
export function TranslatorPopover() {
  const { activeTerm, activeLevel, open, close } = useTranslator();

  return (
    <Modal
      open={!!activeTerm}
      onClose={close}
      title={activeTerm?.term ? activeTerm.term.charAt(0).toUpperCase() + activeTerm.term.slice(1) : ""}
      className="max-w-md"
    >
      {activeTerm && (
        <div>
          <p className="mb-4 text-sm leading-relaxed text-ink-primary">
            {activeTerm.shortDef}
          </p>

          <div className="mb-4 flex gap-1">
            {LEARNING_LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => activeTerm && open(activeTerm.term, l)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  l === activeLevel
                    ? "bg-cyan text-ink-onAccent"
                    : "bg-surface text-ink-secondary hover:text-ink-primary"
                }`}
              >
                {levelLabels[l]}
              </button>
            ))}
          </div>

          {activeTerm.levels?.[activeLevel] && (
            <p className="text-sm leading-relaxed text-ink-secondary border-t border-line-subtle pt-3">
              {activeTerm.levels[activeLevel]}
            </p>
          )}

          {activeTerm.related && activeTerm.related.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-ink-muted">Related:</span>
              {activeTerm.related.map((r) => (
                <button
                  key={r}
                  onClick={() => open(r, activeLevel)}
                  className="text-xs text-cyan hover:underline"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
