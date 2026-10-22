# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-22 (Pass 2)

| Claim | Status | Evidence |
|-------|--------|----------|
| Threshold / validateProposedChange | **verified** (unit) | `lib/permissionEngine.test.ts` |
| parsePermissionRows | **verified** (unit) | `lib/parseAccount.test.ts` |
| analyzeGraphRisk | **verified** (unit) | `lib/graphRisk.test.ts` |
| Soft-fail get_account | code present | CORS/offline may fail |
| updateauth broadcast | **not claimed** | educational only |

```bash
npm test && npm run typecheck
```
