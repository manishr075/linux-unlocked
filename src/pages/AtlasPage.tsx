/* ============================================================
   LINUX UNLOCKED — Linux Atlas (Module C)
   ------------------------------------------------------------
   The complete categorized Linux knowledge platform.
   Features:
     - 6 Cognitive Domains grouping 22 Categories
     - Fuse.js Instant Fuzzy Search Engine
     - Multi-Depth Level Integration (Beginner / Practical / Tech)
     - Interactive Article Viewer with upstream verified sources
     - Guided Learning Paths with local progress persistence
   ============================================================ */

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ATLAS_ARTICLES,
  ATLAS_DOMAINS,
  CATEGORY_LABELS,
  type AtlasArticleData,
  type AtlasDomain,
} from "@/content/atlasData";
import { searchAtlas, getArticleBySlug } from "@/content/atlasSearch";
import { ArticleViewer } from "@/components/atlas/ArticleViewer";
import { LearningPaths } from "@/components/atlas/LearningPaths";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Compass,
  X,
} from "lucide-react";

export function AtlasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const articleParam = searchParams.get("article");

  // Selected Article state (null = show catalog list)
  const [activeArticle, setActiveArticle] = useState<AtlasArticleData | null>(
    articleParam ? getArticleBySlug(articleParam) || null : null
  );

  // Active tab: "catalog" | "paths"
  const [activeTab, setActiveTab] = useState<"catalog" | "paths">("catalog");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<AtlasDomain | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | "all">("all");

  // Synchronize URL query param
  useEffect(() => {
    if (articleParam) {
      const found = getArticleBySlug(articleParam);
      if (found) setActiveArticle(found);
    }
  }, [articleParam]);

  const selectArticle = (slug: string) => {
    const found = getArticleBySlug(slug);
    if (found) {
      setActiveArticle(found);
      setSearchParams({ article: slug });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const clearArticle = () => {
    setActiveArticle(null);
    setSearchParams({});
  };

  // Filtered and searched articles
  const filteredArticles = useMemo(() => {
    return searchAtlas({
      query: searchQuery,
      domain: selectedDomain,
      difficulty: selectedDifficulty,
    });
  }, [searchQuery, selectedDomain, selectedDifficulty]);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
      {/* If reading an article, show the ArticleViewer */}
      {activeArticle ? (
        <ArticleViewer
          article={activeArticle}
          onBack={clearArticle}
          onSelectArticle={selectArticle}
        />
      ) : (
        /* Catalog & Learning Paths Explorer View */
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <Pill tone="cyan" className="mb-4">
              Module C • Knowledge Atlas
            </Pill>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              The Linux Atlas.
              <br />
              <span className="text-gradient">Verified Knowledge for Every Depth.</span>
            </h1>
            <p className="mt-3 text-base text-ink-secondary md:text-lg">
              Explore 22 Linux categories categorized into 6 core domains. Read analogies at the Beginner level,
              practical commands at the Practical level, or kernel specs at the Technical level.
            </p>

            {/* View Switcher Tabs */}
            <div className="mt-8 inline-flex rounded-xl border border-line-subtle bg-surface/70 p-1.5 backdrop-blur-glass">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "catalog"
                    ? "bg-cyan text-void font-bold shadow-glow"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <BookOpen size={16} /> Knowledge Catalog ({ATLAS_ARTICLES.length} Articles)
              </button>
              <button
                onClick={() => setActiveTab("paths")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "paths"
                    ? "bg-cyan text-void font-bold shadow-glow"
                    : "text-ink-secondary hover:text-ink-primary"
                }`}
              >
                <Compass size={16} /> Guided Learning Paths
              </button>
            </div>
          </div>

          {activeTab === "paths" ? (
            /* Guided Learning Paths Tab */
            <section className="animate-fadeIn">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Compass className="text-cyan" /> Structured Curriculums
                </h2>
                <p className="text-sm text-ink-secondary mt-1">
                  Follow step-by-step reading paths designed for your specific goals. Progress is saved locally in your browser.
                </p>
              </div>
              <LearningPaths onSelectArticle={selectArticle} />
            </section>
          ) : (
            /* Knowledge Catalog Tab */
            <div className="space-y-8 animate-fadeIn">
              {/* Search & Filter Bar */}
              <GlassPanel className="p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search concepts, commands, filesystems, kernel topics..."
                      className="w-full rounded-xl border border-line-subtle bg-void py-2.5 pl-10 pr-10 text-sm text-ink-primary placeholder-ink-muted focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Filter Selectors */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value as AtlasDomain | "all")}
                      aria-label="Filter by domain"
                      className="rounded-xl border border-line-subtle bg-void px-3 py-2 text-xs font-semibold text-ink-primary focus:border-cyan focus:outline-none"
                    >
                      <option value="all">All 6 Domains</option>
                      {Object.entries(ATLAS_DOMAINS).map(([key, dom]) => (
                        <option key={key} value={key}>
                          {dom.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={selectedDifficulty}
                      onChange={(e) =>
                        setSelectedDifficulty(
                          e.target.value === "all" ? "all" : Number(e.target.value)
                        )
                      }
                      aria-label="Filter by difficulty"
                      className="rounded-xl border border-line-subtle bg-void px-3 py-2 text-xs font-semibold text-ink-primary focus:border-cyan focus:outline-none"
                    >
                      <option value="all">Any Difficulty</option>
                      <option value="1">Level 1: Novice</option>
                      <option value="2">Level 2: Practical</option>
                      <option value="3">Level 3: Intermediate</option>
                      <option value="4">Level 4: Advanced</option>
                      <option value="5">Level 5: Kernel Hacker</option>
                    </select>
                  </div>
                </div>

                {/* Domain Quick Tabs */}
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line-subtle pt-3">
                  <button
                    onClick={() => setSelectedDomain("all")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      selectedDomain === "all"
                        ? "bg-cyan/20 text-cyan border border-cyan/40"
                        : "text-ink-muted hover:text-ink-primary"
                    }`}
                  >
                    All Articles ({ATLAS_ARTICLES.length})
                  </button>
                  {Object.entries(ATLAS_DOMAINS).map(([key, dom]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDomain(key as AtlasDomain)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                        selectedDomain === key
                          ? "bg-cyan/20 text-cyan border border-cyan/40"
                          : "text-ink-muted hover:text-ink-primary"
                      }`}
                    >
                      {dom.label}
                    </button>
                  ))}
                </div>
              </GlassPanel>

              {/* Results Grid */}
              {filteredArticles.length === 0 ? (
                <div className="rounded-2xl border border-line-subtle bg-surface/40 p-12 text-center">
                  <BookOpen className="mx-auto mb-3 text-ink-muted" size={40} />
                  <h3 className="text-lg font-bold text-ink-primary">No articles found</h3>
                  <p className="mt-1 text-xs text-ink-secondary">
                    Try adjusting your search query or removing filters.
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-4 text-cyan"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDomain("all");
                      setSelectedDifficulty("all");
                    }}
                  >
                    Reset all filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((article) => {
                    const categoryName =
                      CATEGORY_LABELS[article.category] || article.category;
                    const domainInfo = ATLAS_DOMAINS[article.domain];

                    return (
                      <Card
                        key={article.id}
                        glass
                        hover
                        className="flex flex-col justify-between cursor-pointer"
                        onClick={() => selectArticle(article.slug)}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="font-mono text-[11px] font-bold text-cyan uppercase tracking-wider">
                              {domainInfo.label}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-[11px] text-ink-muted">
                              <Clock size={11} /> {article.estimatedMinutes}m
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-ink-primary group-hover:text-cyan transition-colors">
                            {article.title}
                          </h3>

                          <p className="mt-2 text-xs text-ink-secondary line-clamp-3 leading-relaxed">
                            {article.summary}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-line-subtle flex items-center justify-between">
                          <span className="rounded bg-elevated px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                            {categoryName}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline">
                            Read Article <ArrowRight size={13} />
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
