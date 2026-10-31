import { type ReactNode, createContext, useContext, useMemo } from "react";
import { useUIStore } from "@/state/useUIStore";
import type { LearningLevel } from "@/types";
import { LEARNING_LEVELS } from "@/types";

interface LevelContextValue {
  level: LearningLevel;
  setLevel: (l: LearningLevel) => void;
  cycleLevel: () => void;
  levels: LearningLevel[];
}

const LevelContext = createContext<LevelContextValue | null>(null);

/** Thin wrapper around the UI store so level can be consumed via context. */
export function LevelProvider({ children }: { children: ReactNode }) {
  const level = useUIStore((s) => s.level);
  const setLevel = useUIStore((s) => s.setLevel);
  const cycleLevel = useUIStore((s) => s.cycleLevel);

  const value = useMemo<LevelContextValue>(
    () => ({ level, setLevel, cycleLevel, levels: LEARNING_LEVELS }),
    [level, setLevel, cycleLevel],
  );

  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
}

export function useLevel(): LevelContextValue {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error("useLevel must be used within LevelProvider");
  return ctx;
}
