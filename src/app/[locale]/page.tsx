import Link from 'next/link';
import type { Locale } from '@/algorithms/types';
import { asLocale, getDictionary, LOCALES } from '@/i18n/dictionary';
import { LESSONS } from '@/lib/curriculum';
import BridgeMap from '@/components/BridgeMap';
import BinarySearchViz from '@/components/viz/BinarySearchViz';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const ANATOMY = [
  {
    vi: ['Bài toán mở đầu', 'Một câu hỏi Toán bạn đã từng gặp ở lớp.'],
    en: ['Opening problem', 'A maths question you have already met in class.'],
  },
  {
    vi: ['Ý tưởng Toán', 'Quy nạp, bất biến, chia trường hợp hay cấu trúc tổ hợp.'],
    en: ['The mathematical idea', 'Induction, invariants, casework or combinatorial structure.'],
  },
  {
    vi: ['Chuyển thành thuật toán', 'Dữ liệu cần lưu, các bước xử lý, điều kiện dừng.'],
    en: ['Turn it into an algorithm', 'What to store, which steps to run, when to stop.'],
  },
  {
    vi: ['Mô phỏng', 'Chạy từng bước, lùi lại được, luôn có lời giải thích.'],
    en: ['Simulation', 'Step forward, step back, always with an explanation.'],
  },
  {
    vi: ['Pseudocode và Python', 'Code ngắn, ưu tiên dễ đọc hơn là ngắn gọn.'],
    en: ['Pseudocode and Python', 'Short code, written to be read rather than to be clever.'],
  },
  {
    vi: ['Bài tập', 'Một bài cơ bản, một bài trung bình, một bài thử thách.'],
    en: ['Exercises', 'One basic, one medium, one challenge.'],
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const d = getDictionary(locale);
  const vi = locale === 'vi';

  const preview = LESSONS.filter((l) =>
    ['05-thuat-toan-euclid', '10-bfs-va-khoang-cach', '13-de-quy-tu-quy-nap', '16-tim-kiem-nhi-phan', '19-quy-hoach-dong'].includes(l.slug),
  );

  return (
    <main>
      {/* Hero: luận điểm của dự án, không phải một khẩu hiệu chung chung */}
      <section className="border-b border-grid bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mark">
            {d.home.eyebrow}
          </p>

          <h1 className="mt-5 max-w-4xl font-display text-[2rem] font-bold leading-[1.15] tracking-tight sm:text-[3.1rem]">
            {vi ? (
              <>
                Bạn không bắt đầu bằng{' '}
                <span className="text-graphite line-through decoration-mark decoration-2">
                  cú pháp lập trình
                </span>
                .<br />
                Bạn bắt đầu bằng một ý tưởng Toán đã quen.
              </>
            ) : (
              <>
                You do not start with{' '}
                <span className="text-graphite line-through decoration-mark decoration-2">
                  programming syntax
                </span>
                .<br />
                You start with a maths idea you already know.
              </>
            )}
          </h1>

          <p className="mt-6 max-w-reading text-[17px] leading-relaxed text-graphite">
            {d.home.heroLead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/lessons/01-thuat-toan-la-gi/`}
              className="rounded border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/85"
            >
              {d.home.cta}
            </Link>
            <Link
              href={`/${locale}/map/`}
              className="rounded border border-grid bg-white px-5 py-2.5 text-sm transition hover:border-ink"
            >
              {d.home.ctaAlt}
            </Link>
          </div>
        </div>
      </section>

      {/* Bằng chứng ngay lập tức: một thuật toán chạy được, không phải ảnh chụp */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
          <div>
            <h2 className="font-display text-xl font-bold">
              {vi ? 'Thử ngay một thuật toán' : 'Try an algorithm right now'}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-graphite">
              {vi
                ? 'Đây là tìm kiếm nhị phân. Ý tưởng Toán đằng sau nó là thu hẹp một nửa không gian nghiệm, thứ bạn vẫn làm khi giải bất phương trình bằng cách chặn khoảng. Bấm Bước sau và đọc dòng giải thích ở dưới.'
                : 'This is binary search. The idea behind it is halving the solution space, which is what you already do when you bracket an interval. Press Next step and read the explanation underneath.'}
            </p>
          </div>
          <BinarySearchViz locale={locale} />
        </div>
      </section>

      {/* Sơ đồ cầu nối, phần chữ ký của dự án */}
      <section className="border-y border-grid bg-white/60">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-display text-2xl font-bold">{d.home.bridgeTitle}</h2>
          <p className="mt-3 max-w-reading text-[15px] leading-relaxed text-graphite">
            {d.home.bridgeNote}
          </p>

          <div className="mt-9">
            <div className="mb-2 grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-5">
              <span className="text-right font-mono text-[10px] uppercase tracking-[0.16em] text-graphite">
                {vi ? 'Bạn đã có' : 'What you have'}
              </span>
              <span className="w-10 sm:w-16" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-graphite">
                {vi ? 'Nó dẫn tới' : 'Where it leads'}
              </span>
            </div>
            <BridgeMap locale={locale} lessons={preview} grouped={false} />
          </div>

          <Link
            href={`/${locale}/map/`}
            className="mt-7 inline-block font-mono text-xs text-mark underline underline-offset-4"
          >
            {vi ? 'Xem đủ 20 cặp →' : 'See all 20 pairs →'}
          </Link>
        </div>
      </section>

      {/* Cấu trúc bài học: đánh số vì đây thật sự là một trình tự */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-display text-2xl font-bold">{d.home.whyTitle}</h2>
        <p className="mt-3 max-w-reading text-[15px] leading-relaxed text-graphite">
          {vi
            ? 'Cả 20 bài đều đi theo đúng sáu bước dưới đây. Bạn luôn biết mình đang ở đâu trong bài, và không bao giờ gặp code trước khi hiểu vì sao nó được viết ra.'
            : 'All 20 lessons follow the same six steps. You always know where you are, and you never meet code before you understand why it exists.'}
        </p>

        <ol className="margin-rule mt-9 space-y-6 pl-6">
          {ANATOMY.map((step, i) => {
            const [title, body] = vi ? step.vi : step.en;
            return (
              <li key={i} className="grid grid-cols-[2.2rem_1fr] items-baseline gap-3">
                <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="font-display text-[17px] font-semibold">{title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-graphite">{body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
