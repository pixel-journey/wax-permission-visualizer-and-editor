import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockSocialOwnerGraph, mockUnsafeGraph } from "./fixtures";
import { nextStepsChecklist } from "./nextSteps";

describe("nextStepsChecklist", () => {
  it("mentions WharfKit",
    () => {
      const s = nextStepsChecklist(mockSafeGraph());
      expect(s.some((x) => x.includes("WharfKit"))).toBe(true);
    });

  it("flags impossible threshold graphs",
    () => {
      const s = nextStepsChecklist(mockUnsafeGraph());
      expect(s.some((x) => x.includes("satisfiable") || x.includes("threshold"))).toBe(
        true
      );
    });

  it("suggests runbook for multi-party owner",
    () => {
      const s = nextStepsChecklist(mockSocialOwnerGraph("alice.wam"));
      expect(s.some((x) => x.includes("runbook") || x.includes("social"))).toBe(
        true
      );
    });
});
