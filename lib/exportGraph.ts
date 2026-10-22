import { analyzeGraphRisk } from "./graphRisk";
import type { PermissionGraph } from "./types";

export function exportGraphJson(graph: PermissionGraph): string {
  return JSON.stringify(
    {
      trustLabel: "educational-reference",
      graph,
      risks: analyzeGraphRisk(graph),
    },
    null,
    2
  );
}

export function exportGraphMarkdown(graph: PermissionGraph): string {
  const lines: string[] = [
    `# Permission graph — ${graph.account}`,
    "",
    `> Educational export. Last updated: ${graph.lastUpdated}`,
    "",
    "## Permissions",
    "",
  ];

  for (const node of Object.values(graph.permissions)) {
    lines.push(`### ${node.name}`);
    if (node.parent) lines.push(`- Parent: \`${node.parent}\``);
    lines.push(`- Threshold: **${node.threshold}**`);
    lines.push("- Keys:");
    if (node.keys.length === 0) lines.push("  - *(none)*");
    for (const k of node.keys) {
      lines.push(`  - \`${k.key}\` weight ${k.weight}`);
    }
    if (node.accounts.length) {
      lines.push("- Accounts:");
      for (const a of node.accounts) {
        lines.push(
          `  - \`${a.permission.actor}@${a.permission.permission}\` weight ${a.weight}`
        );
      }
    }
    lines.push("");
  }

  const risks = analyzeGraphRisk(graph);
  lines.push("## Risk analysis", "");
  if (risks.length === 0) {
    lines.push("- No heuristic warnings.");
  } else {
    for (const r of risks) {
      lines.push(`- **${r.level}**: ${r.message}`);
    }
  }
  lines.push(
    "",
    "## Notes",
    "",
    "- Prefer **WharfKit** for any future updateauth proposals.",
    "- Linked permissions (linkauth) are not fully listed in get_account — see session-keys blueprint.",
    ""
  );
  return lines.join("\n");
}
