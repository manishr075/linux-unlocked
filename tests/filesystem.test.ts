import { describe, it, expect, beforeEach } from "vitest";
import { VirtualFileSystem } from "../src/simulations/filesystem/FileSystem";

describe("VirtualFileSystem", () => {
  let vfs: VirtualFileSystem;

  beforeEach(() => {
    vfs = new VirtualFileSystem();
  });

  it("should initialize with default home directory and seed files", () => {
    expect(vfs.getCurrentDir()).toBe("/home/curious");
    expect(vfs.readFile("/home/curious/welcome.txt")).toContain("Welcome to LINUX UNLOCKED");
    expect(vfs.readFile("/etc/hostname")).toBe("linux-unlocked\n");
  });

  it("should accurately resolve relative and parent paths", () => {
    expect(vfs.resolvePath("Documents")).toBe("/home/curious/Documents");
    expect(vfs.resolvePath("..")).toBe("/home");
    expect(vfs.resolvePath("../../etc")).toBe("/etc");
    expect(vfs.resolvePath("~")).toBe("/home/curious");
    expect(vfs.resolvePath("~/Downloads")).toBe("/home/curious/Downloads");
  });

  it("should create directories with mkdir and mkdir -p", () => {
    expect(vfs.mkdir("/home/curious/testdir")).toBe(true);
    expect(vfs.getNode("/home/curious/testdir")?.type).toBe("dir");

    // Nested without -p should fail
    expect(vfs.mkdir("/home/curious/a/b/c", false)).toBe(false);

    // Nested with makeParents=true should succeed
    expect(vfs.mkdir("/home/curious/a/b/c", true)).toBe(true);
    expect(vfs.getNode("/home/curious/a/b/c")?.type).toBe("dir");
  });

  it("should write, append, and read files", () => {
    expect(vfs.writeFile("/home/curious/notes.txt", "Line 1\n")).toBe(true);
    expect(vfs.readFile("/home/curious/notes.txt")).toBe("Line 1\n");

    expect(vfs.appendFile("/home/curious/notes.txt", "Line 2\n")).toBe(true);
    expect(vfs.readFile("/home/curious/notes.txt")).toBe("Line 1\nLine 2\n");
  });

  it("should copy and move files", () => {
    vfs.writeFile("/home/curious/source.txt", "Payload");
    expect(vfs.copy("/home/curious/source.txt", "/home/curious/copy.txt")).toBe(true);
    expect(vfs.readFile("/home/curious/copy.txt")).toBe("Payload");

    expect(vfs.move("/home/curious/copy.txt", "/home/curious/Documents/moved.txt")).toBe(true);
    expect(vfs.readFile("/home/curious/Documents/moved.txt")).toBe("Payload");
    expect(vfs.readFile("/home/curious/copy.txt")).toBeNull();
  });

  it("should change file permissions with chmod", () => {
    vfs.writeFile("/home/curious/script.sh", "#!/bin/sh", 0o644);
    expect(vfs.chmod("/home/curious/script.sh", 0o755)).toBe(true);
    const node = vfs.getNode("/home/curious/script.sh");
    expect(node?.permissions).toBe(0o755);
  });
});
