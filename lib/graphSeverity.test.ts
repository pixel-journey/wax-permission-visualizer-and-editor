import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { graphSeverity } from "./graphSeverity";

describe("graphSeverity", () => {
  it("unsafe fixture scores 35 and the safe fixture scores 12", () => {
    const u = graphSeverity(mockUnsafeGraph());
    const s = graphSeverity(mockSafeGraph());
    expect(u.score).toBe(35);
    expect(u.label).toBe("moderate");
    expect(s.score).toBe(12);
    expect(s.label).toBe("low");
    expect(u.reasons.length).toBeGreaterThan(0);
  });

  it("includes reasons array",
    () => {
      const s = graphSeverity(mockSafeGraph());
      expect(Array.isArray(s.reasons)).toBe(true);
    });
});
