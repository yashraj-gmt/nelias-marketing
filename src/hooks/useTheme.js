import { useSyncExternalStore } from "react";
import { getTheme, setTheme, toggleTheme, subscribe } from "@/theme/theme";

/**
 * React hook to read and mutate the active theme.
 * Synchronizes with theme.js via useSyncExternalStore.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const isDark = theme === "dark";

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
