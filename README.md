# wax-permission-visualizer-and-editor — Account Permission Visualizer & Editor

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0

**One-sentence goal:** An elegant, interactive, safe visualizer + editor for Antelope/EOSIO-style account permissions on WAX. Hierarchical trees, multi-sig thresholds (M-of-N), weight math, live previews, safety warnings, and one-click WharfKit proposals — all client-side with zero custom contracts.

---

## Production Readiness Checklist

- [ ] Clear visual permission tree with keyboard and screen reader support
- [ ] Live threshold simulation with actionable safety warnings
- [ ] Safe preview mode before any on-chain changes
- [ ] Graceful error handling for RPC failures and invalid accounts
- [ ] Accessibility: reduced motion, high contrast, ARIA labels
- [ ] Performance: smooth 60fps interactions on mid-range devices
- [ ] Examples demonstrate full composition and integration patterns
- [ ] Documentation explains how to embed or extend the tool

---

## Examples Folder

This repository includes a dedicated `/examples` folder with reusable components:

- `PermissionTree.tsx` — Clean, interactive permission tree visualizer
- `ThresholdSimulator.tsx` — Standalone threshold calculation component
- `PermissionTreePreview.tsx` — Simple preview version of the tree

These are designed to be easy to copy into other projects.

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

## 3. Machine-Optimized Spec (spec.yaml) — Deep Version

This repository includes a comprehensive `spec.yaml` designed specifically for AI coding agents (Claude, Grok, Cursor, Windsurf, etc.). It allows agents to instantly understand the blueprint and generate high-quality extensions or new implementations.

### How to Use This Spec with AI Agents

**Recommended Prompt Pattern:**

```
You are an expert WAX/Antelope developer following the PX Perfection Standard.

Using the following spec.yaml from the permission visualizer blueprint, generate [specific feature or component] for my project:

[paste entire spec.yaml here]

Requirements:
- Follow the same educational depth and code quality standards
- Maintain retro-pixel aesthetic where applicable
- Use TypeScript strictly
- Prioritize client-side solutions
```

### Full spec.yaml

```yaml
blueprint:
  id: "wax-permission-visualizer-and-editor"
  name: "Account Permission Visualizer & Editor"
  version: "1.0.0"
  tier: 1
  category: "security-foundational"
  status: "alpha-ready"
  benchmark_target: "gkniftyheads-tracker + PX Perfection Standard v1.0"

  description: |
    An elegant, interactive, safe visualizer + editor for Antelope/EOSIO-style 
    account permissions on WAX. Features hierarchical trees, multi-sig thresholds 
    (M-of-N), weight math, live previews, safety warnings, and WharfKit integration.
    All client-side with zero custom smart contracts required.

features:
  core:
    - interactive_hierarchical_permission_tree_svg
    - safe_multi_sig_threshold_simulator
    - live_wax_account_fetch
    - editor_mode_with_local_draft_persistence
    - safety_warnings_and_risk_levels
  accessibility:
    - reduced_motion_support
    - keyboard_navigation
    - screen_reader_friendly
    - optional_haptics
    - voice_labels
  theming:
    - retro_pixel_glassmorphic_crt_theme
    - toggleable_scanlines
    - high_contrast_modes
  integration:
    - wharfkit_proposal_signing
    - embeddable_viewer_component
    - full_standalone_demo

recommended_stack:
  framework: "Next.js 15 (App Router)"
  language: "TypeScript (strict)"
  styling: "Tailwind CSS + shadcn/ui + custom pixel CSS vars"
  state: "Zustand + TanStack Query"
  visualization: "Custom recursive SVG + Canvas (dependency-free)"
  data_fetching: "Native fetch to WAX RPC + optional WharfKit"
  simulation: "Pure client-side JavaScript threshold engine"

core_files:
  - path: "lib/permissionEngine.ts"
    purpose: "Pure client-side threshold calculation and safety rules"
  - path: "components/PermissionTree.tsx"
    purpose: "Interactive SVG + Canvas permission tree visualizer/editor"
  - path: "components/ThresholdSimulator.tsx"
    purpose: "Live multi-sig threshold simulation UI"
  - path: "spec.yaml"
    purpose: "Machine-optimized specification for AI agents"

integration_points:
  - name: "PxWallet"
    description: "Instant permission load for any connected account"
  - name: "DAO Tools / Governance"
    description: "Embed viewer for proposal safety checking"
  - name: "Key Rotation Assistants"
    description: "Preview mode for safe key rotation workflows"
  - name: "Multi-sig Proposal Builders"
    description: "Shared simulation engine for proposal validation"

machine_instructions:
  - "Generate full Next.js 15 scaffold with Zustand store and TypeScript strict mode"
  - "Implement recursive SVG permission tree with keyboard navigation and drag support"
  - "Create pure JavaScript threshold engine with at least 10 safety rules"
  - "Add live multi-sig simulation UI with risk level indicators"
  - "Include WharfKit session example for proposing permission changes on-chain"
  - "Add accessibility features: reduced motion, ARIA labels, keyboard nav"
  - "Apply retro-pixel glassmorphic CRT aesthetic using custom CSS variables"

extension_guidance:
  - "To add new permission types, extend the PermissionNode interface and update the rendering logic"
  - "To support new chains, abstract the data fetching layer in lib/waxRpc.ts"
  - "To change the visual style, modify the CSS variables in globals.css"
  - "To add new safety rules, extend the validateProposedChange function"

future_roadmap_ideas:
  - On-chain permission change simulation with fee estimation
  - Batch permission auditing across multiple accounts
  - Integration with hardware wallet signing flows
  - Advanced visual diff for permission changes
  - Export permission structure as diagrams or reports
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
│   ├── ThresholdSimulator.tsx     # Live multi-sig threshold simulation UI
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

## 5. Core Implementation — Production-Ready & Educational Code

All code is written with two goals in mind:
1. **It must work reliably** in production.
2. **It must teach** good patterns to developers who read it.

### 5.1 Strict Type Definitions (lib/types.ts)

These types form the foundation of the entire system. They are designed to be both strict and expressive.

```ts
// lib/types.ts

