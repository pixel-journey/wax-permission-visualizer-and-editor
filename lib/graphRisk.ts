import type { ChangeWarning, PermissionGraph } from "./types";

export function analyzeGraphRisk(graph: PermissionGraph): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];
  const perms = graph.permissions;

  for (const [name, node] of Object.entries(perms)) {
    const keyWeight = node.keys.reduce((s, k) => s + k.weight, 0);
    const acctWeight = node.accounts.reduce((s, a) => s + a.weight, 0);
    const total = keyWeight + acctWeight;

    if (total < node.threshold) {
      warnings.push({
        level: "danger",
        message: `${name}: total weight ${total} < threshold ${node.threshold}`,
        affectedPermission: name,
      });
    }

    if (name === "owner" && total === 0) {
      warnings.push({
        level: "danger",
        message: "owner has no keys or account authorities — recovery may be impossible",
        affectedPermission: "owner",
      });
    }

    if (name === "owner" && node.keys.length === 1 && node.accounts.length === 0) {
      warnings.push({
        level: "warning",
        message: "owner is single-key — no multi-sig recovery",
        affectedPermission: "owner",
      });
    }

    // active listed as parent of owner would be inverted (should never happen on-chain)
    if (name === "owner" && node.parent === "active") {
      warnings.push({
        level: "danger",
        message: "owner parent is active — inverted hierarchy",
        affectedPermission: "owner",
      });
    }

    for (const a of node.accounts) {
      if (name === "owner" && a.permission.permission === "active") {
        warnings.push({
          level: "danger",
          message: `owner includes ${a.permission.actor}@active — active must not control owner`,
          affectedPermission: "owner",
        });
      }
    }
  }

  if (!perms.owner) {
    warnings.push({
      level: "warning",
      message: "No owner permission in graph (unexpected for standard accounts)",
    });
  }

  if (!perms.active) {
    warnings.push({
      level: "info",
      message: "No active permission listed",
    });
  }

  return warnings;
}
