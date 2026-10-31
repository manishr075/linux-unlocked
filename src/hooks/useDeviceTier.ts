import { useEffect, useState } from "react";
import type { DeviceTier } from "@/types";

/**
 * Classifies the current device into a capability tier so 3D scenes and
 * motion-heavy features can degrade gracefully.
 *
 * Heuristics (intentionally cheap, no expensive benchmarks):
 *  - `prefers-reduced-motion`  → low
 *  - hardware concurrency ≤ 2  → low
 *  - device pixel ratio ≥ 3
 *    + small viewport (< 820px) → medium  (mobile, but possibly powerful)
 *  - WebGL2 unavailable       → low (no real 3D)
 *  - otherwise                → high
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("high");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTier("low");
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 820;

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      null;

    if (!gl) {
      setTier("low");
      return;
    }

    if (cores <= 2) {
      setTier("low");
      return;
    }

    if (isMobile || (dpr >= 3 && cores <= 4)) {
      setTier("medium");
      return;
    }

    setTier("high");
  }, []);

  return tier;
}
