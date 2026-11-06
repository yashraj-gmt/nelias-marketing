import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { fieldControlClasses } from "./field-styles";
import { cn } from "@/lib/cn";

/**
 * Native select with custom chevron indicator and optional placeholder.
 */
export const Select = forwardRef(function Select(
  { placeholder, options, children, className, defaultValue, value, ...props },
  ref,
) {
  const { t } = useTranslation();
  const placeholderText =
    placeholder === true
      ? t("ui.select.placeholder")
      : typeof placeholder === "string"
        ? placeholder
        : null;

  return (
    <div className="relative w-full">
      <select
        ref={ref}
        defaultValue={
          value !== undefined
            ? undefined
            : defaultValue !== undefined
              ? defaultValue
              : placeholderText
                ? ""
                : undefined
        }
        value={value}
        className={cn(fieldControlClasses, "cursor-pointer appearance-none pr-10", className)}
        {...props}
      >
        {placeholderText && (
          <option value="" disabled>
            {placeholderText}
          </option>
        )}
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-fg-subtle">
        <ChevronDown className="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  );
});
