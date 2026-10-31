import { type ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/** Frosted glass surface for overlays, hero panels, and 3D-chrome. */
export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div
      className={`glass-card rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
