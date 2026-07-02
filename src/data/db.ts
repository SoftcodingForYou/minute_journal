import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

import { DEFAULT_CATEGORIES } from './defaults';
import type { Category, Entry, TrackerType } from './models';

const DB_NAME = 'minutejournal.db';
const SCHEMA_VERSION = 2;

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Returns the singleton database handle, opening + migrating it on first use. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate();
  }
  return dbPromise;
}

async function openAndMigrate(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  // WAL is a native-only optimization; on web (wa-sqlite/OPFS) it is a no-op we skip.
  if (Platform.OS !== 'web') {
    await db.execAsync('PRAGMA journal_mode = WAL;');
  }

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;

  if (version < 1) await migrateToV1(db);
  if (version < 2) await migrateToV2(db);

  return db;
}

async function migrateToV1(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id           TEXT PRIMARY KEY NOT NULL,
      type         TEXT NOT NULL,
      key          TEXT NOT NULL,
      custom_label TEXT,
      color        TEXT NOT NULL,
      sort_order   INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS entries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      date        TEXT NOT NULL,
      type        TEXT NOT NULL,
      category_id TEXT NOT NULL,
      note        TEXT NOT NULL DEFAULT '',
      UNIQUE(date, type)
    );
    CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
  `);

  for (const c of DEFAULT_CATEGORIES) {
    await db.runAsync(
      'INSERT OR IGNORE INTO categories (id, type, key, custom_label, color, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [c.id, c.type, c.key, c.customLabel, c.color, c.sortOrder]
    );
  }

  await db.execAsync('PRAGMA user_version = 1;');
}

async function migrateToV2(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );
  `);
  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION};`);
}

// --- Row mappers -----------------------------------------------------------

interface CategoryRow {
  id: string;
  type: string;
  key: string;
  custom_label: string | null;
  color: string;
  sort_order: number;
}

interface EntryRow {
  id: number;
  date: string;
  type: string;
  category_id: string;
  note: string;
}

function mapCategory(r: CategoryRow): Category {
  return {
    id: r.id,
    type: r.type as TrackerType,
    key: r.key,
    customLabel: r.custom_label,
    color: r.color,
    sortOrder: r.sort_order,
  };
}

function mapEntry(r: EntryRow): Entry {
  return { id: r.id, date: r.date, type: r.type as TrackerType, categoryId: r.category_id, note: r.note };
}

// --- Categories ------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CategoryRow>(
    'SELECT id, type, key, custom_label, color, sort_order FROM categories ORDER BY sort_order'
  );
  return rows.map(mapCategory);
}

export async function updateCategory(
  id: string,
  patch: { customLabel?: string | null; color?: string }
): Promise<void> {
  const db = await getDb();
  if (patch.customLabel !== undefined) {
    await db.runAsync('UPDATE categories SET custom_label = ? WHERE id = ?', [patch.customLabel, id]);
  }
  if (patch.color !== undefined) {
    await db.runAsync('UPDATE categories SET color = ? WHERE id = ?', [patch.color, id]);
  }
}

/** Restores every category's default label (custom_label = NULL) and default color. */
export async function resetCategories(): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const c of DEFAULT_CATEGORIES) {
      await db.runAsync('UPDATE categories SET custom_label = NULL, color = ? WHERE id = ?', [c.color, c.id]);
    }
  });
}

// --- Entries ---------------------------------------------------------------

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<EntryRow>(
    'SELECT id, date, type, category_id, note FROM entries'
  );
  return rows.map(mapEntry);
}

/** Inserts or replaces the single entry for (date, type). */
export async function upsertEntry(
  date: string,
  type: TrackerType,
  categoryId: string,
  note: string
): Promise<Entry> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO entries (date, type, category_id, note) VALUES (?, ?, ?, ?)
     ON CONFLICT(date, type) DO UPDATE SET category_id = excluded.category_id, note = excluded.note`,
    [date, type, categoryId, note]
  );
  const row = await db.getFirstAsync<EntryRow>(
    'SELECT id, date, type, category_id, note FROM entries WHERE date = ? AND type = ?',
    [date, type]
  );
  return mapEntry(row!);
}

export async function deleteEntry(date: string, type: TrackerType): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM entries WHERE date = ? AND type = ?', [date, type]);
}

// --- Settings (key/value) --------------------------------------------------

export async function getAllSettings(): Promise<Record<string, string>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ key: string; value: string | null }>(
    'SELECT key, value FROM settings'
  );
  const out: Record<string, string> = {};
  for (const r of rows) if (r.value !== null) out[r.key] = r.value;
  return out;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value]
  );
}

export type { Category, Entry, TrackerType };
