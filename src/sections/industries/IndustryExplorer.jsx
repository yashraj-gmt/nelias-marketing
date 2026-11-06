import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { IndustryCard } from "./IndustryCard";
import { IndustryDetail } from "./IndustryDetail";
import { industries } from "@/data/industries";
import { industryProfiles } from "@/data/home-content";
import { useGridColumns } from "@/hooks/useGridColumns";

// TODO(Debass): the former industry pages are replaced by this inline detail; confirm the old addresses redirect here.

/**
 * Interactive industry sector explorer with inline detail accordion.
 *
 * @param {Object} props
 * @param {string} [props.tone="default"]
 * @returns {import("react").JSX.Element}
 */
export function IndustryExplorer({ tone = "default" }) {
  const { t } = useTranslation();
  const cols = useGridColumns();
  const [selectedSlug, setSelectedSlug] = useState(null);

  const prevSlugRef = useRef(null);
  const cardRefs = useRef({});

  // Sync state from URL hash on load and hash changes
  useEffect(() => {
    const syncFromHash = () => {
      const raw = window.location.hash.replace(/^#/, "");
      if (raw && industries.includes(raw)) {
        setSelectedSlug(raw);
      } else if (!raw) {
        setSelectedSlug(null);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  // Handle focus and scroll transitions
  useEffect(() => {
    if (selectedSlug) {
      // Opening: scroll into view and focus detail title
      const detailEl = document.getElementById("industry-detail");
      const titleEl = document.getElementById("industry-detail-title");
      if (detailEl) {
        detailEl.scrollIntoView({ block: "start", behavior: "auto" });
      }
      if (titleEl) {
        titleEl.focus({ preventScroll: true });
      }
    } else if (prevSlugRef.current) {
      // Closing: return focus to the card that was open
      const prevCard = cardRefs.current[prevSlugRef.current];
      if (prevCard) {
        prevCard.focus({ preventScroll: true });
      }
    }
    prevSlugRef.current = selectedSlug;
  }, [selectedSlug]);

  const handleSelect = (slug) => {
    if (selectedSlug === slug) {
      handleClose();
      return;
    }
    setSelectedSlug(slug);
    window.history.replaceState(null, "", `#${slug}`);
  };

  const handleClose = () => {
    setSelectedSlug(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  const count = industries.length;
  const selectedIndex = selectedSlug ? industries.indexOf(selectedSlug) : -1;
  const row = selectedIndex !== -1 ? Math.floor(selectedIndex / cols) : -1;
  const insertAfterIndex = selectedIndex !== -1 ? Math.min(count - 1, (row + 1) * cols - 1) : -1;

  return (
    <Section
      id="industry-explorer"
      tone={tone}
      spacing="lg"
      aria-labelledby="industries-selector-heading"
    >
      <Container>
        <div className="max-w-3xl">
          <h2
            id="industries-selector-heading"
            className="font-display text-h2 leading-tight font-semibold tracking-tight text-heading"
          >
            {t("industries:page.selectorTitle")}
          </h2>
          {!selectedSlug && (
            <p className="mt-2 text-lead leading-relaxed text-fg-muted">
              {t("industries:page.selectHint")}
            </p>
          )}
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((slug, index) => {
            const isOpen = selectedSlug === slug;
            const name = t(`industries:items.${slug}.name`);
            const summary = t(`industries:items.${slug}.summary`);
            const icon = industryProfiles[slug]?.icon;

            const cardItem = (
              <li key={slug}>
                <IndustryCard
                  ref={(el) => {
                    if (el) cardRefs.current[slug] = el;
                    else delete cardRefs.current[slug];
                  }}
                  name={name}
                  summary={summary}
                  icon={icon}
                  isOpen={isOpen}
                  onClick={() => handleSelect(slug)}
                />
              </li>
            );

            if (index === insertAfterIndex && selectedSlug) {
              return (
                <div key={`${slug}-group`} className="contents">
                  {cardItem}
                  <li key="detail-row" className="col-span-full">
                    <IndustryDetail slug={selectedSlug} onClose={handleClose} />
                  </li>
                </div>
              );
            }

            return cardItem;
          })}
        </ul>
      </Container>
    </Section>
  );
}
