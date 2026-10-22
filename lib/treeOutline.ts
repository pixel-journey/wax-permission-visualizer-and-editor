import type { PermissionGraph, PermissionNode } from "./types";

export interface OutlineLine {
  depth: number;
  name: string;
  threshold: number;
  keyCount: number;
  accountCount: number;
}

function roots(graph: PermissionGraph): PermissionNode[] {
  return Object.values(graph.permissions).filter(
    (n) => !n.parent || !graph.permissions[n.parent]
  );
}

function walk(
  node: PermissionNode,
  graph: PermissionGraph,
  depth: number,
  out: OutlineLine[]
): void {
  out.push({
    depth,
    name: node.name,
    threshold: node.threshold,
    keyCount: node.keys.length,
    accountCount: node.accounts.length,
  });
  const kids = Object.values(graph.permissions).filter(
    (n) => n.parent === node.name
  );
  for (const k of kids) walk(k, graph, depth + 1, out);
}

/** Flat outline in parent→child order for UI / markdown. */
export function treeOutline(graph: PermissionGraph): OutlineLine[] {
  const out: OutlineLine[] = [];
  for (const r of roots(graph)) walk(r, graph, 0, out);
  // Include orphans not reached (defensive)
  const seen = new Set(out.map((l) => l.name));
  for (const n of Object.values(graph.permissions)) {
    if (!seen.has(n.name)) walk(n, graph, 0, out);
  }
  return out;
}

export function treeOutlineMarkdown(graph: PermissionGraph): string {
  const lines = treeOutline(graph).map((l) => {
    const pad = "  ".repeat(l.depth);
    return `${pad}- **${l.name}** (threshold ${l.threshold}, keys ${l.keyCount}, accounts ${l.accountCount})`;
  });
  return [`# Tree — ${graph.account}`, "", ...lines, ""].join("\n");
}
