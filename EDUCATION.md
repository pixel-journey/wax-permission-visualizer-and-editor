# Permission trees on WAX / Antelope

## Hierarchy

```
owner
  └── active
        └── custom (gameplay, claim, …)
```

## Critical vs intentional

| Pattern | Verdict |
|---------|---------|
| `alice@owner` includes `alice@active` | **Critical** |
| `alice@owner` includes `bob@active` | **Normal** social / multi-party |
| Custom `claim` under active | Prefer **linkauth** |
| Threshold > total weight | **Impossible** |

## App modules (Passes 1–14)

Tree · risk · severity · fixtures · live load · baseline/diff · sketches · exports · share · drafts · next steps · related blueprints

## Cluster

| Need | Repo |
|------|------|
| Visualize / risk | **This** |
| Limited keys + linkauth | session-keys |
| Social recovery design | social-recovery |
| msig | multi-sig builder |
| Hardware owner | hardware patterns |

Prefer **WharfKit** for live authority changes.
