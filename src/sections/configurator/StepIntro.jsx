import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

/**
 * Start screen for the configurator.
 *
 * @param {Object} props
 * @param {boolean} props.hasDraft - Whether a local saved draft exists
 * @param {() => void} props.onStart - Callback to start configuration
 * @param {() => void} props.onResume - Callback to resume draft
 * @param {() => void} props.onStartAgain - Callback to clear draft and start fresh
 */
export function StepIntro({ hasDraft, onStart, onResume, onStartAgain }) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl text-center md:py-8">
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:entry.title")}
      </h2>
      <p className="mt-2 text-lead text-fg-muted">{t("configurator:entry.helper")}</p>

      {hasDraft && (
        <div className="mt-8 text-left">
          <Alert tone="info" title={t("configurator:entry.resumeTitle")}>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="primary" size="md" onClick={onResume}>
                {t("configurator:entry.resume")}
              </Button>
              <Button variant="ghost" size="md" onClick={onStartAgain}>
                {t("configurator:entry.startAgain")}
              </Button>
            </div>
          </Alert>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="primary" size="lg" onClick={onStart}>
          {t("configurator:entry.start")}
        </Button>
      </div>
    </div>
  );
}
