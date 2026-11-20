# Sources

| Source | Use |
| --- | --- |
| [WAX permissions](https://docs.wax.io/build/core-concepts/permissions) | Official hierarchy |
| [WharfKit](https://wharfkit.com/) | Signing tool |
| [auditor](https://github.com/pixel-journey/wax-account-permission-auditor) | Batch critical rules |
| [session keys](https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions) | linkauth |

## Product facts

```text
owner
  └── active
        └── custom (gameplay, claim, …)
```

- `alice@owner` includes `alice@active` → **critical**.
- `alice@owner` includes `bob@active` → normal social / multi-party.
- Threshold > total weight → impossible.
- Tests do **not** broadcast `updateauth`.
