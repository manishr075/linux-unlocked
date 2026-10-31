/* ============================================================
   GSAP ScrollTrigger Controller for Exploded 3D Architecture
   ------------------------------------------------------------
   Manages the bidirectional scroll synchronization between the
   React DOM scroll position, the active chapter highlights,
   and the native Three.js 3D scene progress uniform.
   ============================================================ */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ExplodedScrollState {
  progress: number;
  activeLayer: number;
  scrollToLayer: (index: number) => void;
}

export function useExplodedScroll(
  triggerRef: React.RefObject<HTMLElement | null>,
  layerCount = 6
): ExplodedScrollState {
  const [progress, setProgress] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    // Create pinned ScrollTrigger timeline
    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        setProgress(p);

        // Calculate active layer index (0 to layerCount - 1)
        const idx = Math.min(layerCount - 1, Math.floor(p * layerCount));
        setActiveLayer(idx);
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
    };
  }, [triggerRef, layerCount]);

  const scrollToLayer = useCallback(
    (index: number) => {
      const st = scrollTriggerRef.current;
      if (!st) return;

      const targetProgress = (index + 0.5) / layerCount;
      const scrollY = st.start + targetProgress * (st.end - st.start);

      window.scrollTo({
        top: scrollY,
        behavior: "smooth",
      });
    },
    [layerCount]
  );

  return { progress, activeLayer, scrollToLayer };
}
