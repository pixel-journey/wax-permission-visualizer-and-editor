# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (Pass 4 complete)

| Claim | Status | Evidence |
|-------|--------|----------|
| Engine / parse / risk / export | **verified** (unit) | lib/*.test.ts |
| graphSeverity | **verified** (unit) | `lib/graphSeverity.test.ts` |
| Live get_account | soft-fail optional | CORS/offline |
| updateauth broadcast | **not claimed** | educational |

```bash
npm test && npm run typecheck
```
