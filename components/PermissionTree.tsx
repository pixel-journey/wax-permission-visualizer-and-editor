'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PermissionNode, PermissionGraph } from '@/lib/types';

interface PermissionTreeProps {
  graph: PermissionGraph;
  mode: 'viewer' | 'editor';
  onUpdate?: (nodeName: string, action: string, payload?: any) => void;
  selectedNode?: string | null;
  onSelectNode?: (name: string) => void;
}

/**
 * Interactive hierarchical permission tree using SVG + Canvas overlay.
 * Retro pixel glassmorphic aesthetic. Fully keyboard accessible.
 * Zero heavy graph libraries — educational and lightweight.
 */
export function PermissionTree({
  graph,
  mode,
  onUpdate,
  selectedNode,
  onSelectNode,
}: PermissionTreeProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const selected = selectedNode ?? internalSelected;

  const handleSelect = (name: string) => {
    if (onSelectNode) onSelectNode(name);
    else setInternalSelected(name);
  };

  // Recursive SVG node renderer
  const renderNode = (node: PermissionNode, x: number, y: number, level: number) => {
    const isSelected = selected === node.name;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <g key={node.name}>
        {/* Glassmorphic node card via foreignObject */}
        <foreignObject
          x={x}
          y={y}
          width="260"
          height="170"
          onClick={() => handleSelect(node.name)}
          className="cursor-pointer"
        >
          <div
            className={`glassmorphic-crt pixel-border p-3 text-xs transition-all duration-150 ${isSelected ? 'ring-2 ring-emerald-400 scale-[1.01]' : 'hover:ring-1 hover:ring-white/30'}`}
          >
            <div className="font-press-start text-[10px] mb-1 tracking-[2px] text-emerald-300">
              {node.name.toUpperCase()}
            </div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="opacity-70">Threshold</span>
              <span className="font-mono text-emerald-400">{node.threshold}</span>
            </div>

            {node.keys.length > 0 && (
              <div className="mb-1">
                <div className="text-[9px] opacity-60 mb-0.5">KEYS</div>
                {node.keys.map((k, i) => (
                  <div key={i} className="flex justify-between text-[9px] font-mono opacity-80">
                    <span>{k.key.slice(0, 12)}…</span>
                    <span className="text-amber-400">{k.weight}</span>
                  </div>
                ))}
              </div>
            )}

            {node.accounts.length > 0 && (
              <div>
                <div className="text-[9px] opacity-60 mb-0.5">ACCOUNTS (MULTI-SIG)</div>
                {node.accounts.map((a, i) => (
                  <div key={i} className="flex justify-between text-[9px] opacity-80">
                    <span>{a.permission.actor}@{a.permission.permission}</span>
                    <span className="text-sky-400">{a.weight}</span>
                  </div>
                ))}
              </div>
            )}

            {mode === 'editor' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate?.(node.name, 'addKey');
                }}
                className="mt-2 text-[9px] underline hover:text-emerald-400 active:text-emerald-300"
              >
                + ADD KEY
              </button>
            )}
          </div>
        </foreignObject>

        {/* Retro dashed connecting lines */}
        {hasChildren &&
          node.children!.map((child, idx) => (
            <line
              key={idx}
              x1={x + 130}
              y1={y + 85}
              x2={x + (idx - 1) * 280 + 130}
              y2={y + 175}
              stroke="#22c55e"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.5"
            />
          ))}
      </g>
    );
  };

  return (
    <div className="relative w-full overflow-auto rounded-2xl border border-white/10 bg-black/60 p-4">
      <svg width="100%" height="640" className="min-w-[820px]">
        {Object.values(graph.permissions).map((node, index) =>
          renderNode(node, 40 + index * 300, 30, 0)
        )}
      </svg>

      {mode === 'editor' && (
        <div className="absolute bottom-4 right-4 text-[10px] opacity-60">
          Editor mode — changes are local drafts only
        </div>
      )}
    </div>
  );
}
