import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { allExercises } from '@/lib/content';
import ExerciseList from '@/components/ExerciseList';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function ExercisesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);

  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-display text-3xl font-bold">{d.exercises.title}</h1>
      <p className="mt-4 max-w-reading text-[16px] leading-relaxed text-graphite">
        {d.exercises.lead}
      </p>
      <div className="mt-10">
        <ExerciseList locale={locale} exercises={allExercises()} />
      </div>
    </main>
  );
}
