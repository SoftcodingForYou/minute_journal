import { useSettings } from '@/store/settings';

import { DEFAULT_THEME_KEY, THEMES, type AppTheme } from './themes';

/** Returns the active theme palette, reactive to the user's theme setting. */
export function useTheme(): AppTheme {
  const key = useSettings((s) => s.theme);
  return THEMES[key] ?? THEMES[DEFAULT_THEME_KEY];
}
