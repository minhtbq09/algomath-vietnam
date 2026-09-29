import type { Locale } from '@/algorithms/types';

/**
 * Nhãn chủ đề bài tập.
 *
 * Trong file JSON, trường `topic` giữ nguyên tên tiếng Việt làm khoá.
 * Bảng này chỉ lo phần hiển thị, nên thêm bài tập mới không cần đụng vào đây
 * trừ khi bạn đặt ra một chủ đề chưa từng có.
 */
const TOPIC_EN: Record<string, string> = {
  'Nền tảng': 'Foundations',
  'Độ phức tạp': 'Complexity',
  'Số học': 'Number theory',
  'Đồ thị': 'Graphs',
  'Tìm kiếm': 'Search',
  'Đệ quy': 'Recursion',
  Greedy: 'Greedy',
  'Quy hoạch động': 'Dynamic programming',
};

/** Trả về nhãn hiển thị. Chủ đề lạ thì giữ nguyên thay vì để trống. */
export function topicLabel(topic: string, locale: Locale): string {
  if (locale === 'vi') return topic;
  return TOPIC_EN[topic] ?? topic;
}
