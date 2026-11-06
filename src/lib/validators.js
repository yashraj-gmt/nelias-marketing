/**
 * Input length limits for lead form fields.
 */
export const LIMITS = Object.freeze({
  fullName: 100,
  workEmail: 254,
  company: 120,
  message: 1000,
});

/**
 * Validates if a string contains non-empty text after trimming.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isFilled(value) {
  if (typeof value !== "string") return false;
  return value.trim().length > 0;
}

/**
 * Permissive email check:
 * Exactly one '@', non-empty local part, dot in domain, no spaces.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
export function isEmail(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes(" ")) return false;

  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@")) return false;

  const domain = trimmed.slice(atIndex + 1);
  if (!domain || !domain.includes(".")) return false;

  const dotIndex = domain.lastIndexOf(".");
  if (dotIndex === 0 || dotIndex === domain.length - 1) return false;

  return true;
}
