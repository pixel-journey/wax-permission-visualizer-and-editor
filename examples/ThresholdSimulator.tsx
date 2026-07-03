'use client';

import React from 'react';

interface ThresholdSimulatorProps {
  threshold: number;
  currentWeight: number;
  className?: string;
}

/**
 * Standalone threshold simulator component.
 */
export function ThresholdSimulator({ threshold, currentWeight, className = '' }: ThresholdSimulatorProps) {
  const canExecute = currentWeight >= threshold;
  const progress = Math.min(currentWeight / threshold, 1);

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Threshold Simulator</h3>

      <div className="mb-2 flex justify-between text-sm">
        <span>Current Weight</span>
        <span className="font-mono">{currentWeight} / {threshold}</span>
      </div>

      <div className="w-full bg-white/10 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all ${canExecute ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className={`text-sm font-medium ${canExecute ? 'text-emerald-400' : 'text-amber-400'}`}>
        {canExecute ? 'Action can be executed' : 'Insufficient weight'}
      </div>
    </div>
  );
}
