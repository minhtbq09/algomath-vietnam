import type { Frame, VizDefinition } from './types';

export interface QueensInput {
  n: number;
}

export type QueenCellMark = 'empty' | 'queen' | 'trying' | 'rejected' | 'attacked';

export interface QueensState {
  n: number;
  /** rows[c] = hàng của quân hậu ở cột c. Độ dài = số cột đã đặt. */
  rows: number[];
  /** Ô đang thử đặt ở bước này. */
  trying: [number, number] | null;
  /** Ô vừa bị loại vì bị ăn. */
  rejected: [number, number] | null;
  /** Các ô bị các quân đã đặt khống chế. */
  attacked: [number, number][];
  solutions: number;
  nodesVisited: number;
  /** Số nhánh bị cắt, để so với tổng số khả năng. */
  pruned: number;
  finished: boolean;
}

function attackedCells(n: number, rows: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (let r = 0; r < n; r += 1) {
    for (let c = rows.length; c < n; c += 1) {
      let hit = false;
      for (let c2 = 0; c2 < rows.length; c2 += 1) {
        const r2 = rows[c2];
        if (r2 === r || Math.abs(r2 - r) === Math.abs(c2 - c)) {
          hit = true;
          break;
        }
      }
      if (hit) out.push([r, c]);
    }
  }
  return out;
}

function buildQueens(input: QueensInput): Frame<QueensState>[] {
  const n = input.n;
  const frames: Frame<QueensState>[] = [];
  const rows: number[] = [];
  let solutions = 0;
  let nodesVisited = 0;
  let pruned = 0;
  // Giới hạn số frame để mô phỏng không quá dài với n = 6
  const MAX_FRAMES = 2000;   // đủ cho bàn 6×6 (1052 khung), chặn an toàn nếu ai đó tăng n

  const push = (
    trying: [number, number] | null,
    rejected: [number, number] | null,
    explain: { vi: string; en: string },
    line: number,
    finished = false,
  ) => {
    if (frames.length >= MAX_FRAMES && !finished) return;
    frames.push({
      state: {
        n,
        rows: [...rows],
        trying,
        rejected,
        attacked: attackedCells(n, rows),
        solutions,
        nodesVisited,
        pruned,
        finished,
      },
      explain,
      line,
    });
  };

  push(null, null, {
    vi: `Bàn cờ ${n}×${n}. Mỗi cột phải có đúng một quân hậu, vì hai quân cùng cột ăn nhau. Ta đặt lần lượt từ cột 1 sang phải.`,
    en: `An ${n}×${n} board. Each column holds exactly one queen, since two queens in a column attack each other. We fill the columns left to right.`,
  }, 0);

  const attacks = (r: number, c: number): boolean => {
    for (let c2 = 0; c2 < rows.length; c2 += 1) {
      const r2 = rows[c2];
      if (r2 === r || Math.abs(r2 - r) === Math.abs(c2 - c)) return true;
    }
    return false;
  };

  let stop = false;

  const place = (c: number) => {
    if (stop) return;
    if (c === n) {
      solutions += 1;
      push(null, null, {
        vi: `Đặt đủ ${n} quân, không quân nào ăn nhau. Đây là nghiệm thứ ${solutions}. Bây giờ lùi lại để tìm nghiệm khác.`,
        en: `All ${n} queens placed with no attacks. This is solution number ${solutions}. Now backtrack to look for others.`,
      }, 1);
      return;
    }

    for (let r = 0; r < n; r += 1) {
      if (stop) return;
      if (frames.length >= MAX_FRAMES) {
        stop = true;
        return;
      }

      nodesVisited += 1;

      if (attacks(r, c)) {
        pruned += 1;
        const branchSize = Math.pow(n, n - c - 1);
        push([r, c], [r, c], {
          vi: `Thử hàng ${r + 1} ở cột ${c + 1}: bị một quân đã đặt ăn. Cắt nhánh ngay, bỏ qua khoảng ${branchSize} cách đặt các cột còn lại mà không cần thử cái nào.`,
          en: `Trying row ${r + 1} in column ${c + 1}: attacked by a placed queen. Prune here, skipping roughly ${branchSize} arrangements of the remaining columns without testing any.`,
        }, 4);
        continue;
      }

      rows.push(r);
      push([r, c], null, {
        vi: `Hàng ${r + 1} ở cột ${c + 1} an toàn. Đặt quân xuống và đi tiếp sang cột ${c + 2}. Vùng tô nhạt là các ô đã bị khống chế.`,
        en: `Row ${r + 1} in column ${c + 1} is safe. Place the queen and move on to column ${c + 2}. The shaded cells are now under attack.`,
      }, 5);

      place(c + 1);

      if (stop) return;
      rows.pop();
      push(null, null, {
        vi: `Đã thử hết mọi khả năng phía sau cột ${c + 1}. Gỡ quân ở hàng ${r + 1} ra để thử hàng khác. Bước gỡ này chính là chỗ đặt tên cho thuật toán quay lui.`,
        en: `Every option beyond column ${c + 1} has been tried. Remove the queen from row ${r + 1} and try another row. This undo step is what gives backtracking its name.`,
      }, 7);
    }
  };

  place(0);

  push(null, null, {
    vi: stop
      ? `Mô phỏng dừng ở đây cho gọn. Đã thăm ${nodesVisited} trạng thái, trong đó ${pruned} lần cắt nhánh ngay lập tức. Tổng số cách đặt nếu vét cạn mù quáng là ${Math.pow(n, n).toLocaleString('vi-VN')}.`
      : `Xong. Bàn ${n}×${n} có ${solutions} nghiệm. Thuật toán chỉ thăm ${nodesVisited} trạng thái, so với ${Math.pow(n, n).toLocaleString('vi-VN')} cách đặt nếu thử mù quáng mọi tổ hợp.`,
    en: stop
      ? `The simulation stops here for brevity. It visited ${nodesVisited} states, pruning ${pruned} of them immediately. A blind enumeration would face ${Math.pow(n, n).toLocaleString('en-US')} arrangements.`
      : `Done. The ${n}×${n} board has ${solutions} solutions. The algorithm visited only ${nodesVisited} states, against ${Math.pow(n, n).toLocaleString('en-US')} arrangements for a blind search.`,
  }, 8, true);

  return frames;
}

export const queensViz: VizDefinition<QueensState, QueensInput> = {
  slug: 'queens',
  title: { vi: 'Quay lui: bài toán N quân hậu', en: 'Backtracking: the N-Queens problem' },
  goal: {
    vi: 'Thấy một nhánh bị cắt ngay khi phát hiện bế tắc, và đếm xem việc cắt sớm tiết kiệm bao nhiêu.',
    en: 'Watch a branch get pruned the moment it fails, and count how much early pruning saves.',
  },
  defaultInput: { n: 5 },
  build: buildQueens,
  pseudocode: [
    { vi: 'đặt(c):', en: 'place(c):' },
    { vi: '    nếu c = n: ghi nhận một nghiệm; quay về', en: '    if c = n: record a solution; return' },
    { vi: '    với mỗi hàng r:', en: '    for each row r:' },
    { vi: '', en: '' },
    { vi: '        nếu (r, c) bị ăn: bỏ qua  ← CẮT NHÁNH', en: '        if (r, c) is attacked: skip  ← PRUNE' },
    { vi: '        đặt quân vào (r, c)', en: '        put a queen on (r, c)' },
    { vi: '        đặt(c + 1)', en: '        place(c + 1)' },
    { vi: '        gỡ quân ra          ← LÙI', en: '        remove the queen     ← UNDO' },
    { vi: 'kết thúc', en: 'done' },
  ],
};
