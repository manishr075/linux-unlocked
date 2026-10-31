import { useEffect, useState } from "react";
import type { DeviceTier } from "@/types";

/**
 * Classifies the current device into a capability tier so 3D scenes and
 * motion-heavy features can degrade gracefully.
 *
 * Heuristics (intentionally cheap, evaluated synchronously):
 *  - `prefers-reduced-motion`  → low
 *  - hardware concurrency ≤ 2  → low
 *  - device pixel ratio ≥ 3
 *    + small viewport (< 820px) → medium  (mobile, but possibly powerful)
 *  - WebGL / WebGL2 unavailable → low (no real 3D)
 *  - otherwise                → high
 */
function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";

  try {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return "low";

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      null;

    if (!gl) return "low";

    const cores = navigator.hardwareConcurrency ?? 4;
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 820;

    if (cores <= 2) return "low";
    if (isMobile || (dpr >= 3 && cores <= 4)) return "medium";

    return "high";
  } catch {
    return "low";
  }
}

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(detectDeviceTier);

  useEffect(() => {
    setTier(detectDeviceTier());
  }, []);

  return tier;
}
