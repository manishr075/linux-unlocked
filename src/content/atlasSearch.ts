import Fuse from "fuse.js";
import { ATLAS_ARTICLES, type AtlasArticleData, type AtlasDomain } from "./atlasData";
import type { AtlasCategory } from "@/types";

export interface AtlasFilterOptions {
  query?: string;
  domain?: AtlasDomain | "all";
  category?: AtlasCategory | "all";
  difficulty?: number | "all";
}

const fuseOptions = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "tags", weight: 0.25 },
    { name: "summary", weight: 0.2 },
    { name: "category", weight: 0.1 },
    { name: "content.beginner", weight: 0.05 },
    { name: "content.practical", weight: 0.05 },
    { name: "content.technical", weight: 0.05 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

const fuse = new Fuse(ATLAS_ARTICLES, fuseOptions);

export function searchAtlas(filters: AtlasFilterOptions): AtlasArticleData[] {
  const { query, domain = "all", category = "all", difficulty = "all" } = filters;

  let results: AtlasArticleData[] = ATLAS_ARTICLES;

  // Apply search query if provided
  if (query && query.trim().length > 0) {
    const fuseResults = fuse.search(query.trim());
    results = fuseResults.map((r) => r.item);
  }

  // Filter by Domain
  if (domain !== "all") {
    results = results.filter((art) => art.domain === domain);
  }

  // Filter by Category
  if (category !== "all") {
    results = results.filter((art) => art.category === category);
  }

  // Filter by Difficulty
  if (difficulty !== "all") {
    results = results.filter((art) => art.difficulty === difficulty);
  }

  return results;
}

export function getArticleBySlug(slug: string): AtlasArticleData | undefined {
  return ATLAS_ARTICLES.find((art) => art.slug === slug);
}
