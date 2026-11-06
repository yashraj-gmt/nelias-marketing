import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { frenchSpacing } from "@/lib/typography.js";
import { cn } from "@/lib/cn.js";

/**
 * Table of contents navigation with scroll-spy for legal documents.
 * Renders sticky nav on desktop and collapsible details on mobile.
 *
 * @param {object} props
 * @param {string} props.ns - i18n namespace
 * @param {Array<{ title: string }>} props.articles
 * @param {"desktop"|"mobile"} [props.variant] - If specified, renders only that variant
 */
export function LegalToc({ ns, articles = [], variant }) {
  const { t, i18n } = useTranslation();
  const [activeId, setActiveId] = useState(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      return window.location.hash.replace(/^#/, "");
    }
    return articles.length > 0 ? "article-1" : "";
  });

  const detailsRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const sections = articles
      .map((_, i) => document.getElementById(`article-${i + 1}`))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -65% 0px",
      },
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      observer.disconnect();
    };
  }, [articles]);

  const contentsLabel = frenchSpacing(t(`${ns}:page.contents`), i18n.language);

  const handleLinkClick = (id) => {
    setActiveId(id);
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
  };

  const renderLinks = (isDesktop = true) => (
    <ul className={cn(isDesktop ? "mt-3 border-l border-line" : "mt-2 space-y-1 p-3")}>
      {articles.map((article, index) => {
        const targetId = `article-${index + 1}`;
        const isActive = activeId === targetId;
        const titleText = frenchSpacing(article.title, i18n.language);

        return (
          <li key={targetId}>
            <a
              href={`#${targetId}`}
              onClick={() => handleLinkClick(targetId)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block text-sm transition-colors",
                isDesktop
                  ? [
                      "-ml-px border-l-2 px-4 py-1.5",
                      isActive
                        ? "border-accent font-semibold text-heading"
                        : "border-transparent text-fg-muted hover:text-heading",
                    ]
                  : [
                      "rounded-md px-3 py-2",
                      isActive
                        ? "bg-surface-tint font-semibold text-heading"
                        : "text-fg-muted hover:bg-surface-muted hover:text-heading",
                    ],
              )}
            >
              {titleText}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "desktop") {
    return (
      <nav
        aria-label={contentsLabel}
        className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto"
      >
        <p className="font-display font-semibold text-heading">{contentsLabel}</p>
        {renderLinks(true)}
      </nav>
    );
  }

  if (variant === "mobile") {
    return (
      <details
        ref={detailsRef}
        className="mb-8 rounded-lg border border-line bg-surface-muted lg:hidden"
      >
        <summary className="min-h-11 cursor-pointer px-4 py-3 font-semibold text-heading select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          {contentsLabel}
        </summary>
        {renderLinks(false)}
      </details>
    );
  }

  return (
    <>
      <nav
        aria-label={contentsLabel}
        className="hidden lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-8rem)] lg:self-start lg:overflow-y-auto"
      >
        <p className="font-display font-semibold text-heading">{contentsLabel}</p>
        {renderLinks(true)}
      </nav>

      <details
        ref={detailsRef}
        className="mb-8 rounded-lg border border-line bg-surface-muted lg:hidden"
      >
        <summary className="min-h-11 cursor-pointer px-4 py-3 font-semibold text-heading select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
          {contentsLabel}
        </summary>
        {renderLinks(false)}
      </details>
    </>
  );
}
