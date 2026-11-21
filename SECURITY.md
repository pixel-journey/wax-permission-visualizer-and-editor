# Security — permission visualizer

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Self-active-on-owner (`alice@owner` includes `alice@active`) | surfaced as **critical** pattern |
| Threshold > total weight | impossible authority |
| Broadcast | tests do not call `updateauth` |
| bob@active on alice@owner | normal social / multi-party shape (not critical) |

## Critical vs intentional

| Shape | Flag |
| --- | --- |
| `alice@active` on `alice@owner` | **critical** (self-escalation) |
| `bob@active` on `alice@owner` | intentional multi-party |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live authority change | WharfKit + user confirmation only |
| Optional `get_account` | read-only; verify chain id |
| Score as enforcement | educational only — never a freeze order |
| linkauth drift after upgrades | re-audit custom permissions |

## Attack angles

1. Treating a visualizer score as a freeze or ban order.  
2. Linking open `eosio.token::transfer` under a "session" permission.  
3. Sharing full seeds as "social recovery."  
4. Confusing self-active-on-owner (critical) with bob-on-alice (intentional).  
5. Auto-broadcasting planned `updateauth` from the UI.

## Honesty limits

No private keys. No broadcast.

| Sibling | Distinction |
| --- | --- |
| [permission auditor](https://github.com/pixel-journey/wax-account-permission-auditor) | Read-only risk scan |
| [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) | Linked permission patterns |
| [multi-sig builder](https://github.com/pixel-journey/wax-multi-sig-proposal-builder-and-simulator) | eosio.msig shapes |
| [key rotation](https://github.com/pixel-journey/wax-safe-key-rotation-assistant) | Rotation checklist |

[docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions) · [WharfKit](https://wharfkit.com/).
