import { useState, useRef, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { features } from "@/config/features";
import { setLanguage } from "@/i18n/language";
import { cn } from "@/lib/cn";

const LANGUAGES = [
  { code: "en", labelKey: "lang.en", shortKey: "lang.enShort" },
  { code: "fr", labelKey: "lang.fr", shortKey: "lang.frShort" },
];

/**
 * Accessible dropdown language selector with smooth transition and keyboard navigation.
 * Hidden unless features.frenchEnabled is true.
 *
 * @param {Object} props
 * @param {"default"|"onDark"} [props.variant="default"]
 * @param {"start"|"end"} [props.align]
 * @param {"top"|"bottom"} [props.placement]
 * @param {string} [props.className]
 */
export function LanguageSwitcher({ variant = "default", align, placement, className }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  // Close on outside click or escape key
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!features.frenchEnabled) {
    return null;
  }

  const currentLang = i18n.resolvedLanguage || i18n.language || "en";
  const isDark = variant === "onDark";

  // Default to right-aligned & downwards on desktop onDark, left-aligned & upwards on mobile default
  const resolvedAlign = align || (isDark ? "end" : "start");
  const resolvedPlacement = placement || (isDark ? "bottom" : "top");

  const handleSelect = (langCode) => {
    setIsOpen(false);
    if (langCode !== currentLang) {
      setLanguage(langCode);
    }
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const triggerClasses = isDark
    ? cn(
        "border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25",
        isOpen && "border-white/30 bg-white/15 shadow-xs",
      )
    : cn(
        "border-line bg-surface text-heading hover:bg-surface-tint hover:border-line-strong",
        isOpen && "border-accent bg-surface-tint shadow-xs ring-1 ring-accent",
      );

  const placementClasses =
    resolvedPlacement === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top";

  const alignClasses = resolvedAlign === "start" ? "left-0" : "right-0";

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${menuId}-menu`}
        aria-label={t("a11y.language")}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition-all duration-200 select-none",
          "focus-visible:outline-2 focus-visible:outline-focus",
          triggerClasses,
        )}
      >
        <Globe
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-colors",
            isDark ? "text-white" : "text-link",
          )}
          aria-hidden="true"
        />
        <span className="tracking-wide uppercase">{t(`lang.${currentLang}Short`)}</span>
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-200 ease-soft",
            isDark ? "text-fg-inverse-muted" : "text-fg-subtle",
            isOpen && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={`${menuId}-menu`}
          role="listbox"
          aria-label={t("a11y.language")}
          aria-activedescendant={`${menuId}-opt-${currentLang}`}
          className={cn(
            "absolute z-50 w-44 animate-modal-in rounded-xl border p-1.5 shadow-raised backdrop-blur-md",
            placementClasses,
            alignClasses,
            isDark
              ? "border-white/15 bg-surface-inverse text-white"
              : "border-line bg-surface-raised/98 text-heading",
          )}
        >
          <div className="flex flex-col gap-1.5">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              const itemClasses = isDark
                ? cn(
                    "border border-transparent text-fg-inverse-muted hover:text-white hover:bg-white/8",
                    isSelected && "border-white/15 bg-white/12 text-white font-semibold shadow-2xs",
                  )
                : cn(
                    "border border-transparent text-fg-strong hover:text-heading hover:bg-surface-tint",
                    isSelected &&
                      "border-accent-line bg-surface-tint text-heading font-semibold shadow-2xs",
                  );

              const badgeClasses = isDark
                ? cn(
                    "bg-white/10 text-fg-inverse-muted",
                    isSelected && "bg-white/20 text-white border border-white/20",
                  )
                : cn(
                    "bg-surface-sunken text-fg-muted",
                    isSelected && "bg-accent-soft text-accent-strong border border-accent-line",
                  );

              return (
                <button
                  key={lang.code}
                  id={`${menuId}-opt-${lang.code}`}
                  role="option"
                  lang={lang.code}
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "flex min-h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-150",
                    "focus-visible:outline-2 focus-visible:outline-focus",
                    itemClasses,
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                        badgeClasses,
                      )}
                    >
                      {t(lang.shortKey)}
                    </span>
                    <span className="truncate text-xs font-semibold">{t(lang.labelKey)}</span>
                  </div>
                  {isSelected && (
                    <Check
                      className={cn(
                        "ml-2 h-3.5 w-3.5 shrink-0 stroke-[2.5]",
                        isDark ? "text-white" : "text-link",
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
