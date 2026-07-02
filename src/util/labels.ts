import type { Category } from '@/data/models';
import type { Strings } from '@/i18n';

/** Display label for a category: the user's custom name, or the translated default. */
export function categoryLabel(cat: Category, t: (key: keyof Strings) => string): string {
  return cat.customLabel ?? t(cat.key as keyof Strings);
}
