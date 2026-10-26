import type { ChangeWarning, PermissionGraph } from "./types";

export function analyzeGraphRisk(graph: PermissionGraph): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];
  const perms = graph.permissions;
  const account = graph.account;

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
        message:
          "owner has no keys or account authorities — recovery may be impossible",
        affectedPermission: "owner",
      });
    }

    if (
      name === "owner" &&
      node.keys.length === 1 &&
      node.accounts.length === 0 &&
      total >= node.threshold
    ) {
      warnings.push({
        level: "warning",
        message: "owner is single-key — no multi-party recovery path",
        affectedPermission: "owner",
      });
    }

    if (name === "owner" && node.parent === "active") {
      warnings.push({
        level: "danger",
        message: "owner parent is active — inverted hierarchy",
        affectedPermission: "owner",
      });
    }

    for (const a of node.accounts) {
      // Only the *same* account's active on owner is the classic anti-pattern.
      // Other accounts' @active weights are normal social-recovery / multi-sig.
      if (
        name === "owner" &&
        a.permission.actor === account &&
        a.permission.permission === "active"
      ) {
        warnings.push({
          level: "danger",
          message: `owner includes ${account}@active — this account's active must not control its own owner`,
          affectedPermission: "owner",
        });
      }
    }

    if (name === "active" && node.parent && node.parent !== "owner") {
      warnings.push({
        level: "warning",
        message: `active parent is "${node.parent}" (expected owner)`,
        affectedPermission: "active",
      });
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

  const owner = perms.owner;
  if (owner && owner.accounts.length >= 2 && owner.threshold >= 2) {
    warnings.push({
      level: "info",
      message:
        "owner uses multi-party account authorities — see social-recovery blueprint for posture/runbooks",
      affectedPermission: "owner",
    });
  }

  const custom = Object.keys(perms).filter(
    (n) => n !== "owner" && n !== "active"
  );
  if (custom.length > 0) {
    warnings.push({
      level: "info",
      message: `Custom permission(s): ${custom.join(", ")} — prefer linkauth scope (session-keys blueprint)`,
    });
  }

  return warnings;
}
