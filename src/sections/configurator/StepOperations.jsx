import { useTranslation } from "react-i18next";
import { Field } from "@/components/ui/forms/Field";
import { Fieldset } from "@/components/ui/forms/Fieldset";
import { NumberStepper } from "@/components/ui/forms/NumberStepper";
import { LIMITS } from "@/lib/configurator/constants";
import { ModuleSelector } from "./ModuleSelector";

// TODO(Debass): the V3 notes mention "teams and priorities" without approved wording; they are not built.
// TODO(Debass): "functions" (approved microcopy) and "standard modules" (client wording) mean the same thing here; confirm the customer-facing term.

/**
 * Step 2: How do you work? (Operations).
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {Object} props.plansById - Plans map
 * @param {string} props.effectivePlan - Current plan id
 * @param {string[]} props.visibleModules - List of visible module ids
 * @param {string[]} props.effectiveModules - List of selected module ids
 * @param {string[]} props.recommendedModules - List of recommended module ids
 * @param {Array<{ id: string, kind: "included" | "additional" }>} props.labels
 * @param {{ selected: number, included: number|null, extra: number, remaining: number, unlimited: boolean }} props.info
 * @param {(id: string) => void} props.toggleModule
 * @param {() => void} props.resetModules
 * @param {(partial: Object) => void} props.patch - State patch callback
 */
export function StepOperations({
  data,
  plansById,
  effectivePlan,
  visibleModules,
  effectiveModules,
  recommendedModules,
  labels,
  info,
  toggleModule,
  resetModules,
  patch,
}) {
  const { t } = useTranslation();

  const planName = t(`pricing:plans.${effectivePlan || "start"}.name`);

  const quotaInfoText = t("configurator:operations.quotaInfo", {
    start: plansById?.start?.includedModules ?? 4,
    business: plansById?.business?.includedModules ?? 6,
    professional: plansById?.professional?.includedModules ?? 8,
  });

  return (
    <div>
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:steps.operations")}
      </h2>
      <p className="mt-2 text-lead text-fg-muted">
        {t("configurator:operations.operateHelper")}{" "}
        <span className="font-medium text-fg">{quotaInfoText}</span>
      </p>

      <div className="mt-8 space-y-10">
        {/* Group A: Standard Modules */}
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

        {/* Group B: Size & Capacity */}
        <Fieldset
          legend={t("configurator:operations.sizeTitle")}
          hint={t("configurator:operations.sizeHelper")}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="config-users" label={t("pricing:page.usersLabel")}>
              <NumberStepper
                id="config-users"
                value={data.users}
                min={LIMITS.users.min}
                max={LIMITS.users.max}
                onChange={(val) => patch({ users: val })}
              />
            </Field>

            <Field id="config-entities" label={t("pricing:page.entitiesLabel")}>
              <NumberStepper
                id="config-entities"
                value={data.entities}
                min={LIMITS.entities.min}
                max={LIMITS.entities.max}
                onChange={(val) => patch({ entities: val })}
              />
            </Field>
          </div>
        </Fieldset>
      </div>
    </div>
  );
}
