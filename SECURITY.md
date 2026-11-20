# Security — permission visualizer

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Self-active-on-owner | surfaced as critical pattern |
| Threshold > weight | impossible |
| Broadcast | tests do not call `updateauth` |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Live authority change | WharfKit + user confirmation only |
| Optional `get_account` | read-only; verify chain id |
| Score as enforcement | educational only |

## Attack angles

1. Treating a visualizer score as a freeze order.  
2. Linking open `eosio.token::transfer` under a "session" permission.  
3. Sharing full seeds as "social recovery."

## Honesty limits

[docs.wax.io permissions](https://docs.wax.io/build/core-concepts/permissions) · [WharfKit](https://wharfkit.com/) · [auditor](https://github.com/pixel-journey/wax-account-permission-auditor).
