import { create } from 'zustand';

import { deleteEntry, getAllEntries, upsertEntry } from '@/data/db';
import type { Entry, TrackerType } from '@/data/models';

/** The (up to) three entries logged for a single day. */
export type DayEntries = Partial<Record<TrackerType, Entry>>;

interface EntriesState {
  hydrated: boolean;
  /** 'YYYY-MM-DD' -> { best?, worst?, mood? } */
  byDate: Record<string, DayEntries>;
  load: () => Promise<void>;
  setEntry: (date: string, type: TrackerType, categoryId: string, note: string) => Promise<void>;
  removeEntry: (date: string, type: TrackerType) => Promise<void>;
}

export const useEntries = create<EntriesState>((set, get) => ({
  hydrated: false,
  byDate: {},

  load: async () => {
    const all = await getAllEntries();
    const byDate: Record<string, DayEntries> = {};
    for (const e of all) {
      (byDate[e.date] ??= {})[e.type] = e;
    }
    set({ byDate, hydrated: true });
  },

  setEntry: async (date, type, categoryId, note) => {
    const entry = await upsertEntry(date, type, categoryId, note);
    const byDate = { ...get().byDate };
    byDate[date] = { ...(byDate[date] ?? {}), [type]: entry };
    set({ byDate });
  },

  removeEntry: async (date, type) => {
    await deleteEntry(date, type);
    const byDate = { ...get().byDate };
    const day = byDate[date];
    if (day) {
      const next = { ...day };
      delete next[type];
      if (Object.keys(next).length === 0) delete byDate[date];
      else byDate[date] = next;
      set({ byDate });
    }
  },
}));
