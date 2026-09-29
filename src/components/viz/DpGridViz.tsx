'use client';

import { useMemo } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { dpGridViz, type DpGridState } from '@/algorithms/dpGrid';
import { STATE_COLOR, STATE_TEXT, type Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function DpGridViz({ locale }: { locale: Locale }) {
  const frames = useMemo(() => dpGridViz.build(dpGridViz.defaultInput), []);
  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<DpGridState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={dpGridViz.pseudocode}
      controls={
        <p className="text-[13px] text-graphite">
          {t
            ? 'Đi từ ô góc trên trái tới góc dưới phải, mỗi bước chỉ được sang phải hoặc xuống dưới.'
            : 'Travel from the top-left cell to the bottom-right, moving only right or down.'}
        </p>
      }
      render={(s) => (
        <div
          className="grid gap-[4px]"
          style={{ gridTemplateColumns: `repeat(${s.rows[0].length}, 46px)` }}
        >
          {s.cells.map((row, r) =>
            row.map((cell, c) => {
              const isWall = s.rows[r][c] === '#';
              const value = s.table[r][c];
              return (
                <div
                  key={`${r}-${c}`}
                  className="flex h-[46px] items-center justify-center rounded font-mono text-[13px] transition-colors duration-200"
                  style={{
                    backgroundColor: isWall ? '#3A4767' : STATE_COLOR[cell],
                    color: STATE_TEXT[cell],
                  }}
                >
                  {isWall ? '' : value === null ? '' : value}
                </div>
              );
            }),
          )}
        </div>
      )}
    />
  );
}
