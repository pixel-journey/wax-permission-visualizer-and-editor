# AI handoff — permission visualizer

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

| Source | Role |
| --- | --- |
| [WAX permissions](https://docs.wax.io/build/core-concepts/permissions) | Official hierarchy |
| [auditor](https://github.com/pixel-journey/wax-account-permission-auditor) | Batch critical rules |
| [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) | linkauth |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit patterns |

## Non-negotiables

1. Hierarchy teaching shape: `owner → active → custom`.
2. `alice@owner` includes `alice@active` → **critical**.
3. `alice@owner` includes `bob@active` → normal social / multi-party.
4. Threshold > total weight → impossible.
5. Tests do **not** broadcast `updateauth`.
6. Permission trees are Antelope-wide; account names and chain id are local. Prefer WharfKit for any later live path.

## Prompt seeds

- "Draw owner/active/custom for a gameplay claim key."
- "Why is self-active-on-owner critical?"
- "Hand off to auditor for batch severity scoring."
- "Refuse broadcasting updateauth from unit tests."

## Do not

- Treat visualizer output as a signed updateauth.
- Linkauth open eosio.token::transfer to a session key (session lab).
- Put private keys in prompts.
