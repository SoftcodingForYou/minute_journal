# Minute Journal (React Native)

A ground-up React Native rewrite of the [Minute Journal](../minutejournal) Flutter app,
targeting **web and Android** from a single Expo codebase. Log the **Best** and **Worst**
part of your day plus your **Mood**, each with a customizable category and an optional note,
then review a calendar and summary charts. All data stays **on-device** (local SQLite).

No accounts, no paywalls — every feature is free.

## Stack

- **Expo** (SDK 57) + **React Native Web** — one codebase → Android + web
- **TypeScript**, **Expo Router** (file-based routing, real URLs on web)
- **expo-sqlite** for persistence (native SQLite; `wa-sqlite`/WASM on web)
- **Zustand** (in-memory store), **i18next** (4 languages), **date-fns**, **react-native-svg**

## Getting started

```bash
npm install
npm run web       # open in the browser
npm run android   # open on an Android device/emulator
```

Type-check: `npx tsc --noEmit` · Web build: `npx expo export -p web` (outputs `dist/`).

## ⚠️ Web persistence requires cross-origin isolation

On web, `expo-sqlite` uses `wa-sqlite` compiled to WebAssembly and stores data in the
browser's **OPFS**, which only works when the page is **cross-origin isolated**. The site
(and dev server) must send:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

- The dev server sets these automatically (see `metro.config.js`).
- **Hosting:** use a host that allows custom headers — **Netlify, Vercel, Cloudflare Pages,
  or Firebase Hosting**. GitHub Pages cannot set these headers, so OPFS (and thus
  persistence across reloads) will not work there.

## Project structure

```
src/
  app/            # Expo Router routes (_layout.tsx, index.tsx, …)
  components/     # shared UI
  constants/      # theme tokens
  data/           # models.ts, defaults.ts, db.ts (SQLite schema + queries)
  hooks/
```

### Data model

Single SQLite database `minutejournal.db`:

- `categories(id, type, key, custom_label, color, sort_order)` — stable ids +
  i18n `key`; `custom_label` is set only when a user renames a category.
- `entries(id, date 'YYYY-MM-DD', type, category_id, note)` with `UNIQUE(date, type)`
  so there is exactly one entry per tracker per day.

## Status

**Phases 0–4 complete.**

- **Phase 0** — Expo + Router + TypeScript baseline; expo-sqlite wired and verified on the
  web target (WASM bundles); schema + 15 default categories seeded on first run.
- **Phase 1** — Zustand stores (`settings`, `categories`, `entries`) hydrated from SQLite
  once at startup and served from memory (this is the fix for the original app's per-cell
  query lag); i18n for EN/DE/ES/FR with the original's translation bugs fixed; four color
  themes. DB schema bumped to v2 (adds a key/value `settings` table). The home screen is a
  temporary "foundation check" that flips language/theme live and reads counts from the stores.
- **Phase 2** — Bottom-tab navigation (Calendar / Summary); the calendar screen with a
  Best/Worst/Mood switcher, custom day cells (colored entry dots + note glyph, today/selected
  styling), a selected-day detail panel, and an add/edit FAB; the add/edit/delete entry modal;
  and a Settings screen (language + theme + version). Uses `react-native-calendars` and
  `@expo/vector-icons`.
- **Phase 3** — The Summary tab: a Best/Worst/Mood switcher and a 30-days / month / all window
  selector; SVG pie charts (category frequencies) for Best/Worst; and for Mood, an SVG line
  chart plus the "often coinciding" analysis. Charts are hand-drawn with `react-native-svg` (no
  chart-library dependency). `TrackerSwitcher` extracted and shared with the calendar.
- **Phase 4** — First-launch onboarding (5 stepped pages + language picker; no premium page)
  gated via a redirect in the tabs layout; and the category editor — a categories screen grouped
  by tracker, a rename + preset-swatch color editor (modal), and reset-to-defaults with an inline
  confirm. Both wired into Settings ("Configure categories" + replay "Intro").

Type-check (`tsc --noEmit`) and web export both pass.

**Next (polish):** calendar month/year jump, JSON export/import (backup + cross-device), app
icon/splash, then the Android (EAS) and web release builds.
