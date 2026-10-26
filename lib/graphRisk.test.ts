import { describe, expect, it } from "vitest";
import {
  mockGameLinkedGraph,
  mockSafeGraph,
  mockSocialOwnerGraph,
  mockUnsafeGraph,
} from "./fixtures";
import { analyzeGraphRisk } from "./graphRisk";

describe("analyzeGraphRisk", () => {
  it("flags impossible thresholds on unsafe fixture", () => {
    const w = analyzeGraphRisk(mockUnsafeGraph());
    expect(w.some((x) => x.level === "danger" && x.message.includes("<"))).toBe(
      true
    );
  });

  it("does not flag foreign @active on owner as active-controls-owner", () => {
    const g = mockSocialOwnerGraph("alice.wam");
    const w = analyzeGraphRisk(g);
    expect(
      w.some((x) => x.message.includes("must not control its own owner"))
    ).toBe(false);
    expect(w.some((x) => x.message.includes("multi-party"))).toBe(true);
  });

  it("flags same-account active on owner", () => {
    const g = mockSafeGraph("demo");
    g.permissions.owner.accounts = [
      {
        permission: { actor: "demo", permission: "active" },
        weight: 1,
      },
    ];
    const w = analyzeGraphRisk(g);
    expect(
      w.some((x) => x.message.includes("must not control its own owner"))
    ).toBe(true);
  });

  it("notes custom gameplay permission", () => {
    const w = analyzeGraphRisk(mockGameLinkedGraph());
    expect(w.some((x) => x.message.includes("claim"))).toBe(true);
  });
});
