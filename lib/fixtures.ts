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

/** 2-of-3 account-auth owner — social recovery style (educational). */
export function mockSocialOwnerGraph(account = "social.demo"): PermissionGraph {
  return {
    account,
    lastUpdated: new Date().toISOString(),
    permissions: {
      owner: {
        name: "owner",
        threshold: 2,
        keys: [{ key: "PUB_K1_SELF", weight: 1 }],
        accounts: [
          {
            permission: { actor: "bob.wam", permission: "active" },
            weight: 1,
          },
          {
            permission: { actor: "carol.wam", permission: "active" },
            weight: 1,
          },
        ],
      },
      active: {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ key: "PUB_K1_HOT", weight: 1 }],
        accounts: [],
      },
    },
  };
}

/** Game account: limited claim under active + demo linked_actions. */
export function mockGameLinkedGraph(account = "gamer.wam"): PermissionGraph {
  return {
    account,
    lastUpdated: new Date().toISOString(),
    permissions: {
      owner: {
        name: "owner",
        threshold: 1,
        keys: [{ key: "PUB_K1_COLD", weight: 1 }],
        accounts: [],
      },
      active: {
        name: "active",
        parent: "owner",
        threshold: 1,
        keys: [{ key: "PUB_K1_HOT", weight: 1 }],
        accounts: [],
      },
      claim: {
        name: "claim",
        parent: "active",
        threshold: 1,
        keys: [{ key: "PUB_K1_SESSION", weight: 1 }],
        accounts: [],
      },
    },
    linkedActions: [
      {
        account: "pxfarmer.game",
        action: "claim",
        permission: "claim",
      },
      {
        account: "pxfarmer.game",
        action: "harvest",
        permission: "claim",
      },
    ],
  };
}
