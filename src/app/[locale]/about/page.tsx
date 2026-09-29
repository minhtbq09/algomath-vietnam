import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface Person {
  name: string;
  role: Record<Locale, string>;
  detail: Record<Locale, string>;
}

interface About {
  intro: Record<Locale, string>;
  team: Person[];
  advisors: Person[];
  repoUrl: string;
  contactEmail: string;
  toolingNote: Record<Locale, string>;
}

function readAbout(): About {
  const file = path.join(process.cwd(), 'content', 'about.json');
  return JSON.parse(fs.readFileSync(file, 'utf8')) as About;
}

function PersonList({ people, locale }: { people: Person[]; locale: Locale }) {
  return (
    <ul className="mt-4">
      {people.map((p) => (
        <li key={p.name} className="border-b border-grid py-4">
          <p className="font-display text-[17px] font-semibold">{p.name}</p>
          <p className="font-mono text-[11px] uppercase tracking-wide text-mark">
            {p.role[locale]}
          </p>
          <p className="mt-1.5 max-w-reading text-[15px] leading-relaxed text-graphite">
            {p.detail[locale]}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const about = readAbout();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.about.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {about.intro[locale]}
      </p>

      <section className="mt-12">
        <h2 className="border-b-2 border-ink pb-2 font-display text-xl font-bold">{d.about.team}</h2>
        <PersonList people={about.team} locale={locale} />
      </section>

      <section className="mt-12">
        <h2 className="border-b-2 border-ink pb-2 font-display text-xl font-bold">
          {d.about.advisors}
        </h2>
        <PersonList people={about.advisors} locale={locale} />
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded border border-grid bg-white p-5">
          <h3 className="font-mono text-[11px] uppercase tracking-wide text-graphite">
            {d.about.source}
          </h3>
          <a href={about.repoUrl} className="mt-2 block text-mark underline underline-offset-4">
            {about.repoUrl}
          </a>
        </div>
        <div className="rounded border border-grid bg-white p-5">
          <h3 className="font-mono text-[11px] uppercase tracking-wide text-graphite">
            {d.about.contact}
          </h3>
          <a
            href={`mailto:${about.contactEmail}`}
            className="mt-2 block text-mark underline underline-offset-4"
          >
            {about.contactEmail}
          </a>
        </div>
      </section>

      <p className="mt-10 max-w-reading border-l-[3px] border-grid pl-4 text-[14px] leading-relaxed text-graphite">
        {about.toolingNote[locale]}
      </p>
    </main>
  );
}
