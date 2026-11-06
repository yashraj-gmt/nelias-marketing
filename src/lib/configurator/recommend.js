import { areaAddOn, planIncludesAddOns } from "./plan-rules.js";

// TODO(Debass): Portal Requirements say the engine compares a plan plus extensions with the next plan; no thresholds are given, so the capacity-first rule is used. Additional users and entities remain available in step 4.

/**
 * Determines recommended plan based on capacity parameters (users, legal entities, storage).
 *
 * @param {Object} state - Configurator state
 * @param {Record<string, Object>} plansById - Dictionary of plan objects
 * @returns {{ planId: string, needsReview: boolean }}
 */
export function recommendPlan(state, plansById) {
  const selfService = ["start", "business", "professional"];
  const professional = plansById?.professional || { users: 40, legalEntities: 2, storageGb: 50 };

  const needsReview =
    state.users > (professional.users ?? 40) ||
    state.entities > (professional.legalEntities ?? 2) ||
    state.storage === "more";

  if (needsReview) {
    return { planId: "enterprise", needsReview: true };
  }

  const reqUsers = Number(state.users) || 1;
  const reqEntities = Number(state.entities) || 1;
  const reqStorage = Number(state.storage) || 10;

  for (const pid of selfService) {
    const plan = plansById?.[pid];
    if (!plan) continue;

    const hasUsers = (plan.users ?? 0) >= reqUsers;
    const hasEntities = (plan.legalEntities ?? 0) >= reqEntities;
    const hasStorage = (plan.storageGb ?? 0) >= reqStorage;

    if (hasUsers && hasEntities && hasStorage) {
      return { planId: pid, needsReview: false };
    }
  }

  return { planId: "enterprise", needsReview: true };
}

/**
 * Returns suggested options (add-ons) based on selected business functions.
 *
 * @param {Object} state - Configurator state
 * @param {string} planId - Current target plan id
 * @returns {Array<{ area: string, addOnId: string, included: boolean }>}
 */
export function usefulOptions(state, planId) {
  const functions = Array.isArray(state?.effectiveModules)
    ? state.effectiveModules
    : Array.isArray(state?.modules)
      ? state.modules
      : Array.isArray(state?.functions)
        ? state.functions
        : [];
  const includedList = planIncludesAddOns[planId] || [];

  const seen = new Set();
  const options = [];

  for (const area of functions) {
    const addOnId = areaAddOn[area];
    if (addOnId && !seen.has(addOnId)) {
      seen.add(addOnId);
      options.push({
        area,
        addOnId,
        included: includedList.includes(addOnId),
      });
    }
  }

  return options;
}
