'use client';

import React, { useState } from 'react';

interface PermissionKey {
  key: string;
  weight: number;
}

interface PermissionNode {
  name: string;
  threshold: number;
  keys: PermissionKey[];
  children?: PermissionNode[];
}

interface PermissionTreeProps {
  root: PermissionNode;
  className?: string;
  onNodeSelect?: (node: PermissionNode) => void;
}

/**
 * Clean, reusable Permission Tree visualizer.
 * Supports selection and basic hierarchy display.
 */
export function PermissionTree({ root, className = '', onNodeSelect }: PermissionTreeProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const renderNode = (node: PermissionNode, depth: number = 0) => {
    const isSelected = selected === node.name;

    return (
      <div key={node.name} className="ml-4">
        <div
          onClick={() => {
            setSelected(node.name);
            onNodeSelect?.(node);
          }}
          className={`cursor-pointer rounded-lg px-3 py-2 mb-1 transition-colors ${isSelected ? 'bg-emerald-900/40 ring-1 ring-emerald-400' : 'hover:bg-white/5'}`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-emerald-400">{node.name}</span>
            <span className="text-xs text-muted-foreground">Threshold: {node.threshold}</span>
          </div>

          {node.keys.length > 0 && (
            <div className="mt-1 text-xs text-muted-foreground">
              {node.keys.map((k, i) => (
                <div key={i} className="flex justify-between">
                  <span className="font-mono truncate">{k.key}</span>
                  <span>{k.weight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="border-l border-white/10 pl-2">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Tree</h3>
      {renderNode(root)}
    </div>
  );
}
