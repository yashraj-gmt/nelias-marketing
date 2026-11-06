import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { mainNav } from "@/config/navigation";
import { EVENTS, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * Desktop navigation bar for xl screens and up.
 */
export function DesktopNav() {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={t("header.mainNavLabel")}
      className="hidden items-center gap-0.5 xl:flex 2xl:gap-1"
    >
      {mainNav.map(({ key, to }) => (
        <NavLink
          key={key}
          to={to}
          end={to === "/"}
          onClick={(e) => {
            if (to === "#") e.preventDefault();
            track(EVENTS.NAV_CLICK, { key });
          }}
          className={({ isActive }) =>
            cn(
              "relative px-2 py-2 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors 2xl:px-2.5",
              isActive && to !== "#"
                ? "text-heading after:absolute after:right-2 after:bottom-0 after:left-2 after:h-0.5 after:bg-accent"
                : "text-fg-strong hover:text-link",
            )
          }
        >
          {t(`nav.${key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
