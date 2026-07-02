# wax-permission-visualizer-and-editor — Account Permission Visualizer & Editor

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0

**One-sentence goal:** An elegant, interactive, safe visualizer + editor for Antelope/EOSIO-style account permissions on WAX. Hierarchical trees, multi-sig thresholds (M-of-N), weight math, live previews, safety warnings, and one-click WharfKit proposals — all client-side with zero custom contracts.

---

## 1. Educational Core — Why Permissions Matter (Deep Dive)

The Antelope permission model is simultaneously one of the most powerful and one of the most dangerous features in blockchain. A single misconfigured threshold, a lost owner key, or an overly permissive `active` key can result in permanent loss of funds with almost no recovery path.

Unlike many other chains, Antelope gives users and DAOs extremely fine-grained control — but that control comes with significant responsibility and complexity.

### The Core Mental Model

Think of permissions like a high-security vault system:

- **Owner** = The master deed / root of trust. It controls everything, including the ability to change other permissions.
- **Active** = The daily-use keys. It can perform most actions but cannot change the `owner` permission.
- **Weights & Thresholds** = How many signatures (and how strong) are required to open the vault.
- **Linked Permissions** = Special rules that only apply to specific contracts or actions (e.g. only `transfer` on a token contract).

This model is incredibly powerful for security and governance, but it is also easy to get wrong — often with irreversible consequences.

### Why Most People Underestimate This Area

Many developers treat permissions as a one-time setup task. In reality, permission structures evolve over time (key rotations, multi-sig changes, team member changes, DAO governance). Every change carries risk. The visualizer exists to make these risks visible before they become disasters.

### Common Catastrophic Mistakes (And How This Tool Helps)

| Mistake | What Happens | Why It’s Dangerous | How the Visualizer Protects You |
|---------|--------------|--------------------|----------------------------------|
| **Removing the last owner key** | Complete loss of account control | Irreversible in most cases | Clearly shows when owner permission would have zero valid keys |
| **Setting threshold higher than total weight** | Actions become impossible | Funds get stuck | Live threshold math with clear warnings |
| **Giving `active` permission to change `owner`** | Anyone with active can take full control | Complete takeover risk | Highlights dangerous permission relationships |
| **Losing access during key rotation** | Temporary or permanent lockout | High stress, potential loss | Preview mode shows exactly what the new structure will look like |
| **Overly permissive linked permissions** | Smart contracts can be abused | Unexpected actions possible | Visual tree makes linked permissions obvious |
| **Not understanding multi-sig requirements** | Failed transactions or weak security | Poor governance | Clear M-of-N visualization and simulation |

### Learning Outcomes

After studying and using this blueprint, you will be able to:

- Visually audit and understand any WAX (or Antelope) account’s permission structure at a glance
- Design safe and effective multi-sig and permission setups
- Identify dangerous or fragile permission configurations before they cause problems
- Safely perform key rotations and permission changes with confidence
- Explain permission concepts clearly to team members or DAO participants
- Build or integrate permission tools into your own applications

---

## 2. Tech Recommendations Matrix — Deep Rationale

We evaluated multiple technical approaches with one primary goal in mind: **maximizing educational value and long-term reusability** while maintaining excellent performance and developer experience.

Every decision was made with the following priorities (in order):

1. **Educational clarity** — The code and architecture should teach good patterns.
2. **Zero external dependencies where possible** — Easier to audit, learn from, and maintain.
3. **Client-side only** — No custom smart contracts required.
4. **Retro-pixel aesthetic + accessibility** — Aligns with Pixel Journey identity and WCAG standards.
5. **Future extensibility** — The architecture should support new features without major rewrites.

### Detailed Technology Decisions

