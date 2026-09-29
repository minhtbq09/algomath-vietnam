import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { getDictionary } from '@/i18n/dictionary';

export default function SiteHeader({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const other: Locale = locale === 'vi' ? 'en' : 'vi';

  const links = [
    { href: `/${locale}/map/`, label: d.nav.map },
    { href: `/${locale}/lessons/`, label: d.nav.lessons },
    { href: `/${locale}/visualizations/`, label: d.nav.viz },
    { href: `/${locale}/exercises/`, label: d.nav.exercises },
    { href: `/${locale}/workshops/`, label: d.nav.workshops },
    { href: `/${locale}/impact/`, label: d.nav.impact },
    { href: `/${locale}/about/`, label: d.nav.about },
  ];

  return (
    <header className="border-b border-grid bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href={`/${locale}/`} className="group flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight">
            Algo<span className="text-mark">Math</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-graphite">
            Vietnam
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-graphite transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href={`/${other}/`}
          className="ml-auto rounded border border-grid px-2.5 py-1 font-mono text-xs text-graphite transition hover:border-ink hover:text-ink"
        >
          {d.common.switchLang}
        </Link>
      </div>
    </header>
  );
}
