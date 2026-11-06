/**
 * @file Pure validation functions for authentication flows.
 * No external dependencies, React, or i18n imports.
 * Used in client components and Node check scripts.
 */

export const LIMITS = Object.freeze({
  email: 254,
  emailLocal: 64,
  passwordMax: 128,
});

export const SIGNUP_LIMITS = Object.freeze({
  fullName: [2, 80],
  company: [2, 100],
  passwordMin: 10,
});

export const COMMON_PASSWORD_FRAGMENTS = Object.freeze([
  "password",
  "motdepasse",
  "azerty",
  "qwerty",
  "123456",
  "000000",
  "letmein",
  "welcome",
  "admin",
  "nelias",
]);

const LOCAL_PART_REGEX = /^[\p{L}\p{N}!#$%&'*+/=?^_{|}~.-]+$/u;
const DOMAIN_LABEL_REGEX = /^[\p{L}\p{N}-]+$/u;
const TLD_REGEX = /^\p{L}{2,}$/u;

/**
 * Trims and lowercases an email address.
 *
 * @param {string} value
 * @returns {string}
 */
export function normalizeEmail(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Validates an email address.
 *
 * @param {string} value
 * @returns {{ code: string } | null}
 */
export function validateEmail(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { code: "email.required" };
  }

  const trimmed = value.trim();
  if (trimmed.length > LIMITS.email) {
    return { code: "email.tooLong" };
  }

  const atIndex = trimmed.indexOf("@");
  if (atIndex === -1 || atIndex !== trimmed.lastIndexOf("@")) {
    return { code: "email.invalid" };
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);

  if (
    local.length < 1 ||
    local.length > LIMITS.emailLocal ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    /\s/.test(local) ||
    !LOCAL_PART_REGEX.test(local)
  ) {
    return { code: "email.invalid" };
  }

  if (
    domain.length < 1 ||
    !domain.includes(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    /\s/.test(domain)
  ) {
    return { code: "email.invalid" };
  }

  const labels = domain.split(".");
  for (const label of labels) {
    if (
      label.length === 0 ||
      label.startsWith("-") ||
      label.endsWith("-") ||
      !DOMAIN_LABEL_REGEX.test(label)
    ) {
      return { code: "email.invalid" };
    }
  }

  const lastLabel = labels[labels.length - 1];
  if (!TLD_REGEX.test(lastLabel)) {
    return { code: "email.invalid" };
  }

  return null;
}

/**
 * Validates a password for the sign-in form.
 * Does not trim whitespace, and does not enforce complexity rules at sign-in.
 *
 * @param {string} value
 * @returns {{ code: string } | null}
 */
export function validateSignInPassword(value) {
  if (typeof value !== "string" || value.length === 0) {
    return { code: "password.required" };
  }

  if (value.length > LIMITS.passwordMax) {
    return { code: "password.tooLong" };
  }

  return null;
}

/**
 * Validates sign-in form values.
 *
 * @param {{ email?: string, password?: string }} values
 * @returns {Record<string, { code: string }>}
 */
export function validateSignIn(values = {}) {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validateSignInPassword(values.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

/**
 * Validates whether a redirect URL is safe to follow after authentication.
 * Only allows https URLs whose host is "nelias.app" or a subdomain "*.nelias.app".
 * Rejects userinfo, other schemes, and arbitrary domains.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeRedirect(url) {
  if (typeof url !== "string" || !url.trim()) {
    return false;
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol !== "https:") {
      return false;
    }

    if (parsed.username || parsed.password) {
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    if (host === "nelias.app" || host.endsWith(".nelias.app")) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Trims and collapses inner whitespace to single spaces.
 *
 * @param {string} value
 * @returns {string}
 */
export function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Validates a person's full name.
 * 2 to 80 chars, starts with letter, only letters, marks, spaces, hyphens, apostrophes, dots.
 * At least 2 letters, no digits.
 *
 * @param {string} value
 * @returns {{ code: string } | null}
 */
export function validateFullName(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { code: "fullName.required" };
  }

  const normalized = normalizeText(value);
  if (
    normalized.length < SIGNUP_LIMITS.fullName[0] ||
    normalized.length > SIGNUP_LIMITS.fullName[1]
  ) {
    return { code: "fullName.invalid" };
  }

  if (!/^\p{L}/u.test(normalized)) {
    return { code: "fullName.invalid" };
  }

  if (/\d/.test(normalized)) {
    return { code: "fullName.invalid" };
  }

  if (!/^[\p{L}\p{M}\s\-'.’]+$/u.test(normalized)) {
    return { code: "fullName.invalid" };
  }

  const letters = normalized.match(/\p{L}/gu);
  if (!letters || letters.length < 2) {
    return { code: "fullName.invalid" };
  }

  return null;
}

/**
 * Validates a company name.
 * 2 to 100 chars, no control characters, only letters, digits, spaces, and & ' ’ . , - ( ) / +
 * Not digits only.
 *
 * @param {string} value
 * @returns {{ code: string } | null}
 */
export function validateCompany(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { code: "company.required" };
  }

  // eslint-disable-next-line no-control-regex
  if (/[\r\n\x00-\x1F\x7F]/.test(value)) {
    return { code: "company.invalid" };
  }

  const normalized = normalizeText(value);
  if (
    normalized.length < SIGNUP_LIMITS.company[0] ||
    normalized.length > SIGNUP_LIMITS.company[1]
  ) {
    return { code: "company.invalid" };
  }

  if (/^[\d\s]+$/.test(normalized)) {
    return { code: "company.invalid" };
  }

  if (!/^[\p{L}\p{M}\p{N}\s&'.’,\-()/+]+$/u.test(normalized)) {
    return { code: "company.invalid" };
  }

  return null;
}

/**
 * Validates a selected country code against allowed options.
 *
 * @param {string} value
 * @param {string[] | Record<string, any>} validCodes
 * @returns {{ code: string } | null}
 */
export function validateCountry(value, validCodes = []) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { code: "country.required" };
  }

  const trimmed = value.trim();
  const codes = Array.isArray(validCodes)
    ? validCodes
    : validCodes && typeof validCodes === "object"
      ? Object.keys(validCodes)
      : [];

  if (!codes.includes(trimmed)) {
    return { code: "country.invalid" };
  }

  return null;
}

/**
 * Normalizes a phone number by stripping spaces, dots, dashes, parentheses and converting leading 00 to +.
 *
 * @param {string} value
 * @returns {string}
 */
export function normalizePhone(value) {
  if (typeof value !== "string") return "";
  let cleaned = value.replace(/[\s.\-()]/g, "");
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Validates an optional phone number. Empty is valid; otherwise must match international format ^\+[1-9]\d{6,14}$
 *
 * @param {string} value
 * @returns {{ code: string } | null}
 */
export function validatePhone(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const normalized = normalizePhone(value);
  if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
    return { code: "phone.invalid" };
  }

  return null;
}

/**
 * Evaluates password criteria for checklist display.
 *
 * @param {string} value
 * @returns {{ length: boolean, case: boolean, digit: boolean }}
 */
export function passwordChecks(value) {
  if (typeof value !== "string") {
    return { length: false, case: false, digit: false };
  }
  const length = value.length >= SIGNUP_LIMITS.passwordMin;
  const hasCase = /\p{Lu}/u.test(value) && /\p{Ll}/u.test(value);
  const digit = /\d/.test(value);
  return { length, case: hasCase, digit };
}

/**
 * Validates a new password for registration.
 *
 * @param {string} value
 * @param {{ email?: string, fullName?: string }} [context={}]
 * @returns {{ code: string } | null}
 */
export function validateNewPassword(value, context = {}) {
  if (typeof value !== "string" || value.length === 0) {
    return { code: "password.required" };
  }

  if (value.length > LIMITS.passwordMax) {
    return { code: "password.tooLong" };
  }

  if (value.length < SIGNUP_LIMITS.passwordMin) {
    return { code: "password.tooShort" };
  }

  if (!/\p{Lu}/u.test(value) || !/\p{Ll}/u.test(value)) {
    return { code: "password.noCase" };
  }

  if (!/\d/.test(value)) {
    return { code: "password.noDigit" };
  }

  if (context.email && typeof context.email === "string") {
    const atIdx = context.email.indexOf("@");
    const local =
      atIdx !== -1
        ? context.email.slice(0, atIdx).trim().toLowerCase()
        : context.email.trim().toLowerCase();
    if (local.length >= 4 && value.toLowerCase().includes(local)) {
      return { code: "password.containsEmail" };
    }
  }

  const lower = value.toLowerCase();
  for (const frag of COMMON_PASSWORD_FRAGMENTS) {
    if (lower.includes(frag.toLowerCase())) {
      return { code: "password.common" };
    }
  }

  return null;
}

/**
 * Validates confirm password against the primary password.
 *
 * @param {string} value
 * @param {string} password
 * @returns {{ code: string } | null}
 */
export function validateConfirmPassword(value, password) {
  if (typeof value !== "string" || value.length === 0) {
    return { code: "confirm.required" };
  }
  if (value !== password) {
    return { code: "confirm.mismatch" };
  }
  return null;
}

/**
 * Validates terms acceptance checkbox.
 *
 * @param {boolean} checked
 * @returns {{ code: string } | null}
 */
export function validateTerms(checked) {
  if (checked !== true) {
    return { code: "terms.required" };
  }
  return null;
}

/**
 * Validates full sign up form values.
 *
 * @param {Record<string, any>} values
 * @param {{ countries?: string[] }} [options={}]
 * @returns {Record<string, { code: string }>}
 */
export function validateSignUp(values = {}, options = {}) {
  const errors = {};
  const validCountries = options.countries || [];

  const fullNameErr = validateFullName(values.fullName);
  if (fullNameErr) errors.fullName = fullNameErr;

  const emailErr = validateEmail(values.email);
  if (emailErr) errors.email = emailErr;

  const companyErr = validateCompany(values.company);
  if (companyErr) errors.company = companyErr;

  const countryErr = validateCountry(values.country, validCountries);
  if (countryErr) errors.country = countryErr;

  const phoneErr = validatePhone(values.phone);
  if (phoneErr) errors.phone = phoneErr;

  const passwordErr = validateNewPassword(values.password, {
    email: values.email,
    fullName: values.fullName,
  });
  if (passwordErr) errors.password = passwordErr;

  const confirmErr = validateConfirmPassword(values.confirm, values.password);
  if (confirmErr) errors.confirm = confirmErr;

  const termsErr = validateTerms(values.terms);
  if (termsErr) errors.terms = termsErr;

  return errors;
}
