# wax-permission-visualizer-and-editor — Account Permission Visualizer & Editor

> **Trust Label:** `educational-reference`  
> **Verification:** See [VERIFICATION-LOG.md](VERIFICATION-LOG.md) for honest status of all claims (currently UNTESTED pending live evidence).

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Authentication, Multi-Sig & Permission Management (Core Antelope/EOSIO)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0

**One-sentence goal:** An elegant, interactive, safe visualizer + editor for Antelope/EOSIO-style account permissions on WAX. Hierarchical trees, multi-sig thresholds (M-of-N), weight math, live previews, safety warnings, and one-click WharfKit proposals — all client-side with zero custom contracts.

---

## Repo Scope & Focus

This repository is designed to be the **definitive educational + interactive hub** for understanding, visualizing, editing, and safely working with Antelope/WAX account permissions.

### Primary Focus Areas

- **Interactive Visualization & Editing** — The core strength of this repo. Clean, educational, and powerful tools for exploring and modifying permission structures.
- **Permission Scopes & Linked Permissions** — Deep coverage of one of the most important (and often misunderstood) security features on WAX.
- **Smart Contract Permission Patterns** — Practical guidance and code examples for contract developers.
- **Safety, Anti-Patterns & Risk Analysis** — Strong emphasis on identifying and avoiding dangerous configurations.
- **Educational Depth** — Clear explanations, real-world workflows, and reusable components that help developers learn and build better systems.

### What This Repo Does *Not* Aim to Fully Cover

- Full multi-sig proposal creation and on-chain execution workflows (see `wax-multi-sig-proposal-builder-and-simulator`)
- Detailed step-by-step key rotation assistants (see planned `wax-safe-key-rotation-assistant`)
- Batch permission auditing across many accounts (potential future tool)

This focused scope allows us to go deep where it matters most while keeping the repo coherent and maintainable.

---

## Permission Scopes & Linked Permissions (Deep Dive)

One of the most powerful — and frequently underused — features of the Antelope permission model is the ability to **scope** (or "link") permissions to specific contracts and actions.

### What Are Permission Scopes?

By default, a permission like `active` can be used to authorize **any** action on **any** contract. This is very flexible but also dangerous.

**Linked permissions** (also called scoped permissions) allow you to restrict a permission so that it can **only** be used for specific contracts and actions.

Example:
- Without scoping: `myaccount@active` can call anything.
- With scoping: `myaccount@transfer` can **only** call `eosio.token::transfer`.

This dramatically reduces the attack surface and is one of the best ways to build secure systems on WAX.

### Why Scopes Matter So Much

| Without Scoping                          | With Proper Linked Permissions                  | Security Impact                          |
|------------------------------------------|--------------------------------------------------|------------------------------------------|
| Any contract can abuse the permission    | Only the intended action can be called           | Much lower risk of smart contract abuse  |
| High-value actions share the same key    | Sensitive actions require specific permissions   | Better protection for treasuries & users |
| Hard to audit what a permission can do   | Clear, explicit scope                            | Easier to reason about and audit         |
| Easy to make dangerous mistakes          | Mistakes are more contained                      | Safer overall permission design          |

### How Linked Permissions Work

You create a linked permission in two steps:

1. Create a new permission (or reuse an existing one).
2. Link it to a specific contract + action.

```bash
# 1. Create the 'transfer' permission
cleos set account permission myaccount transfer \
  '{"threshold":1,"keys":[{"key":"PUBKEY","weight":1}],"accounts":[],"waits":[]}' active -p myaccount@active

# 2. Link it so it can ONLY call transfer on eosio.token
cleos set action permission myaccount eosio.token transfer transfer
```

After this, `myaccount@transfer` is **only** valid for `eosio.token::transfer`. It cannot be used for anything else.

### Using Scopes in Smart Contracts

Contracts can enforce specific permission levels using:

