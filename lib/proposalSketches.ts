import { diffPermissionGraphs } from "./graphDiff";
import type { PermissionGraph, PermissionNode } from "./types";

export interface ProposalSketch {
  account: string;
  name: "updateauth" | "deleteauth";
  summary: string;
  /** Conceptual payload — not serialized for chain. */
  note: string;
}

function authSummary(node: PermissionNode): string {
  return `threshold ${node.threshold}, keys ${node.keys.length}, accounts ${node.accounts.length}`;
}

/**
 * Build educational action sketches for changed permissions.
 * Prefer WharfKit Session when implementing real proposals later.
 * Never broadcast from this helper.
 */
export function proposalSketchesFromDiff(
  account: string,
  before: PermissionGraph,
  after: PermissionGraph
): ProposalSketch[] {
  const diffs = diffPermissionGraphs(before, after);
  const out: ProposalSketch[] = [];

  for (const d of diffs) {
    if (d.kind === "same") continue;
    if (d.kind === "removed") {
      out.push({
        account: "eosio",
        name: "deleteauth",
        summary: `deleteauth ${account}@${d.permission}`,
        note: "Requires authority that can modify this permission; usually parent or owner. Educational only.",
      });
      continue;
    }
    const node = after.permissions[d.permission];
    if (!node) continue;
    out.push({
      account: "eosio",
      name: "updateauth",
      summary: `updateauth ${account}@${d.permission} (${authSummary(node)}) parent=${node.parent ?? "—"}`,
      note: "Map required_auth from keys/accounts; sign with WharfKit — do not use eosjs for greenfield.",
    });
  }
  return out;
}

export function proposalSketchesMarkdown(
  account: string,
  before: PermissionGraph,
  after: PermissionGraph
): string {
  const rows = proposalSketchesFromDiff(account, before, after);
  const lines = [
    `# Proposal sketches — ${account}`,
    "",
    "> Educational only. Not signed. Not broadcast.",
    "",
  ];
  if (rows.length === 0) {
    lines.push("- No permission changes detected vs baseline.");
  } else {
    rows.forEach((r, i) => {
      lines.push(`${i + 1}. \`${r.account}::${r.name}\` — ${r.summary}`);
      lines.push(`   - ${r.note}`);
    });
  }
  lines.push("", "Prefer **WharfKit** for real session.transact flows.", "");
  return lines.join("\n");
}
