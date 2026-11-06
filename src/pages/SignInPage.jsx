import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Seo } from "@/components/common/Seo";
import { Section, Container, Button, Alert, TextLink } from "@/components/ui";
import { Field, Input, PasswordField } from "@/components/ui/forms";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormErrorSummary } from "@/components/auth/FormErrorSummary";
import { useAuthForm } from "@/hooks/useAuthForm";
import { validateSignIn, normalizeEmail } from "@/lib/auth/validators";
import { signIn } from "@/lib/auth/auth-client";
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
 * Sign In page component.
 * Allows users to access their NELIAS environment.
 *
 * @returns {import("react").JSX.Element}
 */
export default function SignInPage() {
  const { t } = useTranslation();
  const passwordInputRef = useRef(null);

  // Controlled visibility for password field
  const [showPassword, setShowPassword] = useState(false);

  // Server banner status
  const [serverStatus, setServerStatus] = useState(null);

  // Rate limiting / cooldown state (in-memory only)
  // TODO(Debass): the real protection (rate limiting, lockout, captcha) must be implemented by the backend.
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [cooldownAnnounced, setCooldownAnnounced] = useState(false);

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
    initialValues: { email: "", password: "" },
    validate: validateSignIn,
  });

  // Handle 30-second timer for client cooldown
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Clear banner alert when visitor edits a field
  const handleFieldChange = useCallback(
    (name, value) => {
      if (serverStatus) {
        setServerStatus(null);
      }
      setValue(name, value);
    },
    [serverStatus, setValue],
  );

  const onSubmitValid = async (formValues) => {
    if (cooldownSeconds > 0) return;

    // Clear previous banner alert
    setServerStatus(null);
    // Hide password on submit
    setShowPassword(false);

    const normalized = normalizeEmail(formValues.email);
    const result = await signIn({
      email: normalized,
      password: formValues.password,
    });

    track(EVENTS.AUTH_SIGN_IN_RESULT, { result: result.status });

    if (result.status === "ok") {
      setConsecutiveFailures(0);
      if (result.redirectUrl) {
        setServerStatus({
          type: "redirecting",
          tone: "info",
          message: t("auth:signIn.redirecting"),
        });
        window.location.assign(result.redirectUrl);
      } else {
        setServerStatus({
          type: "successNoRedirect",
          tone: "note",
          message: t("auth:signIn.successNoRedirect"),
        });
      }
      return;
    }

    if (result.status === "invalid") {
      // Clear password field, hide it, focus it
      setValue("password", "");
      setShowPassword(false);
      requestAnimationFrame(() => {
        passwordInputRef.current?.focus();
      });

      const nextFailures = consecutiveFailures + 1;
      if (nextFailures >= 5) {
        setConsecutiveFailures(0);
        setCooldownSeconds(30);
        setCooldownAnnounced(true);
      } else {
        setConsecutiveFailures(nextFailures);
        setServerStatus({
          type: "invalid",
          tone: "danger",
          live: "assertive",
          message: t("auth:errors.invalidCredentials"),
        });
      }
      return;
    }

    if (result.status === "validation") {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
        setSummary(true);
      }
      return;
    }

    // Other failures count toward cooldown
    const nextFailures = consecutiveFailures + 1;
    if (nextFailures >= 5) {
      setConsecutiveFailures(0);
      setCooldownSeconds(30);
      setCooldownAnnounced(true);
      return;
    }
    setConsecutiveFailures(nextFailures);

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
        message: t("auth:errors.unavailable"),
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
  };

  const isCooldownActive = cooldownSeconds > 0;
  const isSubmitDisabled = submitting || isCooldownActive;

  // Build summary error items for FormErrorSummary
  const summaryErrors = [];
  if (summary) {
    if (errors.email) {
      summaryErrors.push({
        id: "email",
        message: resolveErrorMessage(t, errors.email),
      });
    }
    if (errors.password) {
      summaryErrors.push({
        id: "password",
        message: resolveErrorMessage(t, errors.password),
      });
    }
  }

  const handleFormSubmit = (e) => {
    handleSubmit(onSubmitValid)(e);
  };

  return (
    <>
      <Seo title={t("auth:signIn.seo.title")} noindex />

      <Section tone="tint" spacing="lg" className="min-h-[calc(100vh-14rem)] flex items-center">
        <Container>
          <AuthCard>
            <h1 className="font-display text-h2 text-heading">{t("auth:signIn.title")}</h1>
            <p className="mt-2 text-fg-muted">{t("auth:signIn.lead")}</p>

            {/* Screen reader announcement for cooldown start */}
            {isCooldownActive && cooldownAnnounced && (
              <span className="sr-only" role="status" aria-live="polite">
                {t("auth:errors.cooldown", { seconds: cooldownSeconds })}
              </span>
            )}

            <div className="mt-6 space-y-4">
              {/* Cooldown Alert (live="off" to avoid repeated timer announcements) */}
              {isCooldownActive && (
                <Alert tone="warning" live="off">
                  {t("auth:errors.cooldown", { seconds: cooldownSeconds })}
                </Alert>
              )}

              {/* Status / Error Banner */}
              {!isCooldownActive && serverStatus && (
                <Alert
                  tone={serverStatus.tone}
                  live={serverStatus.live || "polite"}
                >
                  {serverStatus.message}
                </Alert>
              )}

              {/* Blocked Submission Error Summary */}
              {summary && summaryErrors.length > 0 && (
                <FormErrorSummary errors={summaryErrors} />
              )}
            </div>

            <form
              noValidate
              onSubmit={handleFormSubmit}
              aria-describedby={summary && summaryErrors.length > 0 ? "form-error-summary" : undefined}
              className="mt-6 space-y-5"
            >
              <Field
                id="email"
                label={t("auth:fields.email")}
                error={touched.email ? resolveErrorMessage(t, errors.email) : undefined}
                required
              >
                <Input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => onBlur("email")}
                  autoComplete="username"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="next"
                  maxLength={320}
                />
              </Field>

              <PasswordField
                ref={passwordInputRef}
                id="password"
                name="password"
                label={t("auth:fields.password")}
                value={values.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={() => onBlur("password")}
                error={touched.password ? resolveErrorMessage(t, errors.password) : undefined}
                visible={showPassword}
                onVisibleChange={setShowPassword}
                autoComplete="current-password"
                enterKeyHint="go"
                maxLength={256}
                required
              />

              {/* TODO(Debass): no password-reset flow or page exists; add a "Forgot password" link when it does. */}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitDisabled}
                aria-disabled={isSubmitDisabled}
                className="mt-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
                    <span>{t("auth:signIn.submitting")}</span>
                  </>
                ) : (
                  t("auth:signIn.submit")
                )}
              </Button>

              <p className="mt-6 text-center text-fg-muted">
                {t("auth:signIn.noAccount")}{" "}
                <TextLink to="/sign-up">{t("auth:signIn.signUpLink")}</TextLink>
              </p>
            </form>
          </AuthCard>
        </Container>
      </Section>
    </>
  );
}
