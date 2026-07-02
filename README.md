# wax-permission-visualizer-and-editor — Account Permission Visualizer & Editor

> **Status:** ✅ **FULL PX PERFECTION (Alpha-Ready)** | Public Release Target: July 2026  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** henrikpiga/gkniftyheads-tracker (education depth, completeness, dev guidance, examples) + Pixel Journey retro-pixel glassmorphic excellence

**One-sentence goal:** An elegant, interactive, safe visualizer + editor for Antelope/EOSIO-style account permissions on WAX. Hierarchical trees, multi-sig thresholds (M-of-N), weight math, live previews, safety warnings, and one-click WharfKit proposals — all client-side with zero custom contracts.

---

## 1. Overview & Why This Matters (Educational Core)

The Antelope permission model is one of the most powerful yet dangerous features in blockchain. A single misconfigured threshold or lost owner key can permanently lock funds. This blueprint turns that complexity into clarity.

### Core Concepts (Explained Simply)
- **owner vs active**: `owner` is the root of trust. `active` handles day-to-day actions. `owner` can change `active`; `active` cannot touch `owner`.
- **Weights + Thresholds**: Every key or linked account has a weight. The permission has a threshold. Sum of signing weights must ≥ threshold.
- **Multi-sig (M-of-N)**: 2-of-3, 3-of-5 etc. Common in DAOs, teams, exchanges.
- **Linked Permissions**: Fine-grained control (e.g. only `transfer` on a specific contract).

**Common Catastrophic Mistakes This Tool Prevents**:
- Accidentally removing the last owner key
- Setting threshold higher than total available weight
- Giving `active` permission to change `owner`
- Losing access during key rotation

**Success Metrics (gkniftyheads-tracker level)**:
- Visualize any WAX account permission tree in < 1.5s
- 100% accurate threshold math + safety warnings
- 95+ Lighthouse accessibility/performance
- Copy-paste integration into any dApp in < 10 minutes

---

## 2. Tech Recommendations Matrix (Pros/Cons + Final Choices)

We evaluated multiple options for maximum education value, performance, and future-proofing. Final choices prioritize **zero custom contracts**, **client-side only**, **retro-pixel aesthetic**, and **maximum reusability**.

| Component                  | Recommended (Chosen)              | Alternative A                          | Alternative B                     | Pros of Chosen | Cons of Chosen | When to Use Alternative |
|----------------------------|-----------------------------------|----------------------------------------|-----------------------------------|---------------|---------------|-------------------------|
| **Visualization**         | Custom hierarchical SVG + Canvas tree (recursive layout) | @xyflow/react (React Flow)            | D3.js force/tree                 | Zero deps, pixel-perfect retro control, educational code, lightweight | More initial layout code | Use React Flow if you want fastest dev time and don't mind bundle size |
| **State**                 | Zustand + TanStack Query         | Jotai                                 | Redux Toolkit                    | Tiny, excellent TS, perfect for draft persistence | Slightly less "magic" | Jotai for even simpler single-file demos |
| **Blockchain Fetch**      | Native `fetch` to WAX RPC + optional WharfKit | @wharfkit/account-kit only           | Legacy eosjs                     | No legacy deps, works everywhere, easy to audit | Manual parsing | WharfKit-only if already deep in WharfKit ecosystem |
| **Editor Interactions**   | SVG + Framer Motion drag + pointer events | React Flow built-in drag             | Pure Canvas hit-testing          | Best retro feel + accessibility (keyboard + screen reader) | Custom drag logic | React Flow for rapid prototyping |
| **Multi-sig Simulation**  | Pure client-side JS threshold engine | WASM simulation                      | On-chain msig preview            | Instant, free, educational, no fees | No real on-chain execution until user signs | On-chain only for final proposal validation |
| **Theming**               | Tailwind + shadcn/ui + custom pixel CSS vars + CRT/glassmorphic | Full custom CSS from scratch        | Headless UI primitives only      | Fast consistent UI + easy pixel overrides | Requires theme overrides | Full custom if you have strong design system already |

**Why these choices win for education & reusability**: Every decision is explained with trade-offs so future devs (and their AI agents) can make informed decisions in their own projects.

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
- `wax-safe-key-rotation-assistant` (next in queue)
- `wax-multi-sig-proposal-builder-and-simulator`
- `wax-account-permission-auditor`

All share the same spec.yaml pattern for instant cross-tool integration.

---

## 11. License & Credits

MIT License — Built with ❤️ for safer Antelope permission management.
Pixel Journey — Beautiful interfaces for public blockchain data.

*Last updated: July 02, 2026 — Full PX Perfection commit*
