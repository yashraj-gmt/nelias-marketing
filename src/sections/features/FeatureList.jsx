import { useTranslation } from "react-i18next";
import { IconBadge } from "@/components/ui/IconBadge";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { TextLink } from "@/components/ui/TextLink";
import { Alert } from "@/components/ui/Alert";
import { visibleAreas } from "@/data/feature-order";
import { capabilityStates, AVAILABILITY } from "@/data/feature-states";
import { industryProfiles } from "@/data/home-content";
import { areaIcons } from "@/data/industry-content";

// TODO(Debass): availability badges show the placeholder state "demo-only" until each area is confirmed in feature-states.js.
// TODO(Debass): the industry filter uses the capability mapping derived only from words in each approved industry summary; confirm.

/**
 * List of capability areas filtered by industry.
 *
 * @param {Object} props
 * @param {string} props.filter - "all" or an industry slug
 * @returns {import("react").JSX.Element}
 */
export function FeatureList({ filter = "all" }) {
  const { t } = useTranslation();

  const total = visibleAreas.length;
  const targetAreaKeys = filter === "all" ? null : (industryProfiles[filter]?.areas ?? []);

  const areas =
    filter === "all" ? visibleAreas : visibleAreas.filter((key) => targetAreaKeys.includes(key));

  const shown = areas.length;

  if (shown === 0) {
    return <Alert tone="note">{t("features:page.empty")}</Alert>;
  }

  const industryName = filter !== "all" ? t(`industries:items.${filter}.name`) : "";

  return (
    <div>
      {/* First row: counter and industry link */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-semibold text-fg-muted">
          {t("features:page.showing", { shown, total })}
        </p>
        {filter !== "all" && (
          <TextLink to={`/industries#${filter}`}>
            {t("features:page.viewIndustry", { name: industryName })}
          </TextLink>
        )}
      </div>

      {/* Capability list */}
      <ul
        aria-label={t("features:page.listLabel")}
        className="grid gap-x-14 border-b border-line md:grid-cols-2"
      >
        {areas.map((key) => {
          const Icon = areaIcons[key];
          const state = capabilityStates[key];

          return (
            <li key={key} className="flex gap-4 border-t border-line py-7">
              {Icon && <IconBadge icon={Icon} size="lg" tone="azure" />}
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-h3 text-heading">
                  {t(`features:areas.${key}.name`)}
                </h2>
                <p className="mt-2 text-fg-muted">{t(`features:areas.${key}.description`)}</p>
                {state !== AVAILABILITY.AVAILABLE && (
                  <div className="mt-3">
                    <AvailabilityBadge state={state} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
