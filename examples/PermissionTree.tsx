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
  editable?: boolean;
  onUpdate?: (updatedRoot: PermissionNode) => void;
}

/**
 * Enhanced Permission Tree with editing capabilities.
 * Supports threshold editing and key management.
 */
export function PermissionTree({ root, className = '', editable = false, onUpdate }: PermissionTreeProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [localRoot, setLocalRoot] = useState(root);

  const updateRoot = (newRoot: PermissionNode) => {
    setLocalRoot(newRoot);
    onUpdate?.(newRoot);
  };

  const updateNode = (nodeName: string, updater: (node: PermissionNode) => PermissionNode) => {
    const updateRecursive = (node: PermissionNode): PermissionNode => {
      if (node.name === nodeName) {
        return updater(node);
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive),
        };
      }
      return node;
    };

    const newRoot = updateRecursive(localRoot);
    updateRoot(newRoot);
  };

  const renderNode = (node: PermissionNode, depth: number = 0) => {
    const isSelected = selectedNode === node.name;
    const totalWeight = node.keys.reduce((sum, k) => sum + k.weight, 0);
    const isValid = totalWeight >= node.threshold;

    return (
      <div key={node.name} className="ml-4 border-l border-white/10 pl-3">
        <div
          onClick={() => setSelectedNode(node.name)}
          className={`cursor-pointer rounded-lg p-3 mb-2 transition-all ${isSelected ? 'bg-emerald-900/30 ring-1 ring-emerald-400' : 'hover:bg-white/5'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-emerald-400">{node.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">Threshold: {node.threshold}</span>
            </div>
            <div className={`text-xs px-2 py-0.5 rounded ${isValid ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'}`}>
              {totalWeight} / {node.threshold}
            </div>
          </div>

          {/* Keys */}
          <div className="mt-2 space-y-1">
            {node.keys.map((key, index) => (
              <div key={index} className="flex items-center justify-between text-sm pl-2">
                <span className="font-mono text-xs truncate">{key.key}</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">{key.weight}</span>
                  {editable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNode(node.name, (n) => ({
                          ...n,
                          keys: n.keys.filter((_, i) => i !== index),
                        }));
                      }}
                      className="text-red-400 hover:text-red-500 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit Controls */}
          {editable && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newKey = prompt('Enter new key name:');
                  if (newKey) {
                    updateNode(node.name, (n) => ({
                      ...n,
                      keys: [...n.keys, { key: newKey, weight: 1 }],
                    }));
                  }
                }}
                className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
              >
                + Key
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newThreshold = prompt('New threshold:', node.threshold.toString());
                  if (newThreshold) {
                    updateNode(node.name, (n) => ({
                      ...n,
                      threshold: parseInt(newThreshold) || n.threshold,
                    }));
                  }
                }}
                className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded"
              >
                Edit Threshold
              </button>
            </div>
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Permission Tree</h3>
      {renderNode(localRoot)}
    </div>
  );
}
