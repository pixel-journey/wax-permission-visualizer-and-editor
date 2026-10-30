import { describe, expect, it } from "vitest";
import { mockSafeGraph, mockSocialOwnerGraph } from "./fixtures";
import {
  calculateThreshold,
  nodeWeightSummary,
  validateProposedChange,
} from "./permissionEngine";

describe("permissionEngine", () => {
  it("nodeWeightSummary totals keys + accounts",
    () => {
      const g = mockSocialOwnerGraph("alice.wam");
      const s = nodeWeightSummary(g.permissions.owner);
      expect(s.total).toBe(3);
      expect(s.threshold).toBe(2);
      expect(s.satisfiable).toBe(true);
    });

  it("account-auth contributes to threshold",
    () => {
      const g = mockSocialOwnerGraph("alice.wam");
      const alone = calculateThreshold(g.permissions.owner, [], []);
      expect(alone.canExecute).toBe(false);
      const withBob = calculateThreshold(
        g.permissions.owner,
        ["PUB_K1_SELF"],
        ["bob.wam@active"]
      );
      expect(withBob.canExecute).toBe(true);
      expect(withBob.currentWeight).toBe(2);
    });

  it("does not flag foreign active on owner in proposed change",
    () => {
      const base = mockSafeGraph("alice.wam");
      const proposed = mockSocialOwnerGraph("alice.wam");
      const w = validateProposedChange(base, proposed);
      expect(
        w.some((x) => x.message.includes("must not control its own owner"))
      ).toBe(false);
    });

  it("flags same-account active on owner in proposed change",
    () => {
      const base = mockSafeGraph("demo");
      const proposed = mockSafeGraph("demo");
      proposed.permissions.owner.accounts = [
        {
          permission: { actor: "demo", permission: "active" },
          weight: 1,
        },
      ];
      const w = validateProposedChange(base, proposed);
      expect(
        w.some((x) => x.message.includes("must not control its own owner"))
      ).toBe(true);
    });
});
