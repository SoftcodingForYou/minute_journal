import { MOOD_VALUE } from '@/data/defaults';
import type { Category, TrackerType } from '@/data/models';
import type { DayEntries } from '@/store/entries';

export type SummaryWindow = 'last30' | 'month' | 'all';
export type FilteredDay = [string, DayEntries];

export interface PieDatum {
  id: string;
  label: string;
  color: string;
  value: number;
}

/** Frequency of each category for a tracker within the given days, most-frequent first. */
export function categoryCounts(
  filtered: FilteredDay[],
  type: TrackerType,
  catMap: Record<string, Category>,
  labelOf: (c: Category) => string
): PieDatum[] {
  const counts = new Map<string, number>();
  for (const [, day] of filtered) {
    const e = day[type];
    if (e) counts.set(e.categoryId, (counts.get(e.categoryId) ?? 0) + 1);
  }
  const out: PieDatum[] = [];
  for (const [id, value] of counts) {
    const c = catMap[id];
    if (c) out.push({ id, label: labelOf(c), color: c.color, value });
  }
  return out.sort((a, b) => b.value - a.value);
}

/** Chronological mood values (good=3 … bad=1) for the mood line chart. */
export function moodPoints(filtered: FilteredDay[]): number[] {
  return filtered
    .filter(([, d]) => d.mood)
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([, d]) => MOOD_VALUE[d.mood!.categoryId] ?? 2);
}

/**
 * Categories of `targetType` most frequently logged on days with a given mood.
 * (good mood → best categories; bad mood → worst categories.) Returns all ties.
 */
export function coincidingCategories(
  filtered: FilteredDay[],
  moodCategoryId: string,
  targetType: TrackerType,
  catMap: Record<string, Category>,
  labelOf: (c: Category) => string
): string[] {
  const counts = new Map<string, number>();
  for (const [, day] of filtered) {
    if (day.mood?.categoryId === moodCategoryId && day[targetType]) {
      const id = day[targetType]!.categoryId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  let max = 0;
  for (const v of counts.values()) if (v > max) max = v;
  const out: string[] = [];
  if (max > 0) {
    for (const [id, v] of counts) {
      if (v === max) {
        const c = catMap[id];
        if (c) out.push(labelOf(c));
      }
    }
  }
  return out;
}
