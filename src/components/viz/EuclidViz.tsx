'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { euclidViz, type EuclidState } from '@/algorithms/euclid';
import type { Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function EuclidViz({ locale }: { locale: Locale }) {
  const [a, setA] = useState(euclidViz.defaultInput.a);
  const [b, setB] = useState(euclidViz.defaultInput.b);

  const frames = useMemo(() => euclidViz.build({ a, b }), [a, b]);

  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<EuclidState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={euclidViz.pseudocode}
      controls={
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="font-mono text-graphite">a</span>
            <input
              type="number"
              min={1}
              max={99999}
              value={a}
              onChange={(e) => setA(Math.max(1, Math.min(99999, Number(e.target.value) || 1)))}
              className="w-24 rounded border border-grid px-2 py-1 font-mono"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="font-mono text-graphite">b</span>
            <input
              type="number"
              min={1}
              max={99999}
              value={b}
              onChange={(e) => setB(Math.max(1, Math.min(99999, Number(e.target.value) || 1)))}
              className="w-24 rounded border border-grid px-2 py-1 font-mono"
            />
          </label>
          <span className="text-xs text-graphite">
            {t ? 'Đổi số rồi bấm Bắt đầu lại' : 'Change the numbers, then start again'}
          </span>
        </div>
      }
      render={(s) => (
        <table className="w-full min-w-[420px] border-collapse font-mono text-sm">
          <thead>
            <tr className="border-b border-grid text-left text-xs uppercase tracking-wide text-graphite">
              <th className="py-2 pr-3 font-normal">{t ? 'Bị chia' : 'Dividend'}</th>
              <th className="py-2 pr-3 font-normal">{t ? 'Chia' : 'Divisor'}</th>
              <th className="py-2 pr-3 font-normal">{t ? 'Thương' : 'Quotient'}</th>
              <th className="py-2 pr-3 font-normal">{t ? 'Dư' : 'Remainder'}</th>
            </tr>
          </thead>
          <tbody>
            {s.rows.length === 0 ? (
              <tr>
                <td className="py-3 text-graphite" colSpan={4}>
                  {t ? `Chuẩn bị chia ${s.a} cho ${s.b}` : `About to divide ${s.a} by ${s.b}`}
                </td>
              </tr>
            ) : null}
            {s.rows.map((row, i) => (
              <tr
                key={i}
                className={
                  i === s.cursor && s.gcd === null
                    ? 'bg-highlight/25 text-ink'
                    : 'text-graphite'
                }
              >
                <td className="py-1.5 pr-3">{row.a}</td>
                <td className="py-1.5 pr-3">{row.b}</td>
                <td className="py-1.5 pr-3">{row.q}</td>
                <td className={`py-1.5 pr-3 ${row.r === 0 ? 'font-bold text-solve' : ''}`}>
                  {row.r}
                </td>
              </tr>
            ))}
          </tbody>
          {s.gcd !== null ? (
            <tfoot>
              <tr className="border-t-2 border-solve">
                <td colSpan={4} className="pt-3 text-base font-bold text-solve">
                  ƯCLN = {s.gcd}
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      )}
    />
  );
}
