import i18n from "./index";
import { EVENTS, track } from "@/lib/analytics";

export const SUPPORTED_LANGUAGES = ["en", "fr"];

/**
 * Validates language, updates i18n instance, updates <html lang>,
 * persists to localStorage, and records analytics event.
 *
 * @param {string} lng - Language code ("en" | "fr")
 */
export function setLanguage(lng) {
  if (!SUPPORTED_LANGUAGES.includes(lng)) return;
  const current = i18n.resolvedLanguage || i18n.language;
  if (lng === current) return;

  i18n.changeLanguage(lng);

  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("nelias-lang", lng);
    }
  } catch {
    // Ignore storage errors
  }

  track(EVENTS.LANGUAGE_CHANGE, { to: lng });
}
