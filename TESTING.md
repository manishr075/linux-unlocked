# LINUX UNLOCKED — Testing & Quality Assurance Guide

This document outlines the testing strategy, test suites, automated test execution, manual browser testing checklists, and regression verification for **LINUX UNLOCKED**.

---

## 1. Automated Test Commands

Execute test suites directly from the project root:

```bash
# Run all automated tests (38 tests)
npm test

# Run tests in watch mode
npx vitest

# Run tests with coverage reporting
npx vitest run --coverage

# Run TypeScript compiler verification
npm run typecheck

# Run ESLint static analysis
npm run lint

# Run full production build verification
npm run build
```

---

## 2. Automated Test Suites & Coverage Scope

All automated tests run via **Vitest v5** in under 1 second:

| Test File | Tests | Coverage Scope |
| :--- | :---: | :--- |
| [`tests/shellEngine.test.ts`](file:///home/manish/Downloads/project-bolt-sb1-t4cyanqs/project/tests/shellEngine.test.ts) | 12 | Evaluates command parsing, `pwd`, `whoami`, `cd`, `ls -l [file]`, redirects `>`, `>>`, pipelines `\|`, combined pipeline + redirect (`cat \| grep > out`), quoted strings, `rm` / `rm -rf`, `head -n`, `tail -n`, regex error handling in `grep`, `find` non-existent paths, exit code 127. |
| [`tests/filesystem.test.ts`](file:///home/manish/Downloads/project-bolt-sb1-t4cyanqs/project/tests/filesystem.test.ts) | 6 | Evaluates root hierarchy structure, path resolution (`..`, `~`), directory creation (`mkdir -p`), reading/writing, appending, and octal permissions calculation. |
| [`tests/missions.test.ts`](file:///home/manish/Downloads/project-bolt-sb1-t4cyanqs/project/tests/missions.test.ts) | 9 | Evaluates mission metadata integrity and execution of individual state validators across all 8 guided terminal missions. |
| [`tests/distroQuiz.test.ts`](file:///home/manish/Downloads/project-bolt-sb1-t4cyanqs/project/tests/distroQuiz.test.ts) | 3 | Evaluates completeness of 7 distro datasets (Mint, Ubuntu, Fedora, Debian, Arch, Zorin, Pop!_OS) and verifies weighted scoring recommendation algorithm. |
| [`tests/atlasSearch.test.ts`](file:///home/manish/Downloads/project-bolt-sb1-t4cyanqs/project/tests/atlasSearch.test.ts) | 8 | Evaluates Fuse.js fuzzy search indexing, keyword matching, domain filtering, category filtering, difficulty filtering, slug lookups, empty results, and special character sanitization. |

**Total Automated Tests:** 38 passed / 38 total (100% pass rate).

---

## 3. Manual Browser Testing Procedures (8 Core Journeys)

### Journey 1: First-Time Visitor Journey
1. Navigate to `/`.
2. Verify hero 3D boot sequence initializes and pulses.
3. Click "Explore 3D Architecture". Verify smooth scroll to exploded view.
4. Scrub down through layers 0 to 5. Verify 3D layer separation and HUD card updates.
5. Scrub up in reverse. Verify smooth re-compaction of the monolithic stack.
6. Click "Begin Discovery Journey" to navigate to `/discover`.

### Journey 2: Linux Discovery Journey
1. On `/discover`, verify all 13 topic tabs render.
2. Click "The Linux Kernel". Verify scroll jump and inspect `KernelUserlandDiagram`. Click through User Space, Glibc, Kernel, and Hardware.
3. Click "Filesystem (FHS)". Click folder nodes in `FilesystemTreeExplorer` (`/etc`, `/var`, `/home`). Verify purpose and analogies update.
4. Click "Permissions & Sudo". Toggle Read, Write, and Execute checkboxes in `PermissionsCalculator`. Verify octal updates in real time (e.g. `755`, `644`, `600`).
5. Click a highlighted term (e.g., "Kernel", "Daemon"). Verify Contextual Translator popover appears with level-appropriate explanations.

### Journey 3: Practical Terminal Learning
1. Navigate to `/terminal`.
2. Type `pwd`, press Enter. Verify `/home/curious` is returned.
3. Type `ls -la`. Verify hidden files and permissions string.
4. Select "Mission 3: Creating Files & Folders".
5. Run `mkdir workspace && touch workspace/project.txt`. Verify mission is marked complete with celebratory badge.
6. Test history navigation: Press Arrow Up / Arrow Down to recall past commands.
7. Test maximize/restore toggle button on the terminal window.

### Journey 4: Exploring the Simulated Desktop
1. Navigate to `/desktop`.
2. Notice initial windows: Files and Terminal.
3. Drag the Files window by its header. Verify window follows cursor.
4. Double-click `welcome.txt` in the File Manager. Verify Text Editor window launches with file content.
5. Edit text in the Text Editor and click "Save File". Verify notification and saved state.
6. Switch to Workspace 2 via top bar. Verify windows are isolated to Workspace 1. Switch back to Workspace 1.
7. Open Settings window, select "Violet Nebula" wallpaper. Verify background updates immediately.

### Journey 5: Choosing a Distribution
1. Navigate to `/distros`.
2. On the "Recommendation Quiz" tab, answer all 6 questions.
3. Verify top recommended distro appears with match percentage, pros, cons, and honest trade-offs.
4. Switch to "Comparison Matrix" tab. Verify all 7 distros are tabulated side-by-side with package formats, release models, and system requirements.

### Journey 6: Checking Compatibility
1. Navigate to `/compatibility`.
2. On "Hardware Profiles" tab, search for "Wi-Fi" or "Lenovo".
3. Verify status badges (Platinum, Gold, Silver, Blocker) and inspect upstream evidence links.
4. Switch to "Windows Software" tab. Search for "Photoshop" or "Valorant".
5. Verify honest blocker alerts explaining kernel anti-cheat constraints.

### Journey 7: Planning a Migration
1. Navigate to `/migrate`.
2. Inspect the pre-flight self-audit checklist (Backups, BitLocker, UEFI).
3. Check off Step 1 and Step 2.
4. Click to complete Step 5 (Installation). Verify destructive step safeguard modal opens requiring explicit confirmation.
5. Confirm modal. Verify progress bar increases.
6. Refresh the browser page (`F5`). Verify completed checklist items persist from `localStorage`.

### Journey 8: Returning Visitor & Settings Persistence
1. Change global learning level in the navbar to "Technical".
2. Navigate between `/discover`, `/atlas`, and `/`.
3. Verify that article and terminology presentations maintain the "Technical" depth.
4. Refresh browser. Verify user depth preference is preserved.

---

## 4. Regression & Edge-Case Testing

- **Pipes with Redirection:** Evaluated command `cat /var/log/syslog | grep "Failed password" > failures.txt`. Verified that input flows through pipeline and destination file receives output.
- **Quoted Operators:** Evaluated `echo "hello | world > file"`. Verified that literal pipes and redirection symbols within quotes are not evaluated as shell syntax.
- **Invalid Regex Input:** Evaluated `grep "[" /var/log/syslog`. Verified engine falls back to literal substring matching without throwing runtime JavaScript syntax errors.
- **Nonexistent Directory Traversal:** Evaluated `find /nonexistent_dir`. Verified shell returns exit code 1 with standard error message rather than outputting empty lines.
- **Flag Parsing with Substrings:** Verified `rm my_folder` does not treat the letter `r` inside directory names as the `-r` recursive flag.

---

## 5. Known Gaps & Future Roadmap

- **End-to-End Headless Browser Automation:** Currently verified via Vite server HTTP endpoint verification and Vitest simulation suites. Playwright/Cypress end-to-end browser automation can be integrated in CI/CD when external runner environments are configured.
- **WebGL Headless Execution:** Three.js unit tests run in JSDOM environments without native GPU drivers. Scene validation relies on deterministic WebGL lifecycle tests in real browsers.
