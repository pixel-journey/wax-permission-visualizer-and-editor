import type { PermissionGraph, PermissionNode } from "./types";

export interface GraphDiffLine {
  kind: "added" | "removed" | "changed" | "same";
  permission: string;
  detail: string;
}

function nodeSig(n: PermissionNode): string {
  return JSON.stringify({
    threshold: n.threshold,
    parent: n.parent ?? "",
    keys: n.keys,
    accounts: n.accounts,
  });
}

export function diffPermissionGraphs(
  before: PermissionGraph,
  after: PermissionGraph
): GraphDiffLine[] {
  const lines: GraphDiffLine[] = [];
  const names = new Set([
    ...Object.keys(before.permissions),
    ...Object.keys(after.permissions),
  ]);

  for (const name of [...names].sort()) {
    const a = before.permissions[name];
    const b = after.permissions[name];
    if (!a && b) {
      lines.push({
        kind: "added",
        permission: name,
        detail: `threshold ${b.threshold}, keys ${b.keys.length}`,
      });
    } else if (a && !b) {
      lines.push({
        kind: "removed",
        permission: name,
        detail: `was threshold ${a.threshold}`,
      });
    } else if (a && b) {
      if (nodeSig(a) === nodeSig(b)) {
        lines.push({ kind: "same", permission: name, detail: "unchanged" });
      } else {
        lines.push({
          kind: "changed",
          permission: name,
          detail: `threshold ${a.threshold}→${b.threshold}; keys ${a.keys.length}→${b.keys.length}`,
        });
      }
    }
  }
  return lines;
}
