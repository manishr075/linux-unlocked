import { describe, it, expect, beforeEach } from "vitest";
import { ShellEngine } from "../src/simulations/shell/ShellEngine";
import { TERMINAL_MISSIONS } from "../src/content/terminalMissions";

describe("Terminal Guided Missions", () => {
  let shell: ShellEngine;

  beforeEach(() => {
    shell = new ShellEngine();
  });

  it("should have 8 defined missions with required properties", () => {
    expect(TERMINAL_MISSIONS.length).toBe(8);
    for (const mission of TERMINAL_MISSIONS) {
      expect(mission.id).toBeTruthy();
      expect(mission.title).toBeTruthy();
      expect(mission.objectives.length).toBeGreaterThan(0);
      expect(typeof mission.validate).toBe("function");
    }
  });

  it("Mission 1: Orientation validates on pwd / ls", () => {
    const mission = TERMINAL_MISSIONS[0];
    const res = shell.execute("pwd");
    expect(mission.validate(shell.getVfs(), res.stdout, "pwd")).toBe(true);
  });

  it("Mission 2: Navigation validates when inside /etc", () => {
    const mission = TERMINAL_MISSIONS[1];
    expect(mission.validate(shell.getVfs(), "", "pwd")).toBe(false);
    shell.execute("cd /etc");
    expect(mission.validate(shell.getVfs(), "", "cd /etc")).toBe(true);
  });

  it("Mission 3: Creating files validates when workspace/project.txt exists", () => {
    const mission = TERMINAL_MISSIONS[2];
    shell.execute("mkdir workspace");
    shell.execute("touch workspace/project.txt");
    expect(mission.validate(shell.getVfs(), "", "touch workspace/project.txt")).toBe(true);
  });

  it("Mission 4: Echo & Cat validates when banner.txt contains Linux Unlocked", () => {
    const mission = TERMINAL_MISSIONS[3];
    shell.execute('echo "Linux Unlocked" > banner.txt');
    expect(mission.validate(shell.getVfs(), "", 'echo "Linux Unlocked" > banner.txt')).toBe(true);
  });

  it("Mission 5: Copy & Move validates when banner.bak exists", () => {
    const mission = TERMINAL_MISSIONS[4];
    shell.execute("touch banner.bak");
    expect(mission.validate(shell.getVfs(), "", "touch banner.bak")).toBe(true);
  });

  it("Mission 6: Grep validates when log output contains Failed password", () => {
    const mission = TERMINAL_MISSIONS[5];
    const res = shell.execute('grep "Failed password" /var/log/syslog');
    expect(mission.validate(shell.getVfs(), res.stdout, 'grep "Failed password" /var/log/syslog')).toBe(true);
  });

  it("Mission 7: Chmod validates when Projects/hello.sh becomes executable", () => {
    const mission = TERMINAL_MISSIONS[6];
    shell.execute("chmod 755 Projects/hello.sh");
    expect(mission.validate(shell.getVfs(), "", "chmod 755 Projects/hello.sh")).toBe(true);
  });

  it("Mission 8: Pipes validates when pipeline filters Linux Unlocked OS", () => {
    const mission = TERMINAL_MISSIONS[7];
    const res = shell.execute('cat /etc/os-release | grep "NAME"');
    expect(mission.validate(shell.getVfs(), res.stdout, 'cat /etc/os-release | grep "NAME"')).toBe(true);
  });
});
