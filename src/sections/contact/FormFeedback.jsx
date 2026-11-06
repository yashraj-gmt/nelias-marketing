import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Alert, TextLink } from "@/components/ui";
import { site } from "@/config/site.js";

// TODO(Debass): no approved success wording exists and no response-time promise may be made; neutral confirmation text is used.
export const FormFeedback = forwardRef(function FormFeedback({ status, type = "contact" }, ref) {
  const { t } = useTranslation();
  const email = site.contact.email || "contact@nelias.app";

  return (
    <div ref={ref} tabIndex={-1} role="status" className="outline-none">
      {status === "success" && (
        <Alert tone="success" title={t("contact:feedback.successTitle")}>
          <p>{t(`contact:feedback.success.${type}`)}</p>
        </Alert>
      )}

      {status === "mailto" && (
        <Alert tone="info" title={t("contact:feedback.mailtoTitle")}>
          <p className="mb-3">{t("contact:feedback.mailtoBody", { email })}</p>
          <TextLink to={`mailto:${email}`} showArrow={false}>
            {t("contact:feedback.writeTo", { email })}
          </TextLink>
        </Alert>
      )}
    </div>
  );
});
