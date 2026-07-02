import { create } from 'zustand';

import { getAllSettings, setSetting } from '@/data/db';
import { i18n } from '@/i18n';
import { DEFAULT_THEME_KEY, isThemeKey, type ThemeKey } from '@/theme/themes';

export type LanguageCode = 'en' | 'de' | 'es' | 'fr';
const LANGUAGE_CODES: LanguageCode[] = ['en', 'de', 'es', 'fr'];

function isLanguage(v: string): v is LanguageCode {
  return (LANGUAGE_CODES as string[]).includes(v);
}

interface SettingsState {
  hydrated: boolean;
  language: LanguageCode;
  theme: ThemeKey;
  onboardingCompleted: boolean;
  load: () => Promise<void>;
  setLanguage: (l: LanguageCode) => Promise<void>;
  setTheme: (t: ThemeKey) => Promise<void>;
  setOnboardingCompleted: (v: boolean) => Promise<void>;
}

export const useSettings = create<SettingsState>((set) => ({
  hydrated: false,
  language: 'en',
  theme: DEFAULT_THEME_KEY,
  onboardingCompleted: false,

  load: async () => {
    const s = await getAllSettings();
    set({
      language: s.language && isLanguage(s.language) ? s.language : 'en',
      theme: s.theme && isThemeKey(s.theme) ? s.theme : DEFAULT_THEME_KEY,
      onboardingCompleted: s.onboardingCompleted === '1',
      hydrated: true,
    });
  },

  setLanguage: async (l) => {
    set({ language: l });
    await i18n.changeLanguage(l);
    await setSetting('language', l);
  },

  setTheme: async (t) => {
    set({ theme: t });
    await setSetting('theme', t);
  },

  setOnboardingCompleted: async (v) => {
    set({ onboardingCompleted: v });
    await setSetting('onboardingCompleted', v ? '1' : '0');
  },
}));
