import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Step progress tracker for multi-step flows and wizards.
 *
 * @param {Object} props
 * @param {Array<{ id: string, label: string }>} props.steps
 * @param {number} props.current - Zero-based index of current active step
 * @param {(index: number) => void} [props.onStepClick] - Callback for navigating to previous completed steps
 * @param {string} [props.className]
 */
export function StepProgress({ steps = [], current = 0, onStepClick, className }) {
  const { t } = useTranslation();
  const total = steps.length;
  const currentStepNum = Math.min(Math.max(current + 1, 1), total);

  return (
    <nav
      aria-label={t("ui.stepOf", { current: currentStepNum, total })}
      className={cn("w-full", className)}
    >
      {/* Mobile progress display */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-fg-muted">
          <span>{t("ui.stepOf", { current: currentStepNum, total })}</span>
          <span className="font-bold text-heading">{steps[current]?.label}</span>
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={currentStepNum}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full bg-selected transition-all duration-300"
            style={{ width: `${(currentStepNum / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / tablet horizontal stepped list */}
      <ol className="hidden w-full items-center justify-between gap-4 md:flex">
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isClickable = isCompleted && typeof onStepClick === "function";

          const StepElement = isClickable ? "button" : "div";

          return (
            <li key={step.id || index} className="flex flex-1 items-center gap-3 last:flex-initial">
              <StepElement
                type={isClickable ? "button" : undefined}
                onClick={isClickable ? () => onStepClick(index) : undefined}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2.5 text-left transition-colors",
                  isClickable &&
                    "cursor-pointer rounded hover:opacity-80 focus-visible:outline-2 focus-visible:outline-focus",
                )}
              >
                {/* Status indicator circle */}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isCompleted && "bg-selected text-selected-fg shadow-xs",
                    isCurrent &&
                      "border-2 border-selected bg-surface-raised text-heading shadow-xs",
                    !isCompleted &&
                      !isCurrent &&
                      "border-2 border-line-strong bg-surface-raised text-fg-subtle",
                  )}
                >
                  {isCompleted ? (
                    <>
                      <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
                      <span className="sr-only"> ({t("ui.completed")})</span>
                    </>
                  ) : (
                    index + 1
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    "text-sm whitespace-nowrap",
                    isCompleted && "font-semibold text-heading",
                    isCurrent &&
                      "font-bold text-heading underline decoration-accent decoration-2 underline-offset-4",
                    !isCompleted && !isCurrent && "font-medium text-fg-muted",
                  )}
                >
                  {step.label}
                </span>
              </StepElement>

              {/* Connecting hairline divider between steps */}
              {index < total - 1 && (
                <div
                  className={cn(
                    "ml-2 h-0.5 flex-1 transition-colors",
                    index < current ? "bg-selected" : "bg-line",
                  )}
                  role="presentation"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
