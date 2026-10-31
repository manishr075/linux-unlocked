import { describe, it, expect } from "vitest";
import { APPS_DATABASE } from "../src/content/appsData";
import { HARDWARE_DATABASE } from "../src/content/hardwareData";

describe("Hardware & Application Compatibility Data", () => {
  it("APPS_DATABASE should have valid entries with verified alternatives", () => {
    expect(APPS_DATABASE.length).toBeGreaterThanOrEqual(10);

    for (const app of APPS_DATABASE) {
      expect(app.id).toBeTruthy();
      expect(app.name).toBeTruthy();
      expect(app.category).toBeTruthy();
      expect(["native", "alternative", "workaround", "blocker"]).toContain(app.status);
      expect(app.notes).toBeTruthy();
      expect(app.lastVerified).toBeTruthy();

      // If not native, should provide recommended alternatives or workarounds
      if (!app.linuxNativeAvailable) {
        expect(app.recommendedAlternative || app.compatibilityMethod).toBeTruthy();
      }
    }
  });

  it("HARDWARE_DATABASE should have realistic hardware items and kernel requirements", () => {
    expect(HARDWARE_DATABASE.length).toBeGreaterThanOrEqual(8);

    for (const hw of HARDWARE_DATABASE) {
      expect(hw.id).toBeTruthy();
      expect(hw.name).toBeTruthy();
      expect(hw.componentType).toBeTruthy();
      expect(["platinum", "gold", "silver", "blocker"]).toContain(hw.status);
      expect(hw.kernelVersion).toBeTruthy();
      expect(hw.notes).toBeTruthy();
    }
  });
});
