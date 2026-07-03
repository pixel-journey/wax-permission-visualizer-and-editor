'use client';

import React from 'react';

interface ScopeScenario {
  title: string;
  description: string;
  isScoped: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ScopeImpactSimulatorProps {
  scenarios: ScopeScenario[];
  className?: string;
}

/**
 * Educational component showing the impact of using permission scopes.
 * Helps developers understand the security benefit of linking permissions.
 */
export function ScopeImpactSimulator({ scenarios, className = '' }: ScopeImpactSimulatorProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Scope Impact</h3>

      <div className="space-y-4">
        {scenarios.length > 0 ? (
          scenarios.map((scenario, index) => {
            const riskColor =
              scenario.riskLevel === 'low' ? 'text-emerald-400' :
              scenario.riskLevel === 'medium' ? 'text-amber-400' : 'text-red-400';

            return (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{scenario.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${riskColor} border border-current`}>
                    {scenario.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{scenario.description}</p>
                <p className="text-xs mt-2">
                  {scenario.isScoped ? '✓ Uses linked permission (scoped)' : '✗ Uses generic permission (unscoped)'}
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No scenarios to display.</p>
        )}
      </div>
    </div>
  );
}
