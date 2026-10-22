import { analyzeGraphRisk } from "./graphRisk";
import type { PermissionGraph } from "./types";

export interface GraphSeverity {
  score: number;
  label: "low" | "moderate" | "high" | "critical";
  dangerCount: number;
  warningCount: number;
}

export function graphSeverity(graph: PermissionGraph): GraphSeverity {
  const risks = analyzeGraphRisk(graph);
  const dangerCount = risks.filter((r) => r.level === "danger").length;
  const warningCount = risks.filter((r) => r.level === "warning").length;
  const score = Math.min(100, dangerCount * 35 + warningCount * 12);
  let label: GraphSeverity["label"] = "low";
  if (score >= 70) label = "critical";
  else if (score >= 45) label = "high";
  else if (score >= 20) label = "moderate";
  return { score, label, dangerCount, warningCount };
}
