import { useTranslation } from "react-i18next";
import { Badge } from "./Badge";
import { AVAILABILITY } from "@/data/feature-states";

/**
 * Badge indicating availability state of modules and connectors.
 *
 * @param {Object} props
 * @param {string} props.state - One of AVAILABILITY enum values
 * @param {"sm"|"md"} [props.size="md"]
 * @param {string} [props.className]
 */
export function AvailabilityBadge({ state, size = "md", className }) {
  const { t } = useTranslation();

  if (!state || state === AVAILABILITY.HIDDEN) {
    return null;
  }

  switch (state) {
    case AVAILABILITY.AVAILABLE:
      return (
        <Badge tone="success" size={size} className={className}>
          {t("ui.availability.available")}
        </Badge>
      );
    case AVAILABILITY.DEMO_ONLY:
      return (
        <Badge tone="info" size={size} className={className}>
          {t("ui.availability.demoOnly")}
        </Badge>
      );
    case AVAILABILITY.COMING_LATER:
      return (
        <Badge tone="neutral" size={size} className={className}>
          {t("ui.availability.comingLater")}
        </Badge>
      );
    default:
      return null;
  }
}