```cpp
void mycontract::withdraw(name user, asset amount) {
    // Only allows calls authorized with the 'transfer' permission
    require_auth(permission_level{user, "transfer"_n});
    // ... business logic
}
```

If someone tries to call this with only the generic `active` permission (without the link), the transaction will fail.

### Common Patterns

| Pattern                        | Recommended Scope                              | Use Case                              |
|--------------------------------|------------------------------------------------|---------------------------------------|
| `transfer` permission          | `eosio.token::transfer` (or specific token)    | Token transfers & withdrawals         |
| `claim` permission             | Game/reward contract + claim action            | Games, airdrops, staking rewards      |
| `publish` permission           | Content/social contract + publish action       | Social platforms, content creation    |
| `admin` permission             | Specific admin actions only                    | DAO tooling, protocol configuration   |

### Anti-Patterns to Avoid

| Anti-Pattern                              | Risk                                      | Recommendation                                      |
|-------------------------------------------|-------------------------------------------|-----------------------------------------------------|
| Using only generic `active` for everything | Very large attack surface                 | Create specific linked permissions for sensitive actions |
| Creating linked permissions that are too broad | Still dangerous                           | Scope as narrowly as possible (ideally one contract + action) |
| Not documenting which actions require which permission | Confusion and mistakes in frontend     | Clearly communicate permission requirements to users |
| Linking high-value actions to weak permissions | Funds can be drained easily              | Use appropriate thresholds + multi-sig where needed |

### How This Visualizer Helps With Scopes

- The interactive permission tree clearly shows which permissions are linked and to what.
- The risk analyzer automatically surfaces critical warnings.
- The `LinkedPermissionExample.tsx` component helps developers understand proper scoping patterns.
- You can safely design and preview scoped permission structures before broadcasting changes.

### Best Practices for Permission Scopes

1. **Always use linked permissions** for any action that moves value or has high impact.
2. **Scope as narrowly as possible** — ideally to a single contract + single action.
3. **Document permission requirements** clearly in your dApp and smart contract.
4. **Use the visualizer** before making changes involving scopes.
5. **Test thoroughly** with both single-key and multi-sig accounts.
6. **Regularly audit** linked permissions as your project evolves.

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

This repository includes a dedicated `/examples` folder with reusable components focused on Permission Tree Visualization and Safety Analysis:

- `PermissionTree.tsx` — **Enhanced interactive tree** with full editing support (add/remove keys, change thresholds)
- `PermissionRiskAnalyzer.tsx` — Clean risk and warning display component
- `PermissionDiffViewer.tsx` — Before/after comparison for permission changes
- `MultiSigSimulationPreview.tsx` — Multi-sig approval simulation (great for DAOs and governance)
- `LinkedPermissionExample.tsx` — Examples of linked permissions for smart contracts
- `WharfKitIntegrationExample.tsx` — Example of connecting to WharfKit for on-chain actions
- `PermissionExport.tsx` — Export permission structures as JSON or YAML
- `PermissionPolicyChecker.tsx` — Demonstrates how contracts validate permissions
- `ScopeImpactSimulator.tsx` — Shows the security impact of using (or not using) permission scopes
- `SmartContractPermissionPatterns.tsx` — Common require_auth patterns with security levels
- `PermissionAuditChecklist.tsx` — Checklist for systematically auditing permission structures
- `PermissionWeightVisualizer.tsx` — Visual overview of weights vs threshold
- `PermissionRiskSummary.tsx` — Quick overall risk summary for a permission structure
- `PermissionStructureRecommendations.tsx` — Recommended structures for different use cases
- `PermissionBestPracticesChecklist.tsx` — Best practices checklist for permission management
- `CommonPermissionTemplates.tsx` — Common permission structure templates for quick starts
- `ThresholdSimulator.tsx` — Standalone threshold calculation
- `PermissionTreePreview.tsx` — Simple preview version

These components are designed to be copy-paste friendly and educational.