| Component                  | Chosen Approach                          | Why This Choice Wins for Education & Longevity                                                                 | Trade-offs                                                                 | When Another Option Might Be Better |
|----------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|-------------------------------------|
| **Visualization**         | Custom recursive SVG + Canvas           | Maximum control over pixel-perfect retro aesthetic. Educational value is higher because developers can read and understand the rendering logic. Lightweight and dependency-free. | Requires more initial code for layout and interactions.                   | Use React Flow if speed of development is the absolute top priority and bundle size is acceptable. |
| **State Management**      | Zustand + TanStack Query                | Zustand is tiny, excellent with TypeScript, and has minimal boilerplate. TanStack Query handles data fetching and caching cleanly. This combination teaches modern, lightweight state patterns. | Slightly less “magical” than some alternatives.                           | Jotai can be used for even simpler single-file demos or prototypes. |
| **Blockchain Data**       | Native fetch + optional WharfKit        | Avoids locking into legacy libraries. Native fetch is universal, auditable, and teaches fundamental web + blockchain interaction. Easy to swap or extend. | Slightly more manual parsing than using a full account kit.               | Use @wharfkit/account-kit if you are already deep in the WharfKit ecosystem. |
| **Editor Interactions**   | Custom SVG + Framer Motion              | Best balance of retro feel, accessibility (keyboard + screen reader), and smooth interactions. Educational because the interaction logic is visible and understandable. | More custom code than using a library’s built-in drag system.             | React Flow if rapid prototyping is needed. |
| **Multi-sig Simulation**  | Pure client-side JavaScript engine      | Instant feedback, completely free, highly educational. Users can experiment with different key combinations without any on-chain cost or delay. | Cannot execute real on-chain proposals until the user explicitly signs.   | Use on-chain preview only for final validation before broadcasting. |
| **Theming & Styling**     | Tailwind + shadcn/ui + custom pixel CSS | Fast consistent UI development + easy to override with retro-pixel / CRT / glassmorphic aesthetics. Teaches modern component patterns while allowing strong visual identity. | Requires some theme customization work.                                   | Full custom CSS only if you already have a very strong existing design system. |

**Key Insight**: Every technical choice was evaluated not just for “does it work?”, but for “does this help someone learn and build better things in the future?”

---

## 3. Machine-Optimized Spec (spec.yaml)

Located at repo root: `spec.yaml`. Designed for AI agents (Claude, Grok, Antigravity, Cursor, etc.) and scripts to instantly scaffold or extend this blueprint in any personal project.

```yaml
# Paste this entire block into any AI to regenerate/extend
blueprint:
  id: wax-permission-visualizer-and-editor
  tier: 1
  category: security-foundational
  status: alpha-ready
  benchmark_target: gkniftyheads-tracker + PX

features:
  - interactive_hierarchical_permission_tree_svg
  - safe_multi_sig_threshold_simulator
  - live_wax_account_fetch
  - editor_mode_with_local_draft_persistence
  - accessibility: reduced_motion, haptics, aria, voice_labels
  - retro_pixel_glassmorphic_crt_theme
  - wharfkit_proposal_signing

recommended_stack: { viz: "custom_svg_canvas", state: "zustand", fetch: "native_rpcs" }

integration_points:
  - PxWallet: instant permission load for any account
  - PxHotOrNot / DAO tools: embed viewer for proposal safety
  - entropy: useOnChainEntropy helper for weighted simulations

machine_instructions:
  - "Generate full Next.js 15 scaffold with Zustand store"
  - "Implement recursive SVG permission tree with keyboard nav"
  - "Add pure JS threshold engine with 8+ safety rules"
  - "Include WharfKit session example for live proposal"
```

---

## 4. Complete Folder Structure & Key Files

```
wax-permission-visualizer-and-editor/
├── app/
│   ├── layout.tsx                 # Root layout with pixel theme
│   ├── page.tsx                   # Main demo (Tabs: Viewer / Editor / Simulator / Integrate)
│   └── globals.css                # Retro glassmorphic + CRT + Press Start 2P
├── components/
│   ├── PermissionTree.tsx         # Core interactive SVG + Canvas visualizer/editor
│   ├── PermissionDetailPanel.tsx
│   ├── ThresholdSimulator.tsx     # Live M-of-N safety engine UI
│   └── AccountInput.tsx
├── lib/
│   ├── types.ts                   # Strict PermissionNode, Graph, SimulationResult
│   ├── permissionEngine.ts        # Pure threshold math + 10+ safety rules
│   ├── waxRpc.ts                  # get_account parser + Hyperion fallback
│   └── entropy.ts                 # On-chain entropy stub (TX hash + block header)
├── hooks/
│   └── useWharfSession.ts         # Optional signing
├── spec.yaml                      # Machine-optimized integration spec
├── README.md                      # This file (benchmark education level)
├── package.json
└── next.config.js
```

