import { useId, isValidElement, cloneElement } from "react";
import { useTranslation } from "react-i18next";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Field wrapper linking label, hint, and error message to a form control.
 *
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} props.label
 * @param {string} [props.hint]
 * @param {string} [props.error]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.optional=false]
 * @param {string} [props.className]
 * @param {((controlProps: { id: string, required: boolean, "aria-describedby"?: string, "aria-invalid"?: "true" }) => import("react").ReactNode) | import("react").ReactNode} props.children
 */
export function Field({
  id: explicitId,
  label,
  hint,
  error,
  required = false,
  optional = false,
  className,
  children,
}) {
  const { t } = useTranslation();
  const generatedId = useId();
  const id = explicitId || generatedId;

  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const ariaDescribedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const ariaInvalid = error ? "true" : undefined;

  const controlProps = {
    id,
    required: !!required,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
  };

  const renderedControl =
    typeof children === "function"
      ? children(controlProps)
      : isValidElement(children)
        ? cloneElement(children, controlProps)
        : children;

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="mb-1 block text-[0.9375rem] font-semibold text-heading">
        {label}
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
      </label>

      {hint && (
        <p id={hintId} className="mb-2 text-sm text-fg-muted">
          {hint}
        </p>
      )}

      {renderedControl}

      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-danger"
        >
          <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
