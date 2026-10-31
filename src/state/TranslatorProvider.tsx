import { type ReactNode, createContext, useContext, useMemo, useState, useCallback } from "react";
import { glossary as seedGlossary } from "@/content/glossary";
import type { GlossaryTerm, LearningLevel } from "@/types";

interface TranslatorContextValue {
  /** Currently open term (null = popover closed). */
  activeTerm: GlossaryTerm | null;
  activeLevel: LearningLevel;
  open: (term: string, level: LearningLevel) => void;
  close: () => void;

  /** Look up a term case-insensitively. Returns null if not found. */
  lookup: (term: string) => GlossaryTerm | null;

  /** All known glossary terms (for highlighting). */
  terms: GlossaryTerm[];
}

const TranslatorContext = createContext<TranslatorContextValue | null>(null);

/** Provides the contextual Linux Translator: click a technical term to see a
 *  short, level-aware definition without leaving the page. */
export function TranslatorProvider({ children }: { children: ReactNode }) {
  const terms = useMemo(() => seedGlossary, []);

  const lookupMap = useMemo(() => {
    const m = new Map<string, GlossaryTerm>();
    for (const t of terms) {
      m.set(t.term.toLowerCase(), t);
      for (const alias of t.aliases ?? []) m.set(alias.toLowerCase(), t);
    }
    return m;
  }, [terms]);

  const [activeTerm, setActiveTerm] = useState<GlossaryTerm | null>(null);
  const [activeLevel, setActiveLevel] = useState<LearningLevel>("beginner");

  const lookup = useCallback(
    (term: string) => lookupMap.get(term.toLowerCase()) ?? null,
    [lookupMap],
  );

  const open = useCallback(
    (term: string, level: LearningLevel) => {
      const found = lookup(term);
      if (found) {
        setActiveTerm(found);
        setActiveLevel(level);
      }
    },
    [lookup],
  );

  const close = useCallback(() => setActiveTerm(null), []);

  const value = useMemo<TranslatorContextValue>(
    () => ({ activeTerm, activeLevel, open, close, lookup, terms }),
    [activeTerm, activeLevel, open, close, lookup, terms],
  );

  return (
    <TranslatorContext.Provider value={value}>
      {children}
    </TranslatorContext.Provider>
  );
}

export function useTranslator(): TranslatorContextValue {
  const ctx = useContext(TranslatorContext);
  if (!ctx) throw new Error("useTranslator must be used within TranslatorProvider");
  return ctx;
}
