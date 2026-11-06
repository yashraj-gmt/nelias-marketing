import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/cn";

/**
 * Accessible icon button to toggle between light and dark themes.
 *
 * @param {Object} props
 * @param {"default"|"onDark"} [props.variant="default"]
 * @param {"md"|"sm"} [props.size="md"]
 * @param {string} [props.className]
 */
export function ThemeToggle({ variant = "default", size = "md", className }) {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();

  const label = t("common:theme.darkMode");

  const sizeClasses =
    variant === "onDark" && size === "sm"
      ? "h-9 w-9 text-fg-inverse-muted hover:text-white hover:bg-white/10"
      : "h-11 w-11 border border-line text-heading hover:bg-surface-tint";

  const IconComponent = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors",
        "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
        sizeClasses,
        className,
      )}
    >
      <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" focusable="false" />
    </button>
  );
}
