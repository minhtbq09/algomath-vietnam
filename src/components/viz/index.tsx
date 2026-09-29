import type { Bilingual, Locale } from '@/algorithms/types';
import EuclidViz from './EuclidViz';
import BinarySearchViz from './BinarySearchViz';
import BfsViz from './BfsViz';
import SieveViz from './SieveViz';
import DfsViz from './DfsViz';
import DpGridViz from './DpGridViz';
import DijkstraViz from './DijkstraViz';
import QueensViz from './QueensViz';
import RecursionTreeViz from './RecursionTreeViz';
import FastPowViz from './FastPowViz';
import { euclidViz } from '@/algorithms/euclid';
import { binarySearchViz } from '@/algorithms/binarySearch';
import { bfsViz } from '@/algorithms/bfs';
import { sieveViz } from '@/algorithms/sieve';
import { dfsViz } from '@/algorithms/dfs';
import { dpGridViz } from '@/algorithms/dpGrid';
import { dijkstraViz } from '@/algorithms/dijkstra';
import { queensViz } from '@/algorithms/queens';
import { recTreeViz } from '@/algorithms/recursionTree';
import { fastPowViz } from '@/algorithms/fastPow';

/**
 * Danh bạ mô phỏng.
 *
 * Thêm mô phỏng thứ 4 chỉ cần 3 việc:
 *   1. viết src/algorithms/<ten>.ts sinh frame
 *   2. viết src/components/viz/<Ten>Viz.tsx để vẽ frame
 *   3. thêm một dòng vào đây
 */
export interface VizEntry {
  slug: string;
  title: Bilingual;
  goal: Bilingual;
  Component: (props: { locale: Locale }) => React.ReactNode;
  /** Bài học liên quan, để nối chéo hai chiều. */
  lesson?: string;
}

export const VIZ_REGISTRY: VizEntry[] = [
  {
    slug: euclidViz.slug,
    title: euclidViz.title,
    goal: euclidViz.goal,
    Component: EuclidViz,
    lesson: '05-thuat-toan-euclid',
  },
  {
    slug: binarySearchViz.slug,
    title: binarySearchViz.title,
    goal: binarySearchViz.goal,
    Component: BinarySearchViz,
    lesson: '16-tim-kiem-nhi-phan',
  },
  {
    slug: bfsViz.slug,
    title: bfsViz.title,
    goal: bfsViz.goal,
    Component: BfsViz,
    lesson: '10-bfs-va-khoang-cach',
  },
  {
    slug: sieveViz.slug,
    title: sieveViz.title,
    goal: sieveViz.goal,
    Component: SieveViz,
    lesson: '07-sang-eratosthenes',
  },
  {
    slug: dfsViz.slug,
    title: dfsViz.title,
    goal: dfsViz.goal,
    Component: DfsViz,
    lesson: '11-dfs-va-lien-thong',
  },
  {
    slug: dpGridViz.slug,
    title: dpGridViz.title,
    goal: dpGridViz.goal,
    Component: DpGridViz,
    lesson: '19-quy-hoach-dong',
  },
  {
    slug: dijkstraViz.slug,
    title: dijkstraViz.title,
    goal: dijkstraViz.goal,
    Component: DijkstraViz,
    lesson: '12-duong-di-ngan-nhat',
  },
  {
    slug: queensViz.slug,
    title: queensViz.title,
    goal: queensViz.goal,
    Component: QueensViz,
    lesson: '15-quay-lui',
  },
  {
    slug: recTreeViz.slug,
    title: recTreeViz.title,
    goal: recTreeViz.goal,
    Component: RecursionTreeViz,
    lesson: '14-cay-de-quy',
  },
  {
    slug: fastPowViz.slug,
    title: fastPowViz.title,
    goal: fastPowViz.goal,
    Component: FastPowViz,
    lesson: '06-luy-thua-nhanh',
  },
];

export function getViz(slug: string): VizEntry | undefined {
  return VIZ_REGISTRY.find((v) => v.slug === slug);
}

/** Dùng trong MDX: <Viz name="bfs" /> */
export function Viz({ name, locale }: { name: string; locale: Locale }) {
  const entry = getViz(name);
  if (!entry) {
    return (
      <p className="my-6 rounded border border-mark/40 bg-mark/5 p-4 text-sm text-mark">
        Chưa có mô phỏng tên &quot;{name}&quot;. Kiểm tra lại VIZ_REGISTRY.
      </p>
    );
  }
  const C = entry.Component;
  return <C locale={locale} />;
}
