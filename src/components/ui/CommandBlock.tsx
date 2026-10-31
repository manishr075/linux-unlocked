interface CommandBlockProps {
  command: string;
  output?: string;
  label?: string;
  className?: string;
}

/** Monospace command + optional output display, with a copy button. */
export function CommandBlock({ command, output, label, className = "" }: CommandBlockProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  };

  return (
    <figure className={`my-4 ${className}`}>
      {label && (
        <figcaption className="mb-1 text-xs text-ink-muted">{label}</figcaption>
      )}
      <div className="overflow-hidden rounded-lg border border-line-subtle bg-void">
        <div className="flex items-center justify-between px-4 py-1 text-xs text-ink-muted border-b border-line-subtle">
          <span className="font-mono">bash</span>
          <button
            onClick={copy}
            className="rounded px-2 py-0.5 text-ink-secondary hover:bg-surface hover:text-ink-primary transition-colors"
            aria-label="Copy command"
          >
            Copy
          </button>
        </div>
        <pre className="px-4 py-3 text-sm font-mono text-cyan overflow-x-auto">
          <code>{command}</code>
        </pre>
        {output && (
          <pre className="border-t border-line-subtle px-4 py-3 text-sm font-mono text-ink-secondary overflow-x-auto">
            <code>{output}</code>
          </pre>
        )}
      </div>
    </figure>
  );
}
