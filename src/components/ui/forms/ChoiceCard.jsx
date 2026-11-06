import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Selectable card for choice selection in forms and interactive selectors.
 *
 * @param {Object} props
 * @param {"radio"|"checkbox"} [props.type="radio"]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import("react").ComponentType} [props.icon]
 * @param {import("react").ReactNode} [props.badge]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 */
export const ChoiceCard = forwardRef(function ChoiceCard(
  {
    type = "radio",
    title,
    description,
    icon: IconComponent,
    badge,
    disabled = false,
    className,
    id,
    onMouseEnter,
    onMouseLeave,
    ...inputProps
  },
  ref,
) {
  const isRadio = type === "radio";
  const hasDetails = Boolean(description);

  return (
    <label
      htmlFor={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group relative flex min-h-[4.5rem] cursor-pointer gap-3.5 rounded-lg border border-line bg-surface-raised p-4 transition-all select-none",
        hasDetails ? "items-start" : "items-center",
        "hover:border-line-strong",
        "has-[:checked]:border-accent has-[:checked]:bg-surface-tint has-[:checked]:ring-1 has-[:checked]:ring-accent",
        "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        ref={ref}
        id={id}
        type={type}
        disabled={disabled}
        className="peer sr-only"
        {...inputProps}
      />

      {/* Optional leading icon */}
      {IconComponent && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-heading transition-colors group-has-[:checked]:bg-accent-soft group-has-[:checked]:text-accent-strong">
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </span>
      )}

      {/* Title, description and badge */}
      <div className={cn("flex-1 pr-6", !hasDetails && "flex items-center")}>
        <div className="flex items-center gap-2">
          <span className="leading-snug font-semibold text-heading">{title}</span>
          {badge}
        </div>
        {description && <p className="mt-1 text-sm leading-relaxed text-fg-muted">{description}</p>}
      </div>

      {/* Explicit top-right status indicator */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute right-4 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-field transition-colors",
          hasDetails ? "top-4" : "top-1/2 -translate-y-1/2",
          isRadio ? "rounded-full" : "rounded-xs",
          "peer-checked:border-selected peer-checked:bg-selected peer-checked:[&>svg]:opacity-100",
        )}
      >
        <Check
          className="h-3.5 w-3.5 stroke-[3] text-selected-fg opacity-0 transition-opacity"
          aria-hidden="true"
        />
      </span>
    </label>
  );
});
