import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { VIZ_REGISTRY } from '@/components/viz';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function VizIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.viz.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">{d.viz.lead}</p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {VIZ_REGISTRY.map((v) => (
          <li key={v.slug}>
            <Link
              href={`/${locale}/visualizations/${v.slug}/`}
              className="block h-full rounded border border-grid bg-white p-5 transition hover:border-ink"
            >
              <p className="font-display text-lg font-semibold">{v.title[locale]}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-graphite">{v.goal[locale]}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-mark">
                {locale === 'vi' ? 'Chạy thử →' : 'Run it →'}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
