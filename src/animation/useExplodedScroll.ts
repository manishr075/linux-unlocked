/* ============================================================
   GSAP ScrollTrigger Controller for Exploded 3D Architecture
   ------------------------------------------------------------
   Manages bidirectional scroll synchronization with high performance:
   - High-frequency scroll progress is tracked in a ref (no React re-render per tick)
   - React state only updates when active layer meaningfully changes
   - Reversible forward & backward scrubbing
   ============================================================ */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ExplodedScrollState {
  progressRef: React.MutableRefObject<number>;
  activeLayer: number;
  scrollToLayer: (index: number) => void;
  setActiveLayer: (index: number) => void;
}

export function useExplodedScroll(
  triggerRef: React.RefObject<HTMLElement | null>,
  layerCount = 6
): ExplodedScrollState {
  const [activeLayer, setActiveLayer] = useState(0);
  const activeLayerRef = useRef(0);
  const progressRef = useRef(0);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    // Create pinned ScrollTrigger timeline
    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Calculate active layer index (0 to layerCount - 1)
        const idx = Math.min(layerCount - 1, Math.floor(p * layerCount));
        if (idx !== activeLayerRef.current) {
          activeLayerRef.current = idx;
          setActiveLayer(idx);
        }
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

  return { progressRef, activeLayer, scrollToLayer, setActiveLayer };
}
