/* ============================================================
   LINUX UNLOCKED — In-Memory POSIX Virtual Filesystem (VFS)
   ------------------------------------------------------------
   A pure TypeScript, fully-contained hierarchical tree.
   Provides deterministic filesystem operations with zero host
   or network execution. Safe for sandboxed browser learning.
   ============================================================ */

export interface VNode {
  name: string;
  type: "file" | "dir";
  content?: string;
  children?: Map<string, VNode>;
  permissions: number; // Octal mode, e.g. 0o755
  owner: string;
  group: string;
  modifiedAt: Date;
}

export class VirtualFileSystem {
  private root: VNode;
  private currentDir: string;
  private defaultOwner = "curious";
  private defaultGroup = "users";

  constructor() {
    this.root = this.createDirNode("", 0o755);
    this.currentDir = "/home/curious";
    this.seedDefaultTree();
  }

  private createDirNode(name: string, permissions = 0o755): VNode {
    return {
      name,
      type: "dir",
      children: new Map(),
      permissions,
      owner: this.defaultOwner,
      group: this.defaultGroup,
      modifiedAt: new Date(),
    };
  }

  private createFileNode(name: string, content = "", permissions = 0o644): VNode {
    return {
      name,
      type: "file",
      content,
      permissions,
      owner: this.defaultOwner,
      group: this.defaultGroup,
      modifiedAt: new Date(),
    };
  }

  /** Seeds a realistic default Linux directory structure */
  public seedDefaultTree(): void {
    this.root = this.createDirNode("", 0o755);

    // /bin
    this.mkdir("/bin", true);
    this.writeFile("/bin/sh", "#!/bin/sh\necho 'Linux Unlocked Virtual Shell'", 0o755);

    // /etc
    this.mkdir("/etc", true);
    this.writeFile("/etc/hostname", "linux-unlocked\n");
    this.writeFile("/etc/os-release", 'NAME="Linux Unlocked OS"\nVERSION="2026.1"\nID=linux-unlocked\n');
    this.writeFile("/etc/hosts", "127.0.0.1 localhost\n127.0.1.1 linux-unlocked\n");

    // /var/log
    this.mkdir("/var/log", true);
    this.writeFile(
      "/var/log/syslog",
      "Oct 31 21:00:01 kernel: [0.000000] Linux version 6.12.0-unlocked (gcc 14.2)\n" +
        "Oct 31 21:00:02 kernel: [0.002140] Initializing cgroup subsys cpu\n" +
        "Oct 31 21:00:05 systemd[1]: Reached target Graphical Interface.\n" +
        "Oct 31 21:05:12 sshd[421]: Failed password for invalid user root from 192.168.1.105\n" +
        "Oct 31 21:05:14 sshd[421]: Failed password for invalid user admin from 192.168.1.105\n" +
        "Oct 31 21:10:00 systemd[1]: Starting Daily man-db regeneration...\n"
    );

    // /home/curious
    this.mkdir("/home/curious/Documents", true);
    this.mkdir("/home/curious/Downloads", true);
    this.mkdir("/home/curious/Projects", true);
    this.writeFile(
      "/home/curious/welcome.txt",
      "Welcome to LINUX UNLOCKED!\n" +
        "This is a safe, interactive terminal sandbox.\n" +
        "Try typing 'help' to see all available commands, or explore guided missions.\n"
    );
    this.writeFile(
      "/home/curious/Projects/hello.sh",
      "#!/bin/bash\necho 'Hello, Linux world!'\n",
      0o644 // intentionally unexecutable for chmod mission!
    );
    this.writeFile(
      "/home/curious/Documents/todo.txt",
      "1. Master the terminal navigation (cd, ls, pwd)\n" +
        "2. Learn file permissions (chmod)\n" +
        "3. Filter log files with grep\n" +
        "4. Explore distributions\n"
    );

    this.currentDir = "/home/curious";
  }

  /** Resolves absolute or relative path against current working directory */
  public resolvePath(targetPath: string): string {
    if (!targetPath || targetPath === ".") return this.currentDir;
    if (targetPath === "~") return "/home/curious";
    if (targetPath.startsWith("~/")) {
      targetPath = "/home/curious/" + targetPath.slice(2);
    }

    const isAbsolute = targetPath.startsWith("/");
    const baseSegments = isAbsolute ? [] : this.currentDir.split("/").filter(Boolean);
    const targetSegments = targetPath.split("/").filter(Boolean);

    const resultSegments = [...baseSegments];

    for (const segment of targetSegments) {
      if (segment === ".") continue;
      if (segment === "..") {
        resultSegments.pop();
      } else {
        resultSegments.push(segment);
      }
    }

    return "/" + resultSegments.join("/");
  }

  public getCurrentDir(): string {
    return this.currentDir;
  }

