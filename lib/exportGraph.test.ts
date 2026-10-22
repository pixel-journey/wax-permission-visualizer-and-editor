import { describe, expect, it } from "vitest";
import { exportGraphJson, exportGraphMarkdown } from "./exportGraph";
import { analyzeGraphRisk } from "./graphRisk";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";

describe("exportGraph", () => {
  it("markdown includes account and risks section", () => {
    const md = exportGraphMarkdown(mockSafeGraph());
    expect(md).toContain("Permission graph — demo");
    expect(md).toContain("Risk analysis");
    expect(md).toContain("WharfKit");
  });

  it("json parses with risks", () => {
    const parsed = JSON.parse(exportGraphJson(mockSafeGraph()));
    expect(parsed.graph.account).toBe("demo");
    expect(Array.isArray(parsed.risks)).toBe(true);
  });
});

describe("mockUnsafeGraph", () => {
  it("surfaces danger-level risks", () => {
    const risks = analyzeGraphRisk(mockUnsafeGraph());
    expect(risks.some((r) => r.level === "danger")).toBe(true);
  });
});
