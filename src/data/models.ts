/** Core domain types for Minute Journal. */

export type TrackerType = 'best' | 'worst' | 'mood';

export const TRACKER_TYPES: TrackerType[] = ['best', 'worst', 'mood'];

/** A selectable category within a tracker (e.g. "Work", "Stress"). */
export interface Category {
  id: string; // stable, e.g. 'best.achievement'
  type: TrackerType;
  key: string; // i18n key, e.g. 'categoryAchievement'
  customLabel: string | null; // set only when the user renames it
  color: string; // hex, e.g. '#0066B9'
  sortOrder: number;
}

/** A single logged entry: one per (date, tracker type). */
export interface Entry {
  id: number;
  date: string; // 'YYYY-MM-DD'
  type: TrackerType;
  categoryId: string;
  note: string;
}
