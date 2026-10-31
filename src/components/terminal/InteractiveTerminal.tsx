import { useState, useRef, useEffect } from "react";
import { ShellEngine, type CommandResult } from "@/simulations/shell/ShellEngine";
import { VirtualFileSystem } from "@/simulations/filesystem/FileSystem";
import {
  Terminal as TerminalIcon,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface TerminalHistoryItem {
  prompt: string;
  command: string;
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface InteractiveTerminalProps {
  onCommandExecuted?: (cmd: string, result: CommandResult, vfs: VirtualFileSystem) => void;
  initialWelcome?: boolean;
}

export function InteractiveTerminal({
  onCommandExecuted,
  initialWelcome = true,
}: InteractiveTerminalProps) {
  const [engine] = useState(() => new ShellEngine());
  const [history, setHistory] = useState<TerminalHistoryItem[]>(() => {
    if (!initialWelcome) return [];
    return [
      {
        prompt: "curious@linux-unlocked:~# ",
        command: "cat welcome.txt",
        stdout:
          "Welcome to LINUX UNLOCKED Interactive Sandbox!\n" +
          "Type 'help' to see available commands or select a guided mission on the right.\n" +
          "Everything runs safely inside your browser memory — no real files are modified.\n",
        stderr: "",
        exitCode: 0,
      },
    ];
  });

  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever history updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on mount and on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow Up: navigate backward in command history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const pastCommands = engine.getHistory();
      if (pastCommands.length === 0) return;

      const newIdx = historyIndex === null ? pastCommands.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInputVal(pastCommands[newIdx] || "");
    }
    // Arrow Down: navigate forward in command history
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      const pastCommands = engine.getHistory();
      if (historyIndex === null) return;

      const newIdx = historyIndex + 1;
      if (newIdx >= pastCommands.length) {
        setHistoryIndex(null);
        setInputVal("");
      } else {
        setHistoryIndex(newIdx);
        setInputVal(pastCommands[newIdx] || "");
      }
    }
    // Tab: Auto-complete files & commands
    else if (e.key === "Tab") {
      e.preventDefault();
      const tokens = inputVal.split(" ");
      const lastToken = tokens[tokens.length - 1];

      // Auto-complete commands
      if (tokens.length === 1) {
        const candidateCmds = ["pwd", "ls", "cd", "mkdir", "touch", "cat", "echo", "chmod", "grep", "find", "cp", "mv", "whoami", "clear", "help", "uname", "df"];
        const match = candidateCmds.find((c) => c.startsWith(lastToken));
        if (match) setInputVal(match + " ");
      } else {
        // Auto-complete files in current directory
        const items = engine.getVfs().listDir();
        if (items) {
          const match = items.find((i) => i.name.startsWith(lastToken));
          if (match) {
            tokens[tokens.length - 1] = match.name;
            setInputVal(tokens.join(" ") + (match.type === "dir" ? "/" : " "));
          }
        }
      }
    }
    // Ctrl+L: Clear screen
    else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setHistory([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = engine.getPrompt();
    const cmd = inputVal;

    if (cmd.trim() === "clear") {
      setHistory([]);
      setInputVal("");
      setHistoryIndex(null);
      return;
    }

    const result = engine.execute(cmd);

    setHistory((prev) => [
      ...prev,
      {
        prompt,
        command: cmd,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      },
    ]);

    setInputVal("");
    setHistoryIndex(null);

    onCommandExecuted?.(cmd, result, engine.getVfs());
  };

  const runQuickCommand = (cmd: string) => {
    const prompt = engine.getPrompt();
    const result = engine.execute(cmd);
    setHistory((prev) => [
      ...prev,
      {
        prompt,
        command: cmd,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
      },
    ]);
    onCommandExecuted?.(cmd, result, engine.getVfs());
  };

  const handleResetVfs = () => {
    engine.getVfs().seedDefaultTree();
    setHistory([
      {
        prompt: "system# ",
        command: "reset",
        stdout: "Virtual filesystem reset to initial state.\n",
        stderr: "",
        exitCode: 0,
      },
    ]);
  };

  return (
    <div
      onClick={focusInput}
      className={`rounded-2xl border border-line-accent/40 bg-void flex flex-col font-mono text-xs md:text-sm overflow-hidden shadow-2xl transition-all ${
        isMaximized ? "fixed inset-4 z-modal" : "min-h-[480px] max-h-[640px]"
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-line-subtle bg-surface/80 px-4 py-2.5 backdrop-blur-md select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-error/70" />
            <div className="h-3 w-3 rounded-full bg-warning/70" />
            <div className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          <span className="ml-2 flex items-center gap-1.5 font-bold text-ink-primary text-xs">
            <TerminalIcon size={14} className="text-cyan" />
            curious@linux-unlocked: {engine.getVfs().getCurrentDir()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Command Helper Chips */}
          <div className="hidden sm:flex items-center gap-1">
            {["pwd", "ls -l", "cd ~", "help"].map((qc) => (
              <button
                key={qc}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  runQuickCommand(qc);
                }}
                className="rounded bg-elevated/70 px-2 py-0.5 text-[11px] text-ink-muted hover:text-cyan hover:bg-elevated transition-colors"
              >
                {qc}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleResetVfs();
            }}
            className="rounded p-1 text-ink-muted hover:text-warning"
            title="Reset Virtual Filesystem"
          >
            <RotateCcw size={14} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="rounded p-1 text-ink-muted hover:text-ink-primary"
            title={isMaximized ? "Restore view" : "Maximize terminal"}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Terminal Buffer Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 cursor-text">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {/* Command Line */}
            <div className="flex items-baseline gap-2">
              <span className="text-cyan font-bold select-none">{item.prompt}</span>
              <span className="text-ink-primary font-semibold">{item.command}</span>
            </div>

            {/* Standard Output */}
            {item.stdout && (
              <pre className="whitespace-pre-wrap text-ink-secondary text-xs leading-relaxed">
                {item.stdout}
              </pre>
            )}

            {/* Standard Error */}
            {item.stderr && (
              <pre className="whitespace-pre-wrap text-error text-xs font-semibold leading-relaxed">
                {item.stderr}
              </pre>
            )}
          </div>
        ))}

        {/* Active Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
          <span className="text-cyan font-bold select-none shrink-0">
            {engine.getPrompt()}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="flex-1 bg-transparent text-ink-primary focus:outline-none caret-cyan text-xs md:text-sm"
          />
        </form>

        <div ref={bottomRef} />
      </div>

      {/* Terminal Footer Status */}
      <div className="flex items-center justify-between border-t border-line-subtle bg-base/60 px-4 py-1.5 text-[11px] text-ink-muted">
        <span>VFS: in-memory • Sandbox active</span>
        <span>Tab: auto-complete • ↑↓: history</span>
      </div>
    </div>
  );
}