  public setCurrentDir(path: string): boolean {
    const resolved = this.resolvePath(path);
    const node = this.getNode(resolved);
    if (node && node.type === "dir") {
      this.currentDir = resolved;
      return true;
    }
    return false;
  }

  /** Traverses tree to locate a VNode by absolute path */
  public getNode(absolutePath: string): VNode | null {
    if (absolutePath === "/" || absolutePath === "") return this.root;

    const segments = absolutePath.split("/").filter(Boolean);
    let current = this.root;

    for (const seg of segments) {
      if (current.type !== "dir" || !current.children) return null;
      const next = current.children.get(seg);
      if (!next) return null;
      current = next;
    }

    return current;
  }

  /** Lists children of a directory */
  public listDir(targetPath?: string): VNode[] | null {
    const resolved = this.resolvePath(targetPath || this.currentDir);
    const node = this.getNode(resolved);
    if (!node || node.type !== "dir" || !node.children) return null;
    return Array.from(node.children.values());
  }

  /** Creates directory (with optional parent creation like `mkdir -p`) */
  public mkdir(targetPath: string, makeParents = false): boolean {
    const resolved = this.resolvePath(targetPath);
    const segments = resolved.split("/").filter(Boolean);
    let current = this.root;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!current.children) return false;

      let child = current.children.get(seg);
      if (!child) {
        if (i === segments.length - 1 || makeParents) {
          child = this.createDirNode(seg);
          current.children.set(seg, child);
        } else {
          return false;
        }
      } else if (child.type !== "dir") {
        return false;
      }
      current = child;
    }

    return true;
  }

  /** Writes or overwrites a file */
  public writeFile(targetPath: string, content: string, permissions = 0o644): boolean {
    const resolved = this.resolvePath(targetPath);
    const lastSlash = resolved.lastIndexOf("/");
    const parentPath = lastSlash === 0 ? "/" : resolved.slice(0, lastSlash);
    const fileName = resolved.slice(lastSlash + 1);

    const parentNode = this.getNode(parentPath);
    if (!parentNode || parentNode.type !== "dir" || !parentNode.children) return false;

    const existing = parentNode.children.get(fileName);
    if (existing) {
      if (existing.type !== "file") return false;
      existing.content = content;
      existing.modifiedAt = new Date();
      return true;
    }

    const newFile = this.createFileNode(fileName, content, permissions);
    parentNode.children.set(fileName, newFile);
    return true;
  }

  /** Appends to a file (like `>>` operator) */
  public appendFile(targetPath: string, content: string): boolean {
    const resolved = this.resolvePath(targetPath);
    const existing = this.getNode(resolved);
    if (existing) {
      if (existing.type !== "file") return false;
      existing.content = (existing.content || "") + content;
      existing.modifiedAt = new Date();
      return true;
    }
    return this.writeFile(targetPath, content);
  }

  /** Reads a file content */
  public readFile(targetPath: string): string | null {
    const resolved = this.resolvePath(targetPath);
    const node = this.getNode(resolved);
    if (!node || node.type !== "file") return null;
    return node.content ?? "";
  }

  /** Deletes a file or directory */
  public remove(targetPath: string, recursive = false): boolean {
    const resolved = this.resolvePath(targetPath);
    if (resolved === "/") return false;

    const lastSlash = resolved.lastIndexOf("/");
    const parentPath = lastSlash === 0 ? "/" : resolved.slice(0, lastSlash);
    const nodeName = resolved.slice(lastSlash + 1);

    const parentNode = this.getNode(parentPath);
    if (!parentNode || !parentNode.children) return false;

    const targetNode = parentNode.children.get(nodeName);
    if (!targetNode) return false;

    if (targetNode.type === "dir" && !recursive && targetNode.children && targetNode.children.size > 0) {
      return false; // Directory not empty
    }

    return parentNode.children.delete(nodeName);
  }

  /** Copies a node from src to dest */
  public copy(srcPath: string, destPath: string): boolean {
    const srcResolved = this.resolvePath(srcPath);
    const srcNode = this.getNode(srcResolved);
    if (!srcNode || srcNode.type !== "file") return false;

    let destResolved = this.resolvePath(destPath);
    const destNode = this.getNode(destResolved);
    if (destNode && destNode.type === "dir") {
      destResolved = destResolved === "/" ? `/${srcNode.name}` : `${destResolved}/${srcNode.name}`;
    }

    return this.writeFile(destResolved, srcNode.content || "", srcNode.permissions);
  }

  /** Moves/renames a node */
  public move(srcPath: string, destPath: string): boolean {
    if (this.copy(srcPath, destPath)) {
      return this.remove(srcPath, true);
    }
    return false;
  }

  /** Updates permissions */
  public chmod(targetPath: string, mode: number): boolean {
    const resolved = this.resolvePath(targetPath);
    const node = this.getNode(resolved);
    if (!node) return false;
    node.permissions = mode;
    return true;
  }
}
