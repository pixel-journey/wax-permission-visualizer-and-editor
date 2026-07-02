# wax-permission-visualizer-and-editor — Account Permission Visualizer & Editor

> **Status:** 🔒 Private (In Development) | Target Public Release: July 2026  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)

**One-sentence goal:** An elegant, interactive visualizer and safe editor for Antelope/EOSIO-style account permissions on WAX, showing keys, multi-sig thresholds (M-of-N), permission hierarchies, and allowing safe modifications with previews and warnings.

---

## 1. Overview & Goal

This blueprint provides a clear, visual, and safe interface for understanding and managing the powerful but complex permission system used across Antelope chains (including WAX, EOS, and others). It visualizes owner/active permissions, linked keys, multi-sig thresholds, and allows users to safely propose changes with clear impact previews.

**Important Antelope/EOSIO Context:**
- Every account has at minimum `owner` and `active` permissions.
- `owner` can change `active` (and itself in some cases), but `active` cannot change `owner`.
- Permissions support multi-sig via `accounts` (other accounts with weight) and `keys` (public keys with weight).
- Thresholds like 1-of-5, 2-of-5, 3-of-5 etc. determine how many signatures are needed.
- Not every key/permission is required for every action — it depends on the specific permission used for that action.

**Why it matters for WAX/Antelope:**
- The permission model is one of the most powerful features of these chains but is often poorly understood and error-prone to manage.
- Beautiful tooling here dramatically improves security and usability for individuals, teams, DAOs, and exchanges.
- Pure client-side using standard Antelope RPCs and libraries (like @wharfkit or eosjs).

**Target users:**
- Individual users managing their own keys safely
- Teams and DAOs using multi-sig
- Exchanges and custodians
- Developers and security auditors

**Success metrics:**
- Clearly visualize complex permission trees in < 2 seconds
- Safe preview of any change before submission
- 95+ Lighthouse scores
- Significantly reduce common permission management mistakes

---

## 2. Concepts & Inspiration

### Core Blockchain Concepts (Antelope/EOSIO)
- **owner vs active**: `owner` is the highest permission; `active` is used for most day-to-day actions.
- **Weights and thresholds**: Each key or account link has a weight; the permission has a threshold. Sum of weights from signing keys/accounts must meet or exceed threshold.
- **Linked permissions**: Permissions can be linked to specific contract actions for fine-grained control.
- **Multi-sig**: Multiple keys or accounts can be added to a permission with individual weights.
- **Key rotation safety**: Owner can rotate active keys; active cannot rotate owner.

### User Pain Points Addressed
- Permission structures are hard to visualize and reason about.
- Changing keys is risky without good previews and warnings.
- Multi-sig setup and management lacks good UIs.
- Common mistakes (e.g., losing access to owner) are irreversible.

### Inspirations
- Traditional: Permission management in enterprise systems, SSH key management UIs, multi-sig wallet interfaces (e.g., Gnosis Safe style but native to Antelope).
- Web3: Existing EOSIO explorers' permission views (we make them beautiful, interactive, and editable with safety).
- Design: Clear tree/hierarchy visualizations + diff-style change previews.

**Related Blueprints (synergy):**
- Direct foundation for `wax-safe-key-rotation-assistant`, `wax-multi-sig-proposal-builder-and-simulator`, and `wax-account-permission-auditor`.
- Complements reputation and DAO tooling.

---

## 3. Design Specifications (Pixel Journey Standards)

### 3.1 Visual & Interaction Design
- **Overall layout**: Split view — left: interactive permission tree/hierarchy visualizer. Right: selected permission details, keys/accounts list, weights, and edit controls. Top bar: account search + safety mode toggle.
- **Color palette**: Professional indigo + clear success/warning/danger colors for changes. Dark mode first.
- **Micro-interactions**: Smooth tree expansion, hover highlights on linked permissions, animated previews of proposed changes, clear "This change requires owner permission" warnings.
- **Responsive**: Strong desktop for complex trees; mobile-friendly read-only view.

### 3.2 Key Views / Components
- `PermissionTree.tsx` — Interactive visual tree of permissions (owner → active → custom).
- `PermissionDetailPanel.tsx` — Shows keys, linked accounts, weights, threshold, and linked actions.
- `ChangePreview.tsx` — Side-by-side or diff view of current vs proposed permission state.
- `MultiSigEditor.tsx` — UI for adding/removing keys/accounts and adjusting weights/thresholds.
- `SafetyWarnings.tsx` — Dynamic warnings (e.g., "This would remove the only owner key").

### 3.3 Accessibility (A11y) & Inclusive Design
- WCAG 2.2 AA: Full keyboard navigation of the tree, high-contrast modes, clear announcements of changes and warnings.
- Screen reader friendly: Structured announcements of permission hierarchy and risks.

### 3.4 Performance & Optimization Targets
- Lighthouse 95+
- Fast rendering even for accounts with many linked permissions
- Smooth previews without full transaction simulation until commit

---

## 4. Technical Architecture

