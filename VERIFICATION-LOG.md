# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (Pass 6)

| Claim | Status | Evidence |
|-------|--------|----------|
| Core pure engines | **verified** (unit) | lib/*.test.ts |
| diffPermissionGraphs | **verified** (unit) | `lib/graphDiff.test.ts` |
| graph draft localStorage | soft-fail | browser only |
| updateauth broadcast | **not claimed** | educational |

```bash
npm test && npm run typecheck
```
