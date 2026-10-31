import { describe, it, expect } from "vitest";
import { glossary } from "../src/content/glossary";

describe("Glossary & Linux Translator", () => {
  it("should have a substantial set of technical terms", () => {
    expect(glossary.length).toBeGreaterThanOrEqual(10);
  });

  it("each glossary entry should have valid terms, short definitions, and multi-level explanations", () => {
    for (const item of glossary) {
      expect(item.term).toBeTruthy();
      expect(item.shortDef).toBeTruthy();
      expect(item.shortDef.length).toBeGreaterThan(10);

      // Verify all 3 comprehension levels are provided
      expect(item.levels.beginner).toBeTruthy();
      expect(item.levels.practical).toBeTruthy();
      expect(item.levels.technical).toBeTruthy();

      // Verify aliases is an array
      expect(Array.isArray(item.aliases)).toBe(true);
    }
  });

  it("should find terms by exact name or alias", () => {
    const kernelTerm = glossary.find(
      (g) => g.term === "kernel" || g.aliases.includes("linux kernel")
    );
    expect(kernelTerm).toBeDefined();
    expect(kernelTerm?.levels.technical).toContain("system calls");

    const distroTerm = glossary.find(
      (g) => g.term === "distribution" || g.aliases.includes("distro")
    );
    expect(distroTerm).toBeDefined();
  });
});
