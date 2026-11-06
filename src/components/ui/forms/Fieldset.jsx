import { useId } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Fieldset wrapper for checkbox and radio groups with legend, hint and error.
 *
 * @param {Object} props
 * @param {string} props.legend
 * @param {string} [props.hint]
 * @param {string} [props.error]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.optional=false]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Fieldset({
  legend,
  hint,
  error,
  required = false,
  optional = false,
  className,
  children,
  ...rest
}) {
  const { t } = useTranslation();
  const id = useId();

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      className={cn("m-0 border-0 p-0", className)}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error ? "true" : undefined}
      {...rest}
    >
      <legend className="mb-1 block text-[0.9375rem] font-semibold text-heading">
        {legend}
        {required && (
          <>
            <span className="sr-only"> ({t("ui.required")})</span>
            <span aria-hidden="true" className="ml-1 text-cta">
              *
            </span>
          </>
        )}
        {optional && (
          <span className="ml-1.5 text-sm font-normal text-fg-muted">({t("ui.optional")})</span>
        )}
      </legend>

      {hint && (
        <p id={hintId} className="mb-2 text-sm text-fg-muted">
          {hint}
        </p>
      )}

      {children}

      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger"
        >
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
