import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/button-styles";
import { industryProfiles } from "@/data/home-content";
import { capabilityStates, AVAILABILITY } from "@/data/feature-states";
import { track, EVENTS } from "@/lib/analytics";

/**
 * Inline detail panel for an expanded industry sector.
 *
 * @param {Object} props
 * @param {string} props.slug
 * @param {() => void} props.onClose
 * @returns {import("react").JSX.Element}
 */
export function IndustryDetail({ slug, onClose }) {
  const { t, i18n } = useTranslation();

  const name = t(`industries:items.${slug}.name`);
  const summary = t(`industries:items.${slug}.summary`);
  const headlineKey = `industries:items.${slug}.headline`;
  const hasHeadline = i18n.exists(headlineKey);
  const headline = hasHeadline ? t(headlineKey) : null;

  // Suggested capabilities
  const rawAreas = industryProfiles[slug]?.areas || [];
  const visibleAreas = rawAreas.filter((key) => capabilityStates[key] !== AVAILABILITY.HIDDEN);

  // Carried walkthrough nodes
  const rawWalkthrough = t(`industries:items.${slug}.walkthrough`, {
    returnObjects: true,
  });
  const walkthroughNodes = Array.isArray(rawWalkthrough) ? rawWalkthrough : [];

  // Carried pairs (if present in industries.json)
  const rawPairs = t(`industries:items.${slug}.pairs`, {
    returnObjects: true,
  });
  const pairs = Array.isArray(rawPairs) ? rawPairs : [];

  const demoUrl = `/demo?industry=${encodeURIComponent(slug)}&needs=${encodeURIComponent(visibleAreas.join(","))}`;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      id="industry-detail"
      role="region"
      aria-labelledby="industry-detail-title"
      onKeyDown={handleKeyDown}
      className="scroll-mt-28 rounded-xl border border-line bg-surface-tint p-6 md:p-8"
    >
      {/* 1. Header: Name, Headline, Summary */}
      <div>
        <h3
          id="industry-detail-title"
          tabIndex={-1}
          className="font-display text-h3 text-heading outline-none"
        >
          {name}
        </h3>
        {headline && (
          <p className="mt-2 text-lg leading-snug font-semibold text-heading">{headline}</p>
        )}
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-fg-muted">{summary}</p>
      </div>

      {/* 2. Suggested capabilities */}
      {visibleAreas.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-lg font-semibold text-heading">
            {t("industries:page.suggestedLabel")}
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {visibleAreas.map((areaKey) => {
              const state = capabilityStates[areaKey];
              return (
                <li
                  key={areaKey}
                  className="inline-flex items-center gap-2 rounded-md border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-fg shadow-2xs"
                >
                  <span>{t(`features:areas.${areaKey}.name`)}</span>
                  {state && state !== AVAILABILITY.AVAILABLE && <AvailabilityBadge state={state} />}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 3. Carried block: Practical walkthrough */}
      {walkthroughNodes.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-lg font-semibold text-heading">
            {t("industries:detail.walkthroughTitle")}
          </h4>
          <ol className="mt-3 flex flex-wrap items-center gap-2 text-sm text-fg">
            {walkthroughNodes.map((node, i) => (
              <li key={i} className="inline-flex items-center gap-2">
                <span className="font-semibold text-heading">{i + 1}.</span>
                <span>{node}</span>
                {i < walkthroughNodes.length - 1 && (
                  <span className="text-fg-subtle" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 3b. Carried pairs (if present) */}
      {pairs.length > 0 && (
        <div className="mt-8">
          <h4 className="font-display text-lg font-semibold text-heading">
            {t("industries:detail.challengesTitle")}
          </h4>
          <ul className="mt-3 space-y-3">
            {pairs.map((pair, idx) => (
              <li key={idx} className="rounded-lg border border-line bg-surface-raised p-4">
                <p className="font-semibold text-heading">{pair.challenge}</p>
                <p className="mt-1 text-sm text-fg-muted">{pair.outcome}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Muted note */}
      <p className="mt-8 border-t border-line/60 pt-4 text-sm text-fg-muted">
        {t("pricing:sectors.body")}
      </p>

      {/* 5. Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          to={demoUrl}
          onClick={() => {
            track(EVENTS.CTA_CLICK, {
              intent: "demo",
              location: "industries-detail",
              industry: slug,
            });
          }}
          className={buttonStyles({ variant: "primary", size: "md" })}
        >
          {t("common:cta.bookDemo")}
        </Link>
        <Button variant="ghost" size="md" onClick={onClose}>
          {t("industries:page.close")}
        </Button>
      </div>
    </div>
  );
}
