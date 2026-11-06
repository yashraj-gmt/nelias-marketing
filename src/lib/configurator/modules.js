// TODO(Debass): the Sector Engine recommendation order is derived from industry-areas.js (relevance order), capped at the plan quota; the real rules (Sector Engine Matrix) are not provided.

import { standardModules } from "../../data/modules.js";
import { capabilityStates, AVAILABILITY } from "../../data/feature-states.js";
import { industryAreas as defaultIndustryAreas } from "../../data/industry-areas.js";

/**
 * Returns IDs of standard modules that are not hidden and are compatible with the given industry.
 *
 * @param {string} [industry]
 * @returns {string[]}
 */
export function visibleModuleIds(industry) {
  const isAll = !industry || industry === "other";
  return standardModules
    .filter((mod) => {
      if (capabilityStates[mod.id] === AVAILABILITY.HIDDEN) {
        return false;
      }
      if (isAll) return true;
      if (mod.compatibleIndustries === null) return true;
      return Array.isArray(mod.compatibleIndustries) && mod.compatibleIndustries.includes(industry);
    })
    .map((mod) => mod.id);
}

/**
 * Returns the module quota for a plan id, or null for enterprise (unlimited/tailored).
 *
 * @param {string} planId
 * @param {Object} [plansById]
 * @returns {number|null}
 */
export function quotaOf(planId, plansById) {
  if (!planId || planId === "enterprise") {
    return null;
  }
  if (plansById && plansById[planId]) {
    return plansById[planId].includedModules ?? null;
  }
  // Fallbacks if plansById not provided
  if (planId === "start") return 4;
  if (planId === "business") return 6;
  if (planId === "professional") return 8;
  return null;
}

/**
 * Returns recommended module IDs for an industry, filtered by visibility and capped at quota.
 *
 * @param {string} industry
 * @param {number|null} quota
 * @param {Object} [industryAreas=defaultIndustryAreas]
 * @param {string[]|Set<string>} [visibleIds]
 * @returns {string[]}
 */
export function recommendModules(
  industry,
  quota,
  industryAreas = defaultIndustryAreas,
  visibleIds,
) {
  if (!industry || industry === "other") {
    return [];
  }

  const rawAreas = (industryAreas && industryAreas[industry]) || [];
  const vis = visibleIds || visibleModuleIds(industry);
  const isVisible = (id) => (Array.isArray(vis) ? vis.includes(id) : vis.has(id));

  const filtered = rawAreas.filter(isVisible);

  if (typeof quota === "number" && quota >= 0) {
    return filtered.slice(0, quota);
  }

  return filtered;
}

/**
 * Returns counts and quota breakdown for selected modules under a plan.
 *
 * @param {string[]} modules
 * @param {string} planId
 * @param {Object} [plansById]
 * @returns {{ selected: number, included: number|null, extra: number, remaining: number, unlimited: boolean }}
 */
export function moduleInfo(modules, planId, plansById) {
  const selected = Array.isArray(modules) ? modules.length : 0;
  const quota = quotaOf(planId, plansById);
  const unlimited = quota === null || planId === "enterprise";

  if (unlimited) {
    return {
      selected,
      included: null,
      extra: 0,
      remaining: 0,
      unlimited: true,
    };
  }

  const included = quota;
  const extra = Math.max(0, selected - included);
  const remaining = Math.max(0, included - selected);

  return {
    selected,
    included,
    extra,
    remaining,
    unlimited: false,
  };
}

/**
 * Labels modules as 'included' or 'additional' according to selection order and plan quota.
 *
 * @param {string[]} modules
 * @param {number|null} included
 * @returns {Array<{ id: string, kind: "included" | "additional" }>}
 */
export function labelModules(modules, included) {
  if (!Array.isArray(modules)) return [];
  const isUnlimited = included === null || typeof included !== "number";

  return modules.map((id, index) => {
    if (isUnlimited || index < included) {
      return { id, kind: "included" };
    }
    return { id, kind: "additional" };
  });
}
