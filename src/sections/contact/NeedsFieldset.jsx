import { useTranslation } from "react-i18next";
import { Fieldset, Checkbox } from "@/components/ui/forms";
import { visibleAreas } from "@/data/feature-order.js";

/**
 * Business needs capability checklist fieldset.
 * Excludes any areas marked as hidden in feature-states.js.
 *
 * @param {object} props
 * @param {string[]} [props.selected=[]]
 * @param {(key: string) => void} props.onToggle
 * @param {string} [props.className]
 */
export function NeedsFieldset({ selected = [], onToggle, className }) {
  const { t } = useTranslation();

  return (
    <Fieldset
      legend={t("contact:form.businessNeeds")}
      hint={t("contact:form.businessNeedsHint")}
      optional={true}
      className={className}
    >
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {visibleAreas.map((areaKey) => {
          const isChecked = selected.includes(areaKey);
          return (
            <Checkbox
              key={areaKey}
              id={`need-${areaKey}`}
              label={t(`features:areas.${areaKey}.name`)}
              checked={isChecked}
              onChange={() => onToggle(areaKey)}
            />
          );
        })}
      </div>
    </Fieldset>
  );
}
