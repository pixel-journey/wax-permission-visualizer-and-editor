# Education — permission trees on WAX / Antelope

> **Rung:** `npm test` passes. Live `get_account` is optional UI. The tests do not broadcast `updateauth`.  
> **The test is the rule.** Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Signing tool: [WharfKit](https://wharfkit.com/).

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Sketch owner → active → custom |
| Intermediate | Spot self-active-on-owner as critical |
| Masterclass | Prefer linkauth for custom claim paths |

---

## Beginner — hierarchy

```
owner
  └── active
        └── custom (gameplay, claim, …)
```

```bash
npm test
```

---

## Intermediate — critical vs intentional

| Pattern | Verdict |
| --- | --- |
| `alice@owner` includes `alice@active` | **Critical** |
| `alice@owner` includes `bob@active` | **Normal** social / multi-party |
| Custom `claim` under active | Prefer **linkauth** |
| Threshold > total weight | **Impossible** |

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Self-active on owner | critical (see [auditor](https://github.com/pixel-journey/wax-account-permission-auditor)) |
| Open transfer via "session" | high risk (see [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions)) |
| Threshold > weight sum | impossible authority |

---

## Masterclass — cluster

| Need | Repo |
| --- | --- |
| Visualize / risk | **This** |
| Limited keys + linkauth | [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) |
| Weighted helpers, not shared seeds | [social recovery](https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools) |
| Named `eosio.msig` proposal | [msig builder](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) |
| Owner key on a device | [hardware](https://github.com/pixel-journey/wax-hardware-wallet-integration-patterns) |
| Rotate without locking | [rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) |
| Batch rule engine | [auditor](https://github.com/pixel-journey/wax-account-permission-auditor) |

Prefer **WharfKit** for live authority changes.

### Exercises

1. Is bob@active on alice@owner critical? (**No** — social shape.)  
2. Does this broadcast `updateauth`? (**No**.)  
3. Preferred tool for live auth changes? (**WharfKit**.)

---

## What this course will not teach

- Auto-broadcast of authority changes
- That a visualizer score freezes an account
