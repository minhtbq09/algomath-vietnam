import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { CHAPTERS, LESSONS, type LessonMeta } from '@/lib/curriculum';

/**
 * Sơ đồ cầu nối: cột trái là ý tưởng Toán học sinh đã có,
 * cột phải là thuật toán mà ý tưởng đó dẫn tới.
 *
 * Đây là luận điểm của cả dự án, nên nó được trình bày như một
 * bảng đối chiếu chứ không phải một danh sách bài học thông thường.
 */
export default function BridgeMap({
  locale,
  lessons = LESSONS,
  grouped = true,
}: {
  locale: Locale;
  lessons?: LessonMeta[];
  grouped?: boolean;
}) {
  const vi = locale === 'vi';

  const row = (l: LessonMeta) => (
    <Link
      key={l.slug}
      href={`/${locale}/lessons/${l.slug}/`}
      className="group grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-grid py-3.5 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mark sm:gap-5"
    >
      <span className="text-right text-[15px] leading-snug text-graphite transition group-hover:text-ink">
        {l.mathIdea[locale]}
      </span>

      <span
        aria-hidden
        className="flex w-10 items-center justify-center font-mono text-xs text-grid transition group-hover:text-mark sm:w-16"
      >
        <span className="h-px flex-1 bg-current" />
        <span className="-ml-px">▸</span>
      </span>

      <span className="text-[15px] font-medium leading-snug transition group-hover:text-mark">
        {l.algorithm[locale]}
        <span className="ml-2 font-mono text-[11px] text-graphite">
          {vi ? 'bài' : 'lesson'} {l.number}
        </span>
      </span>
    </Link>
  );

  if (!grouped) {
    return <div>{lessons.map(row)}</div>;
  }

  return (
    <div>
      {CHAPTERS.map((ch) => {
        const items = lessons.filter((l) => l.chapter === ch.number);
        if (items.length === 0) return null;
        return (
          <section key={ch.number} className="mb-10">
            <h3 className="mb-1 flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mark">
                {vi ? 'Chương' : 'Chapter'} {ch.number}
              </span>
              <span className="font-display text-lg font-semibold">{ch.title[locale]}</span>
            </h3>
            {items.map(row)}
          </section>
        );
      })}
    </div>
  );
}
