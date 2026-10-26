# Policy — permission visualizer

**Trust label:** `educational-reference`  
**Scope frozen:** Pass 14 (2026-10-26)

## In scope

- Interactive permission tree + threshold simulation
- Soft-fail live `get_account` (+ optional `linked_actions` when RPC provides)
- Risk heuristics (impossible thresholds, same-account active on owner, single-key owner)
- Fixtures: safe / unsafe / social owner / game claim
- Export MD/JSON, audit download, share `?a=`, localStorage draft
- Educational proposal sketches (not broadcast)

## Out of scope (by design)

- Live `updateauth` / `deleteauth` / `linkauth` broadcast
- Multi-account batch audit → `wax-account-permission-auditor`
- Full msig lifecycle → multi-sig blueprint
- Limited key install UX → session-keys blueprint

## Rules

- Never collect private keys
- Prefer **WharfKit** for any future real signing
- Foreign `@active` weights on owner ≠ “active controls owner”
