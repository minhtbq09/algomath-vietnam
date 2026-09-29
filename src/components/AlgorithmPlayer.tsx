'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Bilingual, Frame, Locale } from '@/algorithms/types';

interface Props<S> {
  frames: Frame<S>[];
  locale: Locale;
  /** Vẽ một frame. Nhận đúng ảnh chụp trạng thái, không giữ state riêng. */
  render: (state: S) => React.ReactNode;
  pseudocode?: Bilingual[];
  /** Ô nhập liệu tuỳ chỉnh của từng mô phỏng, đặt phía trên khung vẽ. */
  controls?: React.ReactNode;
  labels: {
    start: string;
    pause: string;
    next: string;
    back: string;
    reset: string;
    step: string;
    of: string;
  };
}

export default function AlgorithmPlayer<S>({
  frames,
  locale,
  render,
  pseudocode,
  controls,
  labels,
}: Props<S>) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const last = frames.length - 1;
  const frame = frames[Math.min(index, last)];

  // Đổi input là dựng lại toàn bộ frame, nên quay về bước đầu.
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [frames]);

  useEffect(() => {
    if (!playing) return;
    if (index >= last) {
      setPlaying(false);
      return;
    }
    timer.current = setTimeout(() => setIndex((i) => Math.min(i + 1, last)), speed);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playing, index, last, speed]);

  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(i + 1, last));
  }, [last]);

  const back = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      }
    },
    [next, back],
  );

  const codeLines = useMemo(() => pseudocode ?? [], [pseudocode]);

  return (
    <figure
      className="my-8 rounded-lg border border-grid bg-white shadow-[0_1px_0_rgba(20,34,79,0.06)]"
      tabIndex={0}
      onKeyDown={onKey}
    >
      {controls ? <div className="border-b border-grid px-4 py-3">{controls}</div> : null}

      <div className="overflow-x-auto px-4 py-5">{render(frame.state)}</div>

      {codeLines.length > 0 ? (
        <div className="border-t border-grid px-4 py-3">
          <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className={
                  i === frame.line
                    ? 'rounded bg-highlight/30 px-2 py-[1px] text-ink'
                    : 'px-2 py-[1px] text-graphite'
                }
              >
                {line[locale] || '\u00A0'}
              </div>
            ))}
          </pre>
        </div>
      ) : null}

      <figcaption className="border-t border-grid bg-paperdeep px-4 py-3 text-[15px] leading-relaxed text-ink">
        <span
          aria-live="polite"
          // min-height giữ chiều cao ổn định để bố cục không nhảy khi đổi bước
          className="block min-h-[3rem]"
        >
          {frame.explain[locale]}
        </span>
      </figcaption>

      <div className="flex flex-wrap items-center gap-2 border-t border-grid px-4 py-3">
        <button
          type="button"
          onClick={() => (index >= last ? reset() : setPlaying((p) => !p))}
          className="rounded border border-ink bg-ink px-3 py-1.5 text-sm font-medium text-white transition hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark"
        >
          {index >= last ? labels.reset : playing ? labels.pause : labels.start}
        </button>
        <button
          type="button"
          onClick={back}
          disabled={index === 0}
          className="rounded border border-grid px-3 py-1.5 text-sm text-ink transition hover:border-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark"
        >
          {labels.back}
        </button>
        <button
          type="button"
          onClick={next}
          disabled={index >= last}
          className="rounded border border-grid px-3 py-1.5 text-sm text-ink transition hover:border-ink disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark"
        >
          {labels.next}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded border border-grid px-3 py-1.5 text-sm text-ink transition hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark"
        >
          {labels.reset}
        </button>

        <label className="ml-auto flex items-center gap-2 font-mono text-xs text-graphite">
          <span>
            {labels.step} {index + 1}/{frames.length}
          </span>
          <input
            type="range"
            min={0}
            max={last}
            value={Math.min(index, last)}
            onChange={(e) => {
              setPlaying(false);
              setIndex(Number(e.target.value));
            }}
            className="w-28 accent-mark"
            aria-label={labels.step}
          />
        </label>

        <label className="flex items-center gap-1 font-mono text-xs text-graphite">
          <span aria-hidden>⏱</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded border border-grid bg-white px-1 py-0.5"
            aria-label="Speed"
          >
            <option value={1200}>0.5×</option>
            <option value={700}>1×</option>
            <option value={350}>2×</option>
            <option value={150}>4×</option>
          </select>
        </label>
      </div>
    </figure>
  );
}
