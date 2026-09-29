import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import BridgeMap from '@/components/BridgeMap';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const vi = locale === 'vi';

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mark">
        {vi ? 'Lộ trình 20 bài' : '20-lesson roadmap'}
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold">{d.home.bridgeTitle}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {d.home.bridgeNote}
      </p>

      <div className="mt-12">
        <BridgeMap locale={locale} />
      </div>
    </main>
  );
}
