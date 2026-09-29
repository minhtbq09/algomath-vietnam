import type { CellState, Frame, VizDefinition } from './types';

export interface SieveInput {
  n: number;
}

export interface SieveState {
  n: number;
  cells: CellState[];
  /** Số nguyên tố đang được dùng để gạch bội. null khi chưa bắt đầu. */
  prime: number | null;
  /** Số đang bị gạch ở bước này. */
  striking: number | null;
  primes: number[];
  finished: boolean;
}

function buildSieve(input: SieveInput): Frame<SieveState>[] {
  const n = input.n;
  // isComposite[k] = true nghĩa là k đã bị gạch
  const isComposite = new Array(n + 1).fill(false);
  const frames: Frame<SieveState>[] = [];
  const primes: number[] = [];

  const paint = (prime: number | null, striking: number | null): CellState[] => {
    const cells: CellState[] = [];
    for (let k = 0; k <= n; k += 1) {
      if (k < 2) cells.push('excluded');
      else if (k === striking) cells.push('active');
      else if (k === prime) cells.push('result');
      else if (isComposite[k]) cells.push('excluded');
      else if (primes.includes(k)) cells.push('done');
      else cells.push('idle');
    }
    return cells;
  };

  frames.push({
    state: { n, cells: paint(null, null), prime: null, striking: null, primes: [], finished: false },
    explain: {
      vi: `Viết ra mọi số từ 2 đến ${n}. Ban đầu chưa biết số nào là nguyên tố, chỉ biết 0 và 1 thì không phải.`,
      en: `Write every number from 2 to ${n}. At the start nothing is known except that 0 and 1 are not prime.`,
    },
    line: 0,
  });

  const limit = Math.floor(Math.sqrt(n));

  for (let p = 2; p <= n; p += 1) {
    if (isComposite[p]) continue;
    primes.push(p);

    if (p > limit) {
      // Không cần gạch nữa: mọi số còn lại chắc chắn là nguyên tố
      frames.push({
        state: { n, cells: paint(p, null), prime: p, striking: null, primes: [...primes], finished: false },
        explain: {
          vi: `${p} chưa bị gạch nên nó là số nguyên tố. Vì ${p} lớn hơn căn bậc hai của ${n}, bội nhỏ nhất còn lại của nó là ${p}×${p} = ${p * p}, đã vượt quá ${n}. Không còn gì để gạch.`,
          en: `${p} was never struck, so it is prime. Since ${p} exceeds the square root of ${n}, its smallest remaining multiple is ${p}×${p} = ${p * p}, already beyond ${n}. Nothing left to strike.`,
        },
        line: 4,
      });
      continue;
    }

    frames.push({
      state: { n, cells: paint(p, null), prime: p, striking: null, primes: [...primes], finished: false },
      explain: {
        vi: `${p} chưa bị gạch, nên không có số nào nhỏ hơn chia hết nó. Vậy ${p} là số nguyên tố. Bây giờ gạch mọi bội của ${p}.`,
        en: `${p} has not been struck, so no smaller number divides it. Therefore ${p} is prime. Now strike every multiple of ${p}.`,
      },
      line: 2,
    });

    // Bắt đầu từ p*p, không phải 2p: mọi bội nhỏ hơn đã bị gạch bởi thừa số nhỏ hơn
    for (let k = p * p; k <= n; k += p) {
      if (isComposite[k]) continue;
      isComposite[k] = true;
      frames.push({
        state: { n, cells: paint(p, k), prime: p, striking: k, primes: [...primes], finished: false },
        explain: {
          vi: `Gạch ${k} vì ${k} = ${p} × ${k / p}. Chú ý vòng gạch bắt đầu từ ${p}×${p} chứ không phải 2×${p}: mọi bội nhỏ hơn đã bị gạch bởi một thừa số nguyên tố nhỏ hơn ${p} rồi.`,
          en: `Strike ${k} because ${k} = ${p} × ${k / p}. Note the striking starts at ${p}×${p}, not 2×${p}: every smaller multiple was already struck by a prime factor below ${p}.`,
        },
        line: 3,
      });
    }
  }

  frames.push({
    state: { n, cells: paint(null, null), prime: null, striking: null, primes: [...primes], finished: true },
    explain: {
      vi: `Xong. Có ${primes.length} số nguyên tố không vượt quá ${n}. Mỗi hợp số đã bị gạch đúng bởi thừa số nguyên tố nhỏ nhất của nó.`,
      en: `Done. There are ${primes.length} primes up to ${n}. Every composite was struck by its smallest prime factor.`,
    },
    line: 5,
  });

  return frames;
}

export const sieveViz: VizDefinition<SieveState, SieveInput> = {
  slug: 'sieve',
  title: { vi: 'Sàng Eratosthenes', en: 'Sieve of Eratosthenes' },
  goal: {
    vi: 'Thấy vì sao chỉ cần gạch tới căn bậc hai, và vì sao vòng gạch bắt đầu từ p bình phương.',
    en: 'See why striking stops at the square root, and why each pass starts at p squared.',
  },
  defaultInput: { n: 60 },
  build: buildSieve,
  pseudocode: [
    { vi: 'đánh dấu mọi số từ 2 đến n là "chưa gạch"', en: 'mark every number from 2 to n as unstruck' },
    { vi: 'với p từ 2 đến √n:', en: 'for p from 2 to √n:' },
    { vi: '    nếu p chưa bị gạch thì p là nguyên tố', en: '    if p is unstruck then p is prime' },
    { vi: '        gạch p·p, p·p+p, p·p+2p, ... ≤ n', en: '        strike p·p, p·p+p, p·p+2p, ... ≤ n' },
    { vi: 'mọi số chưa bị gạch đều là nguyên tố', en: 'every unstruck number is prime' },
    { vi: 'trả về danh sách số nguyên tố', en: 'return the list of primes' },
  ],
};
