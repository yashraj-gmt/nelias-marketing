import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { Seo } from "@/components/common/Seo";
import { Section, Container, Button, Alert, TextLink } from "@/components/ui";
import { Field, Input, Select, Checkbox, PasswordField } from "@/components/ui/forms";
import { buttonStyles } from "@/components/ui/button-styles";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormErrorSummary } from "@/components/auth/FormErrorSummary";
import { PasswordRules } from "@/components/auth/PasswordRules";
import { useAuthForm } from "@/hooks/useAuthForm";
import {
  validateSignUp,
  normalizeEmail,
  validateNewPassword,
  validateConfirmPassword,
} from "@/lib/auth/validators";
import { signUp } from "@/lib/auth/auth-client";
import { buildCountryOptions, countryCodes } from "@/data/countries";
import { track, EVENTS } from "@/lib/analytics";

/**
 * Resolves a validator error code into a localized message.
 *
 * @param {import("react-i18next").TFunction} t
 * @param {{ code: string } | string | null} error
 * @returns {string | undefined}
 */
function resolveErrorMessage(t, error) {
  if (!error) return undefined;
  const code = typeof error === "string" ? error : error?.code;
  if (!code) return undefined;
  return t(`auth:errors.${code}`, { defaultValue: code });
}

/**
 * Sign Up registration page component.
 *
 * @returns {import("react").JSX.Element}
 */
