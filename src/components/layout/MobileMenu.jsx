import { useEffect, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { HeaderCtas } from "./HeaderCtas";
import { mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { EVENTS, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Mobile drawer navigation dialog.
 * Opens as a native modal with trapped focus, Esc key dismiss, and backdrop dismissal.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 */
export function MobileMenu({ open, onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);
  const location = useLocation();

  // Sync open state with native dialog methods
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  // Handle native cancel (Esc key) and close events
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  // Close on route change
  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close when clicking on backdrop
  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      id="mobile-menu"
      ref={dialogRef}
      aria-label={t("header.menu")}
      onClick={handleDialogClick}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-sm animate-drawer-in overflow-y-auto bg-surface p-0 text-fg shadow-raised backdrop:bg-navy-950/60 open:flex open:flex-col"
    >
      {/* Top bar with logo and close button */}
      <div className="flex min-h-16 shrink-0 items-center justify-between border-b border-line px-5 py-3">
        <Logo onNavigate={onClose} />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("a11y.closeMenu")}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md text-fg-strong transition-colors hover:bg-surface-sunken hover:text-heading"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Main navigation list (56px rows) */}
      <nav aria-label={t("header.mainNavLabel")} className="shrink-0">
        <ul className="flex flex-col">
          {mainNav.map(({ key, to }) => (
            <li key={key}>
              <NavLink
                to={to}
                end={to === "/"}
                onClick={(e) => {
                  if (to === "#") e.preventDefault();
                  track(EVENTS.NAV_CLICK, { key });
                  onClose();
                }}
                className={({ isActive }) =>
                  cn(
                    "relative flex h-14 items-center border-b border-line px-5 text-[17px] font-semibold transition-colors",
                    isActive && to !== "#"
                      ? "border-l-[3px] border-l-accent bg-surface-tint/50 pl-[17px] text-heading"
                      : "text-fg-strong hover:bg-surface-muted hover:text-link",
                  )
                }
              >
                {t(`nav.${key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Secondary utility group: Sign Up, Sign In, Language and Theme */}
      <div className="flex shrink-0 flex-col gap-1 border-b border-line px-5 py-3">
        {site.signUpUrl.startsWith("/") ? (
          <Link
            to={site.signUpUrl}
            onClick={() => {
              track(EVENTS.NAV_CLICK, { key: "signUp" });
              onClose();
            }}
            className="flex min-h-11 items-center rounded-md px-2 text-[15px] font-semibold text-fg-strong transition-colors hover:text-link"
          >
            {t("nav.signUp")}
          </Link>
        ) : (
          <a
            href={site.signUpUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track(EVENTS.NAV_CLICK, { key: "signUp" });
              onClose();
            }}
            className="flex min-h-11 items-center rounded-md px-2 text-[15px] font-semibold text-fg-strong transition-colors hover:text-link"
          >
            {t("nav.signUp")}
          </a>
        )}
        {site.loginUrl.startsWith("/") ? (
          <Link
            to={site.loginUrl}
            onClick={() => {
              track(EVENTS.NAV_CLICK, { key: "signIn" });
              onClose();
            }}
            className="flex min-h-11 items-center rounded-md px-2 text-[15px] font-semibold text-fg-strong transition-colors hover:text-link"
          >
            {t("nav.signIn")}
          </Link>
        ) : (
          <a
            href={site.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              track(EVENTS.NAV_CLICK, { key: "signIn" });
              onClose();
            }}
            className="flex min-h-11 items-center rounded-md px-2 text-[15px] font-semibold text-fg-strong transition-colors hover:text-link"
          >
            {t("nav.signIn")}
          </a>
        )}
        <div className="flex items-center justify-between pt-2">
          <LanguageSwitcher variant="default" />
          <ThemeToggle size="md" />
        </div>
      </div>

      {/* Sticky bottom CTA container */}
      <div className="mt-auto shrink-0 border-t border-line bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <HeaderCtas stacked location="mobile-menu" size="lg" />
      </div>
    </dialog>
  );
}
