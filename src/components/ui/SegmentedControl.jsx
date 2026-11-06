import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Accessible segmented switch control built with native radio inputs.
 *
 * @param {Object} props
 * @param {Array<{ value: string, label: string, badge?: import("react").ReactNode }>} props.options
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {string} [props.name]
 * @param {string} [props.label="Selection"] - Accessible legend name
 * @param {"md"|"lg"} [props.size="md"]
 * @param {string} [props.className]
 */
export function SegmentedControl({
  options = [],
  value,
  onChange,
  name: explicitName,
  label = "Options",
  size = "md",
  className,
}) {
  const generatedId = useId();
  const name = explicitName || `segmented-${generatedId}`;

  return (
    <fieldset
      className={cn(
        "m-0 flex w-full max-w-sm items-center rounded-md border-0 bg-surface-sunken p-1 sm:inline-flex sm:w-auto sm:max-w-none",
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>

      {options.map((opt) => {
        const isSelected = opt.value === value;

        return (
          <label
            key={opt.value}
            className={cn(
              "relative inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded font-semibold transition-colors select-none sm:flex-initial",
              size === "lg" ? "min-h-12 px-5 text-base" : "min-h-11 px-4 text-sm md:text-base",
              isSelected
                ? "bg-selected text-selected-fg shadow-xs"
                : "text-fg-strong hover:text-heading",
              "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange?.(opt.value)}
              className="sr-only"
            />
            <span>{opt.label}</span>
            {opt.badge && <span className="shrink-0">{opt.badge}</span>}
          </label>
        );
      })}
    </fieldset>
  );
}
