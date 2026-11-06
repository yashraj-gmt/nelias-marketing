import {
  normalizeEmail,
  normalizeText,
  normalizePhone,
  isSafeRedirect,
} from "./validators";

export const LEGAL_VERSIONS = Object.freeze({
  terms: "5.0",
  privacy: "5.0",
});

/**
 * Allowed field error codes corresponding to keys in auth:errors.
 */
const ALLOWED_FIELD_ERROR_KEYS = new Set([
  "email.required",
  "email.invalid",
  "email.tooLong",
  "password.required",
  "password.tooLong",
  "password.tooShort",
  "password.noCase",
  "password.noDigit",
  "password.containsEmail",
  "password.common",
  "fullName.required",
  "fullName.invalid",
  "company.required",
  "company.invalid",
  "country.required",
  "country.invalid",
  "phone.invalid",
  "confirm.required",
  "confirm.mismatch",
  "terms.required",
  "emailTaken",
  "rateLimited",
  "unavailable",
  "signUpUnavailable",
  "network",
  "generic",
  "cooldown",
]);

/**
 * Sanitizes server field errors against known auth error keys.
 *
 * @param {Record<string, unknown>} [rawFieldErrors]
 * @returns {Record<string, { code: string }> | undefined}
 */
function sanitizeFieldErrors(rawFieldErrors) {
  if (!rawFieldErrors || typeof rawFieldErrors !== "object") {
    return undefined;
  }
  const sanitized = {};
  for (const [field, codeOrObj] of Object.entries(rawFieldErrors)) {
    const rawCode = typeof codeOrObj === "string" ? codeOrObj : codeOrObj?.code;
    if (!rawCode || typeof rawCode !== "string") continue;

    if (ALLOWED_FIELD_ERROR_KEYS.has(rawCode)) {
      sanitized[field] = { code: rawCode };
    } else if (ALLOWED_FIELD_ERROR_KEYS.has(`${field}.${rawCode}`)) {
      sanitized[field] = { code: `${field}.${rawCode}` };
    }
  }
  return Object.keys(sanitized).length > 0 ? sanitized : undefined;
}

/**
 * Submits sign-in credentials to the authentication API.
 *
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{
 *   status: "ok" | "invalid" | "rate_limited" | "validation" | "unavailable" | "network" | "error",
 *   redirectUrl?: string,
 *   fieldErrors?: Record<string, { code: string }>
 * }>}
 */
export async function signIn({ email, password }) {
  const baseUrl = (import.meta.env.VITE_AUTH_API_URL || "").trim().replace(/\/+$/, "");

  if (!baseUrl) {
    return { status: "unavailable" };
  }

  // TODO(Debass): the backend team must confirm this contract
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const normalized = normalizeEmail(email);
    const response = await fetch(`${baseUrl}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify({
        email: normalized,
        password: password ?? "",
      }),
    });

    if (response.status === 200) {
      let data;
      try {
        data = await response.json();
      } catch {
        // Response without JSON body
      }
      const safeUrl =
        data && typeof data.redirectUrl === "string" && isSafeRedirect(data.redirectUrl)
          ? data.redirectUrl
          : undefined;

      return {
        status: "ok",
        ...(safeUrl ? { redirectUrl: safeUrl } : {}),
      };
    }

    if (response.status === 401) {
      return { status: "invalid" };
    }

    if (response.status === 429) {
      return { status: "rate_limited" };
    }

    if (response.status >= 500 && response.status <= 599) {
      return { status: "unavailable" };
    }

    if (response.status === 400 || response.status === 422) {
      let data;
      try {
        data = await response.json();
      } catch {
        // Ignore JSON parse errors
      }
      const fieldErrors = sanitizeFieldErrors(data?.fieldErrors);
      if (fieldErrors) {
        return { status: "validation", fieldErrors };
      }
      return { status: "error" };
    }

    return { status: "error" };
  } catch {
    // Network error or timeout; never log credentials or request payload
    return { status: "network" };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Submits registration payload to the authentication API.
 *
 * @param {Object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.company
 * @param {string} payload.country
 * @param {string} [payload.phone]
 * @param {string} payload.password
 * @param {boolean} payload.acceptedTerms
 * @param {"en" | "fr"} [payload.locale="en"]
 * @returns {Promise<{
 *   status: "ok" | "exists" | "validation" | "rate_limited" | "unavailable" | "network" | "error",
 *   fieldErrors?: Record<string, { code: string }>
 * }>}
 */
export async function signUp({
  fullName,
  email,
  company,
  country,
  phone,
  password,
  acceptedTerms,
  locale = "en",
}) {
  const baseUrl = (import.meta.env.VITE_AUTH_API_URL || "").trim().replace(/\/+$/, "");

  if (!baseUrl) {
    return { status: "unavailable" };
  }

  // TODO(Debass): the backend team must confirm this contract
  // TODO(Debass): keep in sync with the published legal documents; the backend should keep acceptance evidence (account, date and time, versions) as stated in the Terms of Use article 13
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = normalizeText(fullName);
    const normalizedCompany = normalizeText(company);
    const normalizedPhone = phone ? normalizePhone(phone) : undefined;

    const body = {
      fullName: normalizedName,
      email: normalizedEmail,
      company: normalizedCompany,
      country,
      ...(normalizedPhone ? { phone: normalizedPhone } : {}),
      password: password ?? "",
      acceptedTerms: !!acceptedTerms,
      termsVersion: LEGAL_VERSIONS.terms,
      privacyVersion: LEGAL_VERSIONS.privacy,
      locale,
    };

    const response = await fetch(`${baseUrl}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (response.status === 201 || response.status === 200) {
      return { status: "ok" };
    }

    if (response.status === 409) {
      return { status: "exists" };
    }

    if (response.status === 429) {
      return { status: "rate_limited" };
    }

    if (response.status >= 500 && response.status <= 599) {
      return { status: "unavailable" };
    }

    if (response.status === 400 || response.status === 422) {
      let data;
      try {
        data = await response.json();
      } catch {
        // Ignore JSON parse errors
      }
      const fieldErrors = sanitizeFieldErrors(data?.fieldErrors);
      if (fieldErrors) {
        return { status: "validation", fieldErrors };
      }
      return { status: "error" };
    }

    return { status: "error" };
  } catch {
    // Network error or timeout; never log credentials or request payload
    return { status: "network" };
  } finally {
    clearTimeout(timeoutId);
  }
}
