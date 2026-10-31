/* ============================================================
   LINUX UNLOCKED — Sandboxed Shell Engine
   ------------------------------------------------------------
   Pure in-browser POSIX command evaluator.
   Supports pipelines (|), redirects (>, >>), flag parsing,
   and deterministic simulation over the VirtualFileSystem.
   Never invokes native commands or makes remote network calls.
   ============================================================ */

import { VirtualFileSystem, type VNode } from "../filesystem/FileSystem";

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class ShellEngine {
  private vfs: VirtualFileSystem;
  private history: string[] = [];
  private user = "curious";
  private hostname = "linux-unlocked";

  constructor(vfs?: VirtualFileSystem) {
    this.vfs = vfs ?? new VirtualFileSystem();
  }

  public getVfs(): VirtualFileSystem {
    return this.vfs;
  }

  public getPrompt(): string {
    const cwd = this.vfs.getCurrentDir();
    const displayDir = cwd.startsWith("/home/curious")
      ? "~" + cwd.slice("/home/curious".length)
      : cwd;
    return `${this.user}@${this.hostname}:${displayDir || "/"}# `;
  }

  public getHistory(): string[] {
    return [...this.history];
  }

  /** Splits a string by delimiter only when delimiter is outside single or double quotes */
  private splitUnquoted(str: string, delimiter: string): string[] {
    const parts: string[] = [];
    let current = "";
    let inDouble = false;
    let inSingle = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '"' && !inSingle) {
        inDouble = !inDouble;
        current += char;
      } else if (char === "'" && !inDouble) {
        inSingle = !inSingle;
        current += char;
      } else if (!inDouble && !inSingle && str.startsWith(delimiter, i)) {
        parts.push(current);
        current = "";
        i += delimiter.length - 1;
      } else {
        current += char;
      }
    }
    parts.push(current);
    return parts;
  }

  /** Primary entry point: Evaluates a full command line */
  public execute(commandLine: string): CommandResult {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      return { stdout: "", stderr: "", exitCode: 0 };
    }

    this.history.push(trimmed);

    // Check for redirection first (outside quotes)
    const appendParts = this.splitUnquoted(trimmed, ">>");
    if (appendParts.length > 1) {
      return this.executeWithRedirectionTarget(
        appendParts[0],
        appendParts.slice(1).join(">>").trim(),
        true
      );
    }

    const redirectParts = this.splitUnquoted(trimmed, ">");
    if (redirectParts.length > 1) {
      return this.executeWithRedirectionTarget(
        redirectParts[0],
        redirectParts.slice(1).join(">").trim(),
        false
      );
    }

    // Check for pipeline (| outside quotes)
    const pipeParts = this.splitUnquoted(trimmed, "|");
    if (pipeParts.length > 1) {
      return this.executePipelineParts(pipeParts.map((p) => p.trim()));
    }

    return this.executeSingle(trimmed);
  }

  private executeWithRedirectionTarget(
    leftCmd: string,
    targetFile: string,
    isAppend: boolean
  ): CommandResult {
    if (!targetFile) {
      return { stdout: "", stderr: "syntax error near unexpected token 'newline'", exitCode: 2 };
    }

    const pipeParts = this.splitUnquoted(leftCmd.trim(), "|");
    const execResult =
      pipeParts.length > 1
        ? this.executePipelineParts(pipeParts.map((p) => p.trim()))
        : this.executeSingle(leftCmd.trim());

    if (execResult.exitCode !== 0) {
      return execResult;
    }

    const cleanTarget = targetFile.replace(/^["']|["']$/g, "").trim();

    const success = isAppend
      ? this.vfs.appendFile(cleanTarget, execResult.stdout)
      : this.vfs.writeFile(cleanTarget, execResult.stdout);

    if (!success) {
      return {
        stdout: "",
        stderr: `cannot write to '${cleanTarget}': permission denied or invalid path`,
        exitCode: 1,
      };
    }

    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private executePipelineParts(parts: string[]): CommandResult {
    let currentInput = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const result = this.executeSingleWithStdin(part, currentInput);
      if (result.exitCode !== 0) {
        return result;
      }
      currentInput = result.stdout;
    }

    return { stdout: currentInput, stderr: "", exitCode: 0 };
  }

  /** Tokenizes arguments respecting single and double quotes */
  private tokenize(str: string): string[] {
    const tokens: string[] = [];
    let current = "";
    let inDouble = false;
    let inSingle = false;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (char === '"' && !inSingle) {
        inDouble = !inDouble;
      } else if (char === "'" && !inDouble) {
        inSingle = !inSingle;
      } else if (char === " " && !inDouble && !inSingle) {
        if (current.length > 0) {
          tokens.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  private executeSingle(cmdStr: string): CommandResult {
    return this.executeSingleWithStdin(cmdStr, "");
  }

  private executeSingleWithStdin(cmdStr: string, stdin: string): CommandResult {
    const tokens = this.tokenize(cmdStr);
    if (tokens.length === 0) {
      return { stdout: "", stderr: "", exitCode: 0 };
    }

    const cmd = tokens[0];
    const args = tokens.slice(1);

    switch (cmd) {
      case "pwd":
        return { stdout: this.vfs.getCurrentDir() + "\n", stderr: "", exitCode: 0 };

      case "whoami":
        return { stdout: this.user + "\n", stderr: "", exitCode: 0 };

      case "clear":
        return { stdout: "\x1b[2J\x1b[H", stderr: "", exitCode: 0 };

      case "history":
        return {
          stdout: this.history.map((h, i) => `  ${i + 1}  ${h}`).join("\n") + "\n",
          stderr: "",
          exitCode: 0,
        };

      case "uname":
        if (args.includes("-r")) {
          return { stdout: "6.12.0-unlocked-x86_64\n", stderr: "", exitCode: 0 };
        }
        if (args.includes("-a") || args.length === 0) {
          return {
            stdout: "Linux linux-unlocked 6.12.0-unlocked-x86_64 #1 SMP PREEMPT_DYNAMIC Oct 2026 x86_64 GNU/Linux\n",
            stderr: "",
            exitCode: 0,
          };
        }
        return { stdout: "Linux\n", stderr: "", exitCode: 0 };

      case "cd":
        return this.handleCd(args);

      case "ls":
        return this.handleLs(args);

      case "mkdir":
        return this.handleMkdir(args);

      case "rm":
        return this.handleRm(args);

      case "touch":
        return this.handleTouch(args);

      case "cat":
        return this.handleCat(args, stdin);

      case "head":
        return this.handleHead(args, stdin);

      case "tail":
        return this.handleTail(args, stdin);

      case "date":
        return this.handleDate();

      case "echo":
        return this.handleEcho(args);

      case "chmod":
        return this.handleChmod(args);

      case "cp":
        return this.handleCp(args);

      case "mv":
        return this.handleMv(args);

      case "grep":
        return this.handleGrep(args, stdin);

      case "find":
        return this.handleFind(args);

      case "df":
        return {
          stdout:
            "Filesystem     1K-blocks      Used Available Use% Mounted on\n" +
            "/dev/root       61245000  18432000  39689000  32% /\n" +
            "tmpfs            8142000         0   8142000   0% /dev/shm\n",
          stderr: "",
          exitCode: 0,
        };

      case "help":
        return {
          stdout:
            "LINUX UNLOCKED — Interactive Sandboxed Shell Commands:\n\n" +
            "  Navigation:    pwd, cd [dir], ls [-l, -a, -la]\n" +
            "  Files & Dirs:  mkdir [-p], touch [file], rm [-r, -f], cp [src] [dst], mv [src] [dst]\n" +
            "  Inspection:    cat [file], grep [pattern] [file], head [-n N], tail [-n N], find [path]\n" +
            "  Permissions:   chmod [mode] [file]\n" +
            "  System Stats:  whoami, uname [-a, -r], date, df [-h], history, clear\n" +
            "  Operators:     Pipelines (|), Output Redirection (>), Append (>>)\n\n" +
            "Tip: Practice hands-on challenges in the Guided Missions tab!\n",
          stderr: "",
          exitCode: 0,
        };

      default:
        return {
          stdout: "",
          stderr: `${cmd}: command not found. Type 'help' to see available sandbox commands.`,
          exitCode: 127,
        };
    }
  }

  private handleCd(args: string[]): CommandResult {
    const target = args[0] || "~";
    const ok = this.vfs.setCurrentDir(target);
    if (!ok) {
      return { stdout: "", stderr: `cd: ${target}: No such file or directory`, exitCode: 1 };
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleLs(args: string[]): CommandResult {
    const showHidden = args.some((a) => a.includes("a"));
    const showLong = args.some((a) => a.includes("l"));
    const pathArgs = args.filter((a) => !a.startsWith("-"));
    const targetPath = pathArgs[0] || this.vfs.getCurrentDir();

    const resolvedPath = this.vfs.resolvePath(targetPath);
    const targetNode = this.vfs.getNode(resolvedPath);
    if (!targetNode) {
      return { stdout: "", stderr: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 };
    }

    let items: VNode[];
    if (targetNode.type === "dir") {
      const dirItems = this.vfs.listDir(targetPath);
      if (!dirItems) {
        return { stdout: "", stderr: `ls: cannot access '${targetPath}': No such file or directory`, exitCode: 2 };
      }
      items = showHidden ? dirItems : dirItems.filter((i) => !i.name.startsWith("."));
    } else {
      items = [targetNode];
    }

    if (showLong) {
      const lines = items.map((item) => {
        const typeChar = item.type === "dir" ? "d" : "-";
        const permStr = this.modeToSymbolic(item.permissions);
        const size = item.type === "dir" ? 4096 : (item.content?.length || 0);
        const dateStr = item.modifiedAt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        return `${typeChar}${permStr} 1 ${item.owner} ${item.group} ${size.toString().padStart(6)} ${dateStr} ${item.name}`;
      });
      return { stdout: lines.join("\n") + (lines.length ? "\n" : ""), stderr: "", exitCode: 0 };
    }

    const names = items.map((i) => (i.type === "dir" ? `${i.name}/` : i.name));
    return { stdout: names.join("  ") + (names.length ? "\n" : ""), stderr: "", exitCode: 0 };
  }

  private handleMkdir(args: string[]): CommandResult {
    const makeParents = args.includes("-p");
    const targets = args.filter((a) => !a.startsWith("-"));

    if (targets.length === 0) {
      return { stdout: "", stderr: "mkdir: missing operand", exitCode: 1 };
    }

    for (const target of targets) {
      const ok = this.vfs.mkdir(target, makeParents);
      if (!ok) {
        return { stdout: "", stderr: `mkdir: cannot create directory '${target}': No such file or directory`, exitCode: 1 };
      }
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleRm(args: string[]): CommandResult {
    const flags = args.filter((a) => a.startsWith("-"));
    const isRecursive = flags.some((a) => a.includes("r") || a.includes("R"));
    const isForce = flags.some((a) => a.includes("f"));
    const targets = args.filter((a) => !a.startsWith("-"));

    if (targets.length === 0) {
      if (isForce) return { stdout: "", stderr: "", exitCode: 0 };
      return { stdout: "", stderr: "rm: missing operand", exitCode: 1 };
    }

    for (const target of targets) {
      const resolved = this.vfs.resolvePath(target);
      const node = this.vfs.getNode(resolved);
      if (!node) {
        if (!isForce) {
          return { stdout: "", stderr: `rm: cannot remove '${target}': No such file or directory`, exitCode: 1 };
        }
        continue;
      }

      if (node.type === "dir" && !isRecursive) {
        return { stdout: "", stderr: `rm: cannot remove '${target}': Is a directory`, exitCode: 1 };
      }

      const ok = this.vfs.remove(target, isRecursive);
      if (!ok && !isForce) {
        return { stdout: "", stderr: `rm: cannot remove '${target}'`, exitCode: 1 };
      }
    }

    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleHead(args: string[], stdin: string): CommandResult {
    let count = 10;
    const cleanArgs: string[] = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-n" && i + 1 < args.length) {
        count = parseInt(args[i + 1], 10) || 10;
        i++;
      } else if (args[i].startsWith("-n")) {
        count = parseInt(args[i].slice(2), 10) || 10;
      } else {
        cleanArgs.push(args[i]);
      }
    }

    let text = stdin;
    if (cleanArgs.length > 0) {
      const content = this.vfs.readFile(cleanArgs[0]);
      if (content === null) {
        return { stdout: "", stderr: `head: cannot open '${cleanArgs[0]}': No such file or directory`, exitCode: 1 };
      }
      text = content;
    }

    const lines = text.endsWith("\n") ? text.slice(0, -1).split("\n") : text.split("\n");
    const selected = lines.slice(0, count);
    return { stdout: selected.join("\n") + (selected.length ? "\n" : ""), stderr: "", exitCode: 0 };
  }

  private handleTail(args: string[], stdin: string): CommandResult {
    let count = 10;
    const cleanArgs: string[] = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-n" && i + 1 < args.length) {
        count = parseInt(args[i + 1], 10) || 10;
        i++;
      } else if (args[i].startsWith("-n")) {
        count = parseInt(args[i].slice(2), 10) || 10;
      } else {
        cleanArgs.push(args[i]);
      }
    }

    let text = stdin;
    if (cleanArgs.length > 0) {
      const content = this.vfs.readFile(cleanArgs[0]);
      if (content === null) {
        return { stdout: "", stderr: `tail: cannot open '${cleanArgs[0]}': No such file or directory`, exitCode: 1 };
      }
      text = content;
    }

    const lines = text.endsWith("\n") ? text.slice(0, -1).split("\n") : text.split("\n");
    const selected = lines.slice(-count);
    return { stdout: selected.join("\n") + (selected.length ? "\n" : ""), stderr: "", exitCode: 0 };
  }

  private handleDate(): CommandResult {
    return { stdout: new Date().toUTCString() + "\n", stderr: "", exitCode: 0 };
  }

  private handleTouch(args: string[]): CommandResult {
    if (args.length === 0) {
      return { stdout: "", stderr: "touch: missing file operand", exitCode: 1 };
    }
    for (const target of args) {
      const existing = this.vfs.readFile(target);
      if (existing === null) {
        this.vfs.writeFile(target, "");
      }
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleCat(args: string[], stdin: string): CommandResult {
    if (args.length === 0) {
      return { stdout: stdin, stderr: "", exitCode: 0 };
    }

    let out = "";
    for (const file of args) {
      const content = this.vfs.readFile(file);
      if (content === null) {
        return { stdout: "", stderr: `cat: ${file}: No such file or directory`, exitCode: 1 };
      }
      out += content;
    }
    return { stdout: out, stderr: "", exitCode: 0 };
  }

  private handleEcho(args: string[]): CommandResult {
    return { stdout: args.join(" ") + "\n", stderr: "", exitCode: 0 };
  }

  private handleChmod(args: string[]): CommandResult {
    if (args.length < 2) {
      return { stdout: "", stderr: "chmod: missing operand", exitCode: 1 };
    }

    const modeStr = args[0];
    const target = args[1];

    let mode = 0o644;
    if (/^[0-7]{3,4}$/.test(modeStr)) {
      mode = parseInt(modeStr, 8);
    } else if (modeStr === "+x") {
      const node = this.vfs.getNode(this.vfs.resolvePath(target));
      mode = (node?.permissions || 0o644) | 0o111;
    }

    const ok = this.vfs.chmod(target, mode);
    if (!ok) {
      return { stdout: "", stderr: `chmod: cannot access '${target}': No such file or directory`, exitCode: 1 };
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleCp(args: string[]): CommandResult {
    const cleanArgs = args.filter((a) => !a.startsWith("-"));
    if (cleanArgs.length < 2) {
      return { stdout: "", stderr: "cp: missing destination file operand", exitCode: 1 };
    }
    const ok = this.vfs.copy(cleanArgs[0], cleanArgs[1]);
    if (!ok) {
      return { stdout: "", stderr: `cp: cannot copy '${cleanArgs[0]}' to '${cleanArgs[1]}'`, exitCode: 1 };
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleMv(args: string[]): CommandResult {
    const cleanArgs = args.filter((a) => !a.startsWith("-"));
    if (cleanArgs.length < 2) {
      return { stdout: "", stderr: "mv: missing destination file operand", exitCode: 1 };
    }
    const ok = this.vfs.move(cleanArgs[0], cleanArgs[1]);
    if (!ok) {
      return { stdout: "", stderr: `mv: cannot move '${cleanArgs[0]}' to '${cleanArgs[1]}'`, exitCode: 1 };
    }
    return { stdout: "", stderr: "", exitCode: 0 };
  }

  private handleGrep(args: string[], stdin: string): CommandResult {
    const ignoreCase = args.includes("-i");
    const invert = args.includes("-v");
    const cleanArgs = args.filter((a) => !a.startsWith("-"));

    if (cleanArgs.length === 0) {
      return { stdout: "", stderr: "grep: missing pattern operand", exitCode: 2 };
    }

    const pattern = cleanArgs[0];
    const file = cleanArgs[1];

    let contentToSearch = stdin;
    if (file) {
      const fileContent = this.vfs.readFile(file);
      if (fileContent === null) {
        return { stdout: "", stderr: `grep: ${file}: No such file or directory`, exitCode: 2 };
      }
      contentToSearch = fileContent;
    }

    const lines = contentToSearch.split("\n");
    let matching: string[];

    try {
      const re = new RegExp(pattern, ignoreCase ? "i" : "");
      matching = lines.filter((l) => (invert ? !re.test(l) : re.test(l)));
    } catch {
      // Fallback for invalid regex pattern syntax (literal substring match)
      const p = ignoreCase ? pattern.toLowerCase() : pattern;
      matching = lines.filter((l) => {
        const line = ignoreCase ? l.toLowerCase() : l;
        return invert ? !line.includes(p) : line.includes(p);
      });
    }

    return {
      stdout: matching.length > 0 ? matching.join("\n") + "\n" : "",
      stderr: "",
      exitCode: matching.length > 0 ? 0 : 1,
    };
  }

  private handleFind(args: string[]): CommandResult {
    const searchPath = args[0] || ".";
    const resolved = this.vfs.resolvePath(searchPath);
    const node = this.vfs.getNode(resolved);
    if (!node) {
      return { stdout: "", stderr: `find: '${searchPath}': No such file or directory`, exitCode: 1 };
    }

    const results: string[] = [];

    const traverse = (nodePath: string) => {
      results.push(nodePath);
      const items = this.vfs.listDir(nodePath);
      if (items) {
        for (const item of items) {
          const childPath = nodePath === "/" ? `/${item.name}` : `${nodePath}/${item.name}`;
          if (item.type === "dir") {
            traverse(childPath);
          } else {
            results.push(childPath);
          }
        }
      }
    };

    traverse(resolved);
    return { stdout: results.join("\n") + "\n", stderr: "", exitCode: 0 };
  }

  private modeToSymbolic(mode: number): string {
    const chars = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
    const u = (mode >> 6) & 7;
    const g = (mode >> 3) & 7;
    const o = mode & 7;
    return `${chars[u]}${chars[g]}${chars[o]}`;
  }
}
