'use client';

import React, { useState } from 'react';
import { PermissionTree } from '@/components/PermissionTree';
import { PermissionGraph, PermissionNode } from '@/lib/types';
import { calculateThreshold } from '@/lib/permissionEngine';

// Mock realistic permission graph for demo (pxjourney style)
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
      threshold: 2,
      keys: [
        { key: 'EOS7r1n2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2', weight: 1 },
        { key: 'EOS8s3n2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2v4v2', weight: 1 },
      ],
      accounts: [
        { permission: { actor: 'partneraccount', permission: 'active' }, weight: 1 },
      ],
    },
  },
});

export default function PermissionVisualizerPage() {
  const [account, setAccount] = useState('pxjourney');
  const [graph, setGraph] = useState<PermissionGraph>(createMockGraph('pxjourney'));
  const [mode, setMode] = useState<'viewer' | 'editor'>('viewer');
  const [selectedNode, setSelectedNode] = useState<string | null>('owner');
  const [simulationKeys, setSimulationKeys] = useState<string[]>([]);

  const handleFetchLive = async () => {
    // In production: real WAX RPC call + parser
    // For now: switch to a different mock or real fetch
    const newGraph = createMockGraph(account);
    setGraph(newGraph);
    alert('Live fetch simulated. In production this calls WAX RPC get_account and parses permissions.');
  };

  const handleUpdate = (nodeName: string, action: string) => {
    if (action === 'addKey') {
      const newKey = prompt('Enter public key to add:');
      if (!newKey) return;

      const updated = { ...graph };
      const node = updated.permissions[nodeName];
      node.keys.push({ key: newKey, weight: 1 });
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-press-start text-2xl tracking-widest text-emerald-400">PERMISSION VISUALIZER</div>
            <div className="text-xs opacity-60">Pixel Journey • WAX / Antelope • Safe Multi-Sig Tooling</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === 'viewer' ? 'editor' : 'viewer')}
              className="px-4 py-2 text-sm border border-white/20 hover:bg-white/5 rounded-lg transition-colors"
            >
              {mode === 'viewer' ? 'Switch to Editor Mode' : 'Switch to Viewer Mode'}
            </button>
            <button
              onClick={handleFetchLive}
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Fetch Live WAX Account
            </button>
          </div>
        </div>

        {/* Account Input */}
        <div className="flex gap-3 mb-6">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="flex-1 bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-400"
            placeholder="Enter WAX account name"
          />
          <button
            onClick={handleFetchLive}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors"
          >
            Load
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Visualizer */}
          <div className="lg:col-span-8">
            <div className="mb-2 flex items-center justify-between text-xs opacity-70">
              <div>INTERACTIVE PERMISSION TREE</div>
              <div className="font-mono">{graph.account} • {Object.keys(graph.permissions).length} permissions</div>
            </div>
            <PermissionTree
              graph={graph}
              mode={mode}
              onUpdate={handleUpdate}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
          </div>

          {/* Detail + Simulator Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glassmorphic-crt pixel-border p-5 rounded-2xl">
              <div className="font-press-start text-xs mb-3 tracking-widest">SELECTED PERMISSION</div>
              {currentNode ? (
                <>
                  <div className="text-xl font-mono text-emerald-400 mb-2">{currentNode.name}</div>
                  <div className="text-sm opacity-70 mb-4">Threshold: {currentNode.threshold}</div>

                  <div className="text-xs opacity-60 mb-1">KEYS ({currentNode.keys.length})</div>
                  {currentNode.keys.map((k, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-white/10 font-mono">
                      <span>{k.key.slice(0,20)}…</span>
                      <span className="text-amber-400">{k.weight}</span>
                    </div>
                  ))}

                  {currentNode.accounts.length > 0 && (
                    <>
                      <div className="text-xs opacity-60 mt-4 mb-1">MULTI-SIG ACCOUNTS</div>
                      {currentNode.accounts.map((a, i) => (
                        <div key={i} className="text-xs py-1 border-b border-white/10 font-mono flex justify-between">
                          <span>{a.permission.actor}@{a.permission.permission}</span>
                          <span className="text-sky-400">{a.weight}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className="text-sm opacity-60">Select a permission node in the tree</div>
              )}
            </div>

            {/* Live Threshold Simulator */}
            {currentNode && (
              <div className="glassmorphic-crt pixel-border p-5 rounded-2xl">
                <div className="font-press-start text-xs mb-3 tracking-widest">THRESHOLD SIMULATOR</div>
                <div className="text-xs opacity-70 mb-3">Enter keys you control to test if threshold is met</div>

                <input
                  placeholder="Paste key you control..."
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-xs font-mono rounded mb-3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      setSimulationKeys([...simulationKeys, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                />

                {simResult && (
                  <div className={`p-3 rounded text-xs ${simResult.canExecute ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {simResult.canExecute ? '✅ CAN EXECUTE' : '❌ CANNOT EXECUTE'}
                    <div className="mt-1">Current weight: {simResult.currentWeight} / {currentNode.threshold}</div>
                    {simResult.warnings.length > 0 && (
                      <div className="mt-2 text-[10px] opacity-80">{simResult.warnings.join(' • ')}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] opacity-50">
          Built to gkniftyheads-tracker + Pixel Journey standards • Client-side only • Zero custom contracts • Open source
        </div>
      </div>
    </div>
  );
}
