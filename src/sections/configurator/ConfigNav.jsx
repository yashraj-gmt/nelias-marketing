import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";

/**
 * Navigation bar at the bottom of configurator steps.
 *
 * @param {Object} props
 * @param {string} props.step - Current step id
 * @param {() => void} props.onBack - Go back callback
 * @param {() => void} props.onNext - Continue callback
 */
export function ConfigNav({ step, onBack, onNext }) {
  const { t } = useTranslation();

  if (step === "intro") return null;

  const showForward = step !== "summary";
  const forwardLabel =
    step === "recommendation" ? t("configurator:nav.review") : t("configurator:nav.continue");

  return (
    <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <Button variant="outline" size="lg" onClick={onBack}>
        {t("configurator:nav.back")}
      </Button>

      {showForward && (
        <Button variant="primary" size="lg" onClick={onNext}>
          {forwardLabel}
        </Button>
      )}
    </div>
  );
}
