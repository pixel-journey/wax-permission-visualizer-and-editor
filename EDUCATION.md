# Permission trees on WAX / Antelope

> **Rung:** `npm test` passes. Live `get_account` is optional UI. The tests do not broadcast `updateauth`.  
> Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Signing tool: [WharfKit](https://wharfkit.com/).

## Hierarchy

```
owner
  └── active
        └── custom (gameplay, claim, …)
```

## Critical vs intentional

| Pattern | Verdict |
|---------|---------|
| `alice@owner` includes `alice@active` | **Critical** |
| `alice@owner` includes `bob@active` | **Normal** social / multi-party |
| Custom `claim` under active | Prefer **linkauth** |
| Threshold > total weight | **Impossible** |

## App modules (Passes 1–14)

Tree · risk · severity · fixtures · live load · baseline/diff · sketches · exports · share · drafts · next steps · related blueprints

## Cluster

| Need | Repo |
| --- | --- |
| Visualize / risk | **This** |
| Limited keys + linkauth | [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) |
| Weighted helpers, not shared seeds | [social recovery](https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools) |
| Named `eosio.msig` proposal | [msig builder](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) |
| Owner key on a device | [hardware](https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns) |
| Rotate without locking | [rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) |
| Same-account active on owner | [auditor](https://github.com/pixel-journey/wax-account-permission-auditor) |

Prefer **WharfKit** for live authority changes.
