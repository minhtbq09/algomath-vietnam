/**
 * Đường dẫn gốc, đọc từ biến môi trường lúc build.
 *
 * Next tự thêm basePath cho component <Link>, nhưng KHÔNG tự thêm cho
 * thẻ <a> thường và các URL viết tay trong file MDX. Những chỗ đó phải
 * gọi withBase() thủ công.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBase(href: string): string {
  // Chỉ xử lý đường dẫn nội bộ bắt đầu bằng /, bỏ qua http, mailto, neo #
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  if (BASE_PATH && href.startsWith(BASE_PATH + '/')) return href;
  return BASE_PATH + href;
}
