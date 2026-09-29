import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { LESSONS, getLesson, lessonNeighbours } from '@/lib/curriculum';
import { loadLesson, exercisesForLesson } from '@/lib/content';
import { Viz } from '@/components/viz';
import ExerciseList from '@/components/ExerciseList';
import { withBase } from '@/lib/paths';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => LESSONS.map((l) => ({ locale, slug: l.slug })));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const meta = getLesson(slug);
  const loaded = loadLesson(slug, locale);
  const { prev, next } = lessonNeighbours(slug);
  const exercises = exercisesForLesson(slug);

  if (!meta) {
    return (
      <main className="mx-auto max-w-reading px-5 py-20">
        <p className="text-graphite">404</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${locale}/lessons/`}
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-graphite hover:text-mark"
      >
        ← {d.lessons.title}
      </Link>

      <header className="mt-6 border-b border-grid pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mark">
          {d.lessons.chapter} {meta.chapter} · {String(meta.number).padStart(2, '0')}
        </p>
        <h1 className="mt-4 font-display text-[2rem] font-bold leading-tight sm:text-4xl">
          {meta.title[locale]}
        </h1>

        {/* Nhắc lại cầu nối ngay đầu bài, vì đó là lý do bài này tồn tại */}
        <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded border border-grid bg-white px-4 py-3 text-[14px]">
          <span className="text-graphite">{meta.mathIdea[locale]}</span>
          <span aria-hidden className="font-mono text-mark">
            ▸
          </span>
          <span className="font-medium">{meta.algorithm[locale]}</span>
        </div>
      </header>

      {loaded ? (
        <>
          {loaded.fellBack ? (
            <p className="mt-6 rounded border border-highlight bg-highlight/15 px-4 py-3 text-[14px]">
              {d.lessons.fallbackNotice}
            </p>
          ) : null}

          <article className="prose-lesson mt-10">
            <MDXRemote
              source={loaded.body}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm, remarkMath],
                  rehypePlugins: [rehypeKatex],
                },
              }}
              components={{
                // Trong file .mdx chỉ cần gõ: <Viz name="bfs" />
                Viz: (props: { name: string }) => <Viz {...props} locale={locale} />,
                // Liên kết viết tay trong MDX là thẻ <a> thường, Next không tự
                // thêm basePath cho chúng, nên phải thêm ở đây.
                a: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
                  <a href={href ? withBase(href) : href} {...rest}>
                    {children}
                  </a>
                ),
                Note: ({ children }: { children?: React.ReactNode }) => (
                  <aside className="my-7 border-l-[3px] border-mark bg-white px-5 py-4 text-[15px] leading-relaxed">
                    {children}
                  </aside>
                ),
              }}
            />
          </article>
        </>
      ) : (
        <div className="mt-12 rounded border border-dashed border-grid bg-white px-6 py-10">
          <p className="font-display text-lg font-semibold">{d.lessons.draft}</p>
          <p className="mt-2 max-w-reading text-[15px] leading-relaxed text-graphite">
            {d.lessons.draftNote}
          </p>
        </div>
      )}

      {exercises.length > 0 ? (
        <section className="mt-16 border-t border-grid pt-10">
          <h2 className="font-display text-xl font-bold">{d.lessons.relatedExercises}</h2>
          <div className="mt-6">
            <ExerciseList locale={locale} exercises={exercises} showFilters={false} />
          </div>
        </section>
      ) : null}

      <nav className="mt-16 flex flex-wrap justify-between gap-4 border-t border-grid pt-6 text-sm">
        {prev ? (
          <Link href={`/${locale}/lessons/${prev.slug}/`} className="text-graphite hover:text-mark">
            ← {d.lessons.prev}: {prev.title[locale]}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/${locale}/lessons/${next.slug}/`}
            className="ml-auto text-right text-graphite hover:text-mark"
          >
            {d.lessons.next}: {next.title[locale]} →
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
