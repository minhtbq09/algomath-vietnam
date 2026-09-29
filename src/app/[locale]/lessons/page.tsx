import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { CHAPTERS, LESSONS } from '@/lib/curriculum';
import { lessonExists } from '@/lib/content';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LessonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.lessons.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {d.lessons.lead}
      </p>

      <div className="mt-12 space-y-12">
        {CHAPTERS.map((ch) => (
          <section key={ch.number}>
            <h2 className="flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                {d.lessons.chapter} {ch.number}
              </span>
              <span className="font-display text-lg font-semibold">{ch.title[locale]}</span>
            </h2>

            <ul>
              {LESSONS.filter((l) => l.chapter === ch.number).map((l) => {
                const ready = lessonExists(l.slug);
                return (
                  <li key={l.slug} className="border-b border-grid">
                    <Link
                      href={`/${locale}/lessons/${l.slug}/`}
                      className="flex items-baseline gap-4 py-3.5 transition hover:bg-white"
                    >
                      <span className="w-7 shrink-0 font-mono text-sm text-graphite">
                        {String(l.number).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span className="text-[16px] font-medium">{l.title[locale]}</span>
                        <span className="ml-2 text-[13px] text-graphite">
                          {l.mathIdea[locale]} → {l.algorithm[locale]}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-graphite">
                        {ready ? `${l.minutes} ${d.lessons.minutes}` : d.common.comingSoon}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