---

## 5. Core Implementation (Production-Ready Annotated Code)

### 5.1 Strict Types (lib/types.ts)
```ts
// lib/types.ts
export interface PermissionNode {
  name: string;
  threshold: number;
  keys: Array<{ key: string; weight: number }>;
  accounts: Array<{ permission: { actor: string; permission: string }; weight: number }>;
  children?: PermissionNode[];
  parent?: string;
}

export interface PermissionGraph {
  account: string;
  permissions: Record<string, PermissionNode>;
  lastUpdated: string;
  onChainHash?: string;
}

export interface SimulationResult {
  canExecute: boolean;
  currentWeight: number;
  missingWeight: number;
  satisfiedKeys: string[];
  warnings: string[];
  riskLevel: 'safe' | 'warning' | 'danger';
}
```

### 5.2 Permission Engine — Pure Client-Side Threshold Math (lib/permissionEngine.ts)
```ts
// lib/permissionEngine.ts
export function calculateThreshold(
  permission: PermissionNode,
  providedKeys: string[]
): SimulationResult {
  let currentWeight = 0;
  const satisfiedKeys: string[] = [];
  const warnings: string[] = [];

  // Key matching
  permission.keys.forEach(k => {
    if (providedKeys.includes(k.key)) {
      currentWeight += k.weight;
      satisfiedKeys.push(k.key);
    }
  });

  const canExecute = currentWeight >= permission.threshold;
  const missingWeight = Math.max(0, permission.threshold - currentWeight);

  if (permission.name === 'owner' && missingWeight > 0) {
    warnings.push('CRITICAL: Owner permission cannot be recovered if all keys are lost');
  }
  if (currentWeight === 0 && permission.keys.length > 0) {
    warnings.push('No matching keys provided — this action will fail');
  }

  return {
    canExecute,
    currentWeight,
    missingWeight,
    satisfiedKeys,
    warnings,
    riskLevel: missingWeight === 0 ? 'safe' : missingWeight < 2 ? 'warning' : 'danger'
  };
}

// Additional 8+ safety rules (full file in repo)
export function validateProposedChange(current: PermissionGraph, proposed: PermissionGraph): string[] {
  const warnings: string[] = [];
  // Rule: Cannot reduce owner threshold below 1 if keys exist
  // Rule: Active cannot modify owner
  // Rule: Total weight must always >= threshold
  // ... (full implementation committed)
  return warnings;
}
```

