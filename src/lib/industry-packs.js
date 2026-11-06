import { features } from "@/config/features";
import { industryPacks } from "@/data/industry-packs";

/**
 * V2 extension point: Returns commercially available Industry+ packs when the feature is enabled.
 * Nothing in the V1 UI uses this function.
 *
 * @returns {Array<Object>}
 */
export function getVisibleIndustryPacks() {
  return features.industryPlus ? industryPacks.filter((p) => p.status === "available") : [];
}
