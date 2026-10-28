'use client';

import { PERMISSION_MYTHS } from '@/lib/myths';

export function MythsPanel() {
  return (
    <section
      className="rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/5 p-4 text-xs space-y-3 max-w-3xl mb-6"
      aria-label="Common permission myths"
    >
      <h2 className="text-sm font-semibold text-fuchsia-100">Myths vs reality</h2>
      <ul className="space-y-3">
        {PERMISSION_MYTHS.map((m) => (
          <li key={m.myth} className="leading-relaxed">
            <p className="text-red-200/90">
              <span className="opacity-60">Myth: </span>
              {m.myth}
            </p>
            <p className="text-emerald-100/90 mt-0.5">
              <span className="opacity-60">Reality: </span>
              {m.reality}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
