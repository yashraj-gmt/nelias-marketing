import { useTranslation } from "react-i18next";
import { buttonStyles } from "./button-styles";
import { Spinner } from "./Spinner";

/**
 * Primary button component.
 *
 * @param {Object} props
 * @param {"primary"|"secondary"|"outline"|"ghost"|"onDark"} [props.variant="primary"]
 * @param {"md"|"lg"|"icon"} [props.size="md"]
 * @param {boolean} [props.disabled=false]
 * @param {boolean} [props.loading=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} [props.children]
 * @param {string} [props.type="button"]
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  children,
  type = "button",
  ...rest
}) {
  const { t } = useTranslation();
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading ? "true" : undefined}
      className={buttonStyles({
        variant,
        size,
        disabled: isDisabled,
        fullWidth,
        className,
      })}
      {...rest}
    >
      {loading && <Spinner size={size === "lg" ? "md" : "sm"} className="shrink-0" />}
      {children}
      {loading && <span className="sr-only"> ({t("ui.loading")})</span>}
    </button>
  );
}
