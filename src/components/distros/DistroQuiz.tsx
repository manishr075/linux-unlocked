import { useState } from "react";
import { DISTROS_DATA } from "@/content/distrosData";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Check,
} from "lucide-react";

interface QuestionOption {
  label: string;
  subtext: string;
  weights: Record<string, number>; // Maps distro ID to score increment
}

interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "What is your primary computing background?",
    subtitle: "Understanding your current habits helps us recommend a comfortable desktop interface.",
    options: [
      {
        label: "Windows 10 or 11 user",
        subtext: "I am used to the taskbar at the bottom, Start Menu, and familiar shortcuts.",
        weights: { mint: 30, zorin: 30, ubuntu: 10, popos: 10 },
      },
      {
        label: "macOS user",
        subtext: "I prefer clean docks, touchpad gestures, and distraction-free top panels.",
        weights: { fedora: 30, zorin: 25, popos: 15, ubuntu: 15 },
      },
      {
        label: "CS / IT student or software developer",
        subtext: "I know some programming and want good container and CLI tooling.",
        weights: { fedora: 30, ubuntu: 25, arch: 20, popos: 15 },
      },
      {
        label: "Complete beginner to computing",
        subtext: "I want an intuitive computer that just works without technical steps.",
        weights: { mint: 35, zorin: 30, ubuntu: 15 },
      },
    ],
  },
  {
    id: 2,
    title: "What hardware will you install Linux on?",
    subtitle: "Hardware drivers and age determine the best kernel and desktop environment.",
    options: [
      {
        label: "Dedicated gaming PC or laptop with NVIDIA graphics",
        subtext: "I need automated graphics switching and proprietary GPU driver support.",
        weights: { popos: 35, arch: 20, fedora: 15, ubuntu: 15 },
      },
      {
        label: "An older laptop or desktop (5 to 12 years old)",
        subtext: "I want to revive a computer that Windows 11 abandoned or made sluggish.",
        weights: { mint: 35, debian: 30, zorin: 20 },
      },
      {
        label: "A modern ultrabook or desktop with Intel/AMD graphics",
        subtext: "Standard modern hardware with full open-source Linux kernel support.",
        weights: { fedora: 25, ubuntu: 25, mint: 20, popos: 15 },
      },
      {
        label: "A home server, NAS, or secondary workstation",
        subtext: "Needs high uptime, stability, and headless or remote management.",
        weights: { debian: 40, ubuntu: 25, fedora: 10 },
      },
    ],
  },
  {
    id: 3,
    title: "What is your primary everyday workflow?",
    subtitle: "Different distributions optimize for different daily use cases.",
    options: [
      {
        label: "Everyday computing (web, office, streaming, media)",
        subtext: "Browsing, YouTube, document editing, and communicating.",
        weights: { mint: 30, zorin: 30, ubuntu: 15 },
      },
      {
        label: "PC Gaming via Steam, Proton, and emulation",
        subtext: "Running modern games with high frame rates and controller support.",
        weights: { popos: 35, arch: 25, fedora: 20 },
      },
      {
        label: "Software development, Docker, and DevOps",
        subtext: "Compilers, programming runtimes, containers, and Git workflows.",
        weights: { fedora: 35, ubuntu: 25, arch: 20 },
      },
      {
        label: "Deep technical exploration and custom craftsmanship",
        subtext: "I want to assemble my own tailored operating system from scratch.",
        weights: { arch: 40, debian: 20, fedora: 15 },
      },
    ],
  },
  {
    id: 4,
    title: "What desktop interface style do you prefer?",
    subtitle: "Linux offers total visual modularity.",
    options: [
      {
        label: "Traditional Windows taskbar & Start Menu",
        subtext: "Taskbar at the bottom, system tray on right, application menu on left.",
        weights: { mint: 35, zorin: 30, debian: 10 },
      },
      {
        label: "Modern, gesture-focused interface (GNOME)",
        subtext: "Three-finger swipe between workspaces, clean top bar, dynamic overview.",
        weights: { fedora: 35, ubuntu: 25, popos: 15 },
      },
      {
        label: "Automatic keyboard-driven tiling windows",
        subtext: "Windows arrange into automatic grids without mouse dragging.",
        weights: { popos: 30, arch: 30, fedora: 15 },
      },
      {
        label: "I want to switch or customize layouts with one click",
        subtext: "Let me choose between Windows 11, Windows Classic, or macOS styles.",
        weights: { zorin: 40, mint: 15 },
      },
    ],
  },
  {
    id: 5,
    title: "How do you prefer software updates to arrive?",
    subtitle: "Choosing between rock-solid fixed milestones vs continuous updates.",
    options: [
      {
        label: "Rock-solid stability: updates must never break anything",
        subtext: "Keep software versions fixed for 2-5 years; only apply tested security patches.",
        weights: { debian: 35, mint: 30, ubuntu: 20 },
      },
      {
        label: "Balanced: smooth updates every 6 to 12 months",
        subtext: "Access modern kernels and apps while maintaining tested release checkpoints.",
        weights: { fedora: 30, popos: 25, ubuntu: 25, zorin: 20 },
      },
      {
        label: "Continuous bleeding-edge rolling releases",
        subtext: "Give me the newest software and kernel drivers the day developers release them.",
        weights: { arch: 40, fedora: 15 },
      },
    ],
  },
  {
    id: 6,
    title: "What is your appetite for command-line maintenance?",
    subtitle: "How much interaction with the terminal do you want in your daily life?",
    options: [
      {
        label: "Zero / Minimal — I want a graphical button for everything",
        subtext: "Software store, driver managers, and update notifications through a GUI.",
        weights: { mint: 35, zorin: 30, ubuntu: 15 },
      },
      {
        label: "Comfortable with occasional commands if instructed",
        subtext: "I don't mind copy-pasting an install command or running updates via CLI.",
        weights: { fedora: 25, ubuntu: 25, popos: 25 },
      },
      {
        label: "I prefer configuring my system via configuration files & CLI",
        subtext: "The terminal is my primary home and I want complete transparency.",
        weights: { arch: 40, debian: 25 },
      },
    ],
  },
];

