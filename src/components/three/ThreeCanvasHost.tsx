import { useEffect, useRef, useState } from "react";
import { SceneManager } from "@/three/core/SceneManager";
import type { SceneModule } from "@/three/core/SceneManager";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceTier } from "@/hooks/useDeviceTier";

interface ThreeCanvasHostProps {
  /** Factory that returns a fresh SceneModule instance (not the module itself,
   *  so each mount gets its own state). */
  createScene: () => SceneModule;
  /** Fallback to render when WebGL is unavailable or reduced motion is set. */
  fallback?: React.ReactNode;
  className?: string;
  /** Max DPR override. Defaults to 2 on high, 1.5 on medium, 1 on low. */
  maxDpr?: number;
}

/**
 * Mount point for a Three.js scene inside React.
 *
 * Responsibilities:
 *  - Create the SceneManager on mount, dispose on unmount.
 *  - Catch any WebGL initialization errors and degrade to fallback.
 *  - Skip 3D entirely (render fallback) when WebGL is unavailable or the
 *    user prefers reduced motion.
 *  - Pass an appropriate DPR cap based on the device tier.
 *
 * This is the ONLY component that touches the renderer lifecycle from React.
 * Scene modules remain pure Three.js + TypeScript with no React dependency.
 */
export function ThreeCanvasHost({
  createScene,
  fallback,
  className,
  maxDpr,
}: ThreeCanvasHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initError, setInitError] = useState(false);
  const reduced = useReducedMotion();
  const tier = useDeviceTier();

  const dprCap = maxDpr ?? (tier === "high" ? 2 : tier === "medium" ? 1.5 : 1);
  const skip3D = reduced || tier === "low";

  useEffect(() => {
    if (skip3D || !containerRef.current) return;

    try {
      const manager = new SceneManager(containerRef.current, createScene(), {
        maxDpr: dprCap,
      });
      return () => manager.dispose();
    } catch (err) {
      console.warn("Three.js WebGL initialization failed; degrading gracefully to 2D fallback:", err);
      setInitError(true);
    }
  }, [createScene, dprCap, skip3D]);

  if (skip3D || initError) {
    return (
      <div className={className} aria-hidden={false}>
        {fallback}
      </div>
    );
  }

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
