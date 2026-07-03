'use client';

import React from 'react';

interface PermissionExportProps {
  onExport?: (format: 'json' | 'yaml') => void;
  className?: string;
}

/**
 * Simple export component for permission structures.
 * Useful for documentation, auditing, and sharing.
 */
export function PermissionExport({ onExport, className = '' }: PermissionExportProps) {
  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Export Permission Structure</h3>

      <p className="text-sm text-muted-foreground mb-4">
        Export the current permission setup for documentation or auditing.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => onExport?.('json')}
          className="flex-1 px-4 py-2 border border-white/20 rounded-xl hover:bg-white/5 text-sm"
        >
          Export as JSON
        </button>
        <button
          onClick={() => onExport?.('yaml')}
          className="flex-1 px-4 py-2 border border-white/20 rounded-xl hover:bg-white/5 text-sm"
        >
          Export as YAML
        </button>
      </div>
    </div>
  );
}
