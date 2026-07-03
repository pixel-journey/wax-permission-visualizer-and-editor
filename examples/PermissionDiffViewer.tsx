'use client';

import React from 'react';

interface PermissionChange {
  permission: string;
  before: string;
  after: string;
  isRisky?: boolean;
}

interface PermissionDiffViewerProps {
  changes: PermissionChange[];
  className?: string;
}

/**
 * Component to visually compare before/after permission changes.
 * Very useful for education and safe editing previews.
 */
export function PermissionDiffViewer({ changes, className = '' }: PermissionDiffViewerProps) {
  if (changes.length === 0) {
    return <p className="text-sm text-muted-foreground">No changes to display.</p>;
  }

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Changes Preview</h3>

      <div className="space-y-4">
        {changes.map((change, index) => (
          <div key={index} className="border-l-2 pl-4 ${change.isRisky ? 'border-red-500' : 'border-emerald-500'}">
            <div className="font-medium text-emerald-400">{change.permission}</div>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Before</div>
                <div className="font-mono text-red-400">{change.before}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">After</div>
                <div className="font-mono text-emerald-400">{change.after}</div>
              </div>
            </div>
            {change.isRisky && (
              <div className="text-xs text-red-400 mt-1">⚠ This change introduces risk</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
