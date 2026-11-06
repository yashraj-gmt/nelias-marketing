import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { site } from "@/config/site";

/**
 * SEO component using React 19 native `<title>` and `<meta>` hoisting.
 *
 * @param {Object} props
 * @param {string} [props.pageKey] - Key in seo.json (e.g. "home", "pricing")
 * @param {string} [props.title] - Override title
 * @param {string} [props.description] - Override description
 * @param {boolean} [props.noIndex] - Force noindex on this page
 * @param {boolean} [props.noindex=false] - Force noindex on this page
 */
export function Seo({ pageKey, title, description, noIndex, noindex = false }) {
  const { t, i18n } = useTranslation("seo");
  const { pathname } = useLocation();

  const resolvedTitle =
    title || (pageKey ? t(`${pageKey}.title`, { defaultValue: "" }) : "") || t("fallback.title");
  const resolvedDesc =
    description ||
    (pageKey ? t(`${pageKey}.description`, { defaultValue: "" }) : "") ||
    t("fallback.description");

  // Canonical URL: site base + pathname without trailing slash
  const canonical = site.url + (pathname === "/" ? "" : pathname.replace(/\/+$/, ""));

  const shouldNoIndex = noindex || noIndex || site.noindex;
  const currentLang = i18n.resolvedLanguage || i18n.language || "en";
  const ogLocale = currentLang === "fr" ? "fr_FR" : "en_US";

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDesc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />

      {/* Robots */}
      {shouldNoIndex && <meta name="robots" content="noindex,nofollow" />}
    </>
  );
}
