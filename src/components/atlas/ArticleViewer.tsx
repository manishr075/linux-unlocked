import { useState } from "react";
import { Link } from "react-router-dom";
import type { AtlasArticleData } from "@/content/atlasData";
import { CATEGORY_LABELS, ATLAS_DOMAINS } from "@/content/atlasData";
import { useLevel } from "@/state/LevelProvider";
import type { LearningLevel } from "@/types";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";

interface ArticleViewerProps {
  article: AtlasArticleData;
  onBack?: () => void;
  onSelectArticle?: (slug: string) => void;
}

export function ArticleViewer({ article, onBack, onSelectArticle }: ArticleViewerProps) {
  const { level: globalLevel } = useLevel();
  const [selectedDepth, setSelectedDepth] = useState<LearningLevel | "all">(globalLevel);
  const [copied, setCopied] = useState(false);

  const categoryName = CATEGORY_LABELS[article.category] || article.category;
  const domainInfo = ATLAS_DOMAINS[article.domain];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-subtle pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan hover:underline"
        >
          <ArrowLeft size={16} /> Back to Atlas Library
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-ink-primary transition-colors"
            title="Copy article link"
          >
            {copied ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
            <span>{copied ? "Link Copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Article Header Card */}
      <div className="rounded-2xl border border-line-accent/50 bg-base/80 p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-full bg-cyan/15 px-3 py-1 font-mono text-xs font-bold text-cyan border border-cyan/30">
            {domainInfo.label} • {categoryName}
          </span>
          <span className="flex items-center gap-1 rounded bg-elevated px-2.5 py-1 font-mono text-xs text-ink-muted">
            <Clock size={12} /> {article.estimatedMinutes} min read
          </span>
          <span className="rounded bg-elevated px-2.5 py-1 font-mono text-xs text-ink-muted">
            Difficulty: {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < article.difficulty ? "text-cyan" : "text-line-strong"}>
                ●
              </span>
            ))}
          </span>
        </div>

        <h1 className="font-display text-3xl font-extrabold text-ink-primary md:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <p className="mt-3 text-base text-ink-secondary md:text-lg">
          {article.summary}
        </p>

        {/* Verification Credentials Pill */}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-line-subtle bg-surface/60 p-3 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5 text-success">
            <ShieldCheck size={16} />
            <span className="font-semibold">Source Verified</span>
          </div>
          <span>•</span>
          <span>Verified Against: <strong className="text-ink-primary font-mono">{article.verifiedAgainst}</strong></span>
          <span>•</span>
          <span>Last Audit: <strong className="text-ink-primary font-mono">{article.lastVerified}</strong></span>
        </div>
      </div>

      {/* Depth Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-subtle bg-surface/80 p-2.5 backdrop-blur-glass">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted px-2">Reading Depth:</span>
          <div className="flex gap-1">
            {(
              [
                { id: "beginner", label: "Beginner", desc: "Intuitive & Analogies" },
                { id: "practical", label: "Practical", desc: "Real Commands & How-To" },
                { id: "technical", label: "Technical", desc: "Kernel Architecture & POSIX" },
                { id: "all", label: "All Depths", desc: "Complete Overview" },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDepth(d.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedDepth === d.id
                    ? "bg-cyan text-void font-bold shadow-glow"
                    : "text-ink-secondary hover:text-ink-primary hover:bg-surface"
                }`}
                title={d.desc}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {article.terminalMissionId && (
          <Link to={`/terminal?mission=${article.terminalMissionId}`}>
            <Button size="sm" variant="secondary">
              <Terminal size={14} /> Practice in Terminal Playground
            </Button>
          </Link>
        )}
      </div>

      {/* Article Body Sections */}
      <div className="space-y-8">
        {(selectedDepth === "beginner" || selectedDepth === "all") && (
          <GlassPanel className="p-6 md:p-8 border-l-4 border-l-cyan">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 mb-4">
              <span className="font-display text-lg font-bold text-cyan flex items-center gap-2">
                <Sparkles size={18} /> Beginner Level: Foundational Mental Model
              </span>
              <span className="text-xs font-mono text-ink-muted">Everyday Language</span>
            </div>
            <div className="prose prose-invert max-w-none text-sm md:text-base text-ink-secondary leading-relaxed whitespace-pre-line">
              {article.content.beginner}
            </div>
          </GlassPanel>
        )}

        {(selectedDepth === "practical" || selectedDepth === "all") && (
          <GlassPanel className="p-6 md:p-8 border-l-4 border-l-electric">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 mb-4">
              <span className="font-display text-lg font-bold text-electric flex items-center gap-2">
                <Terminal size={18} /> Practical Level: Commands, Workflows & Fixes
              </span>
              <span className="text-xs font-mono text-ink-muted">Hands-On Application</span>
            </div>
            <div className="prose prose-invert max-w-none text-sm md:text-base text-ink-secondary leading-relaxed whitespace-pre-line font-mono text-xs md:text-sm">
              {article.content.practical}
            </div>
          </GlassPanel>
        )}

        {(selectedDepth === "technical" || selectedDepth === "all") && (
          <GlassPanel className="p-6 md:p-8 border-l-4 border-l-violet">
            <div className="flex items-center justify-between border-b border-line-subtle pb-3 mb-4">
              <span className="font-display text-lg font-bold text-violet flex items-center gap-2">
                <Layers size={18} /> Technical Level: Architecture & Kernel Internals
              </span>
              <span className="text-xs font-mono text-ink-muted">POSIX & System Specifications</span>
            </div>
            <div className="prose prose-invert max-w-none text-sm md:text-base text-ink-secondary leading-relaxed whitespace-pre-line">
              {article.content.technical}
            </div>
          </GlassPanel>
        )}
      </div>

      {/* Upstream Citations & Official References */}
      <div className="rounded-xl border border-line-subtle bg-base/60 p-6">
        <h4 className="font-bold text-sm text-ink-primary flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-cyan" />
          Official Documentation & Standards Sources:
        </h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {article.references.map((ref) => (
            <a
              key={ref.url}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-line-subtle bg-surface/50 p-3 text-xs text-ink-secondary hover:border-cyan hover:text-cyan transition-colors"
            >
              <span className="font-medium truncate mr-2">{ref.title}</span>
              <ExternalLink size={14} className="shrink-0 text-ink-muted" />
            </a>
          ))}
        </div>
      </div>

      {/* Tags & Related */}
      {article.related.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-ink-muted">Related Topics:</span>
          {article.related.map((relSlug) => (
            <button
              key={relSlug}
              onClick={() => onSelectArticle?.(relSlug)}
              className="rounded-full border border-line-subtle bg-surface px-3 py-1 text-xs text-cyan hover:border-cyan transition-colors"
            >
              {relSlug.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
