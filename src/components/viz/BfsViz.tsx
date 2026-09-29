'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { bfsViz, type BfsState } from '@/algorithms/bfs';
import { STATE_COLOR, STATE_TEXT, type Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function BfsViz({ locale }: { locale: Locale }) {
  const [showDist, setShowDist] = useState(true);
  const frames = useMemo(() => bfsViz.build(bfsViz.defaultInput), []);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<BfsState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={bfsViz.pseudocode}
      controls={
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDist}
              onChange={(e) => setShowDist(e.target.checked)}
              className="accent-mark"
            />
            <span className="text-graphite">
              {t ? 'Hiện số bước trên mỗi ô' : 'Show step count on each cell'}
            </span>
          </label>
          <div className="flex flex-wrap gap-3 text-xs text-graphite">
            {(
              [
                ['idle', t ? 'chưa xét' : 'unseen'],
                ['frontier', t ? 'trong hàng đợi' : 'in queue'],
                ['active', t ? 'đang xét' : 'current'],
                ['done', t ? 'đã xong' : 'finished'],
                ['result', t ? 'đường đi' : 'path'],
              ] as const
            ).map(([k, label]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-3 rounded-sm border border-grid"
                  style={{ backgroundColor: STATE_COLOR[k] }}
                />
                {label}
              </span>
            ))}
          </div>
        </div>
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
                const isGoal = s.goal && s.goal[0] === r && s.goal[1] === c;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="flex h-[30px] items-center justify-center rounded-sm font-mono text-[11px] transition-colors duration-200"
                    style={{
                      backgroundColor: isWall ? '#C3CBDA' : STATE_COLOR[cell],
                      color: STATE_TEXT[cell],
                      outline: isStart || isGoal ? '2px solid #E24A26' : undefined,
                      outlineOffset: '-2px',
                    }}
                  >
                    {isWall
                      ? ''
                      : isStart
                        ? 'S'
                        : isGoal
                          ? 'Đ'
                          : showDist && s.dist[r][c] !== null
                            ? s.dist[r][c]
                            : ''}
                  </div>
                );
              }),
            )}
          </div>

          <div className="min-w-[150px] font-mono text-xs text-graphite">
            <p className="mb-1 uppercase tracking-wide">
              {t ? 'Hàng đợi' : 'Queue'} ({s.queue.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {s.queue.slice(0, 14).map(([r, c], i) => (
                <span
                  key={i}
                  className="rounded border border-grid bg-highlight/25 px-1.5 py-0.5"
                >
                  {r + 1},{c + 1}
                </span>
              ))}
              {s.queue.length > 14 ? <span>…</span> : null}
              {s.queue.length === 0 ? (
                <span className="italic">{t ? 'rỗng' : 'empty'}</span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    />
  );
}
