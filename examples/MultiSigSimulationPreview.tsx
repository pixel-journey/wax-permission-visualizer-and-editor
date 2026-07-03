'use client';

import React from 'react';

interface Approval {
  account: string;
  weight: number;
  approved: boolean;
}

interface MultiSigSimulationPreviewProps {
  threshold: number;
  approvals: Approval[];
  className?: string;
}

/**
 * Preview component for multi-sig approval simulation.
 * Useful for education and DAO/governance tools.
 */
export function MultiSigSimulationPreview({ threshold, approvals, className = '' }: MultiSigSimulationPreviewProps) {
  const totalWeight = approvals.reduce((sum, a) => sum + a.weight, 0);
  const approvedWeight = approvals
    .filter(a => a.approved)
    .reduce((sum, a) => sum + a.weight, 0);

  const canExecute = approvedWeight >= threshold;
  const progress = Math.min(approvedWeight / threshold, 1);

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Multi-Sig Simulation</h3>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Approved Weight</span>
          <span className="font-mono">{approvedWeight} / {threshold}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${canExecute ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {approvals.map((approval, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="font-mono">{approval.account}</span>
            <div className="flex items-center gap-2">
              <span>{approval.weight}</span>
              {approval.approved && <span className="text-emerald-400 text-xs">✓</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 text-sm font-medium ${canExecute ? 'text-emerald-400' : 'text-amber-400'}`}>
        {canExecute ? 'Proposal can execute' : 'More approvals needed'}
      </div>
    </div>
  );
}
