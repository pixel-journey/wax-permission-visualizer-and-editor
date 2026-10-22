'use client';

import React, { useMemo, useState } from 'react';
import { PermissionTree } from '@/components/PermissionTree';
import { RelatedBlueprints } from '@/components/RelatedBlueprints';
import { exportGraphJson, exportGraphMarkdown } from '@/lib/exportGraph';
import { mockSafeGraph, mockUnsafeGraph } from '@/lib/fixtures';
import { analyzeGraphRisk } from '@/lib/graphRisk';
import { graphSeverity } from '@/lib/graphSeverity';
import { fetchPermissionGraph } from '@/lib/parseAccount';
import { PermissionGraph } from '@/lib/types';
import { calculateThreshold } from '@/lib/permissionEngine';

export default function PermissionVisualizerPage() {
  const [account, setAccount] = useState('eosio');
  const [graph, setGraph] = useState<PermissionGraph>(() => mockSafeGraph('demo'));
  const [mode, setMode] = useState<'viewer' | 'editor'>('viewer');
  const [selectedNode, setSelectedNode] = useState<string | null>('owner');
  const [simulationKeys, setSimulationKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>('Mock safe graph loaded');
  const [loading, setLoading] = useState(false);

  const risks = useMemo(() => analyzeGraphRisk(graph), [graph]);
  const severity = useMemo(() => graphSeverity(graph), [graph]);

  const handleFetchLive = async () => {
    setLoading(true);
    setStatus(null);
    const r = await fetchPermissionGraph(account);
    setLoading(false);
    if (!r.ok || !r.graph) {
      setStatus(`Soft-fail: ${r.reason ?? 'unknown'} — keeping current graph`);
      return;
    }
    setGraph(r.graph);
    setSelectedNode(
      r.graph.permissions.owner
        ? 'owner'
        : Object.keys(r.graph.permissions)[0] ?? null
    );
    setStatus(
      `Loaded ${Object.keys(r.graph.permissions).length} permission(s) for ${r.graph.account}`
    );
  };

  const copy = async (text: string, ok: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(ok);
    } catch {
      setStatus('Clipboard unavailable');
    }
  };

  const handleUpdate = (nodeName: string, action: string) => {
    if (action === 'addKey') {
      const newKey = prompt('Enter public key to add (local mock only):');
      if (!newKey) return;
      const updated = { ...graph, permissions: { ...graph.permissions } };
      const node = { ...updated.permissions[nodeName] };
      node.keys = [...node.keys, { key: newKey, weight: 1 }];
      updated.permissions[nodeName] = node;
      setGraph(updated);
    }
  };

  const currentNode = selectedNode ? graph.permissions[selectedNode] : null;
  const simResult = currentNode
    ? calculateThreshold(currentNode, simulationKeys)
    : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-2xl tracking-widest text-emerald-400 font-bold">
              PERMISSION VISUALIZER
            </div>
            <div className="text-xs opacity-60">
              Pixel Journey · Pass 4 complete · educational-reference
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'viewer' ? 'editor' : 'viewer')}
              className="px-3 py-2 text-sm border border-white/20 rounded-lg"
            >
              {mode === 'viewer' ? 'Editor' : 'Viewer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setGraph(mockSafeGraph('demo'));
                setSelectedNode('owner');
                setStatus('Safe mock (includes gameplay)');
              }}
              className="px-3 py-2 text-sm bg-white/10 rounded-lg"
            >
              Safe mock
            </button>
            <button
              type="button"
              onClick={() => {
                setGraph(mockUnsafeGraph());
                setSelectedNode('owner');
                setStatus('Unsafe fixture — intentional anti-patterns');
              }}
              className="px-3 py-2 text-sm bg-red-900/50 rounded-lg"
            >
              Unsafe fixture
            </button>
            <button
              type="button"
              onClick={() =>
                copy(exportGraphMarkdown(graph), 'Markdown export copied')
              }
              className="px-3 py-2 text-sm bg-sky-800 rounded-lg"
            >
              Copy MD
            </button>
            <button
              type="button"
              onClick={() => copy(exportGraphJson(graph), 'JSON export copied')}
              className="px-3 py-2 text-sm bg-sky-900 rounded-lg"
            >
              Copy JSON
            </button>
          </div>
        </div>

        <p className="text-xs opacity-60 mb-2 max-w-3xl leading-relaxed">
          Prefer <strong className="text-emerald-400/90">WharfKit</strong>. Session keys:{' '}
          <a
            className="underline text-emerald-400"
            href="https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            wax-wharfkit-session-keys-and-linked-permissions
          </a>
          . No updateauth broadcast.
        </p>

        <p className="text-sm mb-4">
          Graph severity:{" "}
          <span
            className={
              severity.label === 'critical' || severity.label === 'high'
                ? 'text-red-300 font-mono'
                : 'text-emerald-300 font-mono'
            }
          >
            {severity.score}/100 ({severity.label})
          </span>
        </p>

        <div className="flex gap-3 mb-6">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-400"
            placeholder="WAX account name"
          />
          <button
            type="button"
            onClick={handleFetchLive}
            disabled={loading}
            className="px-8 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-sm disabled:opacity-50"
          >
            {loading ? 'Loading…' : 'Load get_account'}
          </button>
        </div>

        {status && (
          <p className="text-xs text-emerald-200/80 mb-4" role="status">
            {status}
          </p>
        )}

        {risks.length > 0 && (
          <ul className="mb-6 text-xs space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            {risks.map((w) => (
              <li
                key={w.message}
                className={
                  w.level === 'danger'
                    ? 'text-red-300'
                    : w.level === 'warning'
                      ? 'text-amber-300'
                      : 'text-white/50'
                }
              >
                [{w.level}] {w.message}
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="mb-2 flex items-center justify-between text-xs opacity-70">
              <div>INTERACTIVE PERMISSION TREE</div>
              <div className="font-mono">
                {graph.account} · {Object.keys(graph.permissions).length} permissions
              </div>
            </div>
            <PermissionTree
              graph={graph}
              mode={mode}
              onUpdate={handleUpdate}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="border border-white/10 bg-black/40 p-5 rounded-2xl">
              <div className="text-xs mb-3 tracking-widest opacity-70">SELECTED</div>
              {currentNode ? (
                <>
                  <div className="text-xl font-mono text-emerald-400 mb-2">
                    {currentNode.name}
                  </div>
                  <div className="text-sm opacity-70 mb-1">
                    Threshold: {currentNode.threshold}
                  </div>
                  {currentNode.parent && (
                    <div className="text-xs opacity-50 mb-4">
                      Parent: {currentNode.parent}
                    </div>
                  )}
                  <div className="text-xs opacity-60 mb-1">
                    KEYS ({currentNode.keys.length})
                  </div>
                  {currentNode.keys.map((k, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs py-1 border-b border-white/10 font-mono gap-2"
                    >
                      <span className="truncate">{k.key}</span>
                      <span className="text-amber-400 shrink-0">{k.weight}</span>
                    </div>
                  ))}
                  {currentNode.accounts.length > 0 && (
                    <>
                      <div className="text-xs opacity-60 mt-4 mb-1">ACCOUNTS</div>
                      {currentNode.accounts.map((a, i) => (
                        <div
                          key={i}
                          className="text-xs py-1 border-b border-white/10 font-mono flex justify-between"
                        >
                          <span>
                            {a.permission.actor}@{a.permission.permission}
                          </span>
                          <span className="text-sky-400">{a.weight}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className="text-sm opacity-60">Select a permission</div>
              )}
            </div>

            {currentNode && (
              <div className="border border-white/10 bg-black/40 p-5 rounded-2xl">
                <div className="text-xs mb-3 tracking-widest opacity-70">
                  THRESHOLD SIMULATOR
                </div>
                <input
                  placeholder="Paste key then Enter"
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-xs font-mono rounded mb-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSimulationKeys([...simulationKeys, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                {simResult && (
                  <div
                    className={`p-3 rounded text-xs ${
                      simResult.canExecute
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {simResult.canExecute ? 'CAN EXECUTE' : 'CANNOT EXECUTE'}
                    <div className="mt-1">
                      Weight {simResult.currentWeight} / {currentNode.threshold}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <RelatedBlueprints />
      </div>
    </div>
  );
}
