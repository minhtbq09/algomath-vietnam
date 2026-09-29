import type { CellState, Frame, VizDefinition } from './types';

export interface BinarySearchInput {
  values: number[];
  target: number;
}

export interface BinarySearchState {
  values: number[];
  target: number;
  lo: number;
  hi: number;
  mid: number | null;
  cells: CellState[];
  foundAt: number | null;
  finished: boolean;
}

function paint(n: number, lo: number, hi: number, mid: number | null): CellState[] {
  const cells: CellState[] = [];
  for (let i = 0; i < n; i += 1) {
    if (i === mid) cells.push('active');
    else if (i >= lo && i <= hi) cells.push('frontier');
    else cells.push('excluded');
  }
  return cells;
}

function buildBinarySearch(input: BinarySearchInput): Frame<BinarySearchState>[] {
  const values = [...input.values].sort((x, y) => x - y);
  const target = input.target;
  const frames: Frame<BinarySearchState>[] = [];

  let lo = 0;
  let hi = values.length - 1;

  frames.push({
    state: {
      values,
      target,
      lo,
      hi,
      mid: null,
      cells: paint(values.length, lo, hi, null),
      foundAt: null,
      finished: false,
    },
    explain: {
      vi: `Dãy đã sắp xếp tăng dần. Cần tìm số ${target}. Vùng còn khả năng chứa nó là toàn bộ ${values.length} phần tử.`,
      en: `The list is sorted. We are looking for ${target}. The search range is all ${values.length} elements.`,
    },
    line: 0,
  });

  let found: number | null = null;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const size = hi - lo + 1;

    frames.push({
      state: {
        values,
        target,
        lo,
        hi,
        mid,
        cells: paint(values.length, lo, hi, mid),
        foundAt: null,
        finished: false,
      },
      explain: {
        vi: `Vùng tìm kiếm còn ${size} phần tử. Lấy phần tử ở giữa, vị trí ${mid + 1}, giá trị ${values[mid]}.`,
        en: `The range holds ${size} elements. Take the middle one at position ${mid + 1}, value ${values[mid]}.`,
      },
      line: 2,
    });

    if (values[mid] === target) {
      found = mid;
      frames.push({
        state: {
          values,
          target,
          lo,
          hi,
          mid,
          cells: values.map((_, i) => (i === mid ? 'result' : 'excluded')),
          foundAt: mid,
          finished: true,
        },
        explain: {
          vi: `${values[mid]} đúng bằng ${target}. Tìm thấy ở vị trí ${mid + 1}.`,
          en: `${values[mid]} equals ${target}. Found at position ${mid + 1}.`,
        },
        line: 3,
      });
      break;
    }

    if (values[mid] < target) {
      frames.push({
        state: {
          values,
          target,
          lo: mid + 1,
          hi,
          mid: null,
          cells: paint(values.length, mid + 1, hi, null),
          foundAt: null,
          finished: false,
        },
        explain: {
          vi: `${values[mid]} nhỏ hơn ${target}. Vì dãy tăng dần, mọi phần tử bên trái cũng nhỏ hơn ${target}, loại hết nửa trái.`,
          en: `${values[mid]} is less than ${target}. Since the list is increasing, everything to its left is smaller too, so the left half is discarded.`,
        },
        line: 4,
      });
      lo = mid + 1;
    } else {
      frames.push({
        state: {
          values,
          target,
          lo,
          hi: mid - 1,
          mid: null,
          cells: paint(values.length, lo, mid - 1, null),
          foundAt: null,
          finished: false,
        },
        explain: {
          vi: `${values[mid]} lớn hơn ${target}. Mọi phần tử bên phải còn lớn hơn nữa, loại hết nửa phải.`,
          en: `${values[mid]} is greater than ${target}. Everything to its right is larger still, so the right half is discarded.`,
        },
        line: 5,
      });
      hi = mid - 1;
    }
  }

  if (found === null) {
    frames.push({
      state: {
        values,
        target,
        lo,
        hi,
        mid: null,
        cells: values.map(() => 'excluded'),
        foundAt: null,
        finished: true,
      },
      explain: {
        vi: `Vùng tìm kiếm đã rỗng. Số ${target} không có trong dãy.`,
        en: `The range is empty. ${target} is not in the list.`,
      },
      line: 6,
    });
  }

  return frames;
}

export const binarySearchViz: VizDefinition<BinarySearchState, BinarySearchInput> = {
  slug: 'binary-search',
  title: { vi: 'Tìm kiếm nhị phân', en: 'Binary Search' },
  goal: {
    vi: 'Quan sát vùng tìm kiếm bị cắt đôi sau mỗi phép so sánh.',
    en: 'Watch the search range halve after every comparison.',
  },
  defaultInput: {
    values: [3, 8, 12, 17, 23, 29, 34, 41, 47, 52, 58, 65, 70],
    target: 41,
  },
  build: buildBinarySearch,
  pseudocode: [
    { vi: 'lo ← 1;  hi ← n', en: 'lo ← 1;  hi ← n' },
    { vi: 'trong khi lo ≤ hi:', en: 'while lo ≤ hi:' },
    { vi: '    mid ← (lo + hi) / 2', en: '    mid ← (lo + hi) / 2' },
    { vi: '    nếu a[mid] = x: trả về mid', en: '    if a[mid] = x: return mid' },
    { vi: '    nếu a[mid] < x: lo ← mid + 1', en: '    if a[mid] < x: lo ← mid + 1' },
    { vi: '    ngược lại:      hi ← mid − 1', en: '    else:            hi ← mid − 1' },
    { vi: 'trả về "không tìm thấy"', en: 'return "not found"' },
  ],
};
