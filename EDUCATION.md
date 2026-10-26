# Permission trees on WAX / Antelope

## What this tool is for

**Visualize** and **reason about** account permissions (`owner`, `active`, custom) — thresholds, keys, account-auth, and how they relate to **`linkauth`** (scoped actions).

It is **not** a full multi-sig executor and **not** a live `updateauth` broadcaster (by design). Use multi-sig / session-keys blueprints for those flows with **WharfKit**.

## Hierarchy (always)

```
owner
  └── active
        └── custom (gameplay, claim, transfer, …)
```

- **owner** can change anything, including itself  
- **active** cannot replace owner  
- **Custom** permissions usually parent to `active` and should be **linked** to narrow actions  

## Myths

| Myth | Reality |
|------|---------|
| “active can fix a lost owner” | False — only owner (or multi-party owner) can |
| “One active key is fine for everything” | Large attack surface; use limited + linkauth for games |
| “Threshold 3 with total weight 2 is conservative” | Impossible — proposals never exec |
| “linkauth is optional polish” | Best way to shrink what a leaked session key can do |

## Cluster map

| Need | Repo |
|------|------|
| See / export / risk-score a tree | **This repo** |
| Install limited keys + linkauth | `wax-wharfkit-session-keys-and-linked-permissions` |
| Social recovery / backup posture | `wax-social-recovery-and-key-backup-tools` |
| Propose msig | `wax-multi-sig-proposal-builder-and-simulator` |
| Hardware owner | `wax-hardware-wallet-integration-patterns` |
| Batch audit many accounts | `wax-account-permission-auditor` |

## Stack

Prefer **WharfKit** for any future signing. Avoid eosjs / UAL greenfield.