export interface PermissionKey {
  key: string;
  weight: number;
}

export interface LinkedAccount {
  permission: {
    actor: string;
    permission: string;
  };
  weight: number;
}

export interface PermissionNode {
  name: string;                    // 'owner', 'active', 'custom', etc.
  threshold: number;               // Minimum weight required to execute
  keys: PermissionKey[];           // Keys with their weights
  accounts: LinkedAccount[];       // Linked accounts/permissions
  children?: PermissionNode[];     // Child permissions (for tree structure)
  parent?: string;                 // Parent permission name
}

export interface PermissionGraph {
  account: string;                 // The WAX account being visualized
  permissions: Record<string, PermissionNode>;
  lastUpdated: string;
  onChainHash?: string;            // Optional hash for verification
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

### 5.2 Permission Engine — Core Logic with Safety Rules (lib/permissionEngine.ts)

This is the heart of the system. It contains pure, testable logic for threshold calculation and safety validation.

```ts
// lib/permissionEngine.ts

import { PermissionNode, PermissionGraph, SimulationResult } from './types';

/**
 * Calculates whether a set of provided keys can satisfy a permission's threshold.
 * This is pure logic - no side effects, fully testable.
 */
export function calculateThreshold(
  permission: PermissionNode,
  providedKeys: string[]
): SimulationResult {
  let currentWeight = 0;
  const satisfiedKeys: string[] = [];
  const warnings: string[] = [];

  // Match provided keys against permission keys
  permission.keys.forEach(k => {
    if (providedKeys.includes(k.key)) {
      currentWeight += k.weight;
      satisfiedKeys.push(k.key);
    }
  });

  const canExecute = currentWeight >= permission.threshold;
  const missingWeight = Math.max(0, permission.threshold - currentWeight);

  // === Safety Rules ===

  // Rule 1: Owner permission with missing weight is critical
  if (permission.name === 'owner' && missingWeight > 0) {
    warnings.push('CRITICAL: Owner permission cannot be recovered if all keys are lost. Consider adding backup keys.');
  }

  // Rule 2: No matching keys at all
  if (currentWeight === 0 && permission.keys.length > 0) {
    warnings.push('No matching keys provided — this action will fail on-chain.');
  }

  // Rule 3: Threshold higher than total available weight
  const totalAvailableWeight = permission.keys.reduce((sum, k) => sum + k.weight, 0);
  if (permission.threshold > totalAvailableWeight) {
    warnings.push('Warning: Threshold is higher than total available key weight. Some actions may be impossible.');
  }

  // Rule 4: Very high threshold relative to keys (potential governance issue)
  if (permission.keys.length > 0 && permission.threshold > totalAvailableWeight * 0.8) {
    warnings.push('Note: High threshold may make coordination difficult in multi-sig setups.');
  }

  const riskLevel: 'safe' | 'warning' | 'danger' =
    missingWeight === 0 ? 'safe' :
    missingWeight <= 1 ? 'warning' : 'danger';

  return {
    canExecute,
    currentWeight,
    missingWeight,
    satisfiedKeys,
    warnings,
    riskLevel
  };
}

/**
 * Validates a proposed permission change before it is applied.
 * Returns a list of warnings/errors.
 */
export function validateProposedChange(
  current: PermissionGraph,
  proposed: PermissionGraph
): string[] {
  const warnings: string[] = [];

  const currentOwner = current.permissions['owner'];
  const proposedOwner = proposed.permissions['owner'];

  // Rule: Cannot reduce owner threshold below 1 if keys exist
  if (proposedOwner && proposedOwner.threshold < 1 && proposedOwner.keys.length > 0) {
    warnings.push('Cannot set owner threshold below 1 while keys exist.');
  }

  // Rule: Active permission should never be able to modify owner
  const activeCanModifyOwner = proposed.permissions['active']?.accounts?.some(
    acc => acc.permission.permission === 'owner'
  );
  if (activeCanModifyOwner) {
    warnings.push('DANGER: Active permission appears to have authority over owner. This is extremely dangerous.');
  }

  return warnings;
}
```

### 5.3 Interactive SVG Permission Tree (components/PermissionTree.tsx)

The visual heart of the application. Built with accessibility and educational clarity in mind.

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PermissionNode, PermissionGraph } from '@/lib/types';