### 4.1 Core Tech Stack (Standardized)
- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS + shadcn/ui + framer-motion
- **State & Data:** @tanstack/react-query + zod + Jotai
- **Wallet & Signing:** @wharfkit/session (for proposing changes)
- **Blockchain Data:** Standard Antelope RPC (get_account, get_permission) — works across WAX, EOS, etc.
- **Utilities:** date-fns, lucide-react, sonner

### 4.2 Data Flow Diagram
```
Enter account name
    ↓
Fetch full permission structure (RPC)
    ↓
Render interactive tree + details
    ↓
User proposes changes (add key, change weight, add multi-sig, etc.)
    ↓
Show live preview + safety warnings
    ↓
User reviews and signs transaction via WharfKit
```

### 4.3 Folder Structure
```
app/
├── (permissions)/
│   └── [account]/page.tsx      # Dynamic permission explorer/editor
├── components/
│   ├── permissions/
│   │   ├── PermissionTree.tsx
│   │   ├── PermissionDetailPanel.tsx
│   │   ├── ChangePreview.tsx
│   │   └── MultiSigEditor.tsx
├── hooks/
│   ├── useAccountPermissions.ts
│   └── useWharfkitSession.ts
├── lib/
│   ├── antelope/
│   │   ├── permission-parser.ts
│   │   └── change-validator.ts
│   └── utils.ts
├── types/
│   └── permission.ts
public/
└── mock-accounts/               # Sample permission structures for demo
```

### 4.4 Security & Privacy Notes
- All analysis is read-only until user explicitly signs changes
- Strong warnings for dangerous operations (losing owner access, reducing threshold too low, etc.)
- Clear distinction between read and propose modes

---

## 5. Implementation Examples & Code Snippets

### 1. Fetching permissions (Antelope RPC)
```ts
// hooks/useAccountPermissions.ts
const res = await fetch(`https://wax.api.atomicassets.io/v1/chain/get_account`, {
  method: 'POST',
  body: JSON.stringify({ account_name: account })
});
const data = await res.json();
// Parse permissions array into tree structure
```

### 2. Change validation example
```ts
// lib/antelope/change-validator.ts
export function validateChange(current, proposed) {
  if (proposed.owner && !current.owner.canModify) {
    return { valid: false, reason: "Active permission cannot modify owner" };
  }
  // Additional safety checks...
  return { valid: true };
}
```

### 3. Multi-sig proposal crafting
```ts
// Use WharfKit to propose a permission update transaction
```

---

## 6. Demo & Testing Strategy

- **Live Demo Toggle:** Mock accounts ↔ Live WAX (or other Antelope) accounts
- **Storybook** for tree, panels, previews
- **Playwright** e2e: view permissions → propose safe change → preview warnings
- **Vitest** for validation logic
- Vercel previews

---

## 7. Roadmap & Development Phases

**Phase 0 — Scaffold (1–2 days)**
- Next.js + Tailwind + permission fetching + basic tree view

**Phase 1 — Core Logic (4 days)**
- Permission parsing, multi-sig modeling, change validation, safety rules

**Phase 2 — UI Polish (4 days)**
- Interactive tree, detail panels, change preview, multi-sig editor

**Phase 3 — Safety & Polish (2–3 days)**
- Advanced warnings, accessibility, performance, responsive views

**Phase 4 — Documentation & Release (2 days)**
- Full README, screenshots, AI prompt pack, make public

**Future Enhancements**
- Batch permission analysis across multiple accounts
- Integration with the key rotation and multi-sig proposal tools in this family
- Support for custom linked permissions and action-level permissions
- Exportable permission reports/audits

---

## 8. Visual References & Mockups

**Key Screen:**
Clean split view. Left side shows a clear hierarchical tree: Owner at top, then Active, then any custom permissions. Each node shows keys and linked accounts with weights. Right panel shows details for the selected permission and proposed changes with live preview and warnings (e.g., red banner if changing owner without proper authorization).

> *Feels like a professional security/permission management tool — clear, safe, and empowering.*

**ASCII Sketch:**
```
Account: myaccount

Owner (threshold: 1)
├── Key: EOS6... (weight 1)
Active (threshold: 2)
├── Key: EOS7... (weight 1)
├── Account: partner (weight 1)   ← Multi-sig
CustomPerm (threshold: 1)
└── Key: EOS8... (weight 1)

[ Propose Change ]  [ Warnings: None ]
```

---

## 9. Related Blueprints & Ecosystem Fit

- `wax-safe-key-rotation-assistant` — Direct companion for safe key changes.
- `wax-multi-sig-proposal-builder-and-simulator` — Uses this visualizer as foundation.
- `wax-account-permission-auditor` — Complements with security analysis.

---

## 10. License, Contributing & Credits

- MIT License
- Built with ❤️ for safer key and permission management on Antelope chains (WAX, EOS, etc.)
- Uses standard Antelope RPC patterns
- Pixel Journey Design System for clarity and safety
- Special thanks to the deep multi-sig and permission model discussions that inspired this

**This blueprint makes one of the most powerful (and complex) features of Antelope chains accessible and safe to use.**

*Pixel Journey — Beautiful interfaces for public blockchain data.*

---

*Last updated: July 02, 2026*