interface DistroQuizProps {
  onSelectDistro?: (slug: string) => void;
}

export function DistroQuiz({ onSelectDistro }: DistroQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentStep] = optionIndex;
    setSelectedAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
  };

  // Compute recommendation scores
  const scoreResults = () => {
    const scores: Record<string, number> = {
      mint: 0,
      ubuntu: 0,
      fedora: 0,
      debian: 0,
      arch: 0,
      zorin: 0,
      popos: 0,
    };

    selectedAnswers.forEach((answerIndex, questionIndex) => {
      const q = QUIZ_QUESTIONS[questionIndex];
      const opt = q?.options[answerIndex];
      if (opt) {
        Object.entries(opt.weights).forEach(([distroId, weight]) => {
          scores[distroId] = (scores[distroId] || 0) + weight;
        });
      }
    });

    const sorted = Object.entries(scores)
      .map(([id, score]) => ({
        distro: DISTROS_DATA.find((d) => d.id === id)!,
        score,
      }))
      .filter((s) => s.distro)
      .sort((a, b) => b.score - a.score);

    const maxScore = sorted[0]?.score || 1;
    return sorted.map((s) => ({
      ...s,
      matchPercentage: Math.min(99, Math.round((s.score / maxScore) * 95)),
    }));
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="max-w-3xl mx-auto">
      {!quizFinished ? (
        /* Quiz Questions Flow */
        <GlassPanel className="p-6 md:p-10 border-line-accent/50 shadow-2xl animate-fadeIn">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-line-subtle pb-4 mb-6">
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
              Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <div className="flex gap-1">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-colors ${
                    i <= currentStep ? "bg-cyan" : "bg-surface"
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-ink-primary md:text-3xl">
            {currentQ.title}
          </h2>
          <p className="mt-2 text-sm text-ink-secondary">
            {currentQ.subtitle}
          </p>

          {/* Options Grid */}
          <div className="mt-8 space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentStep] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-cyan bg-cyan/15 text-cyan font-bold shadow-glow scale-[1.01]"
                      : "border-line-subtle bg-surface/60 text-ink-secondary hover:border-line hover:bg-surface hover:text-ink-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm md:text-base text-ink-primary">
                      {opt.label}
                    </span>
                    {isSelected && <Check size={18} className="text-cyan shrink-0" />}
                  </div>
                  <p className="mt-1 text-xs text-ink-secondary">
                    {opt.subtext}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-line-subtle">
            {currentStep > 0 ? (
              <Button size="sm" variant="ghost" onClick={handleBack}>
                <ArrowLeft size={16} /> Previous Question
              </Button>
            ) : (
              <span />
            )}
            <span className="text-xs text-ink-muted">
              Select an option to advance
            </span>
          </div>
        </GlassPanel>
      ) : (
        /* Results Recommendation View */
        <div className="space-y-8 animate-fadeIn">
          {(() => {
            const results = scoreResults();
            const topMatch = results[0];
            const runnerUp = results[1];

            return (
              <>
                {/* Winner Card */}
                <GlassPanel className="p-8 md:p-10 border-2 border-cyan shadow-glow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-cyan text-void font-bold text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                    {topMatch.matchPercentage}% Compatibility Match
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-cyan" size={24} />
                    <span className="font-mono text-xs uppercase font-bold text-cyan tracking-wider">
                      Recommended For Your Computing Needs
                    </span>
                  </div>

                  <h2 className="font-display text-3xl font-extrabold text-ink-primary md:text-5xl">
                    {topMatch.distro.name}
                  </h2>
                  <p className="mt-2 text-base text-ink-secondary font-medium">
                    {topMatch.distro.tagline}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-line-subtle bg-base/60 p-4">
                      <span className="font-semibold text-xs text-cyan block mb-1">
                        Why this is your ideal match:
                      </span>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        Based on your answers, {topMatch.distro.name} delivers the ideal balance of {topMatch.distro.defaultDesktop} desktop familiarity, {topMatch.distro.maintenanceLevel.toLowerCase()} maintenance demands, and dependable software packaging.
                      </p>
                    </div>

                    <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                      <span className="font-semibold text-xs text-warning block mb-1 flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Honest Trade-off to Know:
                      </span>
                      <p className="text-xs text-ink-secondary leading-relaxed">
                        {topMatch.distro.tradeoffs}
                      </p>
                    </div>
                  </div>

                  {/* Distro Specs Strip */}
                  <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono">
                    <span className="rounded bg-elevated px-3 py-1 text-ink-primary">
                      Desktop: {topMatch.distro.defaultDesktop}
                    </span>
                    <span className="rounded bg-elevated px-3 py-1 text-ink-primary">
                      Release: {topMatch.distro.releaseModel}
                    </span>
                    <span className="rounded bg-elevated px-3 py-1 text-ink-primary">
                      Package Format: {topMatch.distro.packageFormat}
                    </span>
                    <span className="rounded bg-elevated px-3 py-1 text-cyan">
                      RAM Rec: {topMatch.distro.hardwareRequirements.recRam}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={topMatch.distro.officialSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast ease-soft bg-cyan text-ink-onAccent hover:brightness-110 shadow-glow rounded-lg text-base px-6 py-3"
                    >
                      Visit Official Site <ExternalLink size={16} />
                    </a>
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => onSelectDistro?.(topMatch.distro.slug)}
                    >
                      Read Deep Dive Spec
                    </Button>
                    <Button size="lg" variant="ghost" onClick={handleRestart}>
                      <RotateCcw size={16} /> Retake Quiz
                    </Button>
                  </div>
                </GlassPanel>

                {/* Runner Up Alternative */}
                {runnerUp && (
                  <div className="rounded-xl border border-line-subtle bg-surface/70 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono text-ink-muted uppercase">
                        Alternative Strong Contender ({runnerUp.matchPercentage}% Match)
                      </span>
                      <h4 className="text-xl font-bold text-ink-primary mt-1">
                        {runnerUp.distro.name}
                      </h4>
                      <p className="text-xs text-ink-secondary mt-1">
                        {runnerUp.distro.tagline}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onSelectDistro?.(runnerUp.distro.slug)}
                    >
                      Compare with Winner <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
