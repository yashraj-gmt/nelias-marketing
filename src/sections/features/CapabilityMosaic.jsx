import { cn } from "@/lib/cn";
import { visibleAreas } from "@/data/feature-order";
import { areaIcons } from "@/data/industry-content";

/**
 * Returns role classes for a tile by its index in the mosaic.
 * @param {number} index
 * @returns {string}
 */
function getTileClasses(index) {
  if (index === 0 || index === 5 || index === 10) {
    return "bg-selected text-selected-fg border-transparent";
  }
  if (index === 2 || index === 7) {
    return "bg-accent-soft text-link border-transparent";
  }
  return "bg-surface-raised text-link border-line";
}

/**
 * Decorative mosaic illustrating the 12 capability areas.
 * Features an SVG ribbon sweep and entrance-animated icon tiles.
 *
 * @returns {import("react").JSX.Element}
 */
export function CapabilityMosaic() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[4/3] w-full max-w-sm select-none lg:max-w-none"
    >
      {/* Layer 1: Ribbon sweep SVG */}
      <svg
        viewBox="0 0 400 300"
        fill="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="features-mosaic-ribbon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-flame-500)" />
            <stop offset="45%" stopColor="var(--color-flame-400)" />
            <stop offset="100%" stopColor="var(--color-sun-300)" />
          </linearGradient>
        </defs>
        <path
          d="M10 262 C 70 300, 190 290, 250 200 S 358 42, 392 18"
          stroke="url(#features-mosaic-ribbon)"
          strokeWidth="14"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          className="animate-ribbon-draw"
        />
      </svg>

      {/* Layer 2: Capability icon tiles */}
      <div className="relative grid h-full grid-cols-4 gap-3 p-3">
        {visibleAreas.map((key, index) => {
          const Icon = areaIcons[key];
          return (
            <div
              key={key}
              style={{ animationDelay: `${index * 50}ms` }}
              className={cn(
                "grid aspect-square animate-tile-in place-items-center rounded-lg border",
                getTileClasses(index),
              )}
            >
              {Icon && <Icon size={26} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
