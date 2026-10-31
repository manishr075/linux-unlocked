import { type ReactNode } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Lightweight CSS-hover tooltip (no JS positioning logic needed for MVP). */
export function Tooltip({ content, children, className = "" }: TooltipProps) {
  return (
    <span className={`group relative inline-block ${className}`}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-tooltip mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-line-default bg-elevated px-2.5 py-1 text-xs text-ink-primary opacity-0 shadow-md transition-opacity duration-fast group-hover:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
