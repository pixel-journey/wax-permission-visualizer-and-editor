# Education — permission trees on WAX / Antelope

> **Rung:** `npm test` passes. Live `get_account` is optional UI. The tests do not broadcast `updateauth`.  
> **The test is the rule.** Official model: [WAX permissions](https://docs.wax.io/build/core-concepts/permissions). Signing tool: [WharfKit](https://wharfkit.com/).

Antelope authorization is a **named hierarchy**, not an ERC-20 allowance list. The persistent footgun is a bad `updateauth` on **owner**.

## Learning outcomes

| Level | After this file |
| --- | --- |
| Beginner | Sketch owner → active → custom |
| Intermediate | Spot self-active-on-owner as critical; distinguish from social bob@active |
| Masterclass | Prefer linkauth for custom claim paths; never treat scores as enforcement |

---

## Beginner — hierarchy

```
owner
  └── active
        └── custom (gameplay, claim, …)
```

`owner` can change anything. `active` typically runs daily transfers and contract calls. Custom permissions should be **narrow** via `linkauth`.

```bash
npm test
```

---

## Intermediate — critical vs intentional

| Pattern | Verdict |
| --- | --- |
| `alice@owner` includes `alice@active` | **Critical** — compromised active can rewrite owner |
| `alice@owner` includes `bob@active` | **Normal** social / multi-party |
| Custom `claim` under active | Prefer **linkauth** to specific actions |
| Threshold > total weight | **Impossible** authority |
| Open `eosio.token::transfer` as "session" | **High risk** |

### Attack → test

| Attack | Lab behavior |
| --- | --- |
| Self-active on owner | critical (see [auditor](https://github.com/pixel-journey/wax-account-permission-auditor)) |
| Open transfer via "session" | high risk (see [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions)) |
| Threshold > weight sum | impossible authority |
| Treat visualizer score as freeze | educational only |

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

Prefer **WharfKit SessionKit** for live authority changes — not eosjs / UAL greenfield.

### Exercises

1. Is bob@active on alice@owner critical? (**No** — social shape.)  
2. Is alice@active on alice@owner critical? (**Yes**.)  
3. Does this broadcast `updateauth`? (**No**.)  
4. Preferred tool for live auth changes? (**WharfKit**.)

---

## What this course will not teach

- Auto-broadcast of authority changes
- That a visualizer score freezes an account
- That Antelope risks equal ERC-20 infinite approvals
