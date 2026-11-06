import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { HelpCircle } from "lucide-react";
import { Toggletip } from "@/components/ui/Toggletip";
import { Alert } from "@/components/ui/Alert";
import { Field } from "@/components/ui/forms/Field";
import { Fieldset } from "@/components/ui/forms/Fieldset";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { ChoiceCard } from "@/components/ui/forms/ChoiceCard";
import { industries } from "@/data/industries";
import { industryProfiles } from "@/data/home-content";
import { buildCountryOptions } from "@/data/countries";
import { SIZE_IDS } from "@/lib/configurator/constants";

/**
 * Step 1: Tell us about your business (Profile).
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {(slug: string) => void} props.setIndustry - Industry setter callback
 * @param {(partial: Object) => void} props.patch - State updater callback
 * @param {string|null} props.error - Current validation error
 */
export function StepProfile({ data, setIndustry, patch, error }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language?.startsWith("fr") ? "fr" : "en";

  const countryOptions = useMemo(() => buildCountryOptions(lng), [lng]);

  const companySizeOptions = useMemo(
    () =>
      SIZE_IDS.map((id) => ({
        value: id,
        label: t(`contact:sizes.${id}`),
      })),
    [t],
  );

  const isIndustryError = error === "industry";

  return (
    <div>
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:profile.title")}
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-lead text-fg-muted">{t("configurator:profile.helper")}</p>
        <Toggletip label={t("configurator:profile.tooltip")}>
          {t("configurator:profile.tooltip")}
        </Toggletip>
      </div>

      <div className="mt-8 space-y-8">
        {/* Industry Selection */}
        <Fieldset
          legend={t("contact:form.industry")}
          required
          error={isIndustryError ? t("configurator:errors.industry") : undefined}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {industries.map((slug) => {
              const profile = industryProfiles[slug];
              const IconComp = profile?.icon;
              return (
                <ChoiceCard
                  key={slug}
                  id={`industry-${slug}`}
                  type="radio"
                  name="industry"
                  value={slug}
                  checked={data.industry === slug}
                  onChange={() => setIndustry(slug)}
                  title={t(`industries:items.${slug}.name`)}
                  icon={IconComp}
                />
              );
            })}
            <ChoiceCard
              key="other"
              id="industry-other"
              type="radio"
              name="industry"
              value="other"
              checked={data.industry === "other"}
              onChange={() => setIndustry("other")}
              title={t("contact:form.other")}
              icon={HelpCircle}
            />
          </div>
        </Fieldset>

        {/* Main activity */}
        <Field id="config-activity" label={t("configurator:profile.activity")} optional>
          <Input
            id="config-activity"
            maxLength={120}
            value={data.activity || ""}
            onChange={(e) => patch({ activity: e.target.value })}
          />
        </Field>

        {/* Country and Company Size */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="config-country" label={t("contact:form.country")} optional>
            <Select
              id="config-country"
              placeholder={true}
              options={countryOptions}
              value={data.country || ""}
              onChange={(e) => patch({ country: e.target.value })}
            />
          </Field>

          <Field id="config-size" label={t("contact:form.companySize")} optional>
            <Select
              id="config-size"
              placeholder={true}
              options={companySizeOptions}
              value={data.companySize || ""}
              onChange={(e) => patch({ companySize: e.target.value })}
            />
          </Field>
        </div>

        {/* Live assertive validation error banner above navigation */}
        {isIndustryError && (
          <Alert tone="danger" live="assertive">
            {t("configurator:errors.industry")}
          </Alert>
        )}
      </div>
    </div>
  );
}
