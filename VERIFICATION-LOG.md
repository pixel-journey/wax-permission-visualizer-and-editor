# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-22 (Pass 3)

| Claim | Status | Evidence |
|-------|--------|----------|
| Engine / parse / graph risk | **verified** (unit) | lib/*.test.ts |
| Export MD/JSON + unsafe fixture | **verified** (unit) | `lib/exportGraph.test.ts` |
| Live get_account | soft-fail optional | CORS/offline |
| updateauth broadcast | **not claimed** | educational |

```bash
npm test && npm run typecheck
```
