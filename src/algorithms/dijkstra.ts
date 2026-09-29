import type { Frame, VizDefinition } from './types';

export interface DijkstraNode {
  id: string;
  x: number;
  y: number;
}

export interface DijkstraEdge {
  a: string;
  b: string;
  w: number;
}

export interface DijkstraInput {
  nodes: DijkstraNode[];
  edges: DijkstraEdge[];
  start: string;
  goal: string;
}

export type NodeStatus = 'unseen' | 'tentative' | 'current' | 'settled';

export interface DijkstraState {
  nodes: DijkstraNode[];
  edges: DijkstraEdge[];
  dist: Record<string, number | null>;
  status: Record<string, NodeStatus>;
  /** Cạnh đang được xét ở bước này, để tô sáng. */
  activeEdge: [string, string] | null;
  /** Cạnh thuộc cây đường đi ngắn nhất đã dựng được. */
  treeEdges: [string, string][];
  /** Hàng đợi ưu tiên, đã sắp xếp tăng dần theo khoảng cách. */
  queue: { id: string; d: number }[];
  path: string[];
  finished: boolean;
}

function buildDijkstra(input: DijkstraInput): Frame<DijkstraState>[] {
  const { nodes, edges, start, goal } = input;
  const ids = nodes.map((n) => n.id);

  const adj: Record<string, { to: string; w: number }[]> = {};
  ids.forEach((id) => (adj[id] = []));
  edges.forEach((e) => {
    adj[e.a].push({ to: e.b, w: e.w });
    adj[e.b].push({ to: e.a, w: e.w });
  });

  const dist: Record<string, number | null> = {};
  const parent: Record<string, string | null> = {};
  const settled: Record<string, boolean> = {};
  ids.forEach((id) => {
    dist[id] = null;
    parent[id] = null;
    settled[id] = false;
  });
  dist[start] = 0;

  const frames: Frame<DijkstraState>[] = [];
  const treeEdges: [string, string][] = [];

  const statusOf = (current: string | null): Record<string, NodeStatus> => {
    const s: Record<string, NodeStatus> = {};
    ids.forEach((id) => {
      if (id === current) s[id] = 'current';
      else if (settled[id]) s[id] = 'settled';
      else if (dist[id] !== null) s[id] = 'tentative';
      else s[id] = 'unseen';
    });
    return s;
  };

  const queueOf = () =>
    ids
      .filter((id) => !settled[id] && dist[id] !== null)
      .map((id) => ({ id, d: dist[id] as number }))
      .sort((x, y) => x.d - y.d);

  const push = (
    current: string | null,
    activeEdge: [string, string] | null,
    explain: { vi: string; en: string },
    line: number,
    path: string[] = [],
    finished = false,
  ) => {
    frames.push({
      state: {
        nodes,
        edges,
        dist: { ...dist },
        status: statusOf(current),
        activeEdge,
        treeEdges: treeEdges.map((t) => [...t] as [string, string]),
        queue: queueOf(),
        path,
        finished,
      },
      explain,
      line,
    });
  };

  push(null, null, {
    vi: `Đặt khoảng cách tới ${start} bằng 0, mọi đỉnh khác chưa biết. Chỉ đỉnh ${start} nằm trong hàng đợi ưu tiên.`,
    en: `Set the distance to ${start} to 0 and leave every other node unknown. Only ${start} sits in the priority queue.`,
  }, 0);

  let guard = 0;
  while (guard < 500) {
    guard += 1;
    const q = queueOf();
    if (q.length === 0) break;

    const u = q[0].id;
    const du = dist[u] as number;

    push(u, null, {
      vi: `Lấy đỉnh có khoảng cách tạm thời nhỏ nhất trong hàng đợi: ${u} với ${du}. Vì mọi đỉnh chưa xử lý khác đều có khoảng cách tạm thời lớn hơn hoặc bằng, và mọi trọng số đều không âm, giá trị ${du} này đã là khoảng cách cuối cùng.`,
      en: `Take the queued node with the smallest tentative distance: ${u} at ${du}. Since every other unsettled node is at least that far and all weights are non-negative, ${du} is already final.`,
    }, 2);

    settled[u] = true;
    if (parent[u]) treeEdges.push([parent[u] as string, u]);

    for (const { to: v, w } of adj[u]) {
      if (settled[v]) continue;
      const old = dist[v];
      const cand = du + w;

      if (old === null || cand < old) {
        dist[v] = cand;
        parent[v] = u;
        push(u, [u, v], {
          vi:
            old === null
              ? `Cạnh ${u} tới ${v} nặng ${w}. Đỉnh ${v} chưa có khoảng cách nào, nên ghi ${du} + ${w} = ${cand} và đưa ${v} vào hàng đợi.`
              : `Cạnh ${u} tới ${v} nặng ${w}. Đường qua ${u} dài ${du} + ${w} = ${cand}, ngắn hơn ${old} đang ghi, nên cập nhật lại.`,
          en:
            old === null
              ? `Edge ${u} to ${v} has weight ${w}. Node ${v} had no distance yet, so record ${du} + ${w} = ${cand} and queue ${v}.`
              : `Edge ${u} to ${v} has weight ${w}. Going through ${u} costs ${du} + ${w} = ${cand}, better than the ${old} on record, so update it.`,
        }, 4);
      } else {
        push(u, [u, v], {
          vi: `Cạnh ${u} tới ${v} nặng ${w}. Đường qua ${u} dài ${du} + ${w} = ${cand}, không ngắn hơn ${old} đang ghi, nên giữ nguyên.`,
          en: `Edge ${u} to ${v} has weight ${w}. Going through ${u} costs ${du} + ${w} = ${cand}, no better than the ${old} on record, so leave it.`,
        }, 4);
      }
    }
  }

  const path: string[] = [];
  let cur: string | null = goal;
  while (cur) {
    path.unshift(cur);
    cur = parent[cur];
  }

  push(null, null, {
    vi: `Mọi đỉnh đã được xử lý. Đường ngắn nhất từ ${start} tới ${goal} dài ${dist[goal]}, đi qua ${path.join(' → ')}. Đường này lần ngược được nhờ mỗi đỉnh nhớ đỉnh cha đã cập nhật nó.`,
    en: `Every node is settled. The shortest route from ${start} to ${goal} costs ${dist[goal]}, going ${path.join(' → ')}. It is recovered because each node remembers the parent that last improved it.`,
  }, 6, path, true);

  return frames;
}

