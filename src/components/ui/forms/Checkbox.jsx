import { forwardRef } from "react";
import { Check, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Custom accessible checkbox. Whole label is clickable and focusable.
 */
export const Checkbox = forwardRef(function Checkbox(
  { label, hint, error, id, disabled = false, className, ...props },
  ref,
) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label
        htmlFor={id}
        className={cn(
          "group inline-flex min-h-11 cursor-pointer items-start gap-3 py-1 select-none",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="relative mt-0.5 flex shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            disabled={disabled}
            className="peer sr-only"
            aria-invalid={error ? "true" : undefined}
            {...props}
          />
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-sm border-2 border-field bg-surface-raised transition-colors",
              "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
              "peer-checked:border-selected peer-checked:bg-selected peer-checked:[&>svg]:opacity-100",
              "peer-disabled:border-line-strong peer-disabled:bg-surface-sunken",
            )}
          >
            <Check
              className="h-4 w-4 stroke-[3] text-selected-fg opacity-0 transition-opacity"
              aria-hidden="true"
            />
          </span>
        </span>

        <span className="flex flex-col pt-0.5">
          <span className="text-[1rem] leading-snug font-medium text-fg">{label}</span>
          {hint && <span className="mt-0.5 text-sm text-fg-muted">{hint}</span>}
        </span>
      </label>

      {error && (
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-danger">
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
