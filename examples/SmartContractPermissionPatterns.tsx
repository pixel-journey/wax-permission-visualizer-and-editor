'use client';

import React from 'react';

interface Pattern {
  name: string;
  code: string;
  description: string;
  securityLevel: 'low' | 'medium' | 'high';
}

interface SmartContractPermissionPatternsProps {
  patterns: Pattern[];
  className?: string;
}

/**
 * Educational component showing different smart contract permission patterns.
 * Helps developers choose the right require_auth approach.
 */
export function SmartContractPermissionPatterns({ patterns, className = '' }: SmartContractPermissionPatternsProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Smart Contract Permission Patterns</h3>

      <div className="space-y-4">
        {patterns.length > 0 ? (
          patterns.map((pattern, index) => {
            const levelColor =
              pattern.securityLevel === 'high' ? 'text-emerald-400' :
              pattern.securityLevel === 'medium' ? 'text-amber-400' : 'text-red-400';

            return (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pattern.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${levelColor}`}>
                    {pattern.securityLevel.toUpperCase()}
                  </span>
                </div>
                <pre className="text-xs bg-black/50 p-2 rounded overflow-x-auto mb-2">
                  <code>{pattern.code}</code>
                </pre>
                <p className="text-sm text-muted-foreground">{pattern.description}</p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No patterns to display.</p>
        )}
      </div>
    </div>
  );
}
