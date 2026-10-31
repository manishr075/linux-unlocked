import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LearningLevel, Theme } from "@/types";

interface UIState {
  level: LearningLevel;
  setLevel: (l: LearningLevel) => void;
  cycleLevel: () => void;

  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;

  /** Tracks article ids the user has finished reading (localStorage). */
  readArticles: string[];
  markArticleRead: (id: string) => void;

  /** Terminal missions completed. */
  completedMissions: string[];
  markMissionComplete: (id: string) => void;

  /** Migration checklist progress: stepId → done. */
  migrationProgress: Record<string, boolean>;
  toggleMigrationStep: (stepId: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      level: "beginner",
      setLevel: (level) => set({ level }),
      cycleLevel: () => {
        const order: LearningLevel[] = ["beginner", "practical", "technical"];
        const next = order[(order.indexOf(get().level) + 1) % order.length];
        set({ level: next });
      },

      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),

      readArticles: [],
      markArticleRead: (id) =>
        set({
          readArticles: get().readArticles.includes(id)
            ? get().readArticles
            : [...get().readArticles, id],
        }),

      completedMissions: [],
      markMissionComplete: (id) =>
        set({
          completedMissions: get().completedMissions.includes(id)
            ? get().completedMissions
            : [...get().completedMissions, id],
        }),

      migrationProgress: {},
      toggleMigrationStep: (stepId) =>
        set({
          migrationProgress: {
            ...get().migrationProgress,
            [stepId]: !get().migrationProgress[stepId],
          },
        }),
    }),
    {
      name: "linux-unlocked-ui",
      partialize: (s) => ({
        level: s.level,
        theme: s.theme,
        readArticles: s.readArticles,
        completedMissions: s.completedMissions,
        migrationProgress: s.migrationProgress,
      }),
    },
  ),
);
