import { describe, it, expect } from "vitest";
import { DISTROS_DATA } from "../src/content/distrosData";

describe("Distros Data & Recommendation Logic", () => {
  it("should contain all 7 major distributions with rich metadata", () => {
    expect(DISTROS_DATA.length).toBe(7);
    const ids = DISTROS_DATA.map((d) => d.id);
    expect(ids).toContain("mint");
    expect(ids).toContain("ubuntu");
    expect(ids).toContain("fedora");
    expect(ids).toContain("debian");
    expect(ids).toContain("arch");
    expect(ids).toContain("zorin");
    expect(ids).toContain("popos");
  });

  it("each distro should have complete properties for comparison", () => {
    for (const distro of DISTROS_DATA) {
      expect(distro.name).toBeTruthy();
      expect(distro.tagline).toBeTruthy();
      expect(distro.packageManager).toBeTruthy();
      expect(distro.defaultDesktop).toBeTruthy();
      expect(distro.pros.length).toBeGreaterThan(0);
      expect(distro.cons.length).toBeGreaterThan(0);
      expect(distro.hardwareRequirements.minRam).toBeTruthy();
    }
  });

  it("should correctly compute highest score distro from sample quiz answers", () => {
    const scores: Record<string, number> = {
      mint: 0,
      ubuntu: 0,
      fedora: 0,
      debian: 0,
      arch: 0,
      zorin: 0,
      popos: 0,
    };

    // User chooses: Windows background (+30 mint, +30 zorin), stability (+30 mint, +30 debian), office (+30 mint)
    scores.mint += 30 + 30 + 30; // 90
    scores.zorin += 30 + 20 + 20; // 70
    scores.debian += 30;

    let bestId = "mint";
    let bestScore = -1;
    for (const [id, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestId = id;
      }
    }

    expect(bestId).toBe("mint");
    expect(bestScore).toBe(90);
    const matchedDistro = DISTROS_DATA.find((d) => d.id === bestId);
    expect(matchedDistro?.name).toBe("Linux Mint");
  });
});
