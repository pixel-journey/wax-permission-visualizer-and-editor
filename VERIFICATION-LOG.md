# Verification Log

Honest record of what has and has not been tested against live WAX endpoints or pure client-side logic.
Never mark something verified without running it and recording evidence.

## Status legend
- `VERIFIED` — ran against a live endpoint or unit test, result recorded below
- `UNTESTED` — code exists, never executed against chain or in isolation
- `BROKEN` — ran, failed; see notes
- `N/A` — not applicable to this blueprint

## Endpoints exercised
| Endpoint | Status | Date | Notes |
| --- | --- | --- | --- |
| WAX RPC (get_account) | UNTESTED | | Permission tree fetch |
| WharfKit session | UNTESTED | | Proposal signing flow |

## Claims in this repo
| Claim | Status | Evidence |
| --- | --- | --- |
| Pure client-side threshold engine correctly calculates M-of-N | UNTESTED | `calculateThreshold` in lib/permissionEngine.ts + skeleton in lib/permissionEngine.test.ts |
| Safety rules detect owner threshold < 1 | UNTESTED | `validateProposedChange` Rule 1 + test skeleton |
| Safety rules detect total weight < threshold | UNTESTED | `validateProposedChange` Rule 3 + test skeleton |
| Interactive tree renders hierarchical permissions | UNTESTED | components/PermissionTree.tsx |
| Linked permission scopes reduce attack surface | UNTESTED | Educational content + LinkedPermissionExample.tsx |
| Demo runs with mock data (zero network) | UNTESTED | app/page.tsx |
| Trust label present in README | VERIFIED | Header added 2026-10-18 |
| Unit-test skeleton present | VERIFIED | lib/permissionEngine.test.ts added 2026-10-18 |

## How to verify
```bash
# Smoke test account permissions (replace ACCOUNT)
curl -s https://wax.greymass.com/v1/chain/get_account -d '{"account_name":"ACCOUNT"}' | jq .permissions

# Typecheck the pure engine
npm run typecheck

# Run unit tests (after npm install)
npm test
```
Record command + output hash (e.g. `sha256sum`) here when verified.

**Trust label:** educational-reference

**Next refinement targets:**
- Run `npm test` and mark engine claims VERIFIED if passing
- Record one live `get_account` smoke test
- Expand ARCHITECTURE.md with data-flow diagram
