'use client';

import { PERMISSION_GLOSSARY } from '@/lib/glossary';

export function GlossaryPanel() {
  return (
    <section
      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs space-y-3 max-w-3xl mt-8"
      aria-label="Permission glossary"
    >
      <h2 className="text-sm font-semibold text-white/90">Glossary</h2>
      <dl className="space-y-3">
        {PERMISSION_GLOSSARY.map((g) => (
          <div key={g.term}>
            <dt className="font-mono text-emerald-400/90">{g.term}</dt>
            <dd className="text-white/65 mt-0.5 leading-relaxed">{g.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
