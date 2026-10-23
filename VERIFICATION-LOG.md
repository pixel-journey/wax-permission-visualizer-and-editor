# Verification Log

**Trust label:** educational-reference  
**Updated:** 2026-10-23 (Pass 10 freeze)

| Claim | Status | Evidence |
|-------|--------|----------|
| Threshold / validateProposedChange | **verified** (unit) | permissionEngine.test.ts |
| parse / risk / severity / outline | **verified** (unit) | lib/*.test.ts |
| graphDiff / proposalSketches / auditReport | **verified** (unit) | matching tests |
| Soft-fail get_account | code present | CORS/offline possible |
| On-chain authority mutation | **not claimed** | sketches only |

```bash
npm test && npm run typecheck
```
