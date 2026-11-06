import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Screen reader announcement for language changes.
 * Rendered once in RootLayout. Only announces on subsequent language changes,
 * never on initial mount.
 */
export function LanguageAnnouncer() {
  const { t, i18n } = useTranslation("common");
  const [announcement, setAnnouncement] = useState("");
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentLang = i18n.language || "en";
    const languageLabel = t(`lang.${currentLang}`, { defaultValue: currentLang });
    setAnnouncement(t("a11y.languageChanged", { language: languageLabel }));
  }, [i18n.language, t]);

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>
  );
}
