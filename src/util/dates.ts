import { format, parseISO, type Locale } from 'date-fns';
import { de, enUS, es, fr } from 'date-fns/locale';

import type { LanguageCode } from '@/store/settings';

const LOCALES: Record<LanguageCode, Locale> = { en: enUS, de, es, fr };

/** Today as 'YYYY-MM-DD' (local time). */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function toISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** e.g. "Monday, 7 July 2025", localized. */
export function formatLongDate(iso: string, lang: LanguageCode): string {
  return format(parseISO(iso), 'EEEE, d MMMM yyyy', { locale: LOCALES[lang] });
}
