'use client';

import React from 'react';

interface RiskSummary {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  criticalIssues: number;
  warnings: number;
  recommendations: string[];
}

interface PermissionRiskSummaryProps {
  summary: RiskSummary;
  className?: string;
}

/**
 * Component showing an overall risk summary for a permission structure.
 * Useful for quick security overviews.
 */
export function PermissionRiskSummary({ summary, className = '' }: PermissionRiskSummaryProps) {
  const riskColor =
    summary.overallRisk === 'low' ? 'text-emerald-400' :
    summary.overallRisk === 'medium' ? 'text-amber-400' :
    summary.overallRisk === 'high' ? 'text-orange-400' : 'text-red-500';

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Risk Summary</h3>

      <div className="mb-4">
        <div className="text-sm text-muted-foreground mb-1">Overall Risk Level</div>
        <div className={`text-2xl font-bold ${riskColor}`}>{summary.overallRisk.toUpperCase()}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Critical Issues</div>
          <div className="text-xl font-mono text-red-400">{summary.criticalIssues}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Warnings</div>
          <div className="text-xl font-mono text-amber-400">{summary.warnings}</div>
        </div>
      </div>

      {summary.recommendations.length > 0 && (
        <div>
          <div className="text-sm text-muted-foreground mb-2">Key Recommendations</div>
          <ul className="text-xs space-y-1">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
