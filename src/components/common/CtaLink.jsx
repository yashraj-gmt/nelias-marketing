import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { EVENTS, track } from "@/lib/analytics";
/**
 * Intent-to-destination mapping.
 */
function resolveIntent(intent, t) {
  switch (intent) {
    case "demo":
      return { to: "/demo", label: t("cta.bookDemo") };
    case "contact":
      return { to: "/contact", label: t("cta.contactTeam") };
    default:
      return { to: "/demo", label: "" };
  }
}

/**
 * CTA link styled as a button. Routes based on intent and feature flags.
 *
 * @param {Object} props
 * @param {"demo"|"contact"} [props.intent]
 * @param {string} [props.to] - Override destination
 * @param {string} [props.label] - Override label (children take precedence)
 * @param {"primary"|"secondary"|"outline"|"ghost"|"onDark"|"white"|"azure"} [props.variant="primary"]
 * @param {"md"|"lg"} [props.size="md"]
 * @param {string} [props.className]
 * @param {string} [props.location] - Tracking location (e.g. "header", "mobile-menu", "sticky", "footer")
 * @param {import("react").MouseEventHandler<HTMLAnchorElement>} [props.onClick]
 * @param {import("react").ReactNode} [props.children]
 */
export function CtaLink({
  intent,
  to: _to,
  label,
  variant = "primary",
  size = "md",
  className,
  location,
  onClick,
  children,
  ...rest
}) {
  const { t } = useTranslation();
  const resolved = intent ? resolveIntent(intent, t) : { to: "/demo", label: label || "" };
  const destination = _to || resolved.to;
  const displayLabel = children || label || resolved.label;

  function handleClick(e) {
    if (destination === "#") {
      e.preventDefault();
    }
    track(EVENTS.CTA_CLICK, { intent, location });
    if (onClick) {
      onClick(e);
    }
  }

  return (
    <Link
      to={destination}
      className={cn(buttonStyles({ variant, size }), className)}
      onClick={handleClick}
      {...rest}
    >
      {displayLabel}
    </Link>
  );
}
