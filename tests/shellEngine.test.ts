import { describe, it, expect, beforeEach } from "vitest";
import { ShellEngine } from "../src/simulations/shell/ShellEngine";

describe("ShellEngine", () => {
  let shell: ShellEngine;

  beforeEach(() => {
    shell = new ShellEngine();
  });

  it("should evaluate pwd and whoami commands", () => {
    const pwdRes = shell.execute("pwd");
    expect(pwdRes.exitCode).toBe(0);
    expect(pwdRes.stdout.trim()).toBe("/home/curious");

    const whoamiRes = shell.execute("whoami");
    expect(whoamiRes.stdout.trim()).toBe("curious");
  });

  it("should handle navigation with cd and ls", () => {
    const cdRes = shell.execute("cd /etc");
    expect(cdRes.exitCode).toBe(0);
    expect(shell.getVfs().getCurrentDir()).toBe("/etc");

    const lsRes = shell.execute("ls");
    expect(lsRes.exitCode).toBe(0);
    expect(lsRes.stdout).toContain("hostname");
    expect(lsRes.stdout).toContain("hosts");
  });

  it("should support stdout redirection with > and >>", () => {
    const echoRes = shell.execute('echo "First Line" > message.txt');
    expect(echoRes.exitCode).toBe(0);

    const catRes1 = shell.execute("cat message.txt");
    expect(catRes1.stdout).toBe("First Line\n");

    shell.execute('echo "Second Line" >> message.txt');
    const catRes2 = shell.execute("cat message.txt");
    expect(catRes2.stdout).toBe("First Line\nSecond Line\n");
  });

  it("should support pipelines (|) with grep", () => {
    const pipelineRes = shell.execute('cat /var/log/syslog | grep "Failed password"');
    expect(pipelineRes.exitCode).toBe(0);
    expect(pipelineRes.stdout).toContain("Failed password for invalid user root");
    expect(pipelineRes.stdout).toContain("Failed password for invalid user admin");
  });

  it("should handle chmod commands", () => {
    shell.execute("touch script.sh");
    const chmodRes = shell.execute("chmod 755 script.sh");
    expect(chmodRes.exitCode).toBe(0);

    const lsRes = shell.execute("ls -l script.sh");
    expect(lsRes.stdout).toContain("-rwxr-xr-x");
  });

  it("should handle rm file and recursive rm -r directory", () => {
    shell.execute("touch to_delete.txt");
    expect(shell.getVfs().getNode("/home/curious/to_delete.txt")).not.toBeNull();
    const rmRes = shell.execute("rm to_delete.txt");
    expect(rmRes.exitCode).toBe(0);
    expect(shell.getVfs().getNode("/home/curious/to_delete.txt")).toBeNull();

    shell.execute("mkdir my_folder");
    shell.execute("touch my_folder/test.txt");
    // rm without -r should fail on directory
    const rmDirFail = shell.execute("rm my_folder");
    expect(rmDirFail.exitCode).toBe(1);
    expect(rmDirFail.stderr).toContain("Is a directory");

    // rm -rf should succeed
    const rmRfRes = shell.execute("rm -rf my_folder");
    expect(rmRfRes.exitCode).toBe(0);
    expect(shell.getVfs().getNode("/home/curious/my_folder")).toBeNull();
  });

  it("should support head and tail commands", () => {
    shell.execute('echo "line1\nline2\nline3\nline4\nline5" > numbers.txt');
    const headRes = shell.execute("head -n 2 numbers.txt");
    expect(headRes.exitCode).toBe(0);
    expect(headRes.stdout).toBe("line1\nline2\n");

    const tailRes = shell.execute("tail -n 2 numbers.txt");
    expect(tailRes.exitCode).toBe(0);
    expect(tailRes.stdout).toBe("line4\nline5\n");
  });

  it("should handle pipeline with output redirection combined", () => {
    const res = shell.execute('cat /var/log/syslog | grep "Failed password" > failures.txt');
    expect(res.exitCode).toBe(0);

    const saved = shell.getVfs().readFile("/home/curious/failures.txt");
    expect(saved).toContain("Failed password for invalid user root");
    expect(saved).toContain("Failed password for invalid user admin");
  });

  it("should not treat operators inside quotes as syntax", () => {
    const res = shell.execute('echo "hello | world > file"');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toBe("hello | world > file\n");
    // File named 'file' should not have been created
    expect(shell.getVfs().getNode("/home/curious/file")).toBeNull();
  });

  it("should handle invalid regex safely in grep without throwing", () => {
    const res = shell.execute('grep "[" /var/log/syslog');
    // Should safely fallback and not crash
    expect(typeof res.exitCode).toBe("number");
  });

  it("should return error for find on nonexistent directory", () => {
    const res = shell.execute("find /nonexistent_directory");
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain("No such file or directory");
  });

  it("should return exitCode 127 for unknown commands", () => {
    const unknownRes = shell.execute("nonexistentcommand123");
    expect(unknownRes.exitCode).toBe(127);
    expect(unknownRes.stderr).toContain("command not found");
  });
});
