import { useTranslation } from "react-i18next";
import { IconBadge } from "@/components/ui/IconBadge";
import { heroTiles } from "@/data/home-content";

/**
 * Decorative animated hero workspace composition.
 * Combines SVG ribbon draw and delayed workspace card entrance.
 */
export function HeroComposition() {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[5/4] w-full max-w-xl select-none lg:max-w-none"
    >
      {/* Layer 1: Inline SVG Ribbon with brand gradient and azure accent */}
      <svg
        viewBox="0 0 500 400"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="hero-ribbon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-flame-500)" />
            <stop offset="45%" stopColor="var(--color-flame-400)" />
            <stop offset="100%" stopColor="var(--color-sun-300)" />
          </linearGradient>
        </defs>

        {/* Primary bold flame-to-sun ribbon */}
        <path
          d="M 30 360 C 130 310, 210 110, 470 50"
          stroke="url(#hero-ribbon-grad)"
          strokeWidth="26"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          className="animate-ribbon-draw"
        />

        {/* Secondary echoing azure ribbon */}
        <path
          d="M 50 110 C 150 210, 310 290, 450 330"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          style={{ animationDelay: "220ms" }}
          className="animate-ribbon-draw"
        />
      </svg>

      {/* Layer 2: White Workspace Panel */}
      <div className="absolute top-1/2 right-1 z-10 w-[92%] -translate-y-1/2 overflow-hidden rounded-xl border border-line bg-surface-raised shadow-raised sm:right-4 sm:w-[88%] lg:right-2 lg:w-[94%] xl:right-4 xl:w-[90%]">
        {/* Workspace panel chrome */}
        <div className="flex items-center justify-between border-b border-line bg-surface-muted px-3.5 py-2 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-1.5" role="presentation">
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
            <span className="h-2 w-2 rounded-full bg-line-strong/80" />
          </div>
          <div className="rounded-full border border-line bg-surface-raised px-2.5 py-0.5 text-xs font-medium tracking-tight text-fg-muted">
            {t("home:composition.address")}
          </div>
        </div>

        {/* 6 Capability Tiles Grid*/}
        <div className="grid grid-cols-2 gap-2 bg-surface p-2.5 sm:grid-cols-3 sm:gap-2.5 sm:p-3.5 lg:gap-2 lg:p-3 xl:gap-2.5 xl:p-4">
          {heroTiles.map(({ id, icon }, index) => (
            <div
              key={id}
              style={{ animationDelay: `${600 + index * 70}ms` }}
              className="flex min-w-0 animate-tile-in items-center gap-2 rounded-lg border border-line bg-surface-raised p-2 shadow-2xs sm:p-2.5"
            >
              <IconBadge icon={icon} tone="azure" size="sm" className="shrink-0" />
              <span className="truncate font-display text-xs leading-tight font-semibold text-heading lg:text-[11px] xl:text-xs 2xl:text-sm">
                {t(`home:heroTiles.${id}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
