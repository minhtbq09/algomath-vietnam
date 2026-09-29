'use client';

import { useMemo } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { dijkstraViz, type DijkstraState, type NodeStatus } from '@/algorithms/dijkstra';
import type { Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

const FILL: Record<NodeStatus, string> = {
  unseen: '#DCE4F0',
  tentative: '#F5C518',
  current: '#E24A26',
  settled: '#14224F',
};
const TEXT: Record<NodeStatus, string> = {
  unseen: '#14224F',
  tentative: '#14224F',
  current: '#FFFFFF',
  settled: '#FFFFFF',
};

export default function DijkstraViz({ locale }: { locale: Locale }) {
  const frames = useMemo(() => dijkstraViz.build(dijkstraViz.defaultInput), []);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<DijkstraState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={dijkstraViz.pseudocode}
      controls={
        <div className="flex flex-wrap gap-3 text-xs text-graphite">
          {(
            [
              ['unseen', t ? 'chưa biết' : 'unknown'],
              ['tentative', t ? 'tạm thời' : 'tentative'],
              ['current', t ? 'đang xử lý' : 'current'],
              ['settled', t ? 'đã chốt' : 'settled'],
            ] as const
          ).map(([k, label]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full border border-grid"
                style={{ backgroundColor: FILL[k] }}
              />
              {label}
            </span>
          ))}
        </div>
      }
      render={(s) => (
        <div className="flex flex-wrap items-start gap-6">
          <svg viewBox="0 0 530 300" className="h-auto w-full min-w-[430px] max-w-[530px]">
            {s.edges.map((e, i) => {
              const A = s.nodes.find((n) => n.id === e.a)!;
              const B = s.nodes.find((n) => n.id === e.b)!;
              const isActive =
                s.activeEdge &&
                ((s.activeEdge[0] === e.a && s.activeEdge[1] === e.b) ||
                  (s.activeEdge[0] === e.b && s.activeEdge[1] === e.a));
              const inTree = s.treeEdges.some(
                ([x, y]) => (x === e.a && y === e.b) || (x === e.b && y === e.a),
              );
              const inPath = s.path.some(
                (p, k) =>
                  k < s.path.length - 1 &&
                  ((p === e.a && s.path[k + 1] === e.b) || (p === e.b && s.path[k + 1] === e.a)),
              );
              const stroke = inPath ? '#0E8F7E' : isActive ? '#E24A26' : inTree ? '#14224F' : '#DCE4F0';
              const width = inPath ? 5 : isActive ? 3.5 : inTree ? 2.5 : 1.5;
              return (
                <g key={i}>
                  <line
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke={stroke}
                    strokeWidth={width}
                    strokeLinecap="round"
                  />
                  <rect
                    x={(A.x + B.x) / 2 - 11}
                    y={(A.y + B.y) / 2 - 10}
                    width={22}
                    height={18}
                    rx={3}
                    fill="#F8F9FB"
                    stroke={isActive ? '#E24A26' : '#DCE4F0'}
                  />
                  <text
                    x={(A.x + B.x) / 2}
                    y={(A.y + B.y) / 2 + 3}
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    fill={isActive ? '#E24A26' : '#5B6478'}
                  >
                    {e.w}
                  </text>
                </g>
              );
            })}

            {s.nodes.map((n) => {
              const st = s.status[n.id];
              const d = s.dist[n.id];
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={21} fill={FILL[st]} stroke="#14224F" strokeWidth={1.5} />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="600"
                    fontFamily="ui-monospace, monospace"
                    fill={TEXT[st]}
                  >
                    {n.id}
                  </text>
                  <text
                    x={n.x}
                    y={n.y + 38}
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="ui-monospace, monospace"
                    fill={d === null ? '#9AA3B5' : '#14224F'}
                  >
                    {d === null ? '∞' : d}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="min-w-[140px] font-mono text-xs text-graphite">
            <p className="mb-1 uppercase tracking-wide">
              {t ? 'Hàng đợi ưu tiên' : 'Priority queue'}
            </p>
            <div className="flex flex-col gap-1">
              {s.queue.map((q) => (
                <span key={q.id} className="rounded border border-grid bg-highlight/25 px-2 py-0.5">
                  {q.id} : {q.d}
                </span>
              ))}
              {s.queue.length === 0 ? (
                <span className="italic">{t ? 'rỗng' : 'empty'}</span>
              ) : null}
            </div>
            <p className="mt-2 text-[10px] leading-snug">
              {t ? 'Luôn lấy ra phần tử nhỏ nhất' : 'Always serves the smallest'}
            </p>
          </div>
        </div>
      )}
    />
  );
}
