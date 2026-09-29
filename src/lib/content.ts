import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Locale } from '@/algorithms/types';
import { DEFAULT_LOCALE } from '@/i18n/dictionary';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface LoadedLesson {
  body: string;
  data: Record<string, unknown>;
  /** true khi bản ngôn ngữ yêu cầu chưa có và phải dùng bản mặc định. */
  fellBack: boolean;
}

/**
 * Đọc nội dung bài học. Nếu bản tiếng Anh chưa viết thì trả về bản tiếng Việt
 * kèm cờ fellBack, để trang hiển thị một dòng ghi chú thay vì lỗi 404.
 */
export function loadLesson(slug: string, locale: Locale): LoadedLesson | null {
  const wanted = path.join(CONTENT_DIR, 'lessons', slug, `${locale}.mdx`);
  const fallback = path.join(CONTENT_DIR, 'lessons', slug, `${DEFAULT_LOCALE}.mdx`);

  const file = fs.existsSync(wanted) ? wanted : fs.existsSync(fallback) ? fallback : null;
  if (!file) return null;

  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  return {
    body: parsed.content,
    data: parsed.data,
    fellBack: file === fallback && locale !== DEFAULT_LOCALE,
  };
}

export function lessonExists(slug: string): boolean {
  return fs.existsSync(path.join(CONTENT_DIR, 'lessons', slug));
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Exercise {
  id: string;
  lesson: string;
  topic: string;
  difficulty: Difficulty;
  statement: Record<Locale, string>;
  hint: Record<Locale, string>;
  solution: Record<Locale, string>;
}

let cache: Exercise[] | null = null;

export function allExercises(): Exercise[] {
  if (cache) return cache;
  const dir = path.join(CONTENT_DIR, 'exercises');
  if (!fs.existsSync(dir)) return [];
  const items: Exercise[] = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.json')) continue;
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
    if (Array.isArray(parsed)) items.push(...parsed);
    else items.push(parsed);
  }
  cache = items;
  return items;
}

export function exercisesForLesson(slug: string): Exercise[] {
  return allExercises().filter((e) => e.lesson === slug);
}

export interface Workshop {
  id: string;
  status: 'planned' | 'open' | 'done';
  date: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  agenda: { minutes: number; item: Record<Locale, string> }[];
  registerUrl?: string;
  materialsUrl?: string;
}

export function allWorkshops(): Workshop[] {
  const file = path.join(CONTENT_DIR, 'workshops', 'workshops.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Workshop[];
}

export interface ImpactMetric {
  key: string;
  label: Record<Locale, string>;
  target: Record<Locale, string>;
  actual: Record<Locale, string> | null;
  evidence: Record<Locale, string>;
}

export function impactMetrics(): ImpactMetric[] {
  const file = path.join(CONTENT_DIR, 'impact.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8')) as ImpactMetric[];
}
