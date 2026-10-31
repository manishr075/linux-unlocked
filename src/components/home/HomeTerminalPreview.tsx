import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ShellEngine } from "@/simulations/shell/ShellEngine";
import { ArrowRight, CornerDownLeft, Sparkles, Copy, Check } from "lucide-react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "error";
  text: string;
}

const SUGGESTED_COMMANDS = [
  { cmd: "uname -a", label: "Kernel Version" },
  { cmd: "cat /etc/os-release", label: "OS Identity" },
  { cmd: "free -h", label: "Memory Usage" },
  { cmd: "ls -la", label: "List Home Files" },
  { cmd: "cat welcome.txt", label: "Read Welcome" },
];

export function HomeTerminalPreview() {
  const [shell] = useState(() => new ShellEngine());
  const [inputVal, setInputVal] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "init-1",
      type: "output",
      text: "Linux Unlocked In-Memory POSIX Shell (v6.10-lts-virtual)",
    },
    {
      id: "init-2",
      type: "output",
      text: "Type any command or click a quick shortcut chip below:",
    },
  ]);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setLines([]);
      setInputVal("");
      return;
    }

    const res = shell.execute(trimmed);
    const newItems: TerminalLine[] = [
      { id: String(Date.now()), type: "input", text: `curious@unlocked:~$ ${trimmed}` },
    ];

    if (res.stdout) {
      newItems.push({ id: String(Date.now() + 1), type: "output", text: res.stdout.trimEnd() });
    }
    if (res.stderr) {
      newItems.push({ id: String(Date.now() + 2), type: "error", text: res.stderr.trimEnd() });
    }

    setLines((prev) => [...prev, ...newItems]);
    setInputVal("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRunCommand(inputVal);
    }
  };

  const copyLog = () => {
    const text = lines.map((l) => l.text).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#07090e] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.08)]">
      {/* Chrome Window Titlebar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.03] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80 hover:brightness-125 transition-colors" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80 hover:brightness-125 transition-colors" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80 hover:brightness-125 transition-colors" />
          </div>
          <span className="ml-2 font-mono text-xs text-ink-muted">curious@linux-unlocked: ~ (bash 5.2)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyLog}
            className="flex items-center gap-1 rounded border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[11px] text-ink-muted hover:text-ink-primary transition-colors"
            title="Copy terminal session"
          >
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <Link
            to="/terminal"
            className="flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
          >
            Open Full Shell <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Suggested Command Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.06] bg-black/40 px-4 py-2 text-xs">
        <span className="text-[11px] font-medium text-ink-muted flex items-center gap-1 mr-1">
          <Sparkles size={12} className="text-cyan" /> Quick run:
        </span>
        {SUGGESTED_COMMANDS.map((sc) => (
          <button
            key={sc.cmd}
            onClick={() => handleRunCommand(sc.cmd)}
            className="rounded border border-cyan/20 bg-cyan/5 px-2 py-0.5 font-mono text-[11px] text-cyan hover:bg-cyan/15 hover:border-cyan/40 transition-colors"
          >
            {sc.cmd}
          </button>
        ))}
      </div>

      {/* Terminal Output Area */}
      <div className="h-64 overflow-y-auto p-4 font-mono text-xs leading-relaxed text-ink-primary select-text">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`whitespace-pre-wrap ${
              l.type === "input"
                ? "font-semibold text-cyan"
                : l.type === "error"
                ? "text-red-400"
                : "text-slate-300"
            }`}
          >
            {l.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input Prompt */}
      <div className="flex items-center border-t border-white/[0.08] bg-white/[0.02] px-4 py-2.5">
        <span className="font-mono text-xs font-bold text-cyan shrink-0">curious@unlocked:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type command (e.g. ls, pwd, cat /etc/hosts) and press Enter..."
          className="ml-2 w-full bg-transparent font-mono text-xs text-ink-primary placeholder-slate-600 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={() => handleRunCommand(inputVal)}
          disabled={!inputVal.trim()}
          className="ml-2 flex items-center gap-1 rounded bg-cyan/10 px-2 py-1 text-[11px] font-medium text-cyan hover:bg-cyan/20 disabled:opacity-30 transition-colors"
        >
          <span>Run</span>
          <CornerDownLeft size={11} />
        </button>
      </div>
    </div>
  );
}
