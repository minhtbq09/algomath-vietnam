import type { CellState, Frame, VizDefinition } from './types';

export interface DfsInput {
  rows: string[];
  start: [number, number];
}

export interface DfsState {
  rows: string[];
  cells: CellState[][];
  order: (number | null)[][];
  stack: [number, number][];
  current: [number, number] | null;
  start: [number, number];
  finished: boolean;
}

const DIRS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

/**
 * Cùng một lưới, cùng một cấu trúc vòng lặp như BFS.
 * Khác biệt duy nhất: lấy phần tử VÀO SAU CÙNG thay vì vào đầu tiên.
 * Mục đích của mô phỏng này là cho học sinh thấy một dòng code đổi ra kết quả gì.
 */
function buildDfs(input: DfsInput): Frame<DfsState>[] {
  const rows = input.rows;
  const R = rows.length;
  const C = rows[0].length;

  const order: (number | null)[][] = Array.from({ length: R }, () => Array(C).fill(null));
  const done: boolean[][] = Array.from({ length: R }, () => Array(C).fill(false));
  const frames: Frame<DfsState>[] = [];

  let stack: [number, number][] = [input.start];
  let counter = 0;

  const snapshot = (current: [number, number] | null): CellState[][] => {
    const inStack = new Set(stack.map(([r, c]) => `${r},${c}`));
    return rows.map((row, r) =>
      row.split('').map((ch, c) => {
        if (ch === '#') return 'excluded' as CellState;
        if (current && current[0] === r && current[1] === c) return 'active' as CellState;
        if (done[r][c]) return 'done' as CellState;
        if (inStack.has(`${r},${c}`)) return 'frontier' as CellState;
        return 'idle' as CellState;
      }),
    );
  };

  const push = (
    current: [number, number] | null,
    explain: { vi: string; en: string },
    line: number,
    finished = false,
  ) => {
    frames.push({
      state: {
        rows,
        cells: snapshot(current),
        order: order.map((r) => [...r]),
        stack: stack.map((s) => [...s] as [number, number]),
        current,
        start: input.start,
        finished,
      },
      explain,
      line,
    });
  };

  push(null, {
    vi: 'Đặt ô xuất phát vào ngăn xếp. Ngăn xếp lấy ra phần tử vào sau cùng, giống chồng sách bạn chỉ lấy được quyển trên cùng.',
    en: 'Put the start cell on the stack. A stack serves the most recent item, like a pile of books where you can only take the top one.',
  }, 0);

  let guard = 0;
  while (stack.length > 0 && guard < 3000) {
    guard += 1;
    const [r, c] = stack[stack.length - 1];
    stack = stack.slice(0, -1);

    if (done[r][c]) continue;
    done[r][c] = true;
    counter += 1;
    order[r][c] = counter;

    push([r, c], {
      vi: `Lấy ô trên cùng của ngăn xếp: hàng ${r + 1} cột ${c + 1}. Đây là ô thứ ${counter} được thăm. Con số ghi trên ô là THỨ TỰ THĂM, không phải khoảng cách.`,
      en: `Take the top of the stack: row ${r + 1} column ${c + 1}. This is visit number ${counter}. The number on the cell is the VISIT ORDER, not a distance.`,
    }, 2);

    const added: string[] = [];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
      if (rows[nr][nc] === '#') continue;
      if (done[nr][nc]) continue;
      stack.push([nr, nc]);
      added.push(`(${nr + 1}, ${nc + 1})`);
    }

    if (added.length > 0) {
      push([r, c], {
        vi: `Đẩy các ô kề chưa thăm lên ngăn xếp: ${added.join(', ')}. Ô vừa đẩy lên sẽ được lấy ra ngay ở bước sau, nên thuật toán lao sâu theo một hướng thay vì lan đều.`,
        en: `Push the unvisited neighbours onto the stack: ${added.join(', ')}. The one just pushed comes off next, so the algorithm dives along one direction instead of spreading evenly.`,
      }, 3);
    }
  }

  push(null, {
    vi: `Ngăn xếp đã rỗng, thăm được ${counter} ô. Hãy so sánh hình này với BFS trên cùng mê cung: DFS tạo ra những đường ngoằn ngoèo dài, BFS tạo ra các vòng tròn đồng tâm.`,
    en: `The stack is empty after visiting ${counter} cells. Compare this picture with BFS on the same maze: DFS traces long winding paths, BFS produces concentric rings.`,
  }, 5, true);

  return frames;
}

export const dfsViz: VizDefinition<DfsState, DfsInput> = {
  slug: 'dfs',
  title: { vi: 'DFS và thứ tự thăm', en: 'DFS and visiting order' },
  goal: {
    vi: 'Đổi hàng đợi thành ngăn xếp và thấy ngay hình dạng duyệt thay đổi hoàn toàn.',
    en: 'Swap the queue for a stack and watch the traversal shape change completely.',
  },
  defaultInput: {
    rows: [
      '.....#....',
      '.###.#.##.',
      '.#...#..#.',
      '.#.###.##.',
      '.#.....#..',
      '.#####.#.#',
      '.....#.#..',
      '####.#.#.#',
      '.....#...#',
      '.#########',
    ],
    start: [0, 0],
  },
  build: buildDfs,
  pseudocode: [
    { vi: 'đưa xuất phát vào ngăn xếp', en: 'push start onto the stack' },
    { vi: 'trong khi ngăn xếp khác rỗng:', en: 'while the stack is not empty:' },
    { vi: '    u ← lấy ra ô TRÊN CÙNG', en: '    u ← pop the TOP cell' },
    { vi: '    đẩy mọi ô kề chưa thăm lên ngăn xếp', en: '    push every unvisited neighbour' },
    { vi: '', en: '' },
    { vi: 'kết thúc khi ngăn xếp rỗng', en: 'stop when the stack is empty' },
  ],
};