export default function SignUpPage() {
  const { t, i18n } = useTranslation();

  // TODO(Debass): the Terms of Use say the service is for companies and professionals; free-mail addresses are accepted here. Decide whether to restrict them.
  // TODO(Debass): no optional marketing-consent checkbox is offered; add one (unticked) when the marketing flow is decided.

  const countryOptions = useMemo(() => {
    return buildCountryOptions(i18n.language);
  }, [i18n.language]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [serverStatus, setServerStatus] = useState(null);
  const [submittedEmail, setSubmittedEmail] = useState(null);
  const successHeadingRef = useRef(null);
  const alertRef = useRef(null);

  const validate = useCallback(
    (values) => validateSignUp(values, { countries: countryCodes }),
    [],
  );

  const {
    values,
    errors,
    touched,
    setValue,
    onBlur,
    handleSubmit,
    submitting,
    summary,
    setSummary,
    setErrors,
  } = useAuthForm({
    initialValues: {
      fullName: "",
      email: "",
      company: "",
      country: "",
      phone: "",
      password: "",
      confirm: "",
      terms: false,
    },
    validate,
  });

  // Focus success heading when success state activates
  useEffect(() => {
    if (submittedEmail && successHeadingRef.current) {
      successHeadingRef.current.focus();
    }
  }, [submittedEmail]);

  // Clear banner alert on field edit and handle cross-field validation
  const handleFieldChange = useCallback(
    (name, value) => {
      if (serverStatus) {
        setServerStatus(null);
      }
      setValue(name, value);

      // Cross-field: if email changes, revalidate password (contains-email check)
      if (name === "email" && touched.password) {
        const passwordErr = validateNewPassword(values.password, { email: value });
        setErrors((prev) => ({ ...prev, password: passwordErr }));
      }

      // Cross-field: if password changes, revalidate confirm
      if (name === "password" && touched.confirm) {
        const confirmErr = validateConfirmPassword(values.confirm, value);
        setErrors((prev) => ({ ...prev, confirm: confirmErr }));
      }
    },
    [serverStatus, setValue, touched, values.password, values.confirm, setErrors],
  );

  const onSubmitValid = async (formValues) => {
    setServerStatus(null);

    // Honeypot check: silently accept without network call
    if (honeypot && honeypot.trim().length > 0) {
      setSubmittedEmail(normalizeEmail(formValues.email));
      return;
    }

    const result = await signUp({
      fullName: formValues.fullName,
      email: formValues.email,
      company: formValues.company,
      country: formValues.country,
      phone: formValues.phone,
      password: formValues.password,
      acceptedTerms: formValues.terms,
      locale: i18n.language === "fr" ? "fr" : "en",
    });

    track(EVENTS.AUTH_SIGN_UP_RESULT, { result: result.status });

    if (result.status === "ok") {
      // TODO(Debass): confirm the next step after sign-up (email confirmation, activation) and adjust the success text.
      setSubmittedEmail(normalizeEmail(formValues.email));
      return;
    }

    // On any failure: clear and hide both password fields
    setValue("password", "");
    setValue("confirm", "");
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (result.status === "exists") {
      // TODO(Debass): revealing that an email already has an account allows account enumeration; the backend may prefer a neutral response.
      setServerStatus({
        type: "exists",
        tone: "warning",
        message: (
          <span>
            {t("auth:errors.emailTaken")}{" "}
            <TextLink to="/sign-in" className="font-semibold underline">
              {t("auth:signUp.signInLink")}
            </TextLink>
          </span>
        ),
      });
      requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }

    if (result.status === "validation") {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        setSummary(true);
      }
      return;
    }

    if (result.status === "rate_limited") {
      setServerStatus({
        type: "rate_limited",
        tone: "warning",
        message: t("auth:errors.rateLimited"),
      });
    } else if (result.status === "unavailable") {
      setServerStatus({
        type: "unavailable",
        tone: "warning",
        message: t("auth:errors.signUpUnavailable"),
      });
    } else if (result.status === "network") {
      setServerStatus({
        type: "network",
        tone: "danger",
        message: t("auth:errors.network"),
      });
    } else {
      setServerStatus({
        type: "generic",
        tone: "danger",
        message: t("auth:errors.generic"),
      });
    }

    requestAnimationFrame(() => alertRef.current?.focus());
  };

  const onFormSubmit = (e) => {
    handleSubmit(onSubmitValid)(e);
  };

  // Build summary error items for FormErrorSummary
  const summaryErrors = [];
  if (summary) {
    const fieldOrder = [
      "fullName",
      "email",
      "company",
      "country",
      "phone",
      "password",
      "confirm",
      "terms",
    ];
    for (const fieldId of fieldOrder) {
      if (errors[fieldId]) {
        summaryErrors.push({
          id: fieldId,
          message: resolveErrorMessage(t, errors[fieldId]),
        });
      }
    }
  }

  return (
    <>
      <Seo title={t("auth:signUp.seo.title")} noindex />

      <Section tone="tint" spacing="lg" className="min-h-[calc(100vh-14rem)] flex items-center">
        <Container>
          <AuthCard className="max-w-2xl">
            {submittedEmail ? (
              /* Success Panel */
              <div role="status" className="py-4 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success-strong">
                  <Check className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2
                  ref={successHeadingRef}
                  tabIndex={-1}
                  className="font-display text-h3 text-heading outline-none"
                >
                  {t("auth:signUp.success.title")}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-fg">
                  {t("auth:signUp.success.body", { email: submittedEmail })}
                </p>
                <div className="mt-6">
                  <Link
                    to="/sign-in"
                    className={buttonStyles({ variant: "outline", size: "lg" })}
                  >
                    {t("auth:signUp.success.cta")}
                  </Link>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <>
                <h1 className="font-display text-h2 text-heading">{t("auth:signUp.title")}</h1>
                <p className="mt-2 text-fg-muted">{t("auth:signUp.lead")}</p>

                <div className="mt-6 space-y-4">
                  {/* Status Banner */}
                  {serverStatus && (
                    <div ref={alertRef} tabIndex={-1} className="outline-none">
                      <Alert tone={serverStatus.tone} live="polite">
                        {serverStatus.message}
                      </Alert>
                    </div>
                  )}

                  {/* Blocked Submission Error Summary */}
                  {summary && summaryErrors.length > 0 && (
                    <FormErrorSummary errors={summaryErrors} />
                  )}
                </div>

                <form
                  noValidate
                  onSubmit={onFormSubmit}
                  aria-describedby={
                    summary && summaryErrors.length > 0 ? "form-error-summary" : undefined
                  }
                  className="mt-6"
                >
                  {/* Honeypot field */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
                  >
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* 1. Full name */}
                    <Field
                      id="fullName"
                      label={t("auth:fields.fullName")}
                      error={touched.fullName ? resolveErrorMessage(t, errors.fullName) : undefined}
                      required
                    >
                      <Input
                        id="fullName"
                        name="fullName"
                        value={values.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        onBlur={() => onBlur("fullName")}
                        autoComplete="name"
                        maxLength={120}
                      />
                    </Field>

                    {/* 2. Work email */}
                    <Field
                      id="email"
                      label={t("auth:fields.workEmail")}
                      error={touched.email ? resolveErrorMessage(t, errors.email) : undefined}
                      required
                    >
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        onBlur={() => onBlur("email")}
                        autoComplete="email"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={320}
                      />
                    </Field>

                    {/* 3. Company */}
                    <Field
                      id="company"
                      label={t("auth:fields.company")}
                      error={touched.company ? resolveErrorMessage(t, errors.company) : undefined}
                      required
                    >
                      <Input
                        id="company"
                        name="company"
                        value={values.company}
                        onChange={(e) => handleFieldChange("company", e.target.value)}
                        onBlur={() => onBlur("company")}
                        autoComplete="organization"
                        maxLength={140}
                      />
                    </Field>

                    {/* 4. Country */}
                    <Field
                      id="country"
                      label={t("contact:form.country")}
                      error={touched.country ? resolveErrorMessage(t, errors.country) : undefined}
                      required
                    >
                      <Select
                        id="country"
                        name="country"
                        value={values.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                        onBlur={() => onBlur("country")}
                        autoComplete="country"
                        options={countryOptions}
                        placeholder={t("auth:errors.country.required")}
                      />
                    </Field>

                    {/* 5. Phone (optional) */}
                    <Field
                      id="phone"
                      label={t("auth:fields.phone")}
                      hint={t("auth:hints.phone")}
                      error={touched.phone ? resolveErrorMessage(t, errors.phone) : undefined}
                      optional
                      className="md:col-span-2"
                    >
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        onBlur={() => onBlur("phone")}
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={30}
                      />
                    </Field>

                    {/* 6. Password + Rules */}
                    <div className="flex flex-col">
                      <PasswordField
                        id="password"
                        name="password"
                        label={t("auth:fields.password")}
                        value={values.password}
                        onChange={(e) => handleFieldChange("password", e.target.value)}
                        onBlur={() => onBlur("password")}
                        error={
                          touched.password ? resolveErrorMessage(t, errors.password) : undefined
                        }
                        visible={showPassword}
                        onVisibleChange={setShowPassword}
                        autoComplete="new-password"
                        enterKeyHint="next"
                        maxLength={256}
                        describedBy="password-rules"
                        required
                      />
                      <PasswordRules value={values.password} id="password-rules" />
                    </div>

                    {/* 7. Confirm password */}
                    <div className="flex flex-col">
                      <PasswordField
                        id="confirm"
                        name="confirm"
                        label={t("auth:fields.confirmPassword")}
                        value={values.confirm}
                        onChange={(e) => handleFieldChange("confirm", e.target.value)}
                        onBlur={() => onBlur("confirm")}
                        error={touched.confirm ? resolveErrorMessage(t, errors.confirm) : undefined}
                        visible={showConfirmPassword}
                        onVisibleChange={setShowConfirmPassword}
                        autoComplete="new-password"
                        enterKeyHint="go"
                        maxLength={256}
                        required
                      />
                    </div>

                    {/* 8. Terms checkbox */}
                    <div className="md:col-span-2">
                      <Checkbox
                        id="terms"
                        name="terms"
                        checked={values.terms === true}
                        onChange={(e) => handleFieldChange("terms", e.target.checked)}
                        onBlur={() => onBlur("terms")}
                        error={touched.terms ? resolveErrorMessage(t, errors.terms) : undefined}
                        label={
                          <Trans
                            i18nKey="auth:terms.label"
                            components={{
                              terms: (
                                <a
                                  href="/terms"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-link underline hover:text-accent-strong"
                                >
                                  {""}
                                  <span className="sr-only"> ({t("auth:terms.newTab")})</span>
                                </a>
                              ),
                              privacy: (
                                <a
                                  href="/privacy"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-link underline hover:text-accent-strong"
                                >
                                  {""}
                                  <span className="sr-only"> ({t("auth:terms.newTab")})</span>
                                </a>
                              ),
                            }}
                          />
                        }
                      />
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={submitting}
                      aria-disabled={submitting}
                      className="mt-2 md:col-span-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
                          <span>{t("auth:signUp.submitting")}</span>
                        </>
                      ) : (
                        t("auth:signUp.submit")
                      )}
                    </Button>

                    {/* Already have an account? */}
                    <p className="mt-2 text-center text-fg-muted md:col-span-2">
                      {t("auth:signUp.hasAccount")}{" "}
                      <TextLink to="/sign-in">{t("auth:signUp.signInLink")}</TextLink>
                    </p>
                  </div>
                </form>
              </>
            )}
          </AuthCard>
        </Container>
      </Section>
    </>
  );
}
