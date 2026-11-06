import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { Alert } from "@/components/ui/Alert";
import { Panel } from "@/components/ui/Panel";
import { Badge } from "@/components/ui/Badge";
import { buttonStyles } from "@/components/ui/button-styles";
import { areaIcons } from "@/data/industry-content";
import { describeRule } from "@/sections/pricing/price-format";
import { features } from "@/config/features";
import { ModuleMeter } from "./ModuleSelector";

// TODO(Debass): "functions" (approved microcopy) and "standard modules" (client wording) mean the same thing here; confirm the customer-facing term.

/**
 * Step 3: Here is your recommended setup (Recommendation).
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {Object} props.rec - Recommendation result { planId, needsReview }
 * @param {string} props.effectivePlan - Current plan id
 * @param {Object} props.plansById - Map of plans by id
 * @param {Array} props.options - Useful options { area, addOnId, included }
 * @param {Object} props.catalog - Pricing catalog
 * @param {string[]} props.effectiveModules - List of selected module ids
 * @param {string[]} props.recommendedModules - List of recommended module ids
 * @param {Array<{ id: string, kind: "included" | "additional" }>} props.labels
 * @param {{ selected: number, included: number|null, extra: number, remaining: number, unlimited: boolean }} props.info
 */
export function StepRecommendation({
  data,
  rec,
  effectivePlan,
  plansById,
  options,
  catalog,
  effectiveModules = [],
  recommendedModules = [],
  labels = [],
  info,
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language?.startsWith("fr") ? "fr" : "en";

  const planId = effectivePlan || rec.planId || "start";
  const planObj = plansById[planId] || plansById.start;
  const planName = t(`pricing:plans.${planId}.name`);

  const inclusions = useMemo(() => {
    const raw = t(`pricing:plans.${planId}.included`, { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, planId]);

  const industryName = useMemo(() => {
    if (!data.industry) return "";
    if (data.industry === "other") return t("contact:form.other");
    return t(`industries:items.${data.industry}.name`);
  }, [data.industry, t]);

  const labelsMap = useMemo(() => {
    const map = new Map();
    for (const item of labels) {
      map.set(item.id, item.kind);
    }
    return map;
  }, [labels]);

  const isMatch = useMemo(() => {
    if (effectiveModules.length !== recommendedModules.length) return false;
    return effectiveModules.every((id) => recommendedModules.includes(id));
  }, [effectiveModules, recommendedModules]);

  const includedDisplay = info?.unlimited ? t("pricing:plans.enterprise.modules") : info?.included;

  return (
    <div>
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:steps.recommendation")}
      </h2>
      <p className="mt-2 text-lead text-fg-muted">{t("configurator:recommendation.helper")}</p>

      {rec.needsReview && (
        <div className="mt-6">
          <Alert tone="warning" live="polite">
            <p className="font-medium text-fg">{t("configurator:recommendation.specialist")}</p>
            <div className="mt-4">
              <Link to="/contact" className={buttonStyles({ variant: "primary", size: "md" })}>
                {t("cta.talkToExpert")}
              </Link>
            </div>
          </Alert>
        </div>
      )}

      {/* Recommended Setup Panel */}
      <div className="mt-8">
        <Panel tone="tint" padding="lg">
          <h3 className="text-sm font-semibold tracking-wider text-accent-strong uppercase">
            {t("configurator:recommendation.panelTitle")}
          </h3>

          <div className="mt-3">
            <span className="block font-display text-display text-heading">{planName}</span>
            <p className="mt-1 text-lead text-fg-muted">{t(`pricing:plans.${planId}.tagline`)}</p>
          </div>

          {/* Inclusions checklist */}
          <ul className="mt-6 space-y-2 border-t border-line pt-6">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-fg">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
                  <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Why section */}
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-sm font-semibold tracking-wider text-heading uppercase">
              {t("configurator:recommendation.because")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
              <li>
                {t("configurator:recommendation.usersLine", {
                  needed: data.users,
                  plan: planName,
                  included: planObj.users,
                })}
              </li>
              <li>
                {t("configurator:recommendation.entitiesLine", {
                  needed: data.entities,
                  plan: planName,
                  included: planObj.legalEntities,
                })}
              </li>
              {data.storage !== "more" && (
                <li>
                  {t("configurator:recommendation.storageLine", {
                    needed: data.storage,
                    plan: planName,
                    included: planObj.storageGb,
                  })}
                </li>
              )}
              {Boolean(industryName) && (
                <li>
                  {t("configurator:recommendation.industryLine", {
                    industry: industryName,
                  })}
                </li>
              )}
              {Boolean(info) && (
                <li>
                  {t("configurator:recommendation.modulesLine", {
                    selected: info.selected,
                    plan: planName,
                    included: includedDisplay,
                  })}
                </li>
              )}
            </ul>
          </div>
        </Panel>
      </div>

      {/* Meter & Selected Standard Modules */}
      <div className="mt-10 space-y-6">
        <h3 className="font-display text-h3 text-heading">
          {t("configurator:modules.selectionTitle")}
        </h3>

        {info && <ModuleMeter info={info} planName={planName} />}

        {effectiveModules.length > 0 ? (
          <div className="divide-y divide-line rounded-lg border border-line bg-surface-raised">
            {effectiveModules.map((key) => {
              const IconComp = areaIcons[key];
              const kind = labelsMap.get(key);
              return (
                <div key={key} className="flex items-center justify-between p-3.5 text-sm">
                  <div className="flex items-center gap-3">
                    {IconComp && (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-heading">
                        <IconComp className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    <span className="font-semibold text-fg">{t(`features:areas.${key}.name`)}</span>
                  </div>
                  {kind && (
                    <Badge tone={kind === "additional" ? "highlight" : "neutral"} size="sm">
                      {kind === "additional"
                        ? t("configurator:modules.additional")
                        : t("configurator:modules.included")}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-fg-muted">{t("configurator:summary.none")}</p>
        )}
      </div>

      {/* Recommended Standard Modules */}
      {recommendedModules.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-h3 text-heading">
            {t("configurator:modules.recommendedTitle")}
          </h3>

          <p className="mt-2 text-sm text-fg-muted">
            {isMatch ? t("configurator:modules.matches") : t("configurator:modules.changed")}
          </p>

          <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface-raised">
            {recommendedModules.map((key) => {
              const IconComp = areaIcons[key];
              return (
                <div key={key} className="flex items-center justify-between p-3.5 text-sm">
                  <div className="flex items-center gap-3">
                    {IconComp && (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-heading">
                        <IconComp className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    <span className="font-semibold text-fg">{t(`features:areas.${key}.name`)}</span>
                  </div>
                  <Badge tone="info" size="sm">
                    {t("pricing:page.recommended")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Useful options */}
      <div className="mt-10">
        <h3 className="font-display text-h3 text-heading">
          {t("configurator:recommendation.optionsTitle")}
        </h3>

        {options.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">
            {t("configurator:recommendation.optionsNone")}
          </p>
        ) : (
          <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface-raised">
            {options.map((opt) => {
              const addOnItem = catalog.optionalCharges.addOns.find((a) => a.id === opt.addOnId);
              const priceText =
                features.pricingPublic && addOnItem ? describeRule(addOnItem.rule, t, lng) : "";

              return (
                <div
                  key={opt.addOnId}
                  className="flex flex-wrap items-center justify-between gap-2 p-3.5 text-sm"
                >
                  <span className="font-semibold text-fg">
                    {t(`pricing:optional.items.${opt.addOnId}`)}
                  </span>
                  <div className="flex items-center gap-3">
                    {opt.included ? (
                      <Badge tone="success" size="sm">
                        {t("configurator:recommendation.includedInPlan", {
                          plan: planName,
                        })}
                      </Badge>
                    ) : (
                      priceText && <span className="font-medium text-fg-muted">{priceText}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
