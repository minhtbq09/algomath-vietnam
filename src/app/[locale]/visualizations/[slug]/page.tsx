import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { VIZ_REGISTRY, getViz } from '@/components/viz';
import { getLesson } from '@/lib/curriculum';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => VIZ_REGISTRY.map((v) => ({ locale, slug: v.slug })));
}

export default async function VizPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const entry = getViz(slug);
  if (!entry) return <main className="p-20">404</main>;

  const lesson = entry.lesson ? getLesson(entry.lesson) : undefined;
  const C = entry.Component;

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${locale}/visualizations/`}
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-graphite hover:text-mark"
      >
        ← {d.viz.title}
      </Link>

      <h1 className="mt-6 font-display text-3xl font-bold">{entry.title[locale]}</h1>
      <p className="mt-3 max-w-reading text-[16px] leading-relaxed text-graphite">
        <span className="font-mono text-[11px] uppercase tracking-wide text-mark">
          {d.viz.goal}:{' '}
        </span>
        {entry.goal[locale]}
      </p>

      <C locale={locale} />

      {lesson ? (
        <Link
          href={`/${locale}/lessons/${lesson.slug}/`}
          className="inline-block rounded border border-grid bg-white px-4 py-2 text-sm transition hover:border-ink"
        >
          {d.viz.openLesson}: {lesson.title[locale]} →
        </Link>
      ) : null}
    </main>
  );
}
