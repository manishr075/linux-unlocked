interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

/** Simple progress indicator for missions, articles, migration steps. */
export function ProgressBar({ value, max = 100, label, className = "" }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={className}>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-ink-secondary">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-electric transition-all duration-normal ease-soft"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
