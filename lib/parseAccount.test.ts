import { describe, expect, it } from "vitest";
import { parsePermissionRows } from "./parseAccount";

describe("parsePermissionRows", () => {
  it("builds owner/active and children", () => {
    const graph = parsePermissionRows("alice.wam", [
      {
        perm_name: "owner",
        parent: "",
        required_auth: {
          threshold: 1,
          keys: [{ key: "PUB_K1_A", weight: 1 }],
          accounts: [],
        },
      },
      {
        perm_name: "active",
        parent: "owner",
        required_auth: {
          threshold: 1,
          keys: [{ key: "PUB_K1_B", weight: 1 }],
          accounts: [],
        },
      },
      {
        perm_name: "gameplay",
        parent: "active",
        required_auth: {
          threshold: 1,
          keys: [{ key: "PUB_K1_C", weight: 1 }],
          accounts: [],
        },
      },
    ]);

    expect(graph.account).toBe("alice.wam");
    expect(graph.permissions.owner.keys[0].key).toBe("PUB_K1_A");
    expect(graph.permissions.active.parent).toBe("owner");
    expect(graph.permissions.active.children?.some((c) => c.name === "gameplay")).toBe(
      true
    );
  });
});
