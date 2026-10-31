import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  Compass,
  Terminal,
  Cpu,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: typeof Compass;
  targetAudience: string;
  estimatedHours: string;
  articleSlugs: string[];
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "switcher-roadmap",
    title: "Windows to Linux Migration Mastery",
    description: "From unlearning drive letters and registry files to choosing your first distribution and daily workflow.",
    icon: Compass,
    targetAudience: "Windows & macOS Users",
    estimatedHours: "2 Hours",
    articleSlugs: [
      "unix-philosophy",
      "rolling-vs-point-release",
      "linux-filesystem-hierarchy",
      "modern-package-formats",
      "linux-gaming-proton",
    ],
  },
  {
    id: "terminal-craftsman",
    title: "The Terminal Craftsman: Shell & Automation",
    description: "Master navigation, file manipulation, pipelines, file permissions, and process management.",
    icon: Terminal,
    targetAudience: "Students & Developers",
    estimatedHours: "3 Hours",
    articleSlugs: [
      "terminal-core-navigation",
      "unix-philosophy",
      "linux-filesystem-hierarchy",
      "linux-permissions-chmod",
    ],
  },
  {
    id: "systems-deep-dive",
    title: "Kernel & Systems Architecture",
    description: "Deep dive into process scheduling, VFS, system calls, memory paging, and hardware abstraction.",
    icon: Cpu,
    targetAudience: "Sysadmins & Computer Science Students",
    estimatedHours: "4 Hours",
    articleSlugs: [
      "linux-kernel-architecture",
      "linux-security-hardening",
      "containers-docker-podman",
      "linux-permissions-chmod",
    ],
  },
];

interface LearningPathsProps {
  onSelectArticle: (slug: string) => void;
}

export function LearningPaths({ onSelectArticle }: LearningPathsProps) {
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("linux_unlocked_read_articles");
      if (saved) setCompletedArticles(JSON.parse(saved));
    } catch {
      // ignore local storage errors
    }
  }, []);

  const toggleArticleCompleted = (slug: string) => {
    setCompletedArticles((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem("linux_unlocked_read_articles", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {LEARNING_PATHS.map((path) => {
          const Icon = path.icon;
          const completedCount = path.articleSlugs.filter((s) =>
            completedArticles.includes(s)
          ).length;
          const progressPercent = Math.round((completedCount / path.articleSlugs.length) * 100);

          return (
            <GlassPanel key={path.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="rounded-lg bg-cyan/10 p-2 text-cyan">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-mono text-ink-muted">
                    {path.estimatedHours}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-ink-primary">
                  {path.title}
                </h3>
                <p className="mt-2 text-xs text-ink-secondary leading-relaxed">
                  {path.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono mb-1 text-ink-muted">
                    <span>Progress: {completedCount}/{path.articleSlugs.length}</span>
                    <span className="text-cyan font-bold">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface overflow-hidden">
                    <div
                      className="h-full bg-cyan transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Step List */}
                <div className="mt-5 space-y-2">
                  {path.articleSlugs.map((slug, idx) => {
                    const isDone = completedArticles.includes(slug);
                    return (
                      <div
                        key={slug}
                        className="flex items-center justify-between text-xs rounded p-1.5 hover:bg-surface/60 transition-colors"
                      >
                        <button
                          onClick={() => onSelectArticle(slug)}
                          className="flex items-center gap-2 text-left truncate mr-2 text-ink-secondary hover:text-cyan"
                        >
                          <span className="font-mono text-[10px] text-ink-muted">{idx + 1}.</span>
                          <span className="truncate capitalize">{slug.replace(/-/g, " ")}</span>
                        </button>
                        <button
                          onClick={() => toggleArticleCompleted(slug)}
                          className="shrink-0 text-ink-muted hover:text-success"
                          title={isDone ? "Mark incomplete" : "Mark completed"}
                        >
                          {isDone ? (
                            <CheckCircle2 size={14} className="text-success" />
                          ) : (
                            <Circle size={14} />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-line-subtle">
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-between text-xs text-cyan"
                  onClick={() => onSelectArticle(path.articleSlugs[0])}
                >
                  <span>Start Curriculum</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
