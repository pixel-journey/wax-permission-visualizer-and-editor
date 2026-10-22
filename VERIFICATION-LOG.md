# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-22 (Pass 1 deepen)

| Claim | Status | Evidence |
|-------|--------|----------|
| Threshold / validateProposedChange | **verified** (unit) | `lib/permissionEngine.test.ts` |
| parsePermissionRows tree | **verified** (unit) | `lib/parseAccount.test.ts` |
| Soft-fail get_account fetch | code present | may fail CORS/offline — not claimed always-on |
| On-chain updateauth broadcast | **not claimed** | educational editor only |
| WharfKit proposal signing | **not claimed** | prefer WharfKit when adding later |

```bash
npm test && npm run typecheck
```
