'use client';

import { useMemo, useState } from 'react';
import AlgorithmPlayer from '@/components/AlgorithmPlayer';
import { binarySearchViz, type BinarySearchState } from '@/algorithms/binarySearch';
import { STATE_COLOR, STATE_TEXT, type Locale } from '@/algorithms/types';
import { playerLabels } from '@/i18n/player';

export default function BinarySearchViz({ locale }: { locale: Locale }) {
  const [target, setTarget] = useState(binarySearchViz.defaultInput.target);
  const values = binarySearchViz.defaultInput.values;

  const frames = useMemo(
    () => binarySearchViz.build({ values, target }),
    [values, target],
  );

  const t = locale === 'vi';

  return (
    <AlgorithmPlayer<BinarySearchState>
      frames={frames}
      locale={locale}
      labels={playerLabels[locale]}
      pseudocode={binarySearchViz.pseudocode}
      controls={
        <label className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-graphite">{t ? 'Tìm số' : 'Search for'}</span>
          <select
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="rounded border border-grid px-2 py-1 font-mono"
          >
            {values.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
            <option value={40}>40 ({t ? 'không có trong dãy' : 'not in the list'})</option>
          </select>
        </label>
      }
      render={(s) => (
        <div className="min-w-[520px]">
          <div className="flex gap-1">
            {s.values.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="flex h-11 w-full items-center justify-center rounded font-mono text-sm transition-colors duration-200"
                  style={{
                    backgroundColor: STATE_COLOR[s.cells[i]],
                    color: STATE_TEXT[s.cells[i]],
                  }}
                >
                  {v}
                </div>
                <span className="font-mono text-[10px] text-graphite">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-graphite">
            <span>
              {t ? 'vùng còn lại' : 'range'}: [{s.lo + 1}, {s.hi + 1}]
            </span>
            <span>
              {t ? 'kích thước' : 'size'}: {Math.max(0, s.hi - s.lo + 1)}
            </span>
            {s.mid !== null ? (
              <span>
                {t ? 'giữa' : 'mid'}: {s.mid + 1} → {s.values[s.mid]}
              </span>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}
