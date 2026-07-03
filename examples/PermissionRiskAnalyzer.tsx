'use client';

import React from 'react';

interface Risk {
  level: 'safe' | 'warning' | 'danger';
  message: string;
}

interface PermissionRiskAnalyzerProps {
  risks: Risk[];
  className?: string;
}

/**
 * Reusable component for displaying permission-related risks and warnings.
 */
export function PermissionRiskAnalyzer({ risks, className = '' }: PermissionRiskAnalyzerProps) {
  if (risks.length === 0) {
    return (
      <div className={`rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 ${className}`}>
        <div className="text-emerald-400 font-semibold">No Risks Detected</div>
        <p className="text-sm text-emerald-300 mt-1">This permission structure looks safe.</p>
      </div>
    );
  }

  const dangerCount = risks.filter(r => r.level === 'danger').length;
  const warningCount = risks.filter(r => r.level === 'warning').length;

  return (
    <div className={`rounded-2xl border p-6 ${dangerCount > 0 ? 'border-red-500/30 bg-red-950/20' : 'border-amber-500/30 bg-amber-950/20'} ${className}`}>
      <h3 className={`font-semibold mb-3 ${dangerCount > 0 ? 'text-red-400' : 'text-amber-400'}`}>
        Permission Risk Analysis
      </h3>

      <div className="space-y-2">
        {risks.map((risk, index) => (
          <div key={index} className="flex gap-2 text-sm">
            <span className={risk.level === 'danger' ? 'text-red-400' : 'text-amber-400'}>
              {risk.level === 'danger' ? '⚠' : '!'}
            </span>
            <span>{risk.message}</span>
          </div>
        ))}
      </div>

      {dangerCount > 0 && (
        <p className="text-xs text-red-400 mt-3">
          Critical risks detected. Do not proceed without resolving these issues.
        </p>
      )}
    </div>
  );
}
