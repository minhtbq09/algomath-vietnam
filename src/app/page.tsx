import Link from 'next/link';
import { withBase } from '@/lib/paths';

/**
 * Trang gốc "/" chỉ có nhiệm vụ đưa người dùng sang ngôn ngữ mặc định.
 * Dùng thẻ meta refresh thay vì redirect() vì site xuất ra HTML tĩnh,
 * không có server để chạy redirect lúc người dùng truy cập.
 */
export default function RootPage() {
  const target = withBase('/vi/');
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <main className="mx-auto max-w-reading px-6 py-24 text-center">
        <p className="text-graphite">
          Đang chuyển tới AlgoMath Vietnam.{' '}
          <Link className="text-mark underline" href="/vi/">
            Bấm vào đây nếu trang không tự chuyển
          </Link>
          .
        </p>
      </main>
    </>
  );
}
