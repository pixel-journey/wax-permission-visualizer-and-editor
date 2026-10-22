import { describe, expect, it } from "vitest";
import { buildAuditReportMarkdown } from "./auditReport";
import { mockSafeGraph, mockUnsafeGraph } from "./fixtures";

describe("buildAuditReportMarkdown", () => {
  it("includes severity and graph export", () => {
    const md = buildAuditReportMarkdown(mockSafeGraph());
    expect(md).toContain("Severity:");
    expect(md).toContain("WharfKit");
    expect(md).toContain("Permission graph");
  });

  it("includes diff when baseline provided", () => {
    const md = buildAuditReportMarkdown(mockUnsafeGraph(), mockSafeGraph());
    expect(md).toContain("Diff vs baseline");
    expect(md).toContain("Proposal sketches");
  });
});
