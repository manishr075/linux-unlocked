import { VirtualFileSystem } from "@/simulations/filesystem/FileSystem";

export interface GuidedMission {
  id: string;
  title: string;
  category: "Navigation" | "Files" | "Text" | "Permissions" | "Pipes";
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  objectives: string[];
  hints: string[];
  explanation: string;
  validate: (vfs: VirtualFileSystem, lastOutput: string, lastCommand: string) => boolean;
}

export const TERMINAL_MISSIONS: GuidedMission[] = [
  {
    id: "mission-01-navigation",
    title: "Mission 1: Orientation (pwd & ls)",
    category: "Navigation",
    difficulty: 1,
    description: "Discover your current working directory and inspect what files exist in your home folder.",
    objectives: [
      "Run `pwd` to print your working directory.",
      "Run `ls` or `ls -la` to list all files and folders.",
    ],
    hints: [
      "Type `pwd` and press Enter.",
      "Type `ls` or `ls -l` to see file details like size and permissions.",
    ],
    explanation:
      "`pwd` stands for 'Print Working Directory'. In Linux, there is always a concept of where you currently stand in the filesystem tree. `ls` lists directory contents.",
    validate: (vfs, lastOutput, lastCommand) => {
      const clean = lastCommand.trim();
      return clean.startsWith("ls") || clean === "pwd";
    },
  },
  {
    id: "mission-02-cd",
    title: "Mission 2: Navigating the Tree (cd)",
    category: "Navigation",
    difficulty: 1,
    description: "Leave your home directory to inspect system configuration files in `/etc`, then return back home.",
    objectives: [
      "Navigate to the system configuration directory: `cd /etc`",
      "List the configuration files with `ls`",
      "Return to your home directory with `cd ~` or `cd`",
    ],
    hints: [
      "Type `cd /etc` to change directory into /etc.",
      "Type `cd ~` or `cd` to quickly return to your personal user home directory.",
    ],
    explanation:
      "`cd` changes directories. The tilde `~` symbol is a universal Unix shortcut for your personal user home directory (/home/username).",
    validate: (vfs) => {
      return vfs.getCurrentDir() === "/etc";
    },
  },
  {
    id: "mission-03-mkdir-touch",
    title: "Mission 3: Creating Files & Folders (mkdir & touch)",
    category: "Files",
    difficulty: 2,
    description: "Create a new project directory called `workspace` and create an empty file called `project.txt` inside it.",
    objectives: [
      "Create directory: `mkdir workspace`",
      "Create file: `touch workspace/project.txt`",
    ],
    hints: [
      "Run `mkdir workspace` from your home directory.",
      "Run `touch workspace/project.txt` or `cd workspace` followed by `touch project.txt`.",
    ],
    explanation:
      "`mkdir` makes directories. `touch` creates an empty file if it doesn't already exist, or updates its timestamp if it does.",
    validate: (vfs) => {
      return vfs.getNode("/home/curious/workspace/project.txt") !== null;
    },
  },
  {
    id: "mission-04-echo-cat",
    title: "Mission 4: Writing and Reading (echo & cat)",
    category: "Text",
    difficulty: 2,
    description: "Write text into a file using output redirection (`>`) and inspect the contents with `cat`.",
    objectives: [
      'Write greeting to file: `echo "Linux Unlocked" > banner.txt`',
      "Read file contents using: `cat banner.txt`",
    ],
    hints: [
      'Type: echo "Linux Unlocked" > banner.txt',
      "Then type: cat banner.txt",
    ],
    explanation:
      "The `>` operator redirects output that would normally print to your screen directly into a file, creating or overwriting it. `cat` (concatenate) prints file contents to stdout.",
    validate: (vfs) => {
      const content = vfs.readFile("/home/curious/banner.txt");
      return content !== null && content.toLowerCase().includes("linux unlocked");
    },
  },
  {
    id: "mission-05-cp-mv",
    title: "Mission 5: Copying and Moving (cp & mv)",
    category: "Files",
    difficulty: 2,
    description: "Copy `banner.txt` to `banner.bak`, then move `banner.bak` into your `Documents` folder.",
    objectives: [
      "Copy file: `cp banner.txt banner.bak`",
      "Move file: `mv banner.bak Documents/`",
    ],
    hints: [
      "Run `cp banner.txt banner.bak`",
      "Run `mv banner.bak Documents/`",
    ],
    explanation:
      "`cp` copies files and directories. `mv` moves or renames files. Unlike Windows, Linux operations complete instantly without confirmation prompts unless given flags like `-i`.",
    validate: (vfs) => {
      return (
        vfs.getNode("/home/curious/Documents/banner.bak") !== null ||
        vfs.getNode("/home/curious/banner.bak") !== null
      );
    },
  },
  {
    id: "mission-06-grep",
    title: "Mission 6: Inspecting Logs (grep)",
    category: "Text",
    difficulty: 3,
    description: "Use `grep` to filter system logs and locate unauthorized SSH connection attempts in `/var/log/syslog`.",
    objectives: [
      'Filter log file: `grep "Failed password" /var/log/syslog`',
    ],
    hints: [
      'Type: grep "Failed password" /var/log/syslog',
      "You can also use `-i` for case-insensitive matching: grep -i 'failed' /var/log/syslog",
    ],
    explanation:
      "`grep` (Global Regular Expression Print) searches plain-text data sets for lines matching a regular expression. It is one of the most heavily used sysadmin and developer tools in computing history.",
    validate: (vfs, lastOutput) => {
      return lastOutput.includes("Failed password for invalid user");
    },
  },
  {
    id: "mission-07-chmod",
    title: "Mission 7: Permission Hardening (chmod)",
    category: "Permissions",
    difficulty: 3,
    description: "Make the script `Projects/hello.sh` executable so that it can be run as a program.",
    objectives: [
      "Inspect current permissions: `ls -l Projects/hello.sh`",
      "Add execute permission: `chmod +x Projects/hello.sh` or `chmod 755 Projects/hello.sh`",
    ],
    hints: [
      "Type `chmod +x Projects/hello.sh`",
      "You can also use numeric octal: `chmod 755 Projects/hello.sh`",
    ],
    explanation:
      "Linux files are not executable by default for security. The `chmod` command modifies the read, write, and execute bits for the owner, group, and others.",
    validate: (vfs) => {
      const node = vfs.getNode("/home/curious/Projects/hello.sh");
      return node !== null && (node.permissions & 0o111) !== 0;
    },
  },
  {
    id: "mission-08-pipes",
    title: "Mission 8: Pipelining (|)",
    category: "Pipes",
    difficulty: 3,
    description: "Connect `cat` and `grep` together using a pipe (`|`) to inspect system releases in `/etc/os-release`.",
    objectives: [
      'Chain commands: `cat /etc/os-release | grep "NAME"`',
    ],
    hints: [
      'Type: cat /etc/os-release | grep "NAME"',
      "The vertical pipe character `|` is typically Shift + \\ on your keyboard.",
    ],
    explanation:
      "Pipes connect the stdout of one program to the stdin of the next in kernel memory without writing temporary files to disk. This embodies the core Unix philosophy.",
    validate: (vfs, lastOutput) => {
      return lastOutput.includes("Linux Unlocked OS");
    },
  },
];
