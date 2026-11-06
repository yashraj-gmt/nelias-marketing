// Derived ONLY from the approved plan text (Section 8): BUSINESS includes advanced workflows; PROFESSIONAL includes advanced API, customer portal and advanced BI.
// TODO(Debass): the Sector Engine rules and the function-to-add-on mapping are not provided; this mapping uses exact name matches only. Confirm.
export const areaAddOn = {
  "workflows-automation": "advanced-workflow",
  "reporting-analytics": "advanced-bi",
  "customer-support-portal": "customer-portal-plus",
  "assets-maintenance": "assets-maintenance-plus",
  "connectors-apis": "data-api-plus",
};

export const planIncludesAddOns = {
  start: [],
  business: ["advanced-workflow"],
  professional: ["advanced-workflow", "advanced-bi", "customer-portal-plus", "data-api-plus"],
  enterprise: [],
};

/**
 * Normalizes plans catalog into a dictionary keyed by plan id.
 * Accepts an array of plans or a pre-keyed dictionary.
 *
 * @param {Array<Object>|Record<string, Object>} plans
 * @returns {Record<string, Object>}
 */
export function toPlansById(plans) {
  if (!plans) return {};
  if (Array.isArray(plans)) {
    const byId = {};
    for (const p of plans) {
      if (p && p.id) {
        byId[p.id] = p;
      }
    }
    return byId;
  }
  if (typeof plans === "object") {
    return { ...plans };
  }
  return {};
}
