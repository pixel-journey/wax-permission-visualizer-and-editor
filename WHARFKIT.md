# WharfKit guidance (this repo)

**Trust label:** educational-reference

This visualizer does **not** broadcast `updateauth` / `deleteauth` / `linkauth`. If you later wire real proposals:

1. Prefer **[@wharfkit/session](https://docs.wharfkit.com/)** for login, restore, and `session.transact`.
2. Do **not** start greenfield work on eosjs, UAL, or standalone Anchor Link as the primary stack (deprecated / superseded patterns).
3. Limited dApp permissions (`updateauth` + `linkauth`) are documented in
   [wax-wharfkit-session-keys-and-linked-permissions](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions).
4. Always validate locally first (`validateProposedChange`, `analyzeGraphRisk`) and keep an `owner` recovery path.
5. Proposal sketches from this repo are **summaries only** — map full `required_auth` yourself before signing.

## Related

- Session keys / linked actions: session-keys blueprint
- Multi-account audit: `wax-account-permission-auditor`