export const dijkstraViz: VizDefinition<DijkstraState, DijkstraInput> = {
  slug: 'dijkstra',
  title: { vi: 'Dijkstra và đường đi ngắn nhất', en: 'Dijkstra and shortest paths' },
  goal: {
    vi: 'Thấy vì sao đỉnh có khoảng cách tạm thời nhỏ nhất đã chắc chắn đúng, và vì sao điều đó cần trọng số không âm.',
    en: 'See why the node with the smallest tentative distance is already final, and why that needs non-negative weights.',
  },
  defaultInput: {
    nodes: [
      { id: 'A', x: 60, y: 150 },
      { id: 'B', x: 190, y: 60 },
      { id: 'C', x: 190, y: 240 },
      { id: 'D', x: 340, y: 60 },
      { id: 'E', x: 340, y: 240 },
      { id: 'F', x: 470, y: 150 },
    ],
    edges: [
      { a: 'A', b: 'B', w: 4 },
      { a: 'A', b: 'C', w: 2 },
      { a: 'B', b: 'C', w: 1 },
      { a: 'B', b: 'D', w: 5 },
      { a: 'C', b: 'D', w: 8 },
      { a: 'C', b: 'E', w: 10 },
      { a: 'D', b: 'E', w: 2 },
      { a: 'D', b: 'F', w: 6 },
      { a: 'E', b: 'F', w: 3 },
    ],
    start: 'A',
    goal: 'F',
  },
  build: buildDijkstra,
  pseudocode: [
    { vi: 'd[xuất phát] ← 0, mọi đỉnh khác ← ∞', en: 'd[start] ← 0, every other node ← ∞' },
    { vi: 'trong khi còn đỉnh chưa xử lý:', en: 'while unsettled nodes remain:' },
    { vi: '    u ← đỉnh chưa xử lý có d nhỏ nhất', en: '    u ← unsettled node with smallest d' },
    { vi: '    với mỗi cạnh u→v trọng số w:', en: '    for each edge u→v of weight w:' },
    { vi: '        nếu d[u] + w < d[v]: d[v] ← d[u] + w', en: '        if d[u] + w < d[v]: d[v] ← d[u] + w' },
    { vi: '', en: '' },
    { vi: 'mọi d[v] là khoảng cách ngắn nhất', en: 'every d[v] is a shortest distance' },
  ],
};
