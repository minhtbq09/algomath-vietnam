import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { impactMetrics } from '@/lib/content';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function ImpactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const metrics = impactMetrics();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.impact.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {d.impact.lead}
      </p>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-[15px]">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-graphite">
                {locale === 'vi' ? 'Chỉ số' : 'Metric'}
              </th>
              <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-graphite">
                {d.impact.target}
              </th>
              <th className="py-2 pr-4 font-mono text-[11px] uppercase tracking-wide text-graphite">
                {d.impact.actual}
              </th>
              <th className="py-2 font-mono text-[11px] uppercase tracking-wide text-graphite">
                {d.impact.evidence}
              </th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.key} className="border-b border-grid align-top">
                <td className="py-3 pr-4 font-medium">{m.label[locale]}</td>
                <td className="py-3 pr-4 text-graphite">{m.target[locale]}</td>
                <td className="py-3 pr-4">
                  {m.actual ? (
                    <span className="font-mono text-solve">{m.actual[locale]}</span>
                  ) : (
                    <span className="font-mono text-[13px] text-graphite">{d.impact.pending}</span>
                  )}
                </td>
                <td className="py-3 text-[14px] text-graphite">{m.evidence[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-12 border-l-[3px] border-mark bg-white px-5 py-5">
        <h2 className="font-display text-lg font-semibold">{d.impact.methodTitle}</h2>
        <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-graphite">
          {d.impact.methodBody}
        </p>
      </section>
    </main>
  );
}
