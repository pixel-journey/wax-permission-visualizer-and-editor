import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { graphSeverity } from "./graphSeverity";

describe("graphSeverity", () => {
  it("unsafe fixture scores higher than safe",
    () => {
      const u = graphSeverity(mockUnsafeGraph());
      const s = graphSeverity(mockSafeGraph());
      expect(u.score).toBeGreaterThan(s.score);
      expect(u.reasons.length).toBeGreaterThan(0);
    });

  it("includes reasons array",
    () => {
      const s = graphSeverity(mockSafeGraph());
      expect(Array.isArray(s.reasons)).toBe(true);
    });
});
