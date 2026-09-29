'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { fastPowViz, type FastPowState } from '@/algorithms/fastPow';
import type { Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

const PRESETS = [
  { a: 3, n: 13, m: 100 },
  { a: 2, n: 25, m: 1000 },
  { a: 7, n: 100, m: 10 },
];

export default function FastPowViz({ locale }: { locale: Locale }) {
  const [idx, setIdx] = useState(0);
  const frames = useMemo(() => fastPowViz.build(PRESETS[idx]), [idx]);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<FastPowState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={fastPowViz.pseudocode}
      controls={
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-graphite">{t ? 'Bài toán' : 'Problem'}</span>
          <select
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="rounded border border-grid px-2 py-1 font-mono"
          >
            {PRESETS.map((p, i) => (
              <option key={i} value={i}>
                {p.a}^{p.n} mod {p.m}
              </option>
            ))}
          </select>
        </label>
      }
      render={(s) => (
        <div className="min-w-[440px]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wide text-graphite">
              {t ? 'Số mũ nhị phân' : 'Exponent in binary'}
            </span>
            <div className="flex gap-1">
              {s.bits.map((b, i) => {
                // bits[0] là bit cao nhất, bitIndex đếm từ bit thấp
                const posFromLow = s.bits.length - 1 - i;
                const done = posFromLow < s.bitIndex;
                const active = posFromLow === s.bitIndex && !s.finished;
                return (
                  <span
                    key={i}
                    className="flex h-7 w-7 items-center justify-center rounded font-mono text-sm transition-colors"
                    style={{
                      backgroundColor: active ? '#E24A26' : done ? '#DCE4F0' : '#F8F9FB',
                      color: active ? '#fff' : done ? '#9AA3B5' : '#14224F',
                      border: '1px solid #DCE4F0',
                    }}
                  >
                    {b}
                  </span>
                );
              })}
            </div>
            <span className="font-mono text-xs text-graphite">
              {t ? 'phép nhân đã dùng' : 'multiplications used'}:{' '}
              <span className="text-mark">{s.mults}</span> / {s.n}
            </span>
          </div>

          <table className="w-full border-collapse font-mono text-sm">
            <thead>
              <tr className="border-b border-grid text-left text-xs uppercase tracking-wide text-graphite">
                <th className="py-2 pr-3 font-normal">{t ? 'Mũ còn lại' : 'Exponent left'}</th>
                <th className="py-2 pr-3 font-normal">Bit</th>
                <th className="py-2 pr-3 font-normal">{t ? 'Cơ số' : 'Base'}</th>
                <th className="py-2 pr-3 font-normal">{t ? 'Kết quả' : 'Result'}</th>
              </tr>
            </thead>
            <tbody>
              {s.rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-3 text-graphite">
                    {t ? 'Bấm Bắt đầu để chạy' : 'Press Start to run'}
                  </td>
                </tr>
              ) : null}
              {s.rows.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i === s.rows.length - 1 && !s.finished
                      ? 'bg-highlight/25 text-ink'
                      : 'text-graphite'
                  }
                >
                  <td className="py-1.5 pr-3">{row.remaining}</td>
                  <td className={`py-1.5 pr-3 ${row.used ? 'font-bold text-mark' : ''}`}>
                    {row.bit}
                  </td>
                  <td className="py-1.5 pr-3">{row.base}</td>
                  <td className={`py-1.5 pr-3 ${row.used ? 'font-bold text-ink' : ''}`}>
                    {row.result}
                  </td>
                </tr>
              ))}
            </tbody>
            {s.finished ? (
              <tfoot>
                <tr className="border-t-2 border-solve">
                  <td colSpan={4} className="pt-3 text-base font-bold text-solve">
                    {s.a}^{s.n} mod {s.m} = {s.result}
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      )}
    />
  );
}
