import { type ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/** Frosted glass surface for overlays, hero panels, and 3D-chrome. */
export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return <div className={`glass rounded-xl ${className}`}>{children}</div>;
}
