/**
 * Engine mô phỏng dùng chung.
 *
 * Nguyên tắc: mỗi thuật toán KHÔNG tự chạy tiến trên màn hình.
 * Nó chạy trước một lần và sinh ra một danh sách "frame" bất biến.
 * Mỗi frame là một ảnh chụp trạng thái đầy đủ tại một bước.
 *
 * Nhờ vậy nút Back chỉ là `index - 1`, không cần chạy ngược thuật toán,
 * và cả 10 mô phỏng đều dùng chung một bộ điều khiển.
 */

export type Locale = 'vi' | 'en';

/** Chuỗi song ngữ. Mọi lời giải thích trong frame đều dùng kiểu này. */
export type Bilingual = Record<Locale, string>;

/** Trạng thái hiển thị của một phần tử. Màu sắc khai báo một chỗ duy nhất. */
export type CellState =
  | 'idle' // chưa xét
  | 'active' // đang xét
  | 'frontier' // nằm trong hàng đợi / vùng còn khả năng
  | 'done' // đã xử lý xong
  | 'result' // thuộc kết quả cuối cùng
  | 'excluded'; // đã bị loại

export interface Frame<S> {
  /** Ảnh chụp trạng thái tại bước này. Bất biến, không dùng chung tham chiếu. */
  state: S;
  /** Giải thích ngắn cho đúng bước này, hiển thị dưới mô phỏng. */
  explain: Bilingual;
  /** Dòng pseudocode đang được thực thi, để tô sáng. Tuỳ chọn. */
  line?: number;
}

/**
 * Một thuật toán mô phỏng được = một hàm sinh frame + phần mô tả.
 * Thêm mô phỏng mới chỉ cần viết một object thoả interface này.
 */
export interface VizDefinition<S, I> {
  slug: string;
  title: Bilingual;
  /** Mô tả mục tiêu học tập, hiển thị ở trang danh sách mô phỏng. */
  goal: Bilingual;
  /** Input mặc định khi mở lần đầu. */
  defaultInput: I;
  /** Chạy thuật toán một lần, trả về toàn bộ frame. */
  build: (input: I) => Frame<S>[];
  /** Các dòng pseudocode, để tô sáng theo frame.line. */
  pseudocode: Bilingual[];
}

/** Bảng màu trạng thái. Đổi ở đây là đổi cho cả 10 mô phỏng. */
export const STATE_COLOR: Record<CellState, string> = {
  idle: '#DCE4F0',
  active: '#E24A26',
  frontier: '#F5C518',
  done: '#14224F',
  result: '#0E8F7E',
  excluded: '#EEF1F7',
};

/** Màu chữ tương phản đặt trên nền STATE_COLOR. */
export const STATE_TEXT: Record<CellState, string> = {
  idle: '#14224F',
  active: '#FFFFFF',
  frontier: '#14224F',
  done: '#FFFFFF',
  result: '#FFFFFF',
  excluded: '#9AA3B5',
};
