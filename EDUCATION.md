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
| `alice@owner` includes `alice@active` | **Critical** — active must not control own owner |
| `alice@owner` includes `bob@active` (weight) | **Normal** social / multi-party recovery |
| Custom `claim` under active | Prefer **linkauth** (session-keys blueprint) |
| Threshold > total weight | **Impossible** — fix before relying on it |

## Fixtures in the app

- **Safe** — multi-weight active + gameplay  
- **Unsafe** — impossible thresholds  
- **Social owner** — 2-of-3 style weights  
- **Game claim** — limited session permission  

## Cluster

| Need | Repo |
|------|------|
| Visualize / risk | **This** |
| Install limited + linkauth | session-keys |
| Backup / social recovery design | social-recovery |
| msig propose | multi-sig builder |

Prefer **WharfKit** for any live authority change.
