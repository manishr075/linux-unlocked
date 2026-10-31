import { type ReactNode } from "react";

type Tone = "info" | "warning" | "danger" | "success";

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<Tone, string> = {
  info: "border-electric/30 bg-electric/10 text-ink-primary",
  warning: "border-warning/30 bg-warning/10 text-ink-primary",
  danger: "border-error/30 bg-error/10 text-ink-primary",
  success: "border-success/30 bg-success/10 text-ink-primary",
};

const labelMap: Record<Tone, string> = {
  info: "Note",
  warning: "Warning",
  danger: "Important",
  success: "Success",
};

/** Highlighted box for notes, warnings, and important notices. */
export function Callout({ tone = "info", title, children, className = "" }: CalloutProps) {
  return (
    <div className={`rounded-lg border p-4 ${toneClasses[tone]} ${className}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-secondary">
        {title ?? labelMap[tone]}
      </p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
