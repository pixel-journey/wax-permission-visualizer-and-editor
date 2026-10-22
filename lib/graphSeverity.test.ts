import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";
import { graphSeverity } from "./graphSeverity";

describe("graphSeverity", () => {
  it("unsafe scores higher than safe", () => {
    expect(graphSeverity(mockUnsafeGraph()).score).toBeGreaterThan(
      graphSeverity(mockSafeGraph()).score
    );
  });
});
