import { type ReactNode } from "react";
import { useTranslator } from "@/state/TranslatorProvider";
import { useLevel } from "@/state/LevelProvider";

interface TermLinkProps {
  term: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Clickable inline technical term that opens the contextual Linux Translator popover.
 * Shows a subtle cyan dotted underline to indicate interactivity.
 */
export function TermLink({ term, children, className = "" }: TermLinkProps) {
  const { open } = useTranslator();
  const { level } = useLevel();

  return (
    <button
      type="button"
      onClick={() => open(term, level)}
      className={`inline-flex items-baseline font-medium text-cyan underline decoration-cyan/40 decoration-dotted underline-offset-4 hover:decoration-cyan transition-colors cursor-help ${className}`}
      title={`Click to define: "${term}"`}
    >
      {children || term}
    </button>
  );
}
