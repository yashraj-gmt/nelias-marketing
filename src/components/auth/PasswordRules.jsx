import { useTranslation } from "react-i18next";
import { Check, Circle } from "lucide-react";
import { passwordChecks } from "@/lib/auth/validators";
import { cn } from "@/lib/cn";

/**
 * Visual and accessible checklist of password requirements.
 * Driven by pure passwordChecks; never relies on color alone.
 *
 * @param {Object} props
 * @param {string} [props.value=""] - Current password input value
 * @param {string} [props.id="password-rules"] - Element ID for aria-describedby
 * @param {string} [props.className]
 */
export function PasswordRules({ value = "", id = "password-rules", className }) {
  const { t } = useTranslation();
  const checks = passwordChecks(value);

  const rules = [
    {
      key: "length",
      label: t("auth:password.rules.length"),
      met: checks.length,
    },
    {
      key: "case",
      label: t("auth:password.rules.case"),
      met: checks.case,
    },
    {
      key: "digit",
      label: t("auth:password.rules.digit"),
      met: checks.digit,
    },
  ];

  return (
    <div id={id} className={cn("mt-2 rounded-md bg-surface-muted p-3 text-sm", className)}>
      <p className="text-xs font-semibold text-fg-muted">{t("auth:password.rulesTitle")}</p>
      <ul className="mt-2 space-y-1.5">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-2">
            {rule.met ? (
              <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
            )}
            <span className={rule.met ? "text-fg font-medium" : "text-fg-muted"}>
              {rule.label}
              <span className="sr-only">
                {" "}
                ({rule.met ? t("auth:password.ruleMet") : t("auth:password.ruleNotMet")})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

