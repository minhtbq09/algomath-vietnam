import type { Bilingual } from '@/algorithms/types';

export interface LessonMeta {
  slug: string;
  number: number;
  chapter: number;
  title: Bilingual;
  /** Ý tưởng Toán bạn đã có. Cột trái của sơ đồ cầu nối. */
  mathIdea: Bilingual;
  /** Thuật toán mà ý tưởng đó dẫn tới. Cột phải. */
  algorithm: Bilingual;
  minutes: number;
  /** Slug mô phỏng đi kèm, nếu có. */
  viz?: string;
}

export interface ChapterMeta {
  number: number;
  title: Bilingual;
}

export const CHAPTERS: ChapterMeta[] = [
  { number: 1, title: { vi: 'Nền tảng tư duy thuật toán', en: 'Foundations of algorithmic thinking' } },
  { number: 2, title: { vi: 'Số học và modular arithmetic', en: 'Number theory and modular arithmetic' } },
  { number: 3, title: { vi: 'Lý thuyết đồ thị', en: 'Graph theory' } },
  { number: 4, title: { vi: 'Đệ quy và tìm kiếm', en: 'Recursion and search' } },
  { number: 5, title: { vi: 'Greedy và quy hoạch động', en: 'Greedy and dynamic programming' } },
];

export const LESSONS: LessonMeta[] = [
  {
    slug: '01-thuat-toan-la-gi', number: 1, chapter: 1, minutes: 12,
    title: { vi: 'Thuật toán là gì?', en: 'What is an algorithm?' },
    mathIdea: { vi: 'Trình bày lời giải thành các bước rõ ràng', en: 'Writing a solution as unambiguous steps' },
    algorithm: { vi: 'Định nghĩa thuật toán và điều kiện dừng', en: 'Definition of an algorithm and termination' },
  },
  {
    slug: '02-logic-va-tinh-dung-dan', number: 2, chapter: 1, minutes: 14,
    title: { vi: 'Logic, chứng minh và tính đúng đắn', en: 'Logic, proof and correctness' },
    mathIdea: { vi: 'Chứng minh một mệnh đề đúng với mọi trường hợp', en: 'Proving a statement for every case' },
    algorithm: { vi: 'Bất biến vòng lặp và chứng minh thuật toán đúng', en: 'Loop invariants and algorithm correctness' },
  },
  {
    slug: '03-do-phuc-tap', number: 3, chapter: 1, minutes: 13,
    title: { vi: 'Độ phức tạp qua cách đếm phép tính', en: 'Complexity by counting operations' },
    mathIdea: { vi: 'Đếm số phép tính, ước lượng bậc tăng', en: 'Counting operations, estimating growth' },
    algorithm: { vi: 'Ký hiệu O lớn', en: 'Big-O notation' },
  },
  {
    slug: '04-phep-chia-co-du', number: 4, chapter: 2, minutes: 12,
    title: { vi: 'Phép chia có dư và đồng dư', en: 'Division with remainder and congruence' },
    mathIdea: { vi: 'Số dư và quan hệ đồng dư', en: 'Remainders and congruence relations' },
    algorithm: { vi: 'Số học modulo trong máy tính', en: 'Modular arithmetic in code' },
  },
  {
    slug: '05-thuat-toan-euclid', number: 5, chapter: 2, minutes: 13, viz: 'euclid',
    title: { vi: 'Thuật toán Euclid tìm ƯCLN', en: 'The Euclidean algorithm' },
    mathIdea: { vi: 'Ước chung không đổi khi thay a bằng a mod b', en: 'Common divisors survive replacing a by a mod b' },
    algorithm: { vi: 'Thuật toán Euclid', en: 'Euclidean algorithm' },
  },
  {
    slug: '06-luy-thua-nhanh', number: 6, chapter: 2, minutes: 14, viz: 'fast-pow',
    title: { vi: 'Lũy thừa nhanh theo modulo', en: 'Fast modular exponentiation' },
    mathIdea: { vi: 'Viết số mũ trong hệ nhị phân', en: 'Writing the exponent in binary' },
    algorithm: { vi: 'Bình phương liên tiếp', en: 'Repeated squaring' },
  },
  {
    slug: '07-sang-eratosthenes', number: 7, chapter: 2, minutes: 12, viz: 'sieve',
    title: { vi: 'Số nguyên tố và sàng Eratosthenes', en: 'Primes and the sieve of Eratosthenes' },
    mathIdea: { vi: 'Mọi hợp số đều có ước nguyên tố nhỏ hơn căn bậc hai của nó', en: 'Every composite has a prime factor below its square root' },
    algorithm: { vi: 'Sàng Eratosthenes', en: 'Sieve of Eratosthenes' },
  },
  {
    slug: '08-tu-quan-he-den-do-thi', number: 8, chapter: 3, minutes: 12,
    title: { vi: 'Từ bài toán quan hệ đến đồ thị', en: 'From relations to graphs' },
    mathIdea: { vi: 'Mô hình hóa quan hệ giữa các đối tượng', en: 'Modelling relations between objects' },
    algorithm: { vi: 'Đỉnh, cạnh và ngôn ngữ đồ thị', en: 'Vertices, edges and graph vocabulary' },
  },
  {
    slug: '09-bieu-dien-graph', number: 9, chapter: 3, minutes: 13,
    title: { vi: 'Biểu diễn đồ thị', en: 'Representing a graph' },
    mathIdea: { vi: 'Ma trận và bảng liệt kê', en: 'Matrices and lists' },
    algorithm: { vi: 'Ma trận kề và danh sách kề', en: 'Adjacency matrix and adjacency list' },
  },
  {
    slug: '10-bfs-va-khoang-cach', number: 10, chapter: 3, minutes: 15, viz: 'bfs',
    title: { vi: 'BFS và khoảng cách theo số bước', en: 'BFS and distance in steps' },
    mathIdea: { vi: 'Chia các đỉnh thành lớp theo khoảng cách', en: 'Splitting vertices into distance layers' },
    algorithm: { vi: 'Duyệt theo chiều rộng bằng hàng đợi', en: 'Breadth-first search with a queue' },
  },
  {
    slug: '11-dfs-va-lien-thong', number: 11, chapter: 3, minutes: 14, viz: 'dfs',
    title: { vi: 'DFS và thành phần liên thông', en: 'DFS and connected components' },
    mathIdea: { vi: 'Quan hệ tương đương và lớp tương đương', en: 'Equivalence relations and classes' },
    algorithm: { vi: 'Duyệt theo chiều sâu', en: 'Depth-first search' },
  },
  {
    slug: '12-duong-di-ngan-nhat', number: 12, chapter: 3, minutes: 16, viz: 'dijkstra',
    title: { vi: 'Đường đi ngắn nhất và Dijkstra', en: 'Shortest paths and Dijkstra' },
    mathIdea: { vi: 'Bất đẳng thức tam giác trên độ dài đường đi', en: 'The triangle inequality on path lengths' },
    algorithm: { vi: 'Thuật toán Dijkstra', en: "Dijkstra's algorithm" },
  },
  {
    slug: '13-de-quy-tu-quy-nap', number: 13, chapter: 4, minutes: 14,
    title: { vi: 'Đệ quy sinh ra từ quy nạp', en: 'Recursion from induction' },
    mathIdea: { vi: 'Quy nạp toán học', en: 'Mathematical induction' },
    algorithm: { vi: 'Hàm đệ quy và trường hợp cơ sở', en: 'Recursive functions and base cases' },
  },
  {
    slug: '14-cay-de-quy', number: 14, chapter: 4, minutes: 13, viz: 'recursion-tree',
    title: { vi: 'Cây đệ quy', en: 'The recursion tree' },
    mathIdea: { vi: 'Đếm số lời gọi theo từng tầng', en: 'Counting calls level by level' },
    algorithm: { vi: 'Phân tích chi phí đệ quy', en: 'Analysing recursive cost' },
  },
  {
    slug: '15-quay-lui', number: 15, chapter: 4, minutes: 15, viz: 'queens',
    title: { vi: 'Quay lui qua tổ hợp và mê cung', en: 'Backtracking through counting and mazes' },
    mathIdea: { vi: 'Liệt kê có hệ thống và cắt nhánh', en: 'Systematic enumeration and pruning' },
    algorithm: { vi: 'Thuật toán quay lui', en: 'Backtracking' },
  },
  {
    slug: '16-tim-kiem-nhi-phan', number: 16, chapter: 4, minutes: 12, viz: 'binary-search',
    title: { vi: 'Tìm kiếm nhị phân', en: 'Binary search' },
    mathIdea: { vi: 'Thu hẹp một nửa không gian nghiệm', en: 'Halving the solution space' },
    algorithm: { vi: 'Tìm kiếm nhị phân', en: 'Binary search' },
  },
  {
    slug: '17-tu-duy-greedy', number: 17, chapter: 5, minutes: 13,
    title: { vi: 'Tư duy tham lam', en: 'Greedy thinking' },
    mathIdea: { vi: 'Chọn tối ưu tại từng bước', en: 'Taking the best option at each step' },
    algorithm: { vi: 'Thuật toán tham lam', en: 'Greedy algorithms' },
  },
  {
    slug: '18-khi-nao-greedy-that-bai', number: 18, chapter: 5, minutes: 14,
    title: { vi: 'Khi nào tham lam thất bại?', en: 'When greedy fails' },
    mathIdea: { vi: 'Phản ví dụ', en: 'Counterexamples' },
    algorithm: { vi: 'Kiểm tra tính đúng của greedy', en: 'Testing a greedy strategy' },
  },
  {
    slug: '19-quy-hoach-dong', number: 19, chapter: 5, minutes: 16, viz: 'dp-grid',
    title: { vi: 'Quy hoạch động và trạng thái', en: 'Dynamic programming and states' },
    mathIdea: { vi: 'Hệ thức truy hồi', en: 'Recurrence relations' },
    algorithm: { vi: 'Quy hoạch động và bảng trạng thái', en: 'Dynamic programming tables' },
  },
  {
    slug: '20-ung-dung-dp', number: 20, chapter: 5, minutes: 16,
    title: { vi: 'Ứng dụng: đường đi, đổi tiền, cái túi', en: 'Applications: paths, coins, knapsack' },
    mathIdea: { vi: 'Tối ưu tổ hợp', en: 'Combinatorial optimisation' },
    algorithm: { vi: 'Bài toán cái túi và đổi tiền', en: 'Knapsack and coin change' },
  },
];

export function getLesson(slug: string): LessonMeta | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function lessonNeighbours(slug: string) {
  const i = LESSONS.findIndex((l) => l.slug === slug);
  return {
    prev: i > 0 ? LESSONS[i - 1] : null,
    next: i >= 0 && i < LESSONS.length - 1 ? LESSONS[i + 1] : null,
  };
}
