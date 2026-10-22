'use client';

import React, { useState } from 'react';
import { PermissionTree } from '@/components/PermissionTree';
import { fetchPermissionGraph } from '@/lib/parseAccount';
import { PermissionGraph } from '@/lib/types';
import { calculateThreshold } from '@/lib/permissionEngine';

const createMockGraph = (account: string): PermissionGraph => ({
  account,
  lastUpdated: new Date().toISOString(),
  permissions: {
    owner: {
      name: 'owner',
      threshold: 1,
      keys: [{ key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV', weight: 1 }],
      accounts: [],
    },
    active: {
      name: 'active',
      parent: 'owner',
      threshold: 2,
      keys: [
        { key: 'EOS7examplekeyaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', weight: 1 },
        { key: 'EOS8examplekeybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', weight: 1 },
      ],
      accounts: [
        { permission: { actor: 'partneraccount', permission: 'active' }, weight: 1 },
      ],
    },
    gameplay: {
      name: 'gameplay',
      parent: 'active',
      threshold: 1,
      keys: [{ key: 'PUB_K1_GAMEPLAY_SESSION_EXAMPLE', weight: 1 }],
      accounts: [],
    },
  },
});

export default function PermissionVisualizerPage() {
  const [account, setAccount] = useState('eosio');
  const [graph, setGraph] = useState<PermissionGraph>(createMockGraph('demo'));
  const [mode, setMode] = useState<'viewer' | 'editor'>('viewer');
  const [selectedNode, setSelectedNode] = useState<string | null>('owner');
  const [simulationKeys, setSimulationKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>('Mock graph — click Load for soft-fail get_account');
  const [loading, setLoading] = useState(false);

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
              Pixel Journey · WAX / Antelope · educational-reference
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setMode(mode === 'viewer' ? 'editor' : 'viewer')}
              className="px-4 py-2 text-sm border border-white/20 hover:bg-white/5 rounded-lg"
            >
              {mode === 'viewer' ? 'Editor mode' : 'Viewer mode'}
            </button>
            <button
              type="button"
              onClick={() => {
                setGraph(createMockGraph('demo'));
                setStatus('Restored mock graph (includes gameplay session-key example)');
              }}
              className="px-4 py-2 text-sm bg-white/10 rounded-lg"
            >
              Mock demo
            </button>
          </div>
        </div>

        <p className="text-xs opacity-60 mb-4 max-w-3xl leading-relaxed">
          Prefer <strong className="text-emerald-400/90">WharfKit</strong> for any future
          on-chain proposals — not eosjs or standalone Anchor Link. Limited dApp
          session keys are covered in{' '}
          <a
            className="underline text-emerald-400"
            href="https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            wax-wharfkit-session-keys-and-linked-permissions
          </a>
          . This page does not broadcast updateauth.
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
      </div>
    </div>
  );
}
