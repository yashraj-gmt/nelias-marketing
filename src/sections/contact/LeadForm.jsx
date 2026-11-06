import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Alert, TextLink } from "@/components/ui";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/forms";
import { buttonStyles } from "@/components/ui/button-styles.js";
import { useLeadForm } from "@/hooks/useLeadForm.js";
import { LIMITS } from "@/lib/validators.js";
import { buildCountryOptions } from "@/data/countries.js";
import { industries } from "@/data/industries.js";
import { site } from "@/config/site.js";
import { cn } from "@/lib/cn";
import { NeedsFieldset } from "./NeedsFieldset.jsx";
import { FormFeedback } from "./FormFeedback.jsx";

const FIELD_IDS = {
  fullName: "lead-full-name",
  workEmail: "lead-work-email",
  company: "lead-company",
  country: "lead-country",
  industry: "lead-industry",
  companySize: "lead-company-size",
  message: "lead-message",
  consent: "lead-consent",
};

/**
 * Shared lead capture form for Contact and Demo pages.
 *
 * @param {object} props
 * @param {"contact"|"demo"} [props.type="contact"]
 * @param {string} [props.className]
 * @param {boolean} [props.short=false] - When true, renders a concise contact form omitting sector & size questions
 */
export function LeadForm({ type = "contact", className, short = false }) {
  const { t, i18n } = useTranslation();
  const {
    values,
    errors,
    status,
    submitError,
    setField,
    toggleNeed,
    submit,
    formRef,
    summaryRef,
    feedbackRef,
  } = useLeadForm(type);

  const countryOptions = useMemo(() => buildCountryOptions(i18n.language), [i18n.language]);

  const industryOptions = useMemo(
    () => [
      ...industries.map((slug) => ({
        value: slug,
        label: t(`industries:items.${slug}.name`),
      })),
      { value: "other", label: t("contact:form.other") },
    ],
    [t],
  );

  const companySizeOptions = useMemo(
    () => [
      { value: "s1", label: t("contact:sizes.s1") },
      { value: "s2", label: t("contact:sizes.s2") },
      { value: "s3", label: t("contact:sizes.s3") },
      { value: "s4", label: t("contact:sizes.s4") },
      { value: "s5", label: t("contact:sizes.s5") },
    ],
    [t],
  );

  if (status === "success" || status === "mailto") {
    return <FormFeedback ref={feedbackRef} status={status} type={type} />;
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} className={cn("space-y-6", className)}>
      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="outline-none">
          <Alert tone="danger" title={t("contact:errors.summaryTitle")}>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {Object.entries(errors).map(([field, errKey]) => {
                const targetId = FIELD_IDS[field] || `lead-${field}`;
                return (
                  <li key={field}>
                    <a
                      href={`#${targetId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(targetId)?.focus();
                      }}
                      className="font-medium underline hover:text-danger-strong focus:outline-none"
                    >
                      {t(`contact:errors.${errKey}`)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Alert>
        </div>
      )}

      <p className="text-sm text-fg-muted">{t("contact:form.requiredNote")}</p>

      {/* Primary fields grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Field
          id="lead-full-name"
          label={t("contact:form.fullName")}
          required
          error={errors.fullName ? t(`contact:errors.${errors.fullName}`) : undefined}
        >
          <Input
            autoComplete="name"
            maxLength={LIMITS.fullName}
            value={values.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
          />
        </Field>

        <Field
          id="lead-work-email"
          label={t("contact:form.workEmail")}
          required
          error={errors.workEmail ? t(`contact:errors.${errors.workEmail}`) : undefined}
        >
          <Input
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={LIMITS.workEmail}
            value={values.workEmail}
            onChange={(e) => setField("workEmail", e.target.value)}
          />
        </Field>

        <Field
          id="lead-company"
          label={t("contact:form.company")}
          required
          className={short ? "md:col-span-2" : undefined}
          error={errors.company ? t(`contact:errors.${errors.company}`) : undefined}
        >
          <Input
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={values.company}
            onChange={(e) => setField("company", e.target.value)}
          />
        </Field>

        {!short && (
          <>
            <Field id="lead-country" label={t("contact:form.country")} optional>
              <Select
                autoComplete="country"
                placeholder={true}
                options={countryOptions}
                value={values.country}
                onChange={(e) => setField("country", e.target.value)}
              />
            </Field>

            <Field id="lead-industry" label={t("contact:form.industry")} optional>
              <Select
                placeholder={true}
                options={industryOptions}
                value={values.industry}
                onChange={(e) => setField("industry", e.target.value)}
              />
            </Field>

            <Field
              id="lead-company-size"
              label={t("contact:form.companySize")}
              hint={t("contact:form.companySizeHint")}
              optional
            >
              <Select
                placeholder={true}
                options={companySizeOptions}
                value={values.companySize}
                onChange={(e) => setField("companySize", e.target.value)}
              />
            </Field>
          </>
        )}
      </div>

      {/* Business needs fieldset */}
      {!short && <NeedsFieldset selected={values.businessNeeds} onToggle={toggleNeed} />}

      {/* Message textarea */}
      <Field id="lead-message" label={t("contact:form.message")} optional>
        {(controlProps) => (
          <div>
            <Textarea
              {...controlProps}
              rows={5}
              maxLength={LIMITS.message}
              value={values.message}
              onChange={(e) => setField("message", e.target.value)}
            />
            {values.message.length > 800 && (
              <p className="mt-1 text-right text-xs text-fg-muted" aria-live="off">
                {t("contact:form.counter", {
                  count: values.message.length,
                  max: LIMITS.message,
                })}
              </p>
            )}
          </div>
        )}
      </Field>

      {/* Consent checkbox */}
      {/* // TODO(Debass): the consent wording is a PLACEHOLDER. The PDF requires consent language supplied by legal and compliance (also under Côte d’Ivoire data-protection law) before publication. */}
      <div>
        <Checkbox
          id="lead-consent"
          checked={values.consent}
          onChange={(e) => setField("consent", e.target.checked)}
          label={t("contact:form.consent")}
          error={errors.consent ? t(`contact:errors.${errors.consent}`) : undefined}
          required
        />
        <div className="mt-1.5 pl-9">
          <TextLink to="/privacy" showArrow={false} className="text-sm">
            {t("nav.privacy")}
          </TextLink>
        </div>
      </div>

      {/* Honeypot field for spam prevention */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={(e) => setField("honeypot", e.target.value)}
        />
      </div>

      {/* Form actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          variant="primary"
          loading={status === "sending"}
          className="w-full sm:w-auto"
        >
          {type === "demo" ? t("cta.bookDemo") : t("cta.requestConversation")}
        </Button>

        {type === "contact" && (
          // TODO(Debass): temporary target after the restructure; the page is rewritten in a later step.
          <Link
            to="/features"
            className={cn(
              buttonStyles({ variant: "outline", size: "lg" }),
              "w-full text-center sm:w-auto",
            )}
          >
            {t("cta.exploreNelias")}
          </Link>
        )}
      </div>

      {/* Error alert line */}
      {status === "error" && (
        <Alert tone="danger" live="assertive" className="mt-4">
          <p className="mb-2">{t(`contact:errors.${submitError || "submitFailed"}`)}</p>
          <TextLink to={`mailto:${site.contact.email}`} showArrow={false}>
            {t("contact:feedback.writeTo", { email: site.contact.email })}
          </TextLink>
        </Alert>
      )}
    </form>
  );
}
