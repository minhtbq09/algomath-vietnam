'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/algorithms/types';
import { getDictionary } from '@/i18n/dictionary';
import type { Difficulty, Exercise } from '@/lib/content';
import { topicLabel } from '@/i18n/topics';

const DIFF_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

function DiffBadge({ level, label }: { level: Difficulty; label: string }) {
  const color =
    level === 'easy'
      ? 'border-solve/40 text-solve'
      : level === 'medium'
        ? 'border-highlight text-[#9A7B04]'
        : 'border-mark/50 text-mark';
  return (
    <span className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${color}`}>
      {label}
    </span>
  );
}

function Card({ ex, locale }: { ex: Exercise; locale: Locale }) {
  const d = getDictionary(locale);
  const [hint, setHint] = useState(false);
  const [sol, setSol] = useState(false);

  const diffLabel = { easy: d.exercises.easy, medium: d.exercises.medium, hard: d.exercises.hard }[
    ex.difficulty
  ];

  return (
    <article className="border-b border-grid py-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-graphite">{ex.id}</span>
        <DiffBadge level={ex.difficulty} label={diffLabel} />
        <span className="font-mono text-[11px] text-graphite">{topicLabel(ex.topic, locale)}</span>
      </div>

      <p className="max-w-reading text-[16px] leading-relaxed">{ex.statement[locale]}</p>

      <div className="mt-3 flex flex-wrap gap-4 text-[13px]">
        <button
          type="button"
          onClick={() => setHint((v) => !v)}
          className="text-mark underline underline-offset-4"
        >
          {hint ? d.exercises.hideHint : d.exercises.showHint}
        </button>
        <button
          type="button"
          onClick={() => setSol((v) => !v)}
          className="text-graphite underline underline-offset-4 hover:text-ink"
        >
          {sol ? d.exercises.hideSolution : d.exercises.showSolution}
        </button>
      </div>

      {hint ? (
        <div className="mt-3 max-w-reading border-l-[3px] border-highlight bg-white px-4 py-3 text-[15px] leading-relaxed">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-graphite">
            {d.exercises.hint}
          </p>
          {ex.hint[locale]}
        </div>
      ) : null}

      {sol ? (
        <div className="mt-3 max-w-reading border-l-[3px] border-solve bg-white px-4 py-3 text-[15px] leading-relaxed">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-graphite">
            {d.exercises.solution}
          </p>
          {ex.solution[locale]}
        </div>
      ) : null}
    </article>
  );
}

export default function ExerciseList({
  locale,
  exercises,
  showFilters = true,
}: {
  locale: Locale;
  exercises: Exercise[];
  showFilters?: boolean;
}) {
  const d = getDictionary(locale);
  const [topic, setTopic] = useState<string>('all');
  const [diff, setDiff] = useState<string>('all');

  const topics = useMemo(
    () => Array.from(new Set(exercises.map((e) => e.topic))).sort(),
    [exercises],
  );

  const shown = useMemo(
    () =>
      exercises
        .filter((e) => (topic === 'all' ? true : e.topic === topic))
        .filter((e) => (diff === 'all' ? true : e.difficulty === diff))
        .sort(
          (a, b) =>
            DIFF_ORDER.indexOf(a.difficulty) - DIFF_ORDER.indexOf(b.difficulty) ||
            a.id.localeCompare(b.id),
        ),
    [exercises, topic, diff],
  );

  return (
    <div>
      {showFilters ? (
        <div className="mb-6 flex flex-wrap items-center gap-4 border-y border-grid py-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-graphite">
              {d.exercises.topic}
            </span>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded border border-grid bg-white px-2 py-1"
            >
              <option value="all">{d.exercises.all}</option>
              {topics.map((t) => (
                <option key={t} value={t}>
                  {topicLabel(t, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-graphite">
              {d.exercises.difficulty}
            </span>
            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="rounded border border-grid bg-white px-2 py-1"
            >
              <option value="all">{d.exercises.all}</option>
              <option value="easy">{d.exercises.easy}</option>
              <option value="medium">{d.exercises.medium}</option>
              <option value="hard">{d.exercises.hard}</option>
            </select>
          </label>

          <span className="ml-auto font-mono text-xs text-graphite">
            {shown.length} {d.exercises.count}
          </span>
        </div>
      ) : null}

      {shown.length === 0 ? (
        <p className="py-8 text-graphite">{d.exercises.empty}</p>
      ) : (
        shown.map((ex) => <Card key={ex.id} ex={ex} locale={locale} />)
      )}
    </div>
  );
}
