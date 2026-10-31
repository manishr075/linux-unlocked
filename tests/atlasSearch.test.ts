import { describe, it, expect } from "vitest";
import { searchAtlas, getArticleBySlug } from "../src/content/atlasSearch";
import { ATLAS_ARTICLES } from "../src/content/atlasData";

describe("AtlasSearch", () => {
  it("should return all articles when no filters are applied", () => {
    const results = searchAtlas({});
    expect(results.length).toBe(ATLAS_ARTICLES.length);
  });

  it("should fuzzy search articles by keyword query", () => {
    const results = searchAtlas({ query: "kernel" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((a) => a.title.toLowerCase().includes("kernel"))).toBe(true);
  });

  it("should filter articles by domain", () => {
    const results = searchAtlas({ domain: "system-core" });
    expect(results.every((a) => a.domain === "system-core")).toBe(true);
  });

  it("should filter articles by difficulty", () => {
    const results = searchAtlas({ difficulty: 1 });
    expect(results.every((a) => a.difficulty === 1)).toBe(true);
  });

  it("should retrieve specific article by slug", () => {
    const article = getArticleBySlug("unix-philosophy");
    expect(article).toBeDefined();
    expect(article?.title).toContain("Unix Philosophy");
  });

  it("should handle special characters safely in search query", () => {
    const results = searchAtlas({ query: "[*?+{}$^]" });
    expect(Array.isArray(results)).toBe(true);
  });

  it("should filter articles by category", () => {
    const results = searchAtlas({ category: "networking" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((a) => a.category === "networking")).toBe(true);
    expect(results[0].slug).toBe("linux-networking-stack");
  });

  it("should return empty array for non-matching queries", () => {
    const results = searchAtlas({ query: "xyznonexistentgibberish12345" });
    expect(results.length).toBe(0);
  });
});