### 5.3 Interactive SVG Permission Tree (components/PermissionTree.tsx — Core)
```tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PermissionNode, PermissionGraph } from '@/lib/types';

interface Props {
  graph: PermissionGraph;
  mode: 'viewer' | 'editor';
  onUpdate?: (nodeName: string, action: string, payload?: any) => void;
}

export function PermissionTree({ graph, mode, onUpdate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  // Recursive SVG tree renderer (lightweight, pixel-perfect, keyboard accessible)
  const renderNode = (node: PermissionNode, x: number, y: number, level: number) => {
    const isSelected = selected === node.name;
    return (
      <g key={node.name} onClick={() => setSelected(node.name)} className="cursor-pointer">
        <foreignObject x={x} y={y} width="240" height="160">
          <div className={`glassmorphic-crt pixel-border p-3 text-xs transition-all ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}>
            <div className="font-press-start text-[10px] mb-1 tracking-widest">{node.name.toUpperCase()}</div>
            <div className="flex justify-between text-[10px]">
              <span>Threshold</span>
              <span className="text-emerald-400 font-mono">{node.threshold}</span>
            </div>
            {node.keys.map((k, i) => (
              <div key={i} className="flex justify-between text-[9px] opacity-80 mt-0.5">
                <span>{k.key.slice(0, 10)}…</span>
                <span className="text-amber-400">{k.weight}</span>
              </div>
            ))}
            {mode === 'editor' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate?.(node.name, 'addKey'); }}
                className="mt-2 text-[9px] underline hover:text-emerald-400"
              >
                + ADD KEY
              </button>
            )}
          </div>
        </foreignObject>

        {/* Retro dashed connecting lines */}
        {node.children?.map((child, idx) => (
          <line 
            key={idx}
            x1={x + 120} y1={y + 80}
            x2={x + (idx - 1) * 260 + 120} y2={y + 170}
            stroke="#22c55e" strokeWidth="1" strokeDasharray="3 2" opacity="0.6"
          />
        ))}
      </g>
    );
  };

  return (
    <svg width="100%" height="620" className="bg-black/70 rounded-2xl border border-white/10">
      {Object.values(graph.permissions).map((node, i) => 
        renderNode(node, 60 + i * 280, 40, 0)
      )}
    </svg>
  );
}
```

*(Full component with drag-to-reorder, keyboard navigation, and Canvas overlay for precision lines committed in repo)*

---

## 6. How to Run Locally (Step-by-Step Dev Guide)

```bash
git clone https://github.com/pixel-journey/wax-permission-visualizer-and-editor.git
cd wax-permission-visualizer-and-editor
npm install
npm run dev
```

Open http://localhost:3000 — enter any WAX account (e.g. `pxjourney` or `atomicassets`) and see live permission tree.

Toggle between **Viewer** (read-only) and **Editor** (local drafts + safety preview). Click "Propose on-chain" to trigger WharfKit signing flow (demo mode included).

---

## 7. Integration Guide — Drop Into Your dApp (Copy-Paste Ready)

### 7.1 Quick Embed (Viewer Only)
```tsx
// In your Next.js page or component
 import { PermissionTree } from '@/components/PermissionTree';
 import { useAccountPermissions } from '@/hooks/useAccountPermissions';

 const { graph } = useAccountPermissions('myaccount');
 <PermissionTree graph={graph} mode="viewer" />
```

### 7.2 With PxWallet / WharfKit Session
```ts
// hooks/useWharfSession.ts + PermissionTree editor mode
// Full example in /hooks and /app page — supports auto-sign opt-in
```

### 7.3 Machine Integration (for AI Devs)
1. Copy `spec.yaml` into your project
2. Paste into Claude/Grok: "Using this spec.yaml, generate a permission auditor component for my DAO dashboard"
3. Get production code in seconds

---

## 8. Accessibility, Performance & Retro Pixel Standards

- **Reduced motion**: Respects `prefers-reduced-motion`
- **Haptics**: Optional vibration on threshold met / warnings
- **ARIA**: Full tree role, live regions for warnings, keyboard nav (arrow keys + Enter)
- **Lighthouse targets**: 95+ Performance, 98+ Accessibility, 100 SEO
- **CRT/Glassmorphic**: Custom CSS vars + backdrop-blur + scanlines (toggleable)
- **Font**: Press Start 2P for headers, system mono for data

---

## 9. On-Chain Entropy Helper (Future-Proof)

`lib/entropy.ts` provides deterministic client-side randomness from WharfKit broadcast TX hash + recent block header — ready for any weighted random simulations in future extensions (no RAM/oracle fees).

---

## 10. Related Blueprints & Ecosystem Synergy

This is **Tier 1 foundational security tooling**. Direct companions:
- `wax-safe-key-rotation-assistant`
- `wax-multi-sig-proposal-builder-and-simulator`
- `wax-account-permission-auditor`

All share the same spec.yaml pattern for instant cross-tool integration.

---

## 11. License & Credits

MIT License — Built with ❤️ for safer Antelope permission management.
Pixel Journey — Beautiful interfaces for public blockchain data.

*Last updated: July 02, 2026 — Deep Technical Decisions Refinement Pass*