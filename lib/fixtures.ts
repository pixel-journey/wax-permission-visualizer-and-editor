import type { PermissionGraph } from "./types";

export function mockSafeGraph(account = "demo"): PermissionGraph {
  return {
    account,
    lastUpdated: new Date().toISOString(),
    permissions: {
      owner: {
        name: "owner",
        threshold: 1,
        keys: [
          { key: "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV", weight: 1 },
        ],
        accounts: [],
      },
      active: {
        name: "active",
        parent: "owner",
        threshold: 2,
        keys: [
          { key: "EOS7examplekeyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", weight: 1 },
          { key: "EOS8examplekeybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", weight: 1 },
        ],
        accounts: [
          {
            permission: { actor: "partneraccount", permission: "active" },
            weight: 1,
          },
        ],
      },
      gameplay: {
        name: "gameplay",
        parent: "active",
        threshold: 1,
        keys: [{ key: "PUB_K1_GAMEPLAY_SESSION_EXAMPLE", weight: 1 }],
        accounts: [],
      },
    },
  };
}

/** Intentionally broken patterns for risk-panel demos. */
export function mockUnsafeGraph(account = "unsafe.demo"): PermissionGraph {
  return {
    account,
    lastUpdated: new Date().toISOString(),
    permissions: {
      owner: {
        name: "owner",
        threshold: 2,
        keys: [{ key: "PUB_K1_ONLY_ONE", weight: 1 }],
        accounts: [
          {
            permission: { actor: "attacker", permission: "active" },
            weight: 1,
          },
        ],
      },
      active: {
        name: "active",
        parent: "owner",
        threshold: 5,
        keys: [{ key: "PUB_K1_ACTIVE", weight: 1 }],
        accounts: [],
      },
    },
  };
}
