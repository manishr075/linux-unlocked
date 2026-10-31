import { type ReactNode } from "react";

type Tone = "cyan" | "electric" | "violet" | "success" | "warning" | "error" | "neutral";

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  cyan: "bg-cyan/15 text-cyan border-cyan/30",
  electric: "bg-electric/15 text-electric border-electric/30",
  violet: "bg-violet/15 text-violet border-violet/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  error: "bg-error/15 text-error border-error/30",
  neutral: "bg-surface text-ink-secondary border-line-subtle",
};

/** Small label/tag pill used for difficulty, status, categories. */
export function Pill({ children, tone = "neutral", className = "" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
