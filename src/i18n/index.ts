import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
] as const;

/** Initializes i18next once (or just switches language if already set up). */
export async function initI18n(lng: string) {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        es: { translation: es },
        fr: { translation: fr },
        de: { translation: de },
      },
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      returnNull: false,
    });
  } else {
    await i18n.changeLanguage(lng);
  }
  return i18n;
}

export { i18n };
export type { Strings } from "./en";
