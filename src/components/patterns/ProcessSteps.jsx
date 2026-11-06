import { useRef } from "react";
import { User, Settings2, CheckCircle2, Zap } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const defaultIcons = [User, Settings2, CheckCircle2, Zap];

/**
 * Sequential process steps list with circular icons, dashed wave connector,
 * and step badges matching the modern multi-step journey layout.
 *
 * @param {Object} props
 * @param {Array<{ title: string, text: string, icon?: import("react").ComponentType }>} props.steps
 * @param {number} [props.headingLevel=3]
 * @param {3|4} [props.columns=3]
 * @param {boolean} [props.animated=false]
 * @param {string} [props.className]
 */
export function ProcessSteps({
  steps = [],
  headingLevel = 3,
  columns = 4,
  animated = false,
  className,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    threshold: 0.02,
    rootMargin: "0px 0px 50px 0px",
  });
  const prefersReduced = usePrefersReducedMotion();

  const isVisible = !animated || prefersReduced || isInView;
  const HeadingTag = `h${headingLevel}`;

  const colClasses =
    columns === 4
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div ref={ref} className="relative w-full">
      {/* Dashed wave connector line between step circles on desktop (lg and up) */}
      <svg
        className="pointer-events-none absolute top-12 left-0 z-0 hidden h-20 w-full text-line-strong lg:block"
        viewBox="0 0 1000 80"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {columns === 4 ? (
          <>
            {/* Wave 1 to 2 (curves down) */}
            <path
              d="M 180 40 Q 250 75 320 40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            {/* Wave 2 to 3 (curves up) */}
            <path
              d="M 430 40 Q 500 5 570 40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            {/* Wave 3 to 4 (curves down) */}
            <path
              d="M 680 40 Q 750 75 820 40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            {/* Wave 1 to 2 (curves down) */}
            <path
              d="M 225 40 Q 332 75 440 40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
            {/* Wave 2 to 3 (curves up) */}
            <path
              d="M 560 40 Q 668 5 775 40"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 8"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      <ol className={cn("relative z-10 grid gap-10 lg:gap-6", colClasses, className)}>
        {steps.map(({ title, text, icon: CustomIcon }, index) => {
          const stepNumber = index + 1;
          const StepIcon = CustomIcon || defaultIcons[index % defaultIcons.length];

          const animationStyle =
            animated && !prefersReduced ? { animationDelay: `${index * 100}ms` } : undefined;

          return (
            <li
              key={stepNumber}
              style={animationStyle}
              className={cn(
                "group flex flex-col items-center text-center",
                animated &&
                  !prefersReduced && [isVisible ? "animate-tile-in" : "translate-y-2 opacity-0"],
              )}
            >
              {/* Circular step frame with step number badge */}
              <div className="relative mb-6 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                {/* Number pill badge at top-left of circle */}
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -left-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface-raised text-xs font-bold text-heading shadow-xs"
                >
                  {stepNumber}
                </span>

                {/* Outer circular frame (elevated disc or dashed ring) */}
                <div
                  className={cn(
                    "flex h-full w-full items-center justify-center rounded-full transition-all duration-300",
                    index === 0
                      ? "border-2 border-accent bg-surface-raised shadow-raised ring-8 ring-surface-tint/70"
                      : "border-2 border-dashed border-line-strong bg-surface-raised/90 hover:scale-105 hover:border-accent hover:shadow-card",
                  )}
                >
                  {/* Inner icon background */}
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full transition-colors sm:h-16 sm:w-16",
                      index === 0
                        ? "bg-surface-tint text-accent-strong"
                        : "bg-surface-sunken/70 text-fg-muted group-hover:bg-surface-tint group-hover:text-accent-strong",
                    )}
                  >
                    <StepIcon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                  </span>
                </div>
              </div>

              {/* Step Title */}
              <HeadingTag className="mb-2.5 font-display text-lg font-bold text-heading md:text-xl">
                {title}
              </HeadingTag>

              {/* Step Description */}
              <p className="max-w-[280px] text-sm leading-relaxed text-fg-muted md:text-base">
                {text}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
