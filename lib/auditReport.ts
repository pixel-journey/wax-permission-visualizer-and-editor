import { exportGraphMarkdown } from "./exportGraph";
import { diffPermissionGraphs } from "./graphDiff";
import { analyzeGraphRisk } from "./graphRisk";
import { graphSeverity } from "./graphSeverity";
import { nextStepsChecklist } from "./nextSteps";
import { proposalSketchesMarkdown } from "./proposalSketches";
import { validateProposedChange } from "./permissionEngine";
import type { PermissionGraph } from "./types";

export function buildAuditReportMarkdown(
  graph: PermissionGraph,
  baseline?: PermissionGraph | null
): string {
  const sev = graphSeverity(graph);
  const risks = analyzeGraphRisk(graph);
  const lines: string[] = [
    `# Permission audit report — ${graph.account}`,
    "",
    `> Trust label: educational-reference · generated ${new Date().toISOString()}`,
    "",
    `**Severity:** ${sev.score}/100 (${sev.label}) · dangers ${sev.dangerCount} · warnings ${sev.warningCount}`,
    "",
    "## Next steps",
    "",
  ];

  for (const s of nextStepsChecklist(graph)) lines.push(`- ${s}`);

  lines.push("", "## Graph risks", "");
  if (risks.length === 0) lines.push("- None from heuristics.");
  else for (const r of risks) lines.push(`- **${r.level}**: ${r.message}`);

  if (baseline) {
    lines.push("", "## Diff vs baseline", "");
    const diffs = diffPermissionGraphs(baseline, graph).filter(
      (d) => d.kind !== "same"
    );
    if (diffs.length === 0) lines.push("- No structural changes.");
    else
      for (const d of diffs)
        lines.push(`- **${d.kind}** ${d.permission}: ${d.detail}`);

    lines.push("", "## Proposed-change validation", "");
    const cw = validateProposedChange(baseline, graph);
    if (cw.length === 0) lines.push("- No validateProposedChange warnings.");
    else for (const w of cw) lines.push(`- **${w.level}**: ${w.message}`);

    lines.push("", proposalSketchesMarkdown(graph.account, baseline, graph));
  } else {
    lines.push(
      "",
      "## Baseline",
      "",
      "- No baseline set — skip diff / proposal sketches.",
      ""
    );
  }

  lines.push(
    "",
    "## Full graph export",
    "",
    exportGraphMarkdown(graph),
    "",
    "## Stack note",
    "",
    "- Prefer **WharfKit** for any future session.transact of updateauth.",
    "- Avoid eosjs / UAL / standalone Anchor Link as primary greenfield stack.",
    "- See WHARFKIT.md in this repo.",
    ""
  );

  return lines.join("\n");
}
