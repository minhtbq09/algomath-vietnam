import type { CellState, Frame, VizDefinition } from './types';

export interface DpGridInput {
  /** '.' đi được, '#' là ô chặn. Đi từ góc trên trái xuống góc dưới phải. */
  rows: string[];
}

export interface DpGridState {
  rows: string[];
  table: (number | null)[][];
  cells: CellState[][];
  current: [number, number] | null;
  /** Hai ô nguồn đang được cộng vào ô hiện tại. */
  sources: [number, number][];
  finished: boolean;
}

/**
 * Đếm số đường đi từ góc trên trái tới góc dưới phải, chỉ được đi phải và xuống.
 *
 * Đây là bài tam giác Pascal viết lại trên lưới, nên học sinh nhận ra
 * hệ thức truy hồi trước khi nghe tới từ "quy hoạch động".
 */
function buildDpGrid(input: DpGridInput): Frame<DpGridState>[] {
  const rows = input.rows;
  const R = rows.length;
  const C = rows[0].length;
  const table: (number | null)[][] = Array.from({ length: R }, () => Array(C).fill(null));
  const frames: Frame<DpGridState>[] = [];

  const paint = (current: [number, number] | null, sources: [number, number][]): CellState[][] => {
    const src = new Set(sources.map(([r, c]) => `${r},${c}`));
    return rows.map((row, r) =>
      row.split('').map((ch, c) => {
        if (ch === '#') return 'excluded' as CellState;
        if (current && current[0] === r && current[1] === c) return 'active' as CellState;
        if (src.has(`${r},${c}`)) return 'frontier' as CellState;
        if (table[r][c] !== null) return 'done' as CellState;
        return 'idle' as CellState;
      }),
    );
  };

  const push = (
    current: [number, number] | null,
    sources: [number, number][],
    explain: { vi: string; en: string },
    line: number,
    finished = false,
  ) => {
    frames.push({
      state: {
        rows,
        table: table.map((r) => [...r]),
        cells: paint(current, sources),
        current,
        sources,
        finished,
      },
      explain,
      line,
    });
  };

  push(null, [], {
    vi: 'Mỗi ô sẽ ghi số đường đi từ góc trên trái tới ô đó, chỉ được đi sang phải hoặc xuống dưới. Ô đen là ô bị chặn.',
    en: 'Each cell will hold the number of paths from the top-left corner to that cell, moving only right or down. Black cells are blocked.',
  }, 0);

  for (let r = 0; r < R; r += 1) {
    for (let c = 0; c < C; c += 1) {
      if (rows[r][c] === '#') {
        table[r][c] = 0;
        continue;
      }

      if (r === 0 && c === 0) {
        table[r][c] = 1;
        push([r, c], [], {
          vi: 'Ô xuất phát có đúng 1 đường đi tới nó: đường rỗng, tức đứng yên. Đây là trường hợp cơ sở.',
          en: 'The starting cell has exactly 1 path to it: the empty path, standing still. This is the base case.',
        }, 1);
        continue;
      }

      const sources: [number, number][] = [];
      let sum = 0;
      const parts: string[] = [];

      if (r > 0 && rows[r - 1][c] !== '#') {
        sources.push([r - 1, c]);
        sum += table[r - 1][c] ?? 0;
        parts.push(`${table[r - 1][c] ?? 0} từ trên`);
      }
      if (c > 0 && rows[r][c - 1] !== '#') {
        sources.push([r, c - 1]);
        sum += table[r][c - 1] ?? 0;
        parts.push(`${table[r][c - 1] ?? 0} từ trái`);
      }

      table[r][c] = sum;

      push([r, c], sources, {
        vi:
          sources.length === 0
            ? `Ô này không có ô nguồn hợp lệ nào, nên không đường nào tới được: ghi 0.`
            : `Mọi đường tới ô này phải đi qua ô trên hoặc ô trái ngay trước nó, và hai nhóm đường đó không trùng nhau. Vậy số đường bằng tổng: ${parts.join(' + ')} = ${sum}.`,
        en:
          sources.length === 0
            ? `This cell has no valid source, so no path reaches it: write 0.`
            : `Every path here arrives from the cell above or the cell to the left, and those two groups never overlap. So the count is the sum: ${parts.join(' + ').replace('từ trên', 'from above').replace('từ trái', 'from the left')} = ${sum}.`,
      }, 3);
    }
  }

  push(null, [], {
    vi: `Ô góc dưới phải ghi ${table[R - 1][C - 1]}, đó là đáp án. Mỗi ô chỉ được tính đúng một lần, nên chi phí là số ô, tức O(R×C).`,
    en: `The bottom-right cell holds ${table[R - 1][C - 1]}, the answer. Each cell was computed exactly once, so the cost is the number of cells, O(R×C).`,
  }, 5, true);

  return frames;
}

export const dpGridViz: VizDefinition<DpGridState, DpGridInput> = {
  slug: 'dp-grid',
  title: { vi: 'Bảng quy hoạch động: đếm đường đi', en: 'A DP table: counting paths' },
  goal: {
    vi: 'Thấy hệ thức truy hồi được điền vào bảng theo thứ tự, và vì sao mỗi ô chỉ tính một lần.',
    en: 'Watch a recurrence fill a table in order, and see why each cell is computed only once.',
  },
  defaultInput: {
    rows: ['.......', '..#....', '.......', '...#..#', '.......'],
  },
  build: buildDpGrid,
  pseudocode: [
    { vi: 'f[0][0] ← 1', en: 'f[0][0] ← 1' },
    { vi: 'với mỗi ô (r, c) theo thứ tự từ trên xuống, trái sang phải:', en: 'for each cell (r, c), top to bottom, left to right:' },
    { vi: '    nếu ô bị chặn: f[r][c] ← 0', en: '    if the cell is blocked: f[r][c] ← 0' },
    { vi: '    ngược lại: f[r][c] ← f[r−1][c] + f[r][c−1]', en: '    else: f[r][c] ← f[r−1][c] + f[r][c−1]' },
    { vi: '', en: '' },
    { vi: 'trả về f[R−1][C−1]', en: 'return f[R−1][C−1]' },
  ],
};
