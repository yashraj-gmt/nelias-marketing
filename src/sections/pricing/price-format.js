import { formatNumber, formatFcfa } from "@/lib/format";

/**
 * Returns the localized description string for a price rule.
 *
 * @param {Object} rule
 * @param {string} rule.kind - One of "fixed"|"from"|"fromPlusUsage"|"range"|"includedOr"|"quote"
 * @param {number} [rule.amount]
 * @param {number} [rule.min]
 * @param {number} [rule.max]
 * @param {import("i18next").TFunction} t
 * @param {string} [lng="en"] - Current language code ("en" | "fr")
 * @returns {string}
 */
export function describeRule(rule, t, lng = "en") {
  if (!rule || !rule.kind) return "";

  switch (rule.kind) {
    case "fixed":
      return t("pricing:optional.price.fixed", {
        amount: formatFcfa(rule.amount, lng),
      });
    case "from":
      return t("pricing:optional.price.from", {
        amount: formatFcfa(rule.amount, lng),
      });
    case "fromPlusUsage":
      return t("pricing:optional.price.fromPlusUsage", {
        amount: formatFcfa(rule.amount, lng),
      });
    case "range":
      return t("pricing:optional.price.range", {
        min: formatNumber(rule.min, lng),
        max: formatFcfa(rule.max, lng),
      });
    case "includedOr":
      return t("pricing:optional.price.includedOr", {
        amount: formatFcfa(rule.amount, lng),
      });
    case "quote":
      return t("pricing:optional.price.quote");
    default:
      return "";
  }
}
