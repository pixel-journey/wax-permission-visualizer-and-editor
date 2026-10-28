'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MythsPanel } from '@/components/MythsPanel';
import { PermissionTree } from '@/components/PermissionTree';
import { RelatedBlueprints } from '@/components/RelatedBlueprints';
import { buildAuditReportMarkdown } from '@/lib/auditReport';
import { downloadTextFile } from '@/lib/download';
import { exportGraphJson, exportGraphMarkdown } from '@/lib/exportGraph';
import {
  mockGameLinkedGraph,
  mockSafeGraph,
  mockSocialOwnerGraph,
  mockUnsafeGraph,
} from '@/lib/fixtures';
import { diffPermissionGraphs } from '@/lib/graphDiff';
import { analyzeGraphRisk } from '@/lib/graphRisk';
import { graphSeverity } from '@/lib/graphSeverity';
import {
  clearGraphDraft,
  loadGraphDraft,
  saveGraphDraft,
} from '@/lib/graphStorage';
import { nextStepsChecklist } from '@/lib/nextSteps';
import { fetchPermissionGraph } from '@/lib/parseAccount';
import {
  calculateThreshold,
  nodeWeightSummary,
  validateProposedChange,
} from '@/lib/permissionEngine';
import {
  proposalSketchesFromDiff,
  proposalSketchesMarkdown,
} from '@/lib/proposalSketches';
import { DEFAULT_RPC_URL, RPC_ENDPOINTS } from '@/lib/rpcEndpoints';
import { buildAccountShareParam, readAccountFromSearch } from '@/lib/shareUrl';
import { treeOutline } from '@/lib/treeOutline';
import { PermissionGraph } from '@/lib/types';

