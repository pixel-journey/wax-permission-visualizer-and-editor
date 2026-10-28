'use client';

import { WAITS_EDUCATION } from '@/lib/waitsNote';

export function WaitsNote() {
  return (
    <section
      className="rounded-2xl border border-sky-500/25 bg-sky-500/5 p-4 text-xs space-y-2 max-w-3xl mt-6"
      aria-label="Waits education"
    >
      <h2 className="text-sm font-semibold text-sky-100">{WAITS_EDUCATION.title}</h2>
      <ul className="list-disc pl-4 space-y-1.5 text-sky-50/85 leading-relaxed">
        {WAITS_EDUCATION.body.map((line) => (
          <li key={line.slice(0, 40)}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
