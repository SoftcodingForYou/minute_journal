import { create } from 'zustand';

import { getCategories, resetCategories, updateCategory } from '@/data/db';
import type { Category } from '@/data/models';

function buildMap(categories: Category[]): Record<string, Category> {
  const map: Record<string, Category> = {};
  for (const c of categories) map[c.id] = c;
  return map;
}

interface CategoriesState {
  hydrated: boolean;
  categories: Category[];
  /** id -> Category, for O(1) lookups while rendering markers/entries. */
  map: Record<string, Category>;
  load: () => Promise<void>;
  rename: (id: string, label: string) => Promise<void>;
  recolor: (id: string, color: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const useCategories = create<CategoriesState>((set, get) => ({
  hydrated: false,
  categories: [],
  map: {},

  load: async () => {
    const categories = await getCategories();
    set({ categories, map: buildMap(categories), hydrated: true });
  },

  rename: async (id, label) => {
    const customLabel = label.trim() === '' ? null : label.trim();
    await updateCategory(id, { customLabel });
    const categories = get().categories.map((c) => (c.id === id ? { ...c, customLabel } : c));
    set({ categories, map: buildMap(categories) });
  },

  recolor: async (id, color) => {
    await updateCategory(id, { color });
    const categories = get().categories.map((c) => (c.id === id ? { ...c, color } : c));
    set({ categories, map: buildMap(categories) });
  },

  reset: async () => {
    await resetCategories();
    await get().load();
  },
}));
