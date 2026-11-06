import { useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Field } from "./Field";
import { Input } from "./Input";
import { cn } from "@/lib/cn";

/**
 * Password input with integrated show/hide toggle button.
 * Wraps Field and Input while handling accessibility attributes and toggle state.
 *
 * @param {Object} props
 * @param {string} [props.id]
 * @param {string} [props.name="password"]
 * @param {string} props.label
 * @param {string} [props.value]
 * @param {import("react").ChangeEventHandler<HTMLInputElement>} [props.onChange]
 * @param {import("react").FocusEventHandler<HTMLInputElement>} [props.onBlur]
 * @param {string} [props.error]
 * @param {string} [props.hint]
 * @param {string} [props.autoComplete="current-password"]
 * @param {string} [props.enterKeyHint]
 * @param {number} [props.maxLength=256]
 * @param {string} [props.describedBy]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.visible] - Controlled visibility state
 * @param {(visible: boolean) => void} [props.onVisibleChange]
 * @param {string} [props.className]
 * @param {string} [props.inputClassName]
 */
export const PasswordField = forwardRef(function PasswordField(
  {
    id,
    name = "password",
    label,
    value,
    onChange,
    onBlur,
    error,
    hint,
    autoComplete = "current-password",
    enterKeyHint,
    maxLength = 256,
    describedBy,
    required = false,
    visible: controlledVisible,
    onVisibleChange,
    className,
    inputClassName,
    ...rest
  },
  ref,
) {
  const { t } = useTranslation();
  const [internalVisible, setInternalVisible] = useState(false);

  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : internalVisible;

  const handleToggle = () => {
    const next = !visible;
    if (!isControlled) {
      setInternalVisible(next);
    }
    if (onVisibleChange) {
      onVisibleChange(next);
    }
  };

  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {(controlProps) => (
        <div className="relative">
          <Input
            {...controlProps}
            ref={ref}
            type={visible ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete={autoComplete}
            enterKeyHint={enterKeyHint}
            maxLength={maxLength}
            aria-describedby={
              [controlProps["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined
            }
            className={cn("pr-12", inputClassName)}
            {...rest}
          />
          <button
            type="button"
            aria-pressed={visible}
            aria-label={visible ? t("auth:password.hide") : t("auth:password.show")}
            onClick={handleToggle}
            className="absolute inset-y-0 right-0 flex h-full w-12 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm text-fg-muted transition-colors hover:text-heading focus-visible:outline-2 focus-visible:outline-accent"
          >
            {visible ? (
              <EyeOff className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5 shrink-0" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </Field>
  );
});

