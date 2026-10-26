import { analyzeGraphRisk } from "./graphRisk";
import { graphSeverity } from "./graphSeverity";
import type { PermissionGraph } from "./types";

export function nextStepsChecklist(graph: PermissionGraph): string[] {
  const steps: string[] = [];
  const sev = graphSeverity(graph);
  const risks = analyzeGraphRisk(graph);
  const msgs = risks.map((r) => r.message);

  if (sev.score === 0) {
    steps.push("No heuristic dangers — still verify owner recovery offline.");
  }
  if (msgs.some((m) => m.includes("must not control its own owner"))) {
    steps.push(
      "Remove this account's active authority from owner immediately (critical)."
    );
  }
  if (msgs.some((m) => m.includes("< threshold"))) {
    steps.push(
      "Raise total weight or lower threshold so the permission is satisfiable."
    );
  }
  if (msgs.some((m) => m.includes("single-key") || m.includes("single-key"))) {
    steps.push("Consider multi-sig or backup keys on owner.");
  }
  if (msgs.some((m) => m.includes("multi-party"))) {
    steps.push(
      "Document helper contacts offline (social-recovery runbook) — weights alone are not a plan."
    );
  }
  if (msgs.some((m) => m.includes("Custom permission"))) {
    steps.push(
      "Confirm linkauth scopes for each custom permission (session-keys blueprint)."
    );
  }
  steps.push("Export an audit report and store offline before any authority change.");
  steps.push(
    "If proposing on-chain changes, use WharfKit session.transact — not eosjs."
  );
  steps.push(
    "For limited dApp keys, use the session-keys blueprint (linkauth)."
  );
  return steps;
}
