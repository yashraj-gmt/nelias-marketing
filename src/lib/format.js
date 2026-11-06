/**
 * Resolve language code ("en" | "fr") to an Intl locale.
 * @param {string} [lng="en"]
 * @returns {"fr-FR"|"en-US"}
 */
function resolveLocale(lng) {
  return lng === "fr" ? "fr-FR" : "en-US";
}

/**
 * Format a number using Intl.NumberFormat according to the given language.
 *
 * @param {number|null|undefined} value
 * @param {string} [lng="en"]
 * @param {Intl.NumberFormatOptions} [options]
 * @returns {string}
 */
export function formatNumber(value, lng = "en", options = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "";
  }
  return new Intl.NumberFormat(resolveLocale(lng), options).format(Number(value));
}

/**
 * Format an amount in FCFA with a non-breaking space before "FCFA".
 * Example: 49000 in "en" -> "49,000 FCFA", in "fr" -> "49 000 FCFA" (with \u00A0).
 *
 * @param {number|null|undefined} value
 * @param {string} [lng="en"]
 * @returns {string}
 */
export function formatFcfa(value, lng = "en") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "";
  }
  const formatted = formatNumber(value, lng);
  return `${formatted}\u00A0FCFA`;
}

/**
 * Format a Date using Intl.DateTimeFormat according to the given language.
 *
 * @param {Date|number|string} value
 * @param {string} [lng="en"]
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(value, lng = "en", options = {}) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(resolveLocale(lng), options).format(date);
}
