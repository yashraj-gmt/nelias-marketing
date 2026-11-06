import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoImg from "@/assets/brand/nelias-logo.png";
import { cn } from "@/lib/cn";

/**
 * Brand Logo component.
 *
 * @param {Object} props
 * @param {"default"|"plate"} [props.variant="default"]
 * @param {() => void} [props.onNavigate]
 * @param {string} [props.className]
 */
export function Logo({ variant = "default", onNavigate, className }) {
  const { t } = useTranslation();

  // In dark mode the default Logo variant sits on a small white chip because the logo PNG is opaque white.
  // The chip goes away when a white or transparent logo is supplied.
  const link = (
    <Link
      to="/"
      aria-label={t("header.homeLink")}
      onClick={onNavigate}
      className={cn(
        "inline-flex shrink-0 items-center dark:rounded-md dark:bg-white dark:px-2 dark:py-1",
        className,
      )}
    >
      <img
        src={logoImg}
        alt=""
        width={255}
        height={128}
        decoding="async"
        className="h-11 w-auto object-contain xl:h-12"
      />
    </Link>
  );

  // Note: The white plate container wraps the logo on dark backgrounds because the current
  // logo PNG is opaque with a white background. This plate can be retired once a transparent
  // or monochrome white logo asset is supplied.
  if (variant === "plate") {
    return <div className="inline-flex rounded-lg bg-white p-2">{link}</div>;
  }

  return link;
}
