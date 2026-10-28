import { analyzeGraphRisk } from "./graphRisk";
import type { PermissionGraph } from "./types";

export interface GraphSeverity {
  score: number;
  label: "low" | "moderate" | "high" | "critical";
  dangerCount: number;
  warningCount: number;
  infoCount: number;
  /** Human-readable contribution lines for the score strip */
  reasons: string[];
}

export function graphSeverity(graph: PermissionGraph): GraphSeverity {
  const risks = analyzeGraphRisk(graph);
  const dangerCount = risks.filter((r) => r.level === "danger").length;
  const warningCount = risks.filter((r) => r.level === "warning").length;
  const infoCount = risks.filter((r) => r.level === "info").length;
  const score = Math.min(100, dangerCount * 35 + warningCount * 12);
  let label: GraphSeverity["label"] = "low";
  if (score >= 70) label = "critical";
  else if (score >= 45) label = "high";
  else if (score >= 20) label = "moderate";

  const reasons: string[] = [];
  if (dangerCount)
    reasons.push(`${dangerCount} danger × 35 → ${dangerCount * 35}`);
  if (warningCount)
    reasons.push(`${warningCount} warning × 12 → ${warningCount * 12}`);
  if (!dangerCount && !warningCount)
    reasons.push("No danger/warning heuristics — score 0 (still verify offline)");
  if (infoCount) reasons.push(`${infoCount} info note(s) (not scored)`);

  return { score, label, dangerCount, warningCount, infoCount, reasons };
}
