'use client';

import { useMemo } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { dfsViz, type DfsState } from '@/algorithms/dfs';
import { STATE_COLOR, STATE_TEXT, type Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function DfsViz({ locale }: { locale: Locale }) {
  const frames = useMemo(() => dfsViz.build(dfsViz.defaultInput), []);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<DfsState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={dfsViz.pseudocode}
      controls={
        <p className="text-[13px] text-graphite">
          {t
            ? 'Cùng mê cung với mô phỏng BFS. Số trên ô là thứ tự thăm, không phải khoảng cách.'
            : 'The same maze as the BFS simulation. Numbers are visiting order, not distance.'}
        </p>
      }
      render={(s) => (
        <div className="flex flex-wrap items-start gap-6">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${s.rows[0].length}, 30px)` }}
          >
            {s.cells.map((row, r) =>
              row.map((cell, c) => {
                const isWall = s.rows[r][c] === '#';
                const isStart = s.start[0] === r && s.start[1] === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="flex h-[30px] items-center justify-center rounded-sm font-mono text-[11px] transition-colors duration-200"
                    style={{
                      backgroundColor: isWall ? '#C3CBDA' : STATE_COLOR[cell],
                      color: STATE_TEXT[cell],
                      outline: isStart ? '2px solid #E24A26' : undefined,
                      outlineOffset: '-2px',
                    }}
                  >
                    {isWall ? '' : isStart ? 'S' : (s.order[r][c] ?? '')}
                  </div>
                );
              }),
            )}
          </div>

          <div className="min-w-[140px] font-mono text-xs text-graphite">
            <p className="mb-1 uppercase tracking-wide">
              {t ? 'Ngăn xếp' : 'Stack'} ({s.stack.length})
            </p>
            <div className="flex flex-col-reverse gap-1">
              {s.stack.slice(-8).map(([r, c], i) => (
                <span key={i} className="rounded border border-grid bg-highlight/25 px-1.5 py-0.5">
                  {r + 1},{c + 1}
                </span>
              ))}
              {s.stack.length === 0 ? <span className="italic">{t ? 'rỗng' : 'empty'}</span> : null}
            </div>
            {s.stack.length > 8 ? <p className="mt-1">…</p> : null}
            <p className="mt-2 text-[10px] leading-snug">
              {t ? 'Lấy ra từ trên xuống' : 'Popped from the top'}
            </p>
          </div>
        </div>
      )}
    />
  );
}
