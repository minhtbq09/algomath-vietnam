import type { Frame, VizDefinition } from './types';

export interface FastPowInput {
  a: number;
  n: number;
  m: number;
}

export interface FastPowRow {
  remaining: number;
  bit: 0 | 1;
  base: number;
  result: number;
  used: boolean;
}

export interface FastPowState {
  a: number;
  n: number;
  m: number;
  /** Bit của số mũ, bit cao ở đầu, để hiển thị dạng nhị phân. */
  bits: number[];
  /** Bit đang được xử lý, đếm từ bit thấp. */
  bitIndex: number;
  rows: FastPowRow[];
  result: number;
  base: number;
  finished: boolean;
  /** Số phép nhân đã dùng, để so với cách nhân n lần. */
  mults: number;
}

function buildFastPow(input: FastPowInput): Frame<FastPowState>[] {
  const { a, n, m } = input;
  const bits = n.toString(2).split('').map(Number);
  const frames: Frame<FastPowState>[] = [];
  const rows: FastPowRow[] = [];

  let result = 1;
  let base = a % m;
  let remaining = n;
  let bitIndex = 0;
  let mults = 0;

  const push = (explain: { vi: string; en: string }, line: number, finished = false) => {
    frames.push({
      state: {
        a,
        n,
        m,
        bits,
        bitIndex,
        rows: rows.map((r) => ({ ...r })),
        result,
        base,
        finished,
        mults,
      },
      explain,
      line,
    });
  };

  push({
    vi: `Tính ${a}^${n} mod ${m}. Số mũ ${n} viết trong hệ nhị phân là ${bits.join('')}. Ý tưởng: ${a}^${n} bằng tích của các ${a}^(luỹ thừa của 2) ứng với các bit bằng 1.`,
    en: `Computing ${a}^${n} mod ${m}. The exponent ${n} in binary is ${bits.join('')}. The idea: ${a}^${n} is the product of the ${a}^(powers of two) picked out by the 1 bits.`,
  }, 0);

  let guard = 0;
  while (remaining > 0 && guard < 80) {
    guard += 1;
    const bit = (remaining % 2) as 0 | 1;
    const power = Math.pow(2, bitIndex);

    if (bit === 1) {
      const before = result;
      result = (result * base) % m;
      mults += 1;
      rows.push({ remaining, bit, base, result, used: true });
      push({
        vi: `Bit thứ ${bitIndex} bằng 1, nghĩa là ${a}^${power} có mặt trong tích. Nhân cơ số hiện tại ${base} vào kết quả: ${before} × ${base} = ${before * base}, lấy dư ${m} còn ${result}.`,
        en: `Bit ${bitIndex} is 1, so ${a}^${power} belongs in the product. Multiply the current base ${base} into the result: ${before} × ${base} = ${before * base}, which is ${result} modulo ${m}.`,
      }, 3);
    } else {
      rows.push({ remaining, bit, base, result, used: false });
      push({
        vi: `Bit thứ ${bitIndex} bằng 0, nghĩa là ${a}^${power} không có mặt trong tích. Bỏ qua, kết quả giữ nguyên ${result}.`,
        en: `Bit ${bitIndex} is 0, so ${a}^${power} is not in the product. Skip it and leave the result at ${result}.`,
      }, 3);
    }

    remaining = Math.floor(remaining / 2);

    if (remaining > 0) {
      const before = base;
      base = (base * base) % m;
      mults += 1;
      bitIndex += 1;
      push({
        vi: `Bình phương cơ số để nó ứng với bit tiếp theo: ${before} × ${before} = ${before * before}, lấy dư ${m} còn ${base}. Đây chính là ${a}^${Math.pow(2, bitIndex)} mod ${m}. Một phép nhân duy nhất nhảy được cả một bậc luỹ thừa.`,
        en: `Square the base so it matches the next bit: ${before} × ${before} = ${before * before}, which is ${base} modulo ${m}. That is ${a}^${Math.pow(2, bitIndex)} mod ${m}. One multiplication jumps a whole power level.`,
      }, 4);
    }
  }

  push({
    vi: `Số mũ đã về 0, kết quả là ${result}. Toàn bộ mất ${mults} phép nhân, thay vì ${n} phép nếu nhân lần lượt. Với số mũ 600 chữ số, khác biệt này là ranh giới giữa vài mili giây và lâu hơn tuổi vũ trụ.`,
    en: `The exponent has reached 0 and the answer is ${result}. It took ${mults} multiplications instead of ${n}. For a 600-digit exponent, that gap is the difference between milliseconds and longer than the age of the universe.`,
  }, 5, true);

  return frames;
}

export const fastPowViz: VizDefinition<FastPowState, FastPowInput> = {
  slug: 'fast-pow',
  title: { vi: 'Lũy thừa nhanh theo modulo', en: 'Fast modular exponentiation' },
  goal: {
    vi: 'Theo dõi số mũ được đọc theo từng bit nhị phân, và đếm số phép nhân thật sự cần dùng.',
    en: 'Follow the exponent being read bit by bit, and count the multiplications actually needed.',
  },
  defaultInput: { a: 3, n: 13, m: 100 },
  build: buildFastPow,
  pseudocode: [
    { vi: 'kq ← 1;  co_so ← a mod m', en: 'result ← 1;  base ← a mod m' },
    { vi: 'trong khi n > 0:', en: 'while n > 0:' },
    { vi: '', en: '' },
    { vi: '    nếu n lẻ: kq ← kq · co_so mod m', en: '    if n is odd: result ← result · base mod m' },
    { vi: '    co_so ← co_so² mod m;  n ← n / 2', en: '    base ← base² mod m;  n ← n / 2' },
    { vi: 'trả về kq', en: 'return result' },
  ],
};
