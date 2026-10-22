/**
 * Pure client-side permission threshold engine + safety rules.
 * Educational — not a chain enforcement layer.
 */
import {
  PermissionNode,
  PermissionGraph,
  SimulationResult,
  ChangeWarning,
} from "./types";

export function calculateThreshold(
  permission: PermissionNode,
  providedKeys: string[]
): SimulationResult {
  let currentWeight = 0;
  const satisfiedKeys: string[] = [];
  const warnings: string[] = [];

  permission.keys.forEach((k) => {
    if (providedKeys.includes(k.key)) {
      currentWeight += k.weight;
      satisfiedKeys.push(k.key);
    }
  });

  const canExecute = currentWeight >= permission.threshold;
  const missingWeight = Math.max(0, permission.threshold - currentWeight);

  if (permission.name === "owner" && missingWeight > 0) {
    warnings.push("CRITICAL: Owner permission — losing all keys is irreversible");
  }
  if (currentWeight === 0 && permission.keys.length > 0) {
    warnings.push("No matching keys provided for this permission");
  }
  if (missingWeight > 0 && permission.threshold > 1) {
    warnings.push(`Missing ${missingWeight} weight to meet threshold`);
  }

  return {
    canExecute,
    currentWeight,
    missingWeight,
    satisfiedKeys,
    warnings,
    riskLevel:
      missingWeight === 0 ? "safe" : missingWeight < 2 ? "warning" : "danger",
  };
}

function totalAuthWeight(p: PermissionNode): number {
  return (
    p.keys.reduce((sum, k) => sum + k.weight, 0) +
    p.accounts.reduce((sum, a) => sum + a.weight, 0)
  );
}

/**
 * Validates a proposed permission graph against a baseline (e.g. on-chain).
 * Empty array does not mean "safe to broadcast" — only that known heuristics passed.
 */
export function validateProposedChange(
  current: PermissionGraph,
  proposed: PermissionGraph
): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];
  const currentOwner = current.permissions["owner"];
  const proposedOwner = proposed.permissions["owner"];

  if (proposedOwner && proposedOwner.threshold < 1) {
    warnings.push({
      level: "danger",
      message: "Owner threshold cannot be 0 — account would be permanently locked",
      affectedPermission: "owner",
    });
  }

  if (proposedOwner && totalAuthWeight(proposedOwner) === 0) {
    warnings.push({
      level: "danger",
      message: "Proposed owner has zero keys and accounts — irreversible lock risk",
      affectedPermission: "owner",
    });
  }

  if (
    currentOwner &&
    proposedOwner &&
    totalAuthWeight(proposedOwner) < totalAuthWeight(currentOwner) &&
    proposedOwner.keys.length < currentOwner.keys.length
  ) {
    warnings.push({
      level: "warning",
      message:
        "Owner authority reduced (fewer keys/weight) — confirm you still control recovery",
      affectedPermission: "owner",
    });
  }

  for (const a of proposedOwner?.accounts ?? []) {
    if (a.permission.permission === "active") {
      warnings.push({
        level: "danger",
        message: `Proposed owner includes ${a.permission.actor}@active — active must not control owner`,
        affectedPermission: "owner",
      });
    }
  }

  Object.keys(proposed.permissions).forEach((permName) => {
    const p = proposed.permissions[permName];
    const totalWeight = totalAuthWeight(p);
    if (totalWeight < p.threshold) {
      warnings.push({
        level: "danger",
        message: `${permName} total weight (${totalWeight}) is below threshold (${p.threshold})`,
        affectedPermission: permName,
      });
    }
  });

  return warnings;
}

export function canSatisfyPermission(
  permission: PermissionNode,
  keys: string[]
): boolean {
  return calculateThreshold(permission, keys).canExecute;
}
