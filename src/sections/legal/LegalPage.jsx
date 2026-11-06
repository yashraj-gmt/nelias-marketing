import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/common/Seo.jsx";
import { PageHeader } from "@/components/patterns/PageHeader.jsx";
import { Section, Container, Alert } from "@/components/ui";
import { features } from "@/config/features.js";
import { setLanguage } from "@/i18n/language.js";
import { frenchSpacing } from "@/lib/typography.js";
import { Linkified } from "@/components/legal/Linkified.jsx";
import { LegalToc } from "./LegalToc.jsx";
import { LegalArticle } from "./LegalArticle.jsx";

/**
 * Generic reusable legal document page component.
 *
 * @param {object} props
 * @param {string} props.ns - i18n namespace (e.g. "terms", "privacy")
 */
export function LegalPage({ ns }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const meta = t(`${ns}:meta`, { returnObjects: true }) || {};
  const articles = t(`${ns}:articles`, { returnObjects: true }) || [];
  const page = t(`${ns}:page`, { returnObjects: true }) || {};

  // Intro and notice must ONLY exist if defined in active language (no fallback to English)
  const currentLang = i18n.language || "en";
  const bundle = i18n.getResourceBundle ? i18n.getResourceBundle(currentLang, ns) : null;
  const intro =
    (i18n.getResource ? i18n.getResource(currentLang, ns, "meta.intro") : null) ||
    bundle?.meta?.intro ||
    null;
  const notice =
    bundle?.meta?.notice ||
    (i18n.getResource ? i18n.getResource(currentLang, ns, "meta.notice") : null);

  const targetLang = currentLang.startsWith("fr") ? "en" : "fr";

  const handleLanguageToggle = () => {
    if (typeof setLanguage === "function") {
      setLanguage(targetLang);
    } else {
      i18n.changeLanguage(targetLang);
    }
  };

  // Scroll into view on deep links
  useEffect(() => {
    const hash = location.hash;
    if (!hash || !hash.startsWith("#article-")) return;

    requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "auto" });
      }
    });
  }, [location.hash]);

  const seoTitle = t(`${ns}:seo.title`);
  const seoDescription = t(`${ns}:seo.description`);

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} />

      <PageHeader
        title={frenchSpacing(meta.title, currentLang)}
        lead={frenchSpacing(meta.version, currentLang)}
        tone="tint"
        accent={false}
      />

      <Section tone="default" spacing="lg">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-14">
            {/* Desktop Table of Contents */}
            <div className="lg:col-span-4">
              <LegalToc ns={ns} articles={articles} variant="desktop" />
            </div>

            {/* Reading Column */}
            <div className="max-w-[70ch] lg:col-span-8 xl:col-span-7">
              {/* Publisher line */}
              {meta.publisher && (
                <p className="text-sm text-fg-muted">
                  <Linkified text={meta.publisher} />
                </p>
              )}

              {/* Optional intro (active language only) */}
              {intro && (
                <p className="mt-4 text-sm text-fg-muted">
                  <Linkified text={intro} />
                </p>
              )}

              {/* Convenience notice (English only) */}
              {notice && (
                <div className="mt-4">
                  <Alert tone="note">
                    <p>{frenchSpacing(notice, currentLang)}</p>
                  </Alert>
                </div>
              )}

              {/* Language switcher link */}
              {features.frenchEnabled && page.languageLink && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleLanguageToggle}
                    className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-link underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {frenchSpacing(page.languageLink, currentLang)}
                  </button>
                </div>
              )}

              {/* Mobile Table of Contents */}
              <div className="mt-6">
                <LegalToc ns={ns} articles={articles} variant="mobile" />
              </div>

              {/* Articles list */}
              <div className="mt-8">
                {Array.isArray(articles) &&
                  articles.map((article, index) => (
                    <LegalArticle key={index} index={index} article={article} />
                  ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
