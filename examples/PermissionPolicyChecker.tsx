'use client';

import React from 'react';

interface PolicyCheck {
  action: string;
  requiredPermission: string;
  passed: boolean;
}

interface PermissionPolicyCheckerProps {
  checks: PolicyCheck[];
  className?: string;
}

/**
 * Educational component showing permission policy checks.
 * Useful for understanding how contracts validate permissions.
 */
export function PermissionPolicyChecker({ checks, className = '' }: PermissionPolicyCheckerProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Policy Checks</h3>

      <div className="space-y-2">
        {checks.length > 0 ? (
          checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between text-sm p-2 bg-white/5 rounded">
              <div>
                <span className="font-mono">{check.action}</span>
                <span className="text-muted-foreground mx-2">→</span>
                <span className="font-mono text-emerald-400">{check.requiredPermission}</span>
              </div>
              <span className={check.passed ? 'text-emerald-400' : 'text-red-400'}>
                {check.passed ? '✓ Passed' : '✗ Failed'}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No policy checks to display.</p>
        )}
      </div>
    </div>
  );
}
