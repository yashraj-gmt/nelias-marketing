import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Auto-register all namespaces and languages via Vite glob
const modules = import.meta.glob("./locales/*/*.json", { eager: true });
const resources = {};
for (const [path, mod] of Object.entries(modules)) {
  const m = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!m) continue;
  const [, lng, ns] = m;
  (resources[lng] ??= {})[ns] = mod.default ?? mod;
}

/**
 * Determine initial language:
 * 1. URL search param ?lang=en or ?lang=fr (validated and persisted)
 * 2. Saved preference in localStorage (nelias-lang)
 * 3. Fallback to "en"
 *
 * @returns {"en"|"fr"}
 */
function detectInitialLanguage() {
  if (typeof window !== "undefined" && window.location) {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryLang = params.get("lang");
      if (queryLang === "en" || queryLang === "fr") {
        try {
          if (window.localStorage) {
            localStorage.setItem("nelias-lang", queryLang);
          }
        } catch {
          // Ignore localStorage errors
        }
        return queryLang;
      }
    } catch {
      // Ignore query parsing errors
    }
  }

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem("nelias-lang");
      if (stored === "en" || stored === "fr") {
        return stored;
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  return "en";
}

const initialLng = detectInitialLanguage();

// Set <html lang> initially
if (typeof document !== "undefined") {
  document.documentElement.lang = initialLng;
}

const warnedKeys = new Set();
const isDev = Boolean(import.meta.env.DEV);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  supportedLngs: ["en", "fr"],
  fallbackLng: "en",
  defaultNS: "common",
  ns: Object.keys(resources.en || {}),
  interpolation: { escapeValue: false },
  ...(isDev
    ? {
        saveMissing: true,
        missingKeyHandler: (lngs, ns, key) => {
          const primaryLng = Array.isArray(lngs) ? lngs[0] : lngs;
          const combo = `${primaryLng}:${ns}:${key}`;
          if (!warnedKeys.has(combo)) {
            warnedKeys.add(combo);
            console.warn("[i18n] missing key", primaryLng, ns, key);
          }
        },
      }
    : {}),
});

// Sync <html lang> and persist on language change
i18n.on("languageChanged", (lng) => {
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
});

export default i18n;
