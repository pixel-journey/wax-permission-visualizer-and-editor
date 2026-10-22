import { describe, expect, it } from "vitest";
import { analyzeGraphRisk } from "./graphRisk";
import type { PermissionGraph } from "./types";

describe("analyzeGraphRisk", () => {
  it("flags weight below threshold", () => {
    const graph: PermissionGraph = {
      account: "t",
      lastUpdated: "",
      permissions: {
        owner: {
          name: "owner",
          threshold: 2,
          keys: [{ key: "k1", weight: 1 }],
          accounts: [],
        },
      },
    };
    const w = analyzeGraphRisk(graph);
    expect(w.some((x) => x.level === "danger" && x.message.includes("threshold"))).toBe(
      true
    );
  });

  it("flags active controlling owner", () => {
    const graph: PermissionGraph = {
      account: "t",
      lastUpdated: "",
      permissions: {
        owner: {
          name: "owner",
          threshold: 1,
          keys: [],
          accounts: [
            {
              permission: { actor: "bad", permission: "active" },
              weight: 1,
            },
          ],
        },
      },
    };
    const w = analyzeGraphRisk(graph);
    expect(w.some((x) => x.message.includes("active must not control owner"))).toBe(
      true
    );
  });
});
