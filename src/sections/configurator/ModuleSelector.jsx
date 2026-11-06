import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fieldset } from "@/components/ui/forms/Fieldset";
import { Checkbox } from "@/components/ui/forms/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { areaIcons } from "@/data/industry-content";
import { cn } from "@/lib/cn";

/**
 * Accessible Module Meter displaying quota usage and alert on overage.
 */
export function ModuleMeter({ info, planName }) {
  const { t } = useTranslation();

  if (info.unlimited) {
    return (
      <div className="space-y-3">
        <Alert tone="note">{t("configurator:modules.enterpriseNote")}</Alert>
      </div>
    );
  }

  const meterText = t("configurator:modules.meter", {
    selected: info.selected,
    included: info.included,
    plan: planName,
  });

  const isOverQuota = info.extra > 0;
  const totalSlots = isOverQuota ? info.selected : info.included || 1;
  const includedPct = Math.round(
    ((isOverQuota ? info.included : info.selected) / totalSlots) * 100,
  );
  const extraPct = isOverQuota ? 100 - includedPct : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-fg">{meterText}</span>
      </div>

      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={info.included}
        aria-valuenow={Math.min(info.selected, info.included)}
        aria-valuetext={meterText}
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken"
      >
        {isOverQuota ? (
          <div className="flex h-full w-full">
            <div className="h-full bg-accent transition-all" style={{ width: `${includedPct}%` }} />
            <div className="h-full bg-warning transition-all" style={{ width: `${extraPct}%` }} />
          </div>
        ) : (
          <div className="h-full bg-accent transition-all" style={{ width: `${includedPct}%` }} />
        )}
      </div>

      {isOverQuota && (
        <Alert tone="info" live="polite">
          {t("configurator:modules.extraAlert", { extra: info.extra })}
        </Alert>
      )}
    </div>
  );
}

/**
 * Standard modules selection grid with meter and quota badges.
 *
 * @param {Object} props
 * @param {string[]} props.visibleModules
 * @param {string[]} props.effectiveModules
 * @param {string[]} props.recommendedModules
 * @param {Array<{ id: string, kind: "included" | "additional" }>} props.labels
 * @param {{ selected: number, included: number|null, extra: number, remaining: number, unlimited: boolean }} props.info
 * @param {string} props.planName
 * @param {boolean} props.modulesTouched
 * @param {string} [props.industry]
 * @param {(id: string) => void} props.toggleModule
 * @param {() => void} props.resetModules
 * @param {string} [props.className]
 */
export function ModuleSelector({
  visibleModules = [],
  effectiveModules = [],
  recommendedModules = [],
  labels = [],
  info,
  planName,
  modulesTouched = false,
  industry,
  toggleModule,
  resetModules,
  className,
}) {
  const { t } = useTranslation();

  const labelsMap = useMemo(() => {
    const map = new Map();
    for (const item of labels) {
      map.set(item.id, item.kind);
    }
    return map;
  }, [labels]);

  const hasRecommendation = recommendedModules.length > 0;
  const hasNoIndustry = !industry || industry === "other";
  const hintText = hasNoIndustry
    ? t("configurator:modules.noRecommendation")
    : t("configurator:modules.helper");

  return (
    <Fieldset
      legend={t("configurator:modules.title")}
      hint={hintText}
      className={cn("space-y-6", className)}
    >
      {/* Module meter */}
      <ModuleMeter info={info} planName={planName} />

      {/* Reset button when modules are touched and recommendation exists */}
      {modulesTouched && hasRecommendation && (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={resetModules}>
            {t("configurator:modules.reset")}
          </Button>
        </div>
      )}

      {/* Grid of modules */}
      <div className="grid gap-3 sm:grid-cols-2">
        {visibleModules.map((modId) => {
          const isChecked = effectiveModules.includes(modId);
          const isRecommended = recommendedModules.includes(modId);
          const statusKind = labelsMap.get(modId);
          const IconComp = areaIcons[modId];

          return (
            <div
              key={modId}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors",
                isChecked
                  ? "border-line-strong bg-surface-raised shadow-xs"
                  : "border-line bg-surface-raised hover:border-line-strong",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Checkbox
                  id={`module-${modId}`}
                  checked={isChecked}
                  onChange={() => toggleModule(modId)}
                  label={
                    <span className="flex items-center gap-2 font-medium text-fg">
                      {IconComp && (
                        <IconComp className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      )}
                      <span className="truncate">{t(`features:areas.${modId}.name`)}</span>
                    </span>
                  }
                />
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {isRecommended && (
                  <Badge tone="info" size="sm">
                    {t("pricing:page.recommended")}
                  </Badge>
                )}
                {isChecked && statusKind && (
                  <Badge tone={statusKind === "additional" ? "highlight" : "neutral"} size="sm">
                    {statusKind === "additional"
                      ? t("configurator:modules.additional")
                      : t("configurator:modules.included")}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Fieldset>
  );
}