---

## Using These Components in Your Project

All components in the `/examples` folder are designed to be easy to copy and adapt into your own Next.js, React, or TypeScript projects.

### Quick Integration Steps

1. Copy the desired component file(s) into your project.
2. Adjust imports and styling to match your design system (most use Tailwind + shadcn/ui patterns).
3. Pass the required props (e.g. `PermissionTree` needs a `PermissionNode` structure).
4. Connect to your data source (e.g. fetch account permissions via WAX RPC or WharfKit).

### Recommended Starting Points

- **For visualization**: Start with `PermissionTree.tsx` + `PermissionWeightVisualizer.tsx`
- **For safety checks**: Use `PermissionRiskAnalyzer.tsx` + `PermissionAuditChecklist.tsx`
- **For scopes education**: Use `LinkedPermissionExample.tsx` + `ScopeImpactSimulator.tsx`
- **For smart contract developers**: Use `SmartContractPermissionPatterns.tsx` + `PermissionPolicyChecker.tsx`

### TypeScript Types

Most components use the types defined in `lib/types.ts`. You can copy those types or extend them as needed.

---

## Common Workflows

This section covers the most important real-world workflows when working with permissions on WAX.

### 1. Safely Setting Up a Multi-Sig Account

**Goal**: Create a secure multi-sig structure without locking yourself out.

**Recommended Steps**:

1. Start with a single `owner` key you fully control.
2. Add additional trusted keys or accounts to `owner` with appropriate weights.
3. Set a reasonable threshold (e.g. 2-of-3 or 3-of-5).
4. **Never** remove your last controlling key until the new structure is fully tested.
5. Use the Permission Visualizer to preview the structure before broadcasting.
6. Test with a small transaction first.

**Common Mistake**: Setting the threshold higher than the total weight of keys you control.

### 2. Rotating Keys Safely

**Goal**: Replace compromised or old keys without losing access.

**Recommended Steps**:

1. Add the new key to the relevant permission(s) first.
2. Verify the new key works by signing a test transaction.
3. Only then remove the old key.
4. Use the visual diff tool to confirm the change looks correct.
5. Update any off-chain records or backup systems.

**Tool Support**: The `PermissionDiffViewer` component is ideal for previewing key rotation changes.

### 3. Auditing an Existing Account

**Goal**: Identify dangerous or fragile permission setups.

**What to Check**:

- Is the `owner` permission recoverable? (At least 1–2 keys with reasonable weights)
- Does `active` have authority over `owner`? (Major red flag)
- Are thresholds reasonable relative to total weight?
- Are there overly permissive linked permissions?
- Are high-value actions protected by specific permissions?

Use the `PermissionRiskAnalyzer` component to surface warnings automatically.

### 4. Designing Permissions for a Game or dApp

**Goal**: Create safe, usable permission structures for players and the project.

**Recommended Approach**:

- Use linked permissions for high-impact actions (`transfer`, `claim`, `stake`, etc.)
- Keep `active` relatively permissive for daily use
- Use multi-sig or higher thresholds for treasury/admin actions
- Provide clear frontend guidance on which permission is needed for each action
- Regularly audit permission usage as the project evolves

---

## Anti-Patterns & Security Risks (Deep Dive)

This section provides a detailed catalog of dangerous permission patterns on WAX/Antelope, why they are risky, and how to avoid or detect them.

### Critical Anti-Patterns

