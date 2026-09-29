import type { Frame, VizDefinition } from './types';

export interface EuclidInput {
  a: number;
  b: number;
}

export interface EuclidRow {
  a: number;
  b: number;
  q: number;
  r: number;
}

export interface EuclidState {
  a: number;
  b: number;
  rows: EuclidRow[];
  /** Chỉ số dòng đang được tạo ra ở bước này. -1 nghĩa là chưa bắt đầu. */
  cursor: number;
  gcd: number | null;
}

function buildEuclid(input: EuclidInput): Frame<EuclidState>[] {
  let a = Math.max(Math.abs(input.a), Math.abs(input.b));
  let b = Math.min(Math.abs(input.a), Math.abs(input.b));
  const frames: Frame<EuclidState>[] = [];
  const rows: EuclidRow[] = [];

  frames.push({
    state: { a, b, rows: [], cursor: -1, gcd: null },
    explain: {
      vi: `Bắt đầu với hai số ${a} và ${b}. Ý tưởng: ước chung của ${a} và ${b} cũng là ước chung của ${b} và phần dư khi chia ${a} cho ${b}.`,
      en: `Start with ${a} and ${b}. Key idea: any common divisor of ${a} and ${b} also divides ${b} and the remainder of ${a} divided by ${b}.`,
    },
    line: 0,
  });

  let guard = 0;
  while (b !== 0 && guard < 200) {
    guard += 1;
    const q = Math.floor(a / b);
    const r = a % b;
    rows.push({ a, b, q, r });

    frames.push({
      state: { a, b, rows: rows.map((x) => ({ ...x })), cursor: rows.length - 1, gcd: null },
      explain: {
        vi: `${a} = ${b} × ${q} + ${r}. Phần dư là ${r}, nên bài toán thu về tìm ƯCLN của ${b} và ${r}.`,
        en: `${a} = ${b} × ${q} + ${r}. The remainder is ${r}, so the problem reduces to gcd(${b}, ${r}).`,
      },
      line: 2,
    });

    a = b;
    b = r;
  }

  frames.push({
    state: { a, b: 0, rows: rows.map((x) => ({ ...x })), cursor: rows.length - 1, gcd: a },
    explain: {
      vi: `Phần dư đã bằng 0. Số bị chia cuối cùng là ${a}, đó chính là ƯCLN.`,
      en: `The remainder is now 0. The last dividend is ${a}, which is the gcd.`,
    },
    line: 4,
  });

  return frames;
}

export const euclidViz: VizDefinition<EuclidState, EuclidInput> = {
  slug: 'euclid',
  title: { vi: 'Thuật toán Euclid', en: 'Euclidean Algorithm' },
  goal: {
    vi: 'Nhìn từng phép chia có dư thu nhỏ bài toán tìm ước chung lớn nhất như thế nào.',
    en: 'Watch each division with remainder shrink the problem of finding the greatest common divisor.',
  },
  defaultInput: { a: 252, b: 105 },
  build: buildEuclid,
  pseudocode: [
    { vi: 'nhập a, b', en: 'read a, b' },
    { vi: 'trong khi b ≠ 0:', en: 'while b ≠ 0:' },
    { vi: '    r ← a mod b', en: '    r ← a mod b' },
    { vi: '    a ← b;  b ← r', en: '    a ← b;  b ← r' },
    { vi: 'trả về a', en: 'return a' },
  ],
};
