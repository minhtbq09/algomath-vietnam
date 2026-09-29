'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { queensViz, type QueensState } from '@/algorithms/queens';
import type { Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function QueensViz({ locale }: { locale: Locale }) {
  const [n, setN] = useState(queensViz.defaultInput.n);
  const frames = useMemo(() => queensViz.build({ n }), [n]);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<QueensState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={queensViz.pseudocode}
      controls={
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-graphite">{t ? 'Kích thước bàn cờ' : 'Board size'}</span>
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded border border-grid px-2 py-1 font-mono"
          >
            {[4, 5, 6].map((v) => (
              <option key={v} value={v}>
                {v}×{v}
              </option>
            ))}
          </select>
        </label>
      }
      render={(s) => {
        const cell = s.n <= 5 ? 46 : 40;
        const attacked = new Set(s.attacked.map(([r, c]) => `${r},${c}`));
        return (
          <div className="flex flex-wrap items-start gap-6">
            <div
              className="grid gap-0 overflow-hidden rounded border-2 border-ink"
              style={{ gridTemplateColumns: `repeat(${s.n}, ${cell}px)` }}
            >
              {Array.from({ length: s.n }, (_, r) =>
                Array.from({ length: s.n }, (_, c) => {
                  const hasQueen = s.rows[c] === r && c < s.rows.length;
                  const isTrying = s.trying && s.trying[0] === r && s.trying[1] === c;
                  const isRejected = s.rejected && s.rejected[0] === r && s.rejected[1] === c;
                  const isAttacked = attacked.has(`${r},${c}`);
                  const light = (r + c) % 2 === 0;

                  let bg = light ? '#F8F9FB' : '#E4EAF4';
                  if (isAttacked) bg = light ? '#EFE3DF' : '#E5D6D1';
                  if (hasQueen) bg = '#14224F';
                  if (isRejected) bg = '#E24A26';
                  else if (isTrying && !hasQueen) bg = '#F5C518';

                  return (
                    <div
                      key={`${r}-${c}`}
                      className="flex items-center justify-center transition-colors duration-150"
                      style={{ width: cell, height: cell, backgroundColor: bg }}
                    >
                      {hasQueen ? (
                        <span style={{ color: '#F5C518', fontSize: cell * 0.5 }}>&#9819;</span>
                      ) : isRejected ? (
                        <span style={{ color: '#fff', fontSize: cell * 0.4 }}>&times;</span>
                      ) : isAttacked ? (
                        <span style={{ color: '#C9A99F', fontSize: cell * 0.3 }}>&middot;</span>
                      ) : null}
                    </div>
                  );
                }),
              )}
            </div>

            <dl className="min-w-[170px] space-y-2 font-mono text-xs text-graphite">
              <div>
                <dt className="uppercase tracking-wide">{t ? 'Cột đã đặt' : 'Columns placed'}</dt>
                <dd className="text-base text-ink">
                  {s.rows.length} / {s.n}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">{t ? 'Trạng thái đã thăm' : 'States visited'}</dt>
                <dd className="text-base text-ink">{s.nodesVisited}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">{t ? 'Lần cắt nhánh' : 'Branches pruned'}</dt>
                <dd className="text-base text-mark">{s.pruned}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">{t ? 'Nghiệm tìm được' : 'Solutions found'}</dt>
                <dd className="text-base text-solve">{s.solutions}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
