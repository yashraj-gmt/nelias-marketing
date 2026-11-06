import { industries } from "@/data/industries";
import { industryProfiles } from "@/data/home-content";

/**
 * Decorative hub illustration for Industries landing page.
 * Displays 12 industry icons around a central brand-ribbon hub.
 *
 * @returns {import("react").JSX.Element}
 */
export function IndustriesHub() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid aspect-square w-full max-w-sm grid-cols-4 gap-3 select-none sm:max-w-md"
    >
      {industries.map((slug, index) => {
        const Icon = industryProfiles[slug]?.icon;

        return (
          <div
            key={slug}
            style={{ animationDelay: `${index * 60}ms` }}
            className="grid aspect-square animate-tile-in place-items-center rounded-lg border border-line bg-surface-raised text-link"
          >
            {Icon && (
              <Icon className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]" aria-hidden="true" />
            )}
          </div>
        );
      })}

      <div
        key="hub"
        className="col-start-2 col-end-4 row-start-2 row-end-4 grid place-items-center rounded-xl bg-selected"
      >
        <svg
          viewBox="0 0 56 56"
          fill="none"
          aria-hidden="true"
          focusable="false"
          className="h-[88px] w-[88px]"
        >
          <defs>
            <linearGradient id="hub-ribbon-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-flame-500)" />
              <stop offset="45%" stopColor="var(--color-flame-400)" />
              <stop offset="100%" stopColor="var(--color-sun-300)" />
            </linearGradient>
          </defs>
          <path
            d="M 12 42 C 16 22, 36 14, 44 22"
            fill="none"
            stroke="url(#hub-ribbon-grad)"
            strokeWidth="9"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            className="animate-ribbon-draw"
          />
        </svg>
      </div>
    </div>
  );
}
