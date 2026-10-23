import { analyzeGraphRisk } from "./graphRisk";
import { graphSeverity } from "./graphSeverity";
import type { PermissionGraph } from "./types";

export function nextStepsChecklist(graph: PermissionGraph): string[] {
  const steps: string[] = [];
  const sev = graphSeverity(graph);
  const risks = analyzeGraphRisk(graph);

  if (sev.score === 0) {
    steps.push("No heuristic dangers — still verify owner recovery offline.");
  }
  if (risks.some((r) => r.message.includes("active must not control owner"))) {
    steps.push("Remove any active authority from owner immediately (critical)."
    );
  }
  if (risks.some((r) => r.message.includes("below threshold"))) {
    steps.push("Raise total weight or lower threshold so the permission is satisfiable.");
  }
  if (risks.some((r) => r.message.includes("single-key"))) {
    steps.push("Consider multi-sig or backup keys on owner.");
  }
  steps.push("Export an audit report and store offline before any authority change.");
  steps.push("If proposing on-chain changes, use WharfKit session.transact — not eosjs.");
  steps.push("For limited dApp keys, use the session-keys blueprint (linkauth)."
  );
  return steps;
}
