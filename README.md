# wax-permission-visualizer-and-editor

> **Trust label:** `educational-reference`  
> **Status:** Passes **1–12** (2026-10-26)

Permission **tree** visualizer + risk analysis for WAX. Soft-fail `get_account`, fixtures (safe / unsafe / social owner / game claim), exports — **no** auto authority broadcast.

**Pass 12:** Corrected risk rule — only *this* account@active on owner is critical (foreign helpers are social recovery).

```bash
npm install && npm test && npm run build && npm run dev
```

[EDUCATION.md](./EDUCATION.md) · [POLICY.md](./POLICY.md)

MIT — Pixel Journey
