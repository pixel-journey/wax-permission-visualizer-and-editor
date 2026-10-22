import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { proposalSketchesFromDiff } from "./proposalSketches";

describe("proposalSketchesFromDiff", () => {
  it("emits sketches when graphs differ", () => {
    const rows = proposalSketchesFromDiff(
      "alice.wam",
      mockSafeGraph(),
      mockUnsafeGraph()
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((r) => r.name === "updateauth" || r.name === "deleteauth")).toBe(
      true
    );
  });

  it("empty when identical", () => {
    const g = mockSafeGraph();
    expect(proposalSketchesFromDiff("a", g, g)).toHaveLength(0);
  });
});
