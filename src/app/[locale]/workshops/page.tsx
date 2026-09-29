import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { allWorkshops } from '@/lib/content';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function WorkshopsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const workshops = allWorkshops();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.workshops.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {d.workshops.lead}
      </p>

      <div className="mt-12 space-y-10">
        {workshops.map((w) => (
          <article key={w.id} className="rounded border border-grid bg-white p-6">
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                {w.id}
              </span>
              <span className="rounded border border-grid px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-graphite">
                {d.workshops.status[w.status]}
              </span>
              <span className="font-mono text-[11px] text-graphite">{w.date}</span>
            </div>

            <h2 className="mt-3 font-display text-xl font-bold">{w.title[locale]}</h2>
            <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-graphite">
              {w.summary[locale]}
            </p>

            <h3 className="mt-6 font-mono text-[11px] uppercase tracking-wide text-graphite">
              {d.workshops.agenda}
            </h3>
            <ul className="mt-2">
              {w.agenda.map((a, i) => (
                <li key={i} className="flex gap-4 border-b border-grid py-2 text-[15px]">
                  <span className="w-16 shrink-0 font-mono text-[13px] text-mark">
                    {a.minutes}&#39;
                  </span>
                  <span>{a.item[locale]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {w.registerUrl ? (
                <a
                  href={w.registerUrl}
                  className="rounded border border-ink bg-ink px-4 py-2 text-white transition hover:bg-ink/85"
                >
                  {locale === 'vi' ? 'Đăng ký tham gia' : 'Register'}
                </a>
              ) : null}
              {w.materialsUrl ? (
                <a
                  href={w.materialsUrl}
                  className="rounded border border-grid px-4 py-2 transition hover:border-ink"
                >
                  {d.workshops.materials}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
