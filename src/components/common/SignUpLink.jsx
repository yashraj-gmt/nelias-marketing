import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { site } from "@/config/site";
import { buttonStyles } from "@/components/ui/button-styles";
import { EVENTS, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

// TODO(Debass): confirm the sign-up address and whether it should open in the same tab.

/**
 * Sign Up button link. Routes to the internal /sign-up page or external endpoint.
 *
 * @param {Object} props
 * @param {"primary"|"secondary"|"outline"|"ghost"|"onDark"|"white"|"azure"} [props.variant="primary"]
 * @param {"sm"|"md"|"lg"} [props.size]
 * @param {string} [props.location] - Tracking location (e.g. "home-final")
 * @param {string} [props.className]
 * @param {import("react").MouseEventHandler<HTMLAnchorElement>} [props.onClick]
 * @param {import("react").ReactNode} [props.children]
 */
export function SignUpLink({
  variant = "primary",
  size,
  location,
  className,
  children,
  onClick,
  newTab,
  target,
  rel,
  ...rest
}) {
  const { t } = useTranslation();
  const label = children || t("common:cta.signUp");

  function handleClick(e) {
    track(EVENTS.CTA_CLICK, { location });
    if (onClick) {
      onClick(e);
    }
  }

  const isNewTab = newTab || target === "_blank";
  const isInternal = site.signUpUrl.startsWith("/");

  if (isInternal && !isNewTab) {
    return (
      <Link
        to={site.signUpUrl}
        onClick={handleClick}
        className={cn(buttonStyles({ variant, size }), className)}
        {...rest}
      >
        {label}
      </Link>
    );
  }

  return (
    <a
      href={site.signUpUrl}
      onClick={handleClick}
      target={isNewTab ? "_blank" : target}
      rel={isNewTab ? rel || "noopener noreferrer" : rel}
      className={cn(buttonStyles({ variant, size }), className)}
      {...rest}
    >
      {label}
    </a>
  );
}
