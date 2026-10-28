'use client';

import type { GraphSeverity } from '@/lib/graphSeverity';

export function SeverityStrip({ severity }: { severity: GraphSeverity }) {
  const color =
    severity.label === 'critical' || severity.label === 'high'
      ? 'text-red-300'
      : severity.label === 'moderate'
        ? 'text-amber-300'
        : 'text-emerald-300';

  return (
    <div className="mb-6 max-w-3xl rounded-xl border border-white/10 bg-black/40 p-4 text-xs space-y-2">
      <p className="text-sm">
        Graph severity:{' '}
        <span className={`font-mono ${color}`}>
          {severity.score}/100 ({severity.label})
        </span>
        <span className="opacity-50 ml-2">
          · {severity.dangerCount}d / {severity.warningCount}w / {severity.infoCount}i
        </span>
      </p>
      <ul className="list-disc pl-4 space-y-1 text-white/60">
        {severity.reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <p className="opacity-40 text-[10px]">
        Heuristic only — not a security guarantee. Score = min(100, 35×dangers +
        12×warnings).
      </p>
    </div>
  );
}
