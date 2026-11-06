import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isEmail, isFilled } from "@/lib/validators.js";
import { leadMode, buildPayload, sendLead, buildMailto, logDevNotices } from "@/lib/leads.js";
import { track, EVENTS } from "@/lib/analytics.js";
import { industries } from "@/data/industries.js";
import { featureAreaOrder } from "@/data/feature-order.js";
import { capabilityStates, AVAILABILITY } from "@/data/feature-states.js";

/**
 * Hook managing lead form state, validation, anti-spam, and submission.
 *
 * @param {"contact"|"demo"} type
 * @returns {{
 *   values: object,
 *   errors: Record<string, string>,
 *   status: "idle"|"sending"|"success"|"mailto"|"error",
 *   submitError: string|null,
 *   setField: (field: string, value: any) => void,
 *   toggleNeed: (needKey: string) => void,
 *   submit: (event: React.FormEvent) => Promise<void>,
 *   formRef: React.RefObject<HTMLFormElement|null>,
 *   summaryRef: React.RefObject<HTMLDivElement|null>,
 *   feedbackRef: React.RefObject<HTMLDivElement|null>,
 * }}
 */
export function useLeadForm(type = "contact") {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const startedAtRef = useRef(0);
  const formRef = useRef(null);
  const summaryRef = useRef(null);
  const feedbackRef = useRef(null);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const initialIndustry = (() => {
    const indParam = searchParams.get("industry");
    return indParam && industries.includes(indParam) ? indParam : "";
  })();

  const initialBusinessNeeds = (() => {
    const needsParam = searchParams.get("needs");
    if (!needsParam) return [];
    const tokens = needsParam.split(",").map((t) => t.trim());
    const valid = [];
    const seen = new Set();
    for (const key of tokens) {
      if (
        featureAreaOrder.includes(key) &&
        capabilityStates[key] !== AVAILABILITY.HIDDEN &&
        !seen.has(key)
      ) {
        seen.add(key);
        valid.push(key);
        if (valid.length >= 12) break;
      }
    }
    return valid;
  })();

  const createInitialValues = useCallback(
    () => ({
      fullName: "",
      workEmail: "",
      company: "",
      country: "",
      industry: initialIndustry,
      companySize: "",
      message: "",
      businessNeeds: initialBusinessNeeds,
      consent: false,
      honeypot: "",
    }),
    [initialIndustry, initialBusinessNeeds],
  );

  const [values, setValues] = useState(createInitialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    logDevNotices();
  }, []);

  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const toggleNeed = useCallback((needKey) => {
    setValues((prev) => {
      const current = prev.businessNeeds || [];
      const updated = current.includes(needKey)
        ? current.filter((k) => k !== needKey)
        : [...current, needKey];
      return { ...prev, businessNeeds: updated };
    });
  }, []);

  const validate = useCallback((vals) => {
    const errs = {};
    if (!isFilled(vals.fullName)) {
      errs.fullName = "fullName";
    }
    if (!isFilled(vals.workEmail)) {
      errs.workEmail = "emailRequired";
    } else if (!isEmail(vals.workEmail)) {
      errs.workEmail = "emailInvalid";
    }
    if (!isFilled(vals.company)) {
      errs.company = "company";
    }
    if (!vals.consent) {
      errs.consent = "consent";
    }
    return errs;
  }, []);

  const submit = useCallback(
    async (event) => {
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }

      if (status === "sending") {
        return;
      }

      const trimmedValues = {
        ...values,
        fullName: values.fullName.trim(),
        workEmail: values.workEmail.trim(),
        company: values.company.trim(),
        message: values.message.trim(),
      };

      const validationErrors = validate(trimmedValues);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setStatus("idle");
        setTimeout(() => {
          summaryRef.current?.focus();
        }, 0);
        return;
      }

      setErrors({});

      // Anti-spam check: honeypot filled or completed in under 2500ms
      const elapsed = Date.now() - startedAtRef.current;
      const isBot = Boolean(values.honeypot) || elapsed < 2500;
      if (isBot) {
        // Silently display success without sending or tracking
        setStatus("success");
        setValues(createInitialValues());
        setTimeout(() => {
          feedbackRef.current?.focus();
        }, 0);
        return;
      }

      const payload = buildPayload(trimmedValues, {
        type,
        lng: i18n.language,
        pagePath: location.pathname,
      });

      const eventName = type === "demo" ? EVENTS.DEMO_REQUEST_SUBMIT : EVENTS.CONTACT_SUBMIT;

      if (leadMode === "mailto") {
        const { url, tooLong } = buildMailto(payload, t);
        if (tooLong) {
          setStatus("error");
          setSubmitError("mailtoTooLong");
          track(eventName, { ok: false, mode: "mailto" });
          setTimeout(() => {
            feedbackRef.current?.focus();
          }, 0);
          return;
        }

        window.location.assign(url);
        setStatus("mailto");
        track(eventName, { ok: true, mode: "mailto" });
        setTimeout(() => {
          feedbackRef.current?.focus();
        }, 0);
        return;
      }

      // Endpoint mode
      setStatus("sending");
      setSubmitError(null);

      const result = await sendLead(payload);
      track(eventName, { ok: result.ok, mode: "endpoint" });

      if (result.ok) {
        setStatus("success");
        setSubmitError(null);
        setValues(createInitialValues());
        setTimeout(() => {
          feedbackRef.current?.focus();
        }, 0);
      } else {
        setStatus("error");
        setSubmitError("submitFailed");
        setTimeout(() => {
          feedbackRef.current?.focus();
        }, 0);
      }
    },
    [status, values, validate, createInitialValues, type, i18n.language, location.pathname, t],
  );

  return {
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
  };
}
