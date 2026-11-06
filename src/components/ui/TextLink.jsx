import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Inline text link with directional redirect arrow, external target handling, and accessibility announcements.
 *
 * @param {Object} props
 * @param {string} props.to - Route path or URL
 * @param {boolean} [props.external=false]
 * @param {boolean} [props.showArrow=true]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function TextLink({
  to,
  external = false,
  showArrow = true,
  className,
  children,
  onClick,
  ...rest
}) {
  const { t } = useTranslation();
  const isInternal = typeof to === "string" && to.startsWith("/") && !external;
  const linkClasses = cn(
    "group text-link font-semibold underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors inline-flex items-center gap-1.5",
    className,
  );

  const handleClick = (e) => {
    if (to === "#") {
      e.preventDefault();
    }
    if (onClick) {
      onClick(e);
    }
  };

  if (isInternal) {
    return (
      <Link to={to} className={linkClasses} onClick={handleClick} {...rest}>
        <span>{children}</span>
        {showArrow && (
          <ArrowUpRight
            className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  }

  return (
    <a
      href={to}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={linkClasses}
      onClick={handleClick}
      {...rest}
    >
      <span>{children}</span>
      {external ? (
        <>
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only"> {t("ui.externalLink")}</span>
        </>
      ) : showArrow ? (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      ) : null}
    </a>
  );
}
