# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (Pass 5)

| Claim | Status | Evidence |
|-------|--------|----------|
| Engine / parse / risk / export / severity | **verified** (unit) | lib/*.test.ts |
| treeOutline | **verified** (unit) | `lib/treeOutline.test.ts` |
| Live get_account | soft-fail optional | CORS/offline |
| updateauth broadcast | **not claimed** | educational |

```bash
npm test && npm run typecheck
```
