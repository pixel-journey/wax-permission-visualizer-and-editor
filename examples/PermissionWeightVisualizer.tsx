'use client';

import React from 'react';

interface KeyWeight {
  key: string;
  weight: number;
}

interface PermissionWeightVisualizerProps {
  threshold: number;
  keys: KeyWeight[];
  className?: string;
}

/**
 * Visual component for understanding permission weights and thresholds.
 * Helps users see how close they are to meeting the threshold.
 */
export function PermissionWeightVisualizer({ threshold, keys, className = '' }: PermissionWeightVisualizerProps) {
  const totalWeight = keys.reduce((sum, k) => sum + k.weight, 0);
  const progress = Math.min(totalWeight / threshold, 1);

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Weight Overview</h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Total Weight</span>
          <span className="font-mono">{totalWeight} / {threshold}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${progress >= 1 ? 'bg-emerald-500' : 'bg-amber-500'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {keys.map((key, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="font-mono truncate">{key.key}</span>
            <span className="text-amber-400">{key.weight}</span>
          </div>
        ))}
      </div>

      {progress < 1 && (
        <p className="text-xs text-amber-400 mt-3">
          Missing {threshold - totalWeight} weight to meet threshold.
        </p>
      )}
    </div>
  );
}