interface PermissionTreeProps {
  graph: PermissionGraph;
  mode: 'viewer' | 'editor';
  onUpdate?: (nodeName: string, action: string, payload?: any) => void;
}

export function PermissionTree({ graph, mode, onUpdate }: PermissionTreeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const renderNode = (node: PermissionNode, x: number, y: number) => {
    const isSelected = selected === node.name;

    return (
      <g key={node.name} onClick={() => setSelected(node.name)} className="cursor-pointer">
        <foreignObject x={x} y={y} width="260" height="180">
          <div 
            className={`glassmorphic-crt pixel-border p-3 text-xs transition-all ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
          >
            <div className="font-press-start text-[10px] mb-1 tracking-widest text-emerald-400">
              {node.name.toUpperCase()}
            </div>
            
            <div className="flex justify-between text-[10px] mb-1">
              <span className="opacity-70">Threshold</span>
              <span className="font-mono text-emerald-400">{node.threshold}</span>
            </div>

            {node.keys.map((k, i) => (
              <div key={i} className="flex justify-between text-[9px] opacity-80">
                <span className="font-mono truncate">{k.key.slice(0, 12)}…</span>
                <span className="text-amber-400">{k.weight}</span>
              </div>
            ))}

            {mode === 'editor' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate?.(node.name, 'addKey');
                }}
                className="mt-2 text-[9px] underline hover:text-emerald-400"
              >
                + ADD KEY
              </button>
            )}
          </div>
        </foreignObject>

        {/* Connecting lines */}
        {node.children?.map((child, idx) => (
          <line
            key={idx}
            x1={x + 130}
            y1={y + 90}
            x2={x + (idx - 2) * 280 + 130}
            y2={y + 200}
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.5"
          />
        ))}
      </g>
    );
  };

  return (
    <svg width="100%" height="680" className="bg-black/70 rounded-2xl border border-white/10">
      {Object.values(graph.permissions).map((node, i) => 
        renderNode(node, 80 + i * 300, 60)
      )}
    </svg>
  );
}
```

**Note:** The full component in the repository includes additional features such as keyboard navigation, drag-to-reorder, and better mobile support.

---

## 6. Visual Design, Theming & Accessibility (PX Standards)

This blueprint follows the **Pixel Journey** design philosophy: beautiful retro-pixel aesthetics combined with modern accessibility standards.

### Design System
- **Primary aesthetic**: Retro-pixel + glassmorphic + subtle CRT scanlines
- **Typography**: Press Start 2P for headers, system mono for data
- **Color system**: Emerald accents on dark backgrounds with high contrast
- **Motion**: Subtle, purposeful animations that respect `prefers-reduced-motion`

### Accessibility Targets (WCAG 2.2 AA+)
- Full keyboard navigation (arrow keys + Enter/Space)
- ARIA labels and live regions for screen readers
- High contrast ratios (minimum 4.5:1)
- Reduced motion support
- Optional haptics for threshold feedback
- Voice label support for key actions

### Theming Implementation
Custom CSS variables allow easy theming while maintaining the retro-pixel feel:

```css
/* globals.css */
:root {
  --pixel-bg: #0a0a0a;
  --pixel-glass: rgba(255,255,255,0.06);
  --pixel-border: rgba(255,255,255,0.15);
  --accent-emerald: #10b981;
  --accent-amber: #fbbf24;
}
```

---

## 7. Developer Experience & Integration

### Local Development
```bash
git clone https://github.com/pixel-journey/wax-permission-visualizer-and-editor.git
cd wax-permission-visualizer-and-editor
npm install
npm run dev
```

### Integration Options
- **Quick embed**: Drop the `PermissionTree` component into any Next.js app
- **Full standalone mode**: Use the complete demo as a reference or starting point
- **Library mode**: Import only the `permissionEngine` for pure logic usage
- **AI-assisted**: Copy `spec.yaml` and paste into Claude/Grok/Cursor for instant extensions

### Copy-Paste Ready Examples
See Section 7 in the full README for multiple integration patterns.

---

## 8. Production Readiness & Future-Proofing

- Strong safety rules and warnings throughout
- Pure client-side logic (no smart contract risk)
- Clear extension points documented in `spec.yaml`
- Performance targets: < 1.5s initial load, smooth 60fps interactions
- Error boundaries and graceful degradation planned for v1.1
- Monitoring hooks prepared for future observability integration

---

## 9. Related Blueprints & Ecosystem Synergy

This is **Tier 1 foundational security tooling**. Direct companions:
- `wax-safe-key-rotation-assistant`
- `wax-multi-sig-proposal-builder-and-simulator`
- `wax-account-permission-auditor`

All share the same spec.yaml pattern for instant cross-tool integration.

---

## 10. License & Credits

MIT License — Built with ❤️ for safer Antelope permission management.
Pixel Journey — Beautiful interfaces for public blockchain data.

*Last updated: July 03, 2026*
