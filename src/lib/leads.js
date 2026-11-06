import { site } from "@/config/site.js";

export const leadMode = import.meta.env.VITE_LEAD_ENDPOINT ? "endpoint" : "mailto";

let hasLoggedMailtoNotice = false;
let hasLoggedConsentWarning = false;

/**
 * Log one-time developer notices in DEV mode.
 */
export function logDevNotices() {
  if (!import.meta.env.DEV) return;

  if (leadMode === "mailto" && !hasLoggedMailtoNotice) {
    hasLoggedMailtoNotice = true;
    // Intentional developer notice: explains why mailto is used instead of HTTP POST
    console.info(
      "[NELIAS] Lead form: VITE_LEAD_ENDPOINT is not set; form submissions will open the visitor's email client.",
    );
  }

  if (!hasLoggedConsentWarning) {
    hasLoggedConsentWarning = true;
    // Intentional developer notice: legal approval required before launch
    // TODO(Debass): the consent wording is a PLACEHOLDER. The PDF requires consent language supplied by legal and compliance (also under Côte d’Ivoire data-protection law) before publication.
    console.warn(
      "[NELIAS] Lead form: Consent text is a placeholder pending formal legal and regulatory review.",
    );
  }
}

/**
 * Build sanitized lead payload for submission.
 * All strings trimmed; businessNeeds is array of area keys.
 * Never stores or returns sensitive credentials.
 *
 * @param {object} values
 * @param {object} meta
 * @param {"contact"|"demo"} meta.type
 * @param {string} meta.lng
 * @param {string} meta.pagePath
 * @returns {object}
 */
export function buildPayload(values, { type, lng, pagePath }) {
  return {
    type,
    language: lng || "en",
    fullName: (values.fullName || "").trim(),
    workEmail: (values.workEmail || "").trim(),
    company: (values.company || "").trim(),
    country: (values.country || "").trim(),
    industry: (values.industry || "").trim(),
    companySize: (values.companySize || "").trim(),
    businessNeeds: Array.isArray(values.businessNeeds) ? values.businessNeeds : [],
    message: (values.message || "").trim(),
    consent: true,
    consentAt: new Date().toISOString(),
    pagePath: pagePath || (typeof window !== "undefined" ? window.location.pathname : ""),
  };
}

/**
 * Send lead payload to endpoint via HTTP POST.
 * 15 second timeout with AbortController.
 * Catches all errors and returns { ok: boolean }. Never logs the payload.
 *
 * @param {object} payload
 * @returns {Promise<{ ok: boolean }>}
 */
export async function sendLead(payload) {
  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT;
  if (!endpoint) {
    return { ok: false };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { ok: response.ok };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build a mailto: URL for the lead payload.
 *
 * @param {object} payload
 * @param {(key: string, options?: object) => string} t
 * @returns {{ url: string, tooLong: boolean }}
 */
export function buildMailto(payload, t) {
  const rawSubject = t(`contact:mail.subject.${payload.type}`, {
    defaultValue: payload.type === "demo" ? "[NELIAS] Demo request" : "[NELIAS] Contact request",
  });
  const subject = rawSubject.replace(/[\r\n]+/g, " ").trim();

  const lines = [];
  if (payload.fullName) {
    lines.push(`${t("contact:form.fullName")}: ${payload.fullName}`);
  }
  if (payload.workEmail) {
    lines.push(`${t("contact:form.workEmail")}: ${payload.workEmail}`);
  }
  if (payload.company) {
    lines.push(`${t("contact:form.company")}: ${payload.company}`);
  }
  if (payload.country) {
    let countryLabel = payload.country;
    try {
      countryLabel =
        new Intl.DisplayNames([payload.language || "en"], { type: "region" }).of(payload.country) ||
        payload.country;
    } catch {
      countryLabel = payload.country;
    }
    lines.push(`${t("contact:form.country")}: ${countryLabel}`);
  }
  if (payload.industry) {
    const industryLabel =
      payload.industry === "other"
        ? t("contact:form.other")
        : t(`industries:items.${payload.industry}.name`, { defaultValue: payload.industry });
    lines.push(`${t("contact:form.industry")}: ${industryLabel}`);
  }
  if (payload.companySize) {
    const sizeLabel = t(`contact:sizes.${payload.companySize}`, {
      defaultValue: payload.companySize,
    });
    lines.push(`${t("contact:form.companySize")}: ${sizeLabel}`);
  }
  if (Array.isArray(payload.businessNeeds) && payload.businessNeeds.length > 0) {
    const needsLabel = payload.businessNeeds
      .map((key) => t(`features:areas.${key}.name`, { defaultValue: key }))
      .join(", ");
    lines.push(`${t("contact:form.businessNeeds")}: ${needsLabel}`);
  }
  if (payload.message) {
    lines.push(`${t("contact:form.message")}:\n${payload.message}`);
  }
  lines.push(`${t("contact:mail.language")}: ${payload.language || "en"}`);

  const body = lines.join("\n\n");
  const email = site.contact.email || "contact@nelias.app";
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    url,
    tooLong: url.length > 1900,
  };
}
