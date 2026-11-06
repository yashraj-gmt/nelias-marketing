import { useTranslation } from "react-i18next";
import { formatNumber, formatFcfa, formatDate } from "@/lib/format";

/**
 * Hook providing locale-aware formatting helpers that re-render automatically
 * whenever the active language changes.
 */
export function useFormat() {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage || i18n.language || "en";

  return {
    lng,
    language: lng,
    formatNumber: (value, options) => formatNumber(value, lng, options),
    formatFcfa: (value) => formatFcfa(value, lng),
    formatDate: (value, options) => formatDate(value, lng, options),
  };
}
