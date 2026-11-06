import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { ChoiceCard } from "@/components/ui/forms/ChoiceCard";
import { Field } from "@/components/ui/forms/Field";
import { Select } from "@/components/ui/forms/Select";
import { Checkbox } from "@/components/ui/forms/Checkbox";
import { NumberStepper } from "@/components/ui/forms/NumberStepper";
import { buttonStyles } from "@/components/ui/button-styles";
import { describeRule } from "@/sections/pricing/price-format";
import { features } from "@/config/features";
import { PLAN_IDS, STORAGE_OPTIONS, LIMITS } from "@/lib/configurator/constants";
import { planIncludesAddOns } from "@/lib/configurator/plan-rules";
import { ModuleSelector } from "./ModuleSelector";

// TODO(Debass): the V3 notes ask to "adjust users, entities, add-ons, connectors and storage"; storage is informational because storage extension prices are not approved.
// TODO(Debass): "functions" (approved microcopy) and "standard modules" (client wording) mean the same thing here; confirm the customer-facing term.

/**
 * Step 4: Make it yours (Customize).
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {string} props.effectivePlan - Current plan
 * @param {Object} props.rec - Recommendation result { planId, needsReview }
 * @param {Object} props.plansById - Map of plans
 * @param {Object} props.catalog - Pricing catalog
 * @param {Array} props.options - Useful options
 * @param {string[]} [props.visibleModules]
 * @param {string[]} [props.effectiveModules]
 * @param {string[]} [props.recommendedModules]
 * @param {Array<{ id: string, kind: "included" | "additional" }>} [props.labels]
 * @param {{ selected: number, included: number|null, extra: number, remaining: number, unlimited: boolean }} [props.info]
 * @param {(id: string) => void} [props.toggleModule]
 * @param {() => void} [props.resetModules]
 * @param {(name: string, id: string) => void} props.toggleIn - Toggle item callback
 * @param {(partial: Object) => void} props.patch - State patch callback
 */
