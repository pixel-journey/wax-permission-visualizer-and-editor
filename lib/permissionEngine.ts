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

export type SimulateAuthInput = {
  /** Public keys contributing weight */
  keys?: string[];
  /** "actor@permission" strings matching account authorities */
  accounts?: string[];
};

function accountTag(actor: string, permission: string): string {
  return `${actor}@${permission}`;
}

export function calculateThreshold(
  permission: PermissionNode,
  providedKeys: string[],
  providedAccounts: string[] = []
): SimulationResult {
  let currentWeight = 0;
  const satisfiedKeys: string[] = [];
  const warnings: string[] = [];
  const accountSet = new Set(
    providedAccounts.map((a) => a.trim().toLowerCase()).filter(Boolean)
  );

  permission.keys.forEach((k) => {
    if (providedKeys.includes(k.key)) {
      currentWeight += k.weight;
      satisfiedKeys.push(k.key);
    }
  });

  const satisfiedAccounts: string[] = [];
  permission.accounts.forEach((a) => {
    const tag = accountTag(a.permission.actor, a.permission.permission);
    if (accountSet.has(tag.toLowerCase())) {
      currentWeight += a.weight;
      satisfiedAccounts.push(tag);
    }
  });

  const canExecute = currentWeight >= permission.threshold;
  const missingWeight = Math.max(0, permission.threshold - currentWeight);

  if (permission.name === "owner" && missingWeight > 0) {
    warnings.push("CRITICAL: Owner permission — losing all keys is irreversible");
  }
  if (
    currentWeight === 0 &&
    (permission.keys.length > 0 || permission.accounts.length > 0)
  ) {
    warnings.push("No matching keys or account authorities provided");
  }
  if (missingWeight > 0 && permission.threshold > 1) {
    warnings.push(`Missing ${missingWeight} weight to meet threshold`);
  }
  if (satisfiedAccounts.length) {
    warnings.push(`Account auth matched: ${satisfiedAccounts.join(", ")}`);
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

export function totalAuthWeight(p: PermissionNode): number {
  return (
    p.keys.reduce((sum, k) => sum + k.weight, 0) +
    p.accounts.reduce((sum, a) => sum + a.weight, 0)
  );
}

export function nodeWeightSummary(p: PermissionNode): {
  keyWeight: number;
  accountWeight: number;
  total: number;
  threshold: number;
  surplus: number;
  satisfiable: boolean;
} {
  const keyWeight = p.keys.reduce((s, k) => s + k.weight, 0);
  const accountWeight = p.accounts.reduce((s, a) => s + a.weight, 0);
  const total = keyWeight + accountWeight;
  return {
    keyWeight,
    accountWeight,
    total,
    threshold: p.threshold,
    surplus: total - p.threshold,
    satisfiable: total >= p.threshold,
  };
}

export function validateProposedChange(
  current: PermissionGraph,
  proposed: PermissionGraph
): ChangeWarning[] {
  const warnings: ChangeWarning[] = [];
  const currentOwner = current.permissions["owner"];
  const proposedOwner = proposed.permissions["owner"];
  const acct = proposed.account;

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
    if (
      a.permission.actor === acct &&
      a.permission.permission === "active"
    ) {
      warnings.push({
        level: "danger",
        message: `Proposed owner includes ${acct}@active — this account's active must not control its own owner`,
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
  keys: string[],
  accounts: string[] = []
): boolean {
  return calculateThreshold(permission, keys, accounts).canExecute;
}