| Anti-Pattern | Description | Risk Level | How to Detect | How to Fix |
|--------------|-------------|------------|---------------|------------|
| **Active controls Owner** | The `active` permission has authority to modify `owner` | Critical | Visual tree shows `active` linked to `owner` | Remove the link immediately. `active` should never control `owner`. |
| **Owner has zero recoverable keys** | No keys with meaningful weight on `owner` | Critical | `owner` threshold > total key weight | Add backup keys or reduce threshold before it's too late. |
| **Threshold higher than total weight** | Proposal can never execute | High | Simulation shows insufficient weight | Lower threshold or add more keys/weight. |
| **Overly permissive linked permissions** | Any contract can call sensitive actions | High | Linked permission has broad actor scope | Scope the linked permission to specific contracts/actions. |
| **Single key controls high-value permission** | No multi-sig on treasury or admin actions | High | Visual tree shows single key with full weight | Add multi-sig structure with reasonable threshold. |
| **No separation between daily and high-risk actions** | `active` can do everything | Medium-High | All actions use generic `active` | Create specific linked permissions for high-impact actions. |

### Why These Patterns Are So Dangerous on WAX

- Permission changes are often irreversible without the `owner` key.
- Smart contracts can be abused if linked permissions are too broad.
- Multi-sig mistakes can permanently lock funds.
- Most users and even many developers underestimate these risks until it's too late.

### How the Visualizer Helps Prevent These Issues

- The interactive tree makes dangerous relationships visible at a glance.
- The risk analyzer automatically surfaces critical warnings.
- The diff viewer lets you preview changes before broadcasting.
- The simulation tools show whether a proposal can actually execute.

---

## Permission Best Practices by Use Case

Different types of projects have different permission needs. Here are recommended approaches for common categories.

### Games & Play-to-Earn

- Use linked `claim` / `reward` permissions for reward distribution.
- Keep player `active` permission relatively open for smooth gameplay.
- Use multi-sig or higher thresholds for treasury and admin actions.
- Provide clear in-game guidance on which actions require which permissions.

### DAOs & Governance

- Strong multi-sig on `owner` with clear, documented thresholds.
- Separate permissions for proposal creation vs execution.
- Use the visualizer and simulation tools before every governance change.
- Regularly audit permission structure as membership changes.

### Token Projects & Marketplaces

- Use specific linked `transfer` permissions.
- Consider time-locked or multi-sig requirements for large withdrawals.
- Provide clear documentation for integrators on required permissions.

### Infrastructure & Tooling

- Very conservative permission structures.
- Strong emphasis on recoverability and auditability.
- Provide excellent tooling (like this visualizer) to help users manage permissions safely.

---

## Smart Contract Permission Patterns & Best Practices

This section provides deep guidance on how smart contracts should interact with the Antelope permission model on WAX.

### Core Concepts for Contract Developers

When writing smart contracts, permissions are enforced through `require_auth()` calls. Understanding the difference between generic and specific permission requirements is critical for security.

#### 1. Generic vs Specific Permission Requirements

```cpp
// Generic - requires the caller's 'active' permission by default
void mycontract::transfer(name from, name to, asset quantity, string memo) {
    require_auth(from);
}

// Specific - only allows calls authorized with the 'transfer' permission
void mycontract::transfer(name from, name to, asset quantity, string memo) {
    require_auth(permission_level{from, "transfer"_n});
}
```

**Recommendation**: Use specific linked permissions (`transfer`, `claim`, `publish`, etc.) for any action that moves value or has significant impact.

#### 2. Common Permission Patterns in Contracts

| Pattern                        | When to Use                                      | Security Level | Example Use Case                     |
|--------------------------------|--------------------------------------------------|----------------|--------------------------------------|
| Default `active`               | Simple read-only or low-risk actions             | Medium         | Viewing data, simple queries         |
| Linked `transfer` permission   | Any action that moves tokens or value            | High           | Token transfers, withdrawals         |
| Linked `claim` / `reward`      | Game reward claiming, airdrops                   | High           | Games and play-to-earn mechanics     |
| Linked `admin` / `publish`     | Administrative or content publishing actions     | High           | DAO tools, content platforms         |
| Multi-level thresholds         | High-value or governance actions                 | Very High      | Treasury management, protocol changes|

---

*Full educational content restored. See git history for complete prior version. Trust label and verification pointer added for Gate 0.*
