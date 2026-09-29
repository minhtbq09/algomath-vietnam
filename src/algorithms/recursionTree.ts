import type { Frame, VizDefinition } from './types';

export interface RecTreeInput {
  n: number;
  /** Bật bảng ghi nhớ để so sánh hai cây. */
  memo: boolean;
}

export interface RecTreeNode {
  key: string;
  n: number;
  depth: number;
  x: number;
  y: number;
  parent: string | null;
  /** true khi lời gọi này được trả lời ngay từ bảng ghi nhớ. */
  cached: boolean;
  value: number | null;
}

export interface RecTreeState {
  nodes: RecTreeNode[];
  current: string | null;
  calls: number;
  cacheHits: number;
  memo: boolean;
  width: number;
  height: number;
  finished: boolean;
}

const LEVEL_H = 58;

function buildRecTree(input: RecTreeInput): Frame<RecTreeState>[] {
  const { n, memo } = input;
  const nodes: RecTreeNode[] = [];
  const byKey: Record<string, RecTreeNode> = {};
  const frames: Frame<RecTreeState>[] = [];
  const cache: Record<number, number> = {};
  let calls = 0;
  let cacheHits = 0;
  let nextX = 0;

  const push = (current: string | null, explain: { vi: string; en: string }, line: number, finished = false) => {
    const maxDepth = nodes.reduce((m, nd) => Math.max(m, nd.depth), 0);
    frames.push({
      state: {
        nodes: nodes.map((nd) => ({ ...nd })),
        current,
        calls,
        cacheHits,
        memo,
        width: Math.max(nextX * 46 + 40, 320),
        height: (maxDepth + 1) * LEVEL_H + 40,
        finished,
      },
      explain,
      line,
    });
  };

  let counter = 0;

  const visit = (k: number, depth: number, parent: string | null): number => {
    counter += 1;
    const key = `${k}-${counter}`;
    calls += 1;

    const node: RecTreeNode = {
      key,
      n: k,
      depth,
      x: 0,
      y: depth * LEVEL_H + 20,
      parent,
      cached: false,
      value: null,
    };
    nodes.push(node);
    byKey[key] = node;

    if (memo && k in cache) {
      cacheHits += 1;
      node.cached = true;
      node.value = cache[k];
      node.x = nextX * 46 + 20;
      nextX += 1;
      push(key, {
        vi: `Gọi fib(${k}). Giá trị này đã có trong bảng ghi nhớ, trả về ${cache[k]} ngay mà không mở nhánh nào. Toàn bộ cây con lẽ ra phải tính ở đây đã được cắt bỏ.`,
        en: `Call fib(${k}). The value is already in the memo table, so it returns ${cache[k]} at once without opening a branch. The whole subtree that would have grown here is gone.`,
      }, 3);
      return cache[k];
    }

    if (k <= 1) {
      node.value = k;
      node.x = nextX * 46 + 20;
      nextX += 1;
      if (memo) cache[k] = k;
      push(key, {
        vi: `Gọi fib(${k}). Đây là trường hợp cơ sở, trả về ${k} ngay.`,
        en: `Call fib(${k}). This is a base case, returning ${k} immediately.`,
      }, 1);
      return k;
    }

    push(key, {
      vi: `Gọi fib(${k}). Chưa tính được ngay, phải mở hai nhánh con fib(${k - 1}) và fib(${k - 2}).`,
      en: `Call fib(${k}). Not directly computable, so it opens two branches, fib(${k - 1}) and fib(${k - 2}).`,
    }, 4);

    const a = visit(k - 1, depth + 1, key);
    const b = visit(k - 2, depth + 1, key);
    const value = a + b;
    node.value = value;

    // Đặt cha vào giữa hai con để cây cân đối
    const kids = nodes.filter((nd) => nd.parent === key);
    node.x = kids.length > 0 ? (kids[0].x + kids[kids.length - 1].x) / 2 : nextX * 46 + 20;

    if (memo) cache[k] = value;

    push(key, {
      vi: `Hai nhánh con trả về ${a} và ${b}, nên fib(${k}) = ${value}.${memo ? ' Ghi giá trị này vào bảng để các lời gọi sau dùng lại.' : ''}`,
      en: `The two branches returned ${a} and ${b}, so fib(${k}) = ${value}.${memo ? ' Store it in the table for later calls to reuse.' : ''}`,
    }, 5);

    return value;
  };

  const result = visit(n, 0, null);

  push(null, {
    vi: memo
      ? `fib(${n}) = ${result}, tính bằng ${calls} lời gọi, trong đó ${cacheHits} lời gọi được trả lời ngay từ bảng. Số giá trị thật sự phải tính chỉ là ${n + 1}.`
      : `fib(${n}) = ${result}, nhưng phải tốn ${calls} lời gọi. Chỉ có ${n + 1} giá trị khác nhau, nên phần lớn cây này là tính lại. Bật bảng ghi nhớ ở trên để thấy khác biệt.`,
    en: memo
      ? `fib(${n}) = ${result}, using ${calls} calls of which ${cacheHits} came straight from the table. Only ${n + 1} distinct values ever needed computing.`
      : `fib(${n}) = ${result}, but it took ${calls} calls. There are only ${n + 1} distinct values, so most of this tree is recomputation. Switch on the memo table above to see the difference.`,
  }, 7, true);

  return frames;
}

export const recTreeViz: VizDefinition<RecTreeState, RecTreeInput> = {
  slug: 'recursion-tree',
  title: { vi: 'Cây đệ quy và chỗ tính lặp', en: 'The recursion tree and repeated work' },
  goal: {
    vi: 'Nhìn thấy cùng một bài toán con xuất hiện ở nhiều nhánh, và bảng ghi nhớ xoá chúng đi thế nào.',
    en: 'See the same subproblem appear on many branches, and watch a memo table erase them.',
  },
  defaultInput: { n: 5, memo: false },
  build: buildRecTree,
  pseudocode: [
    { vi: 'fib(n):', en: 'fib(n):' },
    { vi: '    nếu n ≤ 1: trả về n', en: '    if n ≤ 1: return n' },
    { vi: '', en: '' },
    { vi: '    nếu n có trong bảng: trả về bảng[n]', en: '    if n is in the table: return table[n]' },
    { vi: '', en: '' },
    { vi: '    kq ← fib(n−1) + fib(n−2)', en: '    result ← fib(n−1) + fib(n−2)' },
    { vi: '    bảng[n] ← kq', en: '    table[n] ← result' },
    { vi: '    trả về kq', en: '    return result' },
  ],
};