export default function PermissionVisualizerPage() {
  const [account, setAccount] = useState('eosio');
  const [rpcUrl, setRpcUrl] = useState(DEFAULT_RPC_URL);
  const [graph, setGraph] = useState<PermissionGraph>(() => mockSafeGraph('demo'));
  const [baseline, setBaseline] = useState<PermissionGraph | null>(null);
  const [mode, setMode] = useState<'viewer' | 'editor'>('viewer');
  const [selectedNode, setSelectedNode] = useState<string | null>('owner');
  const [simulationKeys, setSimulationKeys] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>('Mock safe graph loaded');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shared = readAccountFromSearch(window.location.search);
      if (shared) {
        setAccount(shared);
        setStatus(`Account from share URL: ${shared} — click Load get_account`);
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }
    }
    const d = loadGraphDraft();
    if (d.ok && d.value) {
      setGraph(d.value);
      setStatus('Restored graph draft from localStorage');
    }
  }, []);

  const risks = useMemo(() => analyzeGraphRisk(graph), [graph]);
  const severity = useMemo(() => graphSeverity(graph), [graph]);
  const outline = useMemo(() => treeOutline(graph), [graph]);
  const steps = useMemo(() => nextStepsChecklist(graph), [graph]);
  const diffLines = useMemo(
    () => (baseline ? diffPermissionGraphs(baseline, graph) : []),
    [baseline, graph]
  );
  const changeWarnings = useMemo(
    () => (baseline ? validateProposedChange(baseline, graph) : []),
    [baseline, graph]
  );
  const sketches = useMemo(
    () =>
      baseline
        ? proposalSketchesFromDiff(graph.account || account, baseline, graph)
        : [],
    [baseline, graph, account]
  );

  const loadFixture = (g: PermissionGraph, label: string) => {
    setGraph(g);
    setSelectedNode(
      g.permissions.owner ? 'owner' : Object.keys(g.permissions)[0] ?? null
    );
    setStatus(label);
  };

  const handleFetchLive = async () => {
    setLoading(true);
    setStatus(null);
    const r = await fetchPermissionGraph(account, rpcUrl);
    setLoading(false);
    if (!r.ok || !r.graph) {
      setStatus(
        `Soft-fail (${new URL(rpcUrl).hostname}): ${r.reason ?? 'unknown'} — try another RPC`
      );
      return;
    }
    setGraph(r.graph);
    setBaseline(r.graph);
    setSelectedNode(
      r.graph.permissions.owner
        ? 'owner'
        : Object.keys(r.graph.permissions)[0] ?? null
    );
    const linkN = r.graph.linkedActions?.length ?? 0;
    setStatus(
      `Loaded ${Object.keys(r.graph.permissions).length} permission(s) for ${r.graph.account}` +
        (linkN ? ` · ${linkN} linked_action(s)` : '') +
        ` via ${new URL(rpcUrl).hostname}`
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

  const copyShare = async () => {
    const param = buildAccountShareParam(account);
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?${param}`
        : `?${param}`;
    await copy(url, 'Share URL copied');
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
  const weightSum = currentNode ? nodeWeightSummary(currentNode) : null;
  const simResult = currentNode
    ? calculateThreshold(currentNode, simulationKeys)
    : null;

  const acct = graph.account || account || 'account';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-2xl tracking-widest text-emerald-400 font-bold">
              PERMISSION VISUALIZER
            </div>
            <div className="text-xs opacity-60">
              Pixel Journey · Pass 16 · educational-reference
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
              onClick={() => loadFixture(mockSafeGraph('demo'), 'Safe mock')}
              className="px-3 py-2 text-sm bg-white/10 rounded-lg"
            >
              Safe
            </button>
            <button
              type="button"
              onClick={() => loadFixture(mockUnsafeGraph(), 'Unsafe fixture')}
              className="px-3 py-2 text-sm bg-red-900/50 rounded-lg"
            >
              Unsafe
            </button>
            <button
              type="button"
              onClick={() =>
                loadFixture(
                  mockSocialOwnerGraph('alice.wam'),
                  'Social 2-of-3 owner fixture'
                )
              }
              className="px-3 py-2 text-sm bg-cyan-900/50 rounded-lg"
            >
              Social owner
            </button>
            <button
              type="button"
              onClick={() =>
                loadFixture(mockGameLinkedGraph(), 'Game claim-session fixture')
              }
              className="px-3 py-2 text-sm bg-lime-900/40 rounded-lg"
            >
              Game claim
            </button>
            <button
              type="button"
              onClick={() => void copyShare()}
              className="px-3 py-2 text-sm bg-teal-800 rounded-lg"
            >
              Copy share URL
            </button>
            <button
              type="button"
              onClick={() => {
                setBaseline(graph);
                setStatus('Baseline snapshot set');
              }}
              className="px-3 py-2 text-sm bg-violet-800 rounded-lg"
            >
              Set baseline
            </button>
            <button
              type="button"
              onClick={() => {
                const r = saveGraphDraft(graph);
                setStatus(r.ok ? 'Draft saved' : `Save failed: ${r.reason}`);
              }}
              className="px-3 py-2 text-sm bg-violet-700 rounded-lg"
            >
              Save draft
            </button>
            <button
              type="button"
              onClick={() => {
                clearGraphDraft();
                setStatus('Draft cleared');
              }}
              className="px-3 py-2 text-sm bg-white/10 rounded-lg"
            >
              Clear draft
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
            <button
              type="button"
              onClick={() => {
                downloadTextFile(
                  `${acct}-audit.md`,
                  buildAuditReportMarkdown(graph, baseline),
                  'text/markdown;charset=utf-8'
                );
                setStatus('Audit report downloaded');
              }}
              className="px-3 py-2 text-sm bg-emerald-900 rounded-lg"
            >
              Download audit.md
            </button>
            {baseline && (
              <button
                type="button"
                onClick={() =>
                  copy(
                    proposalSketchesMarkdown(
                      graph.account || account,
                      baseline,
                      graph
                    ),
                    'Proposal sketches copied (not for broadcast)'
                  )
                }
                className="px-3 py-2 text-sm bg-amber-900/60 rounded-lg"
              >
                Copy proposal sketches
              </button>
            )}
          </div>
        </div>

        <section
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-100/90 space-y-2 mb-6 max-w-3xl"
          role="note"
        >
          <p className="font-medium text-sm">Read / plan only</p>
          <p>
            Soft-fail live <code>get_account</code>. Switch RPC if one node is down.
            No auto <code>updateauth</code>.
          </p>
        </section>

        <MythsPanel />

        <p className="text-sm mb-2">
          Graph severity:{' '}
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

        <ol className="mb-6 list-decimal pl-5 text-xs space-y-1 text-white/70 max-w-3xl">
          <li className="list-none -ml-5 opacity-50 mb-1">NEXT STEPS</li>
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="flex-1 min-w-[12rem] bg-black/60 border border-white/10 px-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-400"
            placeholder="WAX account name"
          />
          <label className="flex items-center gap-2 text-xs opacity-80">
            RPC
            <select
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              className="bg-black/60 border border-white/10 px-3 py-3 rounded-xl font-mono text-sm"
            >
              {RPC_ENDPOINTS.map((e) => (
                <option key={e.id} value={e.url}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>
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

        {graph.linkedActions && graph.linkedActions.length > 0 && (
          <ul className="mb-4 text-xs space-y-1 rounded-xl border border-lime-500/25 bg-lime-500/10 p-4 font-mono">
            <li className="opacity-60 list-none">LINKED ACTIONS (from RPC if present)</li>
            {graph.linkedActions.map((l, i) => (
              <li key={`${l.account}-${l.action}-${i}`}>
                {l.permission} → {l.account}::{l.action}
              </li>
            ))}
          </ul>
        )}

        {risks.length > 0 && (
          <ul className="mb-4 text-xs space-y-1 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <li className="opacity-60">GRAPH RISK</li>
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

        {changeWarnings.length > 0 && (
          <ul className="mb-4 text-xs space-y-1 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <li className="opacity-60">PROPOSED CHANGE vs BASELINE</li>
            {changeWarnings.map((w) => (
              <li
                key={w.message}
                className={w.level === 'danger' ? 'text-red-300' : 'text-amber-300'}
              >
                [{w.level}] {w.message}
              </li>
            ))}
          </ul>
        )}

        {baseline && diffLines.some((l) => l.kind !== 'same') && (
          <ul className="mb-4 text-xs space-y-1 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 font-mono">
            <li className="opacity-60 mb-1">DIFF vs baseline</li>
            {diffLines
              .filter((l) => l.kind !== 'same')
              .map((l) => (
                <li key={`${l.permission}-${l.kind}`}>
                  [{l.kind}] {l.permission}: {l.detail}
                </li>
              ))}
          </ul>
        )}

        {sketches.length > 0 && (
          <ol className="mb-6 list-decimal pl-5 text-xs space-y-1 rounded-xl border border-violet-500/25 bg-violet-500/10 p-4 font-mono text-violet-100/90">
            <li className="list-none opacity-60 -ml-5 mb-1">
              PROPOSAL SKETCHES (not sent)
            </li>
            {sketches.map((s) => (
              <li key={s.summary}>
                {s.account}::{s.name} — {s.summary}
              </li>
            ))}
          </ol>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
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
            <div className="border border-white/10 bg-black/30 rounded-xl p-4 text-xs font-mono">
              <div className="opacity-60 mb-2 tracking-widest text-[10px]">OUTLINE</div>
              <ul className="space-y-1">
                {outline.map((l) => (
                  <li key={l.name}>
                    <button
                      type="button"
                      className="text-left hover:text-emerald-400"
                      style={{ paddingLeft: l.depth * 12 }}
                      onClick={() => setSelectedNode(l.name)}
                    >
                      {l.name} · thr {l.threshold} · keys {l.keyCount}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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
                  {weightSum && (
                    <div
                      className={`text-xs font-mono mb-3 rounded-lg px-2 py-1.5 ${
                        weightSum.satisfiable
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-red-500/10 text-red-300'
                      }`}
                    >
                      weight {weightSum.total} (keys {weightSum.keyWeight} + accts{' '}
                      {weightSum.accountWeight}) · thr {weightSum.threshold}
                      {weightSum.satisfiable
                        ? ` · surplus ${weightSum.surplus}`
                        : ' · UNSATISFIABLE'}
                    </div>
                  )}
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
                      <div className="text-xs opacity-60 mb-1 mt-3">
                        ACCOUNT AUTH ({currentNode.accounts.length})
                      </div>
                      {currentNode.accounts.map((a, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-xs py-1 border-b border-white/10 font-mono gap-2"
                        >
                          <span className="truncate">
                            {a.permission.actor}@{a.permission.permission}
                          </span>
                          <span className="text-amber-400 shrink-0">{a.weight}</span>
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
