'use client';

import React from 'react';

interface PermissionNode {
  name: string;
  threshold: number;
  keys: Array<{ key: string; weight: number }>;
}

interface PermissionTreePreviewProps {
  permissions: PermissionNode[];
  className?: string;
}

/**
 * Simple preview component for permission tree structure.
 */
export function PermissionTreePreview({ permissions, className = '' }: PermissionTreePreviewProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Structure Preview</h3>

      <div className="space-y-4">
        {permissions.map((perm, index) => (
          <div key={index} className="border-l-2 border-emerald-500 pl-4">
            <div className="font-medium text-emerald-400">{perm.name.toUpperCase()}</div>
            <div className="text-sm text-muted-foreground">Threshold: {perm.threshold}</div>
            <div className="mt-1 space-y-1">
              {perm.keys.map((k, i) => (
                <div key={i} className="text-xs flex justify-between">
                  <span className="font-mono truncate">{k.key}</span>
                  <span>{k.weight}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
