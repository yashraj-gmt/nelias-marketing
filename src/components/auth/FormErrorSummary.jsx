import { useTranslation } from "react-i18next";
import { Alert } from "@/components/ui/Alert";

/**
 * Accessible form error summary banner.
 * Emits role="alert" with assertive live region and links to invalid fields.
 *
 * @param {Object} props
 * @param {Array<{ id: string, message: string }> | Record<string, string>} props.errors
 * @param {string} [props.id="form-error-summary"]
 * @param {string} [props.className]
 */
export function FormErrorSummary({
  errors = [],
  id = "form-error-summary",
  className,
  ...rest
}) {
  const { t } = useTranslation();

  const errorItems = Array.isArray(errors)
    ? errors
    : Object.entries(errors)
        .filter(([, msg]) => Boolean(msg))
        .map(([fieldId, msg]) => ({
          id: fieldId,
          message: typeof msg === "string" ? msg : msg?.message || String(msg),
        }));

  if (errorItems.length === 0) {
    return null;
  }

  const handleLinkClick = (fieldId) => (e) => {
    e.preventDefault();
    const el = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
    if (el && typeof el.focus === "function") {
      el.focus();
      if (typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Alert
      id={id}
      tone="danger"
      live="assertive"
      tabIndex={-1}
      title={t("auth:summary.title")}
      className={className}
      {...rest}
    >
      <ul className="list-disc pl-5 space-y-1">
        {errorItems.map(({ id: fieldId, message }) => (
          <li key={fieldId}>
            <a
              href={`#${fieldId}`}
              onClick={handleLinkClick(fieldId)}
              className="font-medium underline hover:text-danger-strong focus-visible:outline-2 focus-visible:outline-accent"
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </Alert>
  );
}

