'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { sieveViz, type SieveState } from '@/algorithms/sieve';
import { STATE_COLOR, STATE_TEXT, type Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function SieveViz({ locale }: { locale: Locale }) {
  const [n, setN] = useState(sieveViz.defaultInput.n);
  const frames = useMemo(() => sieveViz.build({ n }), [n]);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<SieveState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={sieveViz.pseudocode}
      controls={
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-graphite">{t ? 'Sàng tới số' : 'Sieve up to'}</span>
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded border border-grid px-2 py-1 font-mono"
          >
            {[30, 60, 100].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
      }
      render={(s) => (
        <div className="min-w-[420px]">
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
            {Array.from({ length: s.n + 1 }, (_, k) => (
              <div
                key={k}
                className="flex h-8 items-center justify-center rounded-sm font-mono text-[12px] transition-colors duration-150"
                style={{
                  backgroundColor: STATE_COLOR[s.cells[k]],
                  color: STATE_TEXT[s.cells[k]],
                  textDecoration: s.cells[k] === 'excluded' && k >= 2 ? 'line-through' : undefined,
                }}
              >
                {k}
              </div>
            ))}
          </div>

          <div className="mt-4 font-mono text-xs text-graphite">
            <p className="uppercase tracking-wide">
              {t ? 'Số nguyên tố tìm được' : 'Primes found'} ({s.primes.length})
            </p>
            <p className="mt-1 leading-relaxed text-ink">{s.primes.join(', ') || '—'}</p>
          </div>
        </div>
      )}
    />
  );
}
