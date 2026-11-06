import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Accessible toggletip for informative hints.
 *
 * @param {Object} props
 * @param {string} [props.label] - Accessible name for info trigger
 * @param {"start"|"end"} [props.align="start"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children - Informative text
 */
export function Toggletip({ label, align = "start", className, children }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const accessibleLabel = label || t("ui.info");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        aria-label={accessibleLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-fg-subtle transition-colors hover:text-heading focus-visible:outline-2 focus-visible:outline-focus"
      >
        <Info className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Screen reader live announcement area (persists in DOM) */}
      <span role="status" className="sr-only">
        {isOpen ? children : ""}
      </span>

      {/* Visual tooltip bubble */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full z-50 mt-1.5 rounded-md bg-secondary p-3 text-sm leading-relaxed text-secondary-fg shadow-raised",
            "w-max max-w-[min(20rem,calc(100vw-2rem))]",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
