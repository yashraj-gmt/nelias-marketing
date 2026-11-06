import { EVENTS, track } from "@/lib/analytics";

export const THEMES = ["light", "dark"];
export const STORAGE_KEY = "nelias-theme";

const subscribers = new Set();
let mediaQueryList = null;
let mediaListener = null;
let initialized = false;

function apply(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", theme === "dark" ? "#04172B" : "#002B52");
}

export function getTheme() {
  if (typeof document === "undefined") return "light";
  const current = document.documentElement.getAttribute("data-theme");
  return current === "dark" ? "dark" : "light";
}

function notify(theme) {
  for (const callback of subscribers) {
    callback(theme);
  }
}

function stopListeningToSystem() {
  if (mediaQueryList && mediaListener) {
    if (mediaQueryList.removeEventListener) {
      mediaQueryList.removeEventListener("change", mediaListener);
    } else if (mediaQueryList.removeListener) {
      mediaQueryList.removeListener(mediaListener);
    }
    mediaListener = null;
  }
}

function startListeningToSystem() {
  if (typeof window === "undefined" || !window.matchMedia) return;
  stopListeningToSystem();
  mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
  mediaListener = (e) => {
    let stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (!stored) {
      const next = e.matches ? "dark" : "light";
      apply(next);
      notify(next);
    }
  };
  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener("change", mediaListener);
  } else if (mediaQueryList.addListener) {
    mediaQueryList.addListener(mediaListener);
  }
}

export function setTheme(theme) {
  if (!THEMES.includes(theme)) return;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
  stopListeningToSystem();
  apply(theme);
  notify(theme);
  track(EVENTS.THEME_CHANGE, { to: theme });
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
}

export function subscribe(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export function initTheme() {
  if (initialized) return;
  initialized = true;

  if (typeof window === "undefined") return;

  let themeToApply = "light";
  let hasExplicitChoice = false;

  // (a) check ?theme=dark|light
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("theme");
    if (q === "dark" || q === "light") {
      themeToApply = q;
      hasExplicitChoice = true;
      try {
        localStorage.setItem(STORAGE_KEY, q);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  // (b) stored choice
  if (!hasExplicitChoice) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") {
        themeToApply = stored;
        hasExplicitChoice = true;
      }
    } catch {
      // ignore
    }
  }

  // (c) system preference
  if (!hasExplicitChoice) {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      themeToApply = "dark";
    }
    startListeningToSystem();
  }

  apply(themeToApply);
}
