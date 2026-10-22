import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { diffPermissionGraphs } from "./graphDiff";

describe("diffPermissionGraphs", () => {
  it("detects changes between safe and unsafe fixtures", () => {
    const lines = diffPermissionGraphs(mockSafeGraph(), mockUnsafeGraph());
    expect(lines.some((l) => l.kind === "changed" || l.kind === "removed")).toBe(
      true
    );
  });

  it("same graph is all same", () => {
    const g = mockSafeGraph();
    expect(diffPermissionGraphs(g, g).every((l) => l.kind === "same")).toBe(true);
  });
});
