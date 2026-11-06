import { plans, optionalCharges } from "./pricing-catalog.js";

// Figures of the document of 26 October 2026 that the catalog does not hold.
// TODO(Debass): move these into pricing-catalog.js when the pricing update of 19 October 2026 is applied there.
export const MODULES_INCLUDED = { start: 4, business: 6, professional: 8 };
export const EXTRA_MODULE_MONTHLY = 15000;
// TODO(Debass): move into pricing-catalog.js when the pricing update of 19 October 2026 is applied there.
export const INDUSTRY_PACK_MONTHLY = 50000;

/**
 * Returns structured home pricing facts extracted from the catalog.
 *
 * @returns {{
 *   plans: {
 *     start: { monthly: number, annual: number, users: number, legalEntities: number, storageGb: number },
 *     business: { monthly: number, annual: number, users: number, legalEntities: number, storageGb: number },
 *     professional: { monthly: number, annual: number, users: number, legalEntities: number, storageGb: number }
 *   },
 *   extraModule: number,
 *   extensions: {
 *     user1: number,
 *     users5: number,
 *     users10: number,
 *     legalEntity: number,
 *     extraModule: number,
 *     industryPack: number
 *   }
 * }}
 */
export function getHomePricing() {
  const findPlan = (id) => {
    const p = plans.find((item) => item.id === id);
    if (!p) {
      throw new Error(`Plan ${id} not found in pricing-catalog.js`);
    }
    return {
      id: p.id,
      key: p.key,
      monthly: p.monthly,
      annual: p.annual,
      users: p.users,
      legalEntities: p.legalEntities,
      storageGb: p.storageGb,
    };
  };

  const findCapacity = (id) => {
    const item = optionalCharges.capacity?.find((c) => c.id === id);
    return item?.rule?.amount ?? 0;
  };

  const findIndustryPack = () => {
    // Check if optionalCharges holds a numeric industry-plus amount
    for (const group of Object.values(optionalCharges)) {
      if (Array.isArray(group)) {
        const item = group.find((c) => c.id === "industry-plus");
        if (typeof item?.rule?.amount === "number") {
          return item.rule.amount;
        }
      }
    }
    return INDUSTRY_PACK_MONTHLY;
  };

  const extensions = {
    user1: findCapacity("user-1"),
    users5: findCapacity("users-5"),
    users10: findCapacity("users-10"),
    legalEntity: findCapacity("legal-entity"),
    extraModule: EXTRA_MODULE_MONTHLY,
    industryPack: findIndustryPack(),
  };

  return {
    plans: {
      start: findPlan("start"),
      business: findPlan("business"),
      professional: findPlan("professional"),
    },
    extraModule: EXTRA_MODULE_MONTHLY,
    extensions,
  };
}

/**
 * Calculates example cost for START with additional modules.
 *
 * @param {number} [modules=5]
 * @returns {{ base: number, extra: number, total: number }}
 */
export function exampleStart(modules = 5) {
  const startPlan = plans.find((p) => p.id === "start");
  const base = startPlan?.monthly ?? 49000;
  const extra = Math.max(0, modules - MODULES_INCLUDED.start) * EXTRA_MODULE_MONTHLY;
  return {
    base,
    extra,
    total: base + extra,
  };
}