export function StepCustomize({
  data,
  effectivePlan,
  rec,
  plansById,
  catalog,
  options,
  visibleModules = [],
  effectiveModules = [],
  recommendedModules = [],
  labels = [],
  info,
  toggleModule,
  resetModules,
  toggleIn,
  patch,
}) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language?.startsWith("fr") ? "fr" : "en";

  const planObj = plansById[effectivePlan] || plansById.start;
  const planName = t(`pricing:plans.${effectivePlan}.name`);

  // Plan level check: self-service plan below recommended
  const isBelowRecommended = useMemo(() => {
    const selfService = ["start", "business", "professional"];
    const recIndex = selfService.indexOf(rec.planId);
    const currIndex = selfService.indexOf(effectivePlan);
    return recIndex >= 0 && currIndex >= 0 && currIndex < recIndex;
  }, [effectivePlan, rec.planId]);

  // Capacity shortfalls
  const usersShortfall = data.users > planObj.users;
  const entitiesShortfall = data.entities > planObj.legalEntities;

  // Storage shortfall
  const isStorageShort =
    data.storage === "more" ||
    (typeof data.storage === "number" && data.storage > planObj.storageGb);

  const storageOptions = useMemo(
    () =>
      STORAGE_OPTIONS.map((opt) => ({
        value: String(opt),
        label:
          opt === "more"
            ? t("configurator:customize.storageMore", { value: 50 })
            : t("configurator:customize.storageUpTo", { value: opt }),
      })),
    [t],
  );

  return (
    <div>
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:steps.customize")}
      </h2>

      <div className="mt-8 space-y-12">
        {/* 1. Plan Group */}
        <div>
          <h3 className="font-display text-h3 text-heading">
            {t("configurator:customize.planTitle")}
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PLAN_IDS.map((id) => {
              const isRecommended = id === rec.planId;
              const isSelected = effectivePlan === id;
              return (
                <ChoiceCard
                  key={id}
                  id={`plan-choice-${id}`}
                  type="radio"
                  name="plan"
                  value={id}
                  checked={isSelected}
                  onChange={() => patch({ plan: id })}
                  title={t(`pricing:plans.${id}.name`)}
                  description={t(`pricing:plans.${id}.tagline`)}
                  badge={
                    isRecommended ? (
                      <Badge tone="highlight" size="sm">
                        {t("pricing:page.recommended")}
                      </Badge>
                    ) : undefined
                  }
                />
              );
            })}
          </div>

          {isBelowRecommended && (
            <div className="mt-4">
              <Alert tone="warning">
                {t("configurator:customize.planBelow", { plan: planName })}
              </Alert>
            </div>
          )}

          {effectivePlan === "enterprise" && (
            <div className="mt-4">
              <Alert tone="warning">
                <p className="font-medium text-fg">{t("configurator:recommendation.specialist")}</p>
                <div className="mt-3">
                  <Link to="/contact" className={buttonStyles({ variant: "outline", size: "sm" })}>
                    {t("cta.talkToExpert")}
                  </Link>
                </div>
              </Alert>
            </div>
          )}
        </div>

        {/* 2. Standard Modules Group */}
        <div>
          <ModuleSelector
            visibleModules={visibleModules}
            effectiveModules={effectiveModules}
            recommendedModules={recommendedModules}
            labels={labels}
            info={info}
            planName={planName}
            modulesTouched={data.modulesTouched}
            industry={data.industry}
            toggleModule={toggleModule}
            resetModules={resetModules}
          />
        </div>

        {/* 3. Capacity Group */}
        <div>
          <h3 className="font-display text-h3 text-heading">
            {t("configurator:customize.capacityTitle")}
          </h3>

          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <Field id="cust-users" label={t("pricing:page.usersLabel")}>
              <NumberStepper
                id="cust-users"
                value={data.users}
                min={LIMITS.users.min}
                max={LIMITS.users.max}
                onChange={(val) => patch({ users: val })}
              />
            </Field>

            <Field id="cust-entities" label={t("pricing:page.entitiesLabel")}>
              <NumberStepper
                id="cust-entities"
                value={data.entities}
                min={LIMITS.entities.min}
                max={LIMITS.entities.max}
                onChange={(val) => patch({ entities: val })}
              />
            </Field>
          </div>

          <div className="mt-4 space-y-3">
            {usersShortfall && (
              <Alert tone="info">
                {t("configurator:customize.extraUsers", {
                  plan: planName,
                  included: planObj.users,
                })}
              </Alert>
            )}
            {entitiesShortfall && (
              <Alert tone="info">
                {t("configurator:customize.extraEntities", {
                  plan: planName,
                  included: planObj.legalEntities,
                })}
              </Alert>
            )}
          </div>
        </div>

        {/* 4. Storage Group */}
        <div>
          <h3 className="font-display text-h3 text-heading">
            {t("configurator:customize.storageTitle")}
          </h3>

          <div className="mt-4 max-w-sm">
            <Field id="cust-storage" label={t("configurator:customize.storageTitle")}>
              <Select
                id="cust-storage"
                options={storageOptions}
                value={String(data.storage)}
                onChange={(e) => {
                  const val = e.target.value === "more" ? "more" : Number(e.target.value);
                  patch({ storage: val });
                }}
              />
            </Field>
          </div>

          {isStorageShort && (
            <div className="mt-4">
              <Alert tone="warning">
                <p className="font-medium text-fg">
                  {t("configurator:customize.storageShort", {
                    plan: planName,
                    included: planObj.storageGb,
                  })}
                </p>
                <div className="mt-3">
                  <Link to="/contact" className={buttonStyles({ variant: "outline", size: "sm" })}>
                    {t("cta.talkToExpert")}
                  </Link>
                </div>
              </Alert>
            </div>
          )}
        </div>

        {/* 5. Add-ons Group */}
        <div>
          <h3 className="font-display text-h3 text-heading">
            {t("pricing:optional.groups.addOns")}
          </h3>

          <div className="mt-4 space-y-3 divide-y divide-line rounded-lg border border-line bg-surface-raised p-4">
            {catalog.optionalCharges.addOns.map((addOn) => {
              const isIncluded = planIncludesAddOns[effectivePlan]?.includes(addOn.id) || false;
              const isChecked = isIncluded || data.addOns.includes(addOn.id);
              const isSuggested = !isIncluded && options.some((o) => o.addOnId === addOn.id);
              const priceText =
                features.pricingPublic && !isIncluded ? describeRule(addOn.rule, t, lng) : "";

              return (
                <div
                  key={addOn.id}
                  className="flex flex-wrap items-center justify-between gap-2 pt-3 first:pt-0"
                >
                  <Checkbox
                    id={`addon-${addOn.id}`}
                    label={t(`pricing:optional.items.${addOn.id}`)}
                    checked={isChecked}
                    disabled={isIncluded}
                    onChange={() => toggleIn("addOns", addOn.id)}
                  />
                  <div className="flex items-center gap-2">
                    {isIncluded && (
                      <Badge tone="success" size="sm">
                        {t("configurator:recommendation.includedInPlan", {
                          plan: planName,
                        })}
                      </Badge>
                    )}
                    {isSuggested && (
                      <Badge tone="info" size="sm">
                        {t("configurator:customize.suggested")}
                      </Badge>
                    )}
                    {priceText && (
                      <span className="text-sm font-medium text-fg-muted">{priceText}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Connectors Group */}
        <div>
          <h3 className="font-display text-h3 text-heading">
            {t("pricing:optional.groups.connectors")}
          </h3>

          <div className="mt-4 space-y-3 divide-y divide-line rounded-lg border border-line bg-surface-raised p-4">
            {catalog.optionalCharges.connectors.map((conn) => {
              const isChecked = data.connectors.includes(conn.id);
              const priceText = features.pricingPublic ? describeRule(conn.rule, t, lng) : "";

              return (
                <div
                  key={conn.id}
                  className="flex flex-wrap items-center justify-between gap-2 pt-3 first:pt-0"
                >
                  <Checkbox
                    id={`conn-${conn.id}`}
                    label={t(`pricing:optional.items.${conn.id}`)}
                    checked={isChecked}
                    onChange={() => toggleIn("connectors", conn.id)}
                  />
                  {priceText && (
                    <span className="text-sm font-medium text-fg-muted">{priceText}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
