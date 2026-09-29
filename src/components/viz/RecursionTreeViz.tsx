'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { recTreeViz, type RecTreeState } from '@/algorithms/recursionTree';
import type { Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function RecursionTreeViz({ locale }: { locale: Locale }) {
  const [n, setN] = useState(recTreeViz.defaultInput.n);
  const [memo, setMemo] = useState(false);
  const frames = useMemo(() => recTreeViz.build({ n, memo }), [n, memo]);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<RecTreeState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={recTreeViz.pseudocode}
      controls={
        <div className="flex flex-wrap items-center gap-5 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-graphite">fib(</span>
            <select
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="rounded border border-grid px-2 py-1 font-mono"
            >
              {[4, 5, 6, 7].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <span className="text-graphite">)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={memo}
              onChange={(e) => setMemo(e.target.checked)}
              className="accent-mark"
            />
            <span className="text-graphite">
              {t ? 'Bật bảng ghi nhớ' : 'Enable the memo table'}
            </span>
          </label>
        </div>
      }
      render={(s) => (
        <div>
          <svg
            viewBox={`0 0 ${s.width} ${s.height}`}
            className="h-auto w-full"
            style={{ minWidth: Math.min(s.width, 560), maxWidth: s.width }}
          >
            {s.nodes.map((node) => {
              if (!node.parent) return null;
              const p = s.nodes.find((x) => x.key === node.parent);
              if (!p) return null;
              return (
                <line
                  key={`e-${node.key}`}
                  x1={p.x}
                  y1={p.y + 13}
                  x2={node.x}
                  y2={node.y - 13}
                  stroke={node.cached ? '#0E8F7E' : '#DCE4F0'}
                  strokeWidth={node.cached ? 2 : 1.5}
                  strokeDasharray={node.cached ? '4 3' : undefined}
                />
              );
            })}

            {s.nodes.map((node) => {
              const isCurrent = node.key === s.current;
              const fill = node.cached
                ? '#0E8F7E'
                : isCurrent
                  ? '#E24A26'
                  : node.value !== null
                    ? '#14224F'
                    : '#F5C518';
              return (
                <g key={node.key}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={14}
                    fill={fill}
                    stroke="#14224F"
                    strokeWidth={isCurrent ? 2.5 : 1}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    fill="#FFFFFF"
                  >
                    {node.n}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-graphite">
            <span>
              {t ? 'số lời gọi' : 'calls'}: <span className="text-ink">{s.calls}</span>
            </span>
            {s.memo ? (
              <span>
                {t ? 'trả lời từ bảng' : 'served from table'}:{' '}
                <span className="text-solve">{s.cacheHits}</span>
              </span>
            ) : null}
            <span>
              {t ? 'giá trị phân biệt' : 'distinct values'}: {n + 1}
            </span>
          </div>
        </div>
      )}
    />
  );
}
