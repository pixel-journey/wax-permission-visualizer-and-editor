import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { nextStepsChecklist } from "./nextSteps";

describe("nextStepsChecklist", () => {
  it("always mentions WharfKit", () => {
    expect(
      nextStepsChecklist(mockSafeGraph()).some((s) => s.includes("WharfKit"))
    ).toBe(true);
  });

  it("flags critical owner issues on unsafe fixture", () => {
    const steps = nextStepsChecklist(mockUnsafeGraph());
    expect(steps.some((s) => /active|threshold|multi-sig/i.test(s))).toBe(true);
  });
});
