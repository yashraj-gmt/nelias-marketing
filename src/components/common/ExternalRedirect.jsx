import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// TODO(Debass): auth pages are off by default; enable VITE_FEATURE_AUTH_PAGES and VITE_AUTH_API_URL when the backend contract is confirmed.

/**
 * Client-side redirect to an external URL.
 * Renders a fallback link if JS is disabled or the redirect is delayed.
 *
 * @param {Object} props
 * @param {string} props.to
 */
export function ExternalRedirect({ to }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined" && to) {
      window.location.replace(to);
    }
  }, [to]);

  return (
    <div className="flex min-h-[50dvh] items-center justify-center p-6 text-center">
      <p className="text-sm text-fg-muted">
        <a href={to} className="text-link underline hover:text-accent-strong">
          {t("auth:redirect.text")}
        </a>
      </p>
    </div>
  );
}

export default ExternalRedirect;

