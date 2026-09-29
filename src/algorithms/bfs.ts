import type { CellState, Frame, VizDefinition } from './types';

export interface BfsInput {
  /** Mỗi chuỗi là một hàng. '.' là ô đi được, '#' là tường. */
  rows: string[];
  start: [number, number];
  goal: [number, number] | null;
}

export interface BfsState {
  rows: string[];
  cells: CellState[][];
  dist: (number | null)[][];
  queue: [number, number][];
  current: [number, number] | null;
  start: [number, number];
  goal: [number, number] | null;
  path: [number, number][];
  finished: boolean;
}

const DIRS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function snapshot(
  rows: string[],
  dist: (number | null)[][],
  visitedDone: boolean[][],
  queue: [number, number][],
  current: [number, number] | null,
  path: [number, number][],
): CellState[][] {
  const inQueue = new Set(queue.map(([r, c]) => `${r},${c}`));
  const inPath = new Set(path.map(([r, c]) => `${r},${c}`));

  return rows.map((row, r) =>
    row.split('').map((ch, c) => {
      if (ch === '#') return 'excluded' as CellState;
      if (inPath.has(`${r},${c}`)) return 'result' as CellState;
      if (current && current[0] === r && current[1] === c) return 'active' as CellState;
      if (inQueue.has(`${r},${c}`)) return 'frontier' as CellState;
      if (visitedDone[r][c]) return 'done' as CellState;
      if (dist[r][c] !== null) return 'frontier' as CellState;
      return 'idle' as CellState;
    }),
  );
}

function buildBfs(input: BfsInput): Frame<BfsState>[] {
  const rows = input.rows;
  const R = rows.length;
  const C = rows[0].length;

  const dist: (number | null)[][] = Array.from({ length: R }, () => Array(C).fill(null));
  const parent: ([number, number] | null)[][] = Array.from({ length: R }, () => Array(C).fill(null));
  const done: boolean[][] = Array.from({ length: R }, () => Array(C).fill(false));

  const frames: Frame<BfsState>[] = [];
  const [sr, sc] = input.start;
  dist[sr][sc] = 0;
  let queue: [number, number][] = [[sr, sc]];

  const push = (
    current: [number, number] | null,
    explain: { vi: string; en: string },
    line: number,
    path: [number, number][] = [],
    finished = false,
  ) => {
    frames.push({
      state: {
        rows,
        cells: snapshot(rows, dist, done, queue, current, path),
        dist: dist.map((r) => [...r]),
        queue: queue.map((q) => [...q] as [number, number]),
        current,
        start: input.start,
        goal: input.goal,
        path,
        finished,
      },
      explain,
      line,
    });
  };

  push(null, {
    vi: 'Đặt ô xuất phát vào hàng đợi với khoảng cách 0. Mọi ô khác chưa biết khoảng cách.',
    en: 'Put the start cell in the queue with distance 0. No other cell has a known distance yet.',
  }, 0);

  let guard = 0;
  let reached = false;

  while (queue.length > 0 && guard < 2000) {
    guard += 1;
    const [r, c] = queue[0];
    queue = queue.slice(1);
    const d = dist[r][c] as number;

    push([r, c], {
      vi: `Lấy ô đầu hàng đợi, ở hàng ${r + 1} cột ${c + 1}, cách xuất phát ${d} bước. Xét bốn ô kề nó.`,
      en: `Take the front of the queue, row ${r + 1} column ${c + 1}, at distance ${d}. Look at its four neighbours.`,
    }, 2);

    const discovered: string[] = [];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
      if (rows[nr][nc] === '#') continue;
      if (dist[nr][nc] !== null) continue;
      dist[nr][nc] = d + 1;
      parent[nr][nc] = [r, c];
      queue.push([nr, nc]);
      discovered.push(`(${nr + 1}, ${nc + 1})`);
    }

    done[r][c] = true;

    if (discovered.length > 0) {
      push([r, c], {
        vi: `Các ô kề chưa có khoảng cách được gán ${d + 1} và xếp vào cuối hàng đợi: ${discovered.join(', ')}. Vì hàng đợi luôn lấy ra theo thứ tự vào, các ô cách ${d} bước được xử lý hết trước các ô cách ${d + 1} bước.`,
        en: `Unlabelled neighbours get distance ${d + 1} and join the back of the queue: ${discovered.join(', ')}. Because a queue serves in arrival order, every cell at distance ${d} is processed before any cell at distance ${d + 1}.`,
      }, 4);
    } else {
      push([r, c], {
        vi: 'Không có ô kề nào mới. Đánh dấu ô này đã xử lý xong và đi tiếp.',
        en: 'No new neighbours here. Mark this cell finished and move on.',
      }, 4);
    }

    if (input.goal && dist[input.goal[0]][input.goal[1]] !== null && !reached) {
      reached = true;
    }
  }

  const path: [number, number][] = [];
  if (input.goal && dist[input.goal[0]][input.goal[1]] !== null) {
    let cur: [number, number] | null = input.goal;
    while (cur) {
      path.push(cur);
      cur = parent[cur[0]][cur[1]];
    }
    path.reverse();
    push(null, {
      vi: `Mọi ô đến được đều đã có khoảng cách. Ô đích cách xuất phát ${dist[input.goal[0]][input.goal[1]]} bước, và đường đi ngắn nhất được lần ngược qua các ô cha.`,
      en: `Every reachable cell now has a distance. The goal is ${dist[input.goal[0]][input.goal[1]]} steps away, and the shortest path is traced back through parent cells.`,
    }, 6, path, true);
  } else {
    push(null, {
      vi: 'Hàng đợi đã rỗng. Mỗi ô đến được đều mang đúng số bước ít nhất từ ô xuất phát.',
      en: 'The queue is empty. Every reachable cell carries the minimum number of steps from the start.',
    }, 6, [], true);
  }

  return frames;
}

export const bfsViz: VizDefinition<BfsState, BfsInput> = {
  slug: 'bfs',
  title: { vi: 'BFS và khoảng cách theo số bước', en: 'BFS and Layered Distance' },
  goal: {
    vi: 'Thấy các ô được tô màu theo từng lớp khoảng cách 0, 1, 2, 3 và hiểu vì sao hàng đợi tạo ra thứ tự đó.',
    en: 'See cells fill in by distance layer 0, 1, 2, 3 and understand why a queue produces that order.',
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
      '.#########'.slice(0, 10),
    ],
    start: [0, 0],
    goal: [8, 7],
  },
  build: buildBfs,
  pseudocode: [
    { vi: 'd[xuất phát] ← 0;  đưa xuất phát vào hàng đợi', en: 'd[start] ← 0;  enqueue start' },
    { vi: 'trong khi hàng đợi khác rỗng:', en: 'while queue is not empty:' },
    { vi: '    u ← lấy ra đầu hàng đợi', en: '    u ← dequeue' },
    { vi: '    với mỗi ô v kề u:', en: '    for each neighbour v of u:' },
    { vi: '        nếu d[v] chưa có: d[v] ← d[u] + 1; đưa v vào hàng đợi', en: '        if d[v] unset: d[v] ← d[u] + 1; enqueue v' },
    { vi: '', en: '' },
    { vi: 'mọi d[v] là số bước ít nhất', en: 'every d[v] is the minimum step count' },
  ],
};
