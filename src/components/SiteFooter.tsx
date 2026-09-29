import type { Locale } from '@/algorithms/types';
import { getDictionary } from '@/i18n/dictionary';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <footer className="mt-24 border-t border-grid bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-4 px-5 py-8 text-sm text-graphite">
        <p className="font-display text-ink">{d.brand}</p>
        <p>{d.footer.free}</p>
        <p className="font-mono text-xs">{d.footer.rights}</p>
      </div>
    </footer>
  );
}
