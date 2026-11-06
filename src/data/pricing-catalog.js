/**
 * @typedef {Object} Plan
 * @property {string} id - Lowercase plan identifier ("start"|"business"|"professional"|"enterprise")
 * @property {string} key - Plan identifier (legacy uppercase)
 * @property {number|null} monthly - Monthly price in FCFA, null = custom quote
 * @property {number|null} annual - Annual price in FCFA, null = custom quote
 * @property {number|null} monthlyPrice - Monthly price in FCFA (legacy alias)
 * @property {number|null} annualPrice - Annual price in FCFA (legacy alias)
 * @property {number|null} users - Included user seats, null = tailored
 * @property {number|null} legalEntities - Included legal entities, null = tailored
 * @property {number|null} storageGb - Included storage in GB, null = tailored
 * @property {number|null} includedModules - Included standard modules, null = tailored
 * @property {boolean} [featured] - Whether this plan is visually highlighted
 */

// Storage extension prices are provisional (Hodi grid not approved) and must NOT be added here. Keep approvedForPublic false until Debass approves; amounts reach the screen only when features.pricingPublic is true.
// TODO(Debass): which capability areas are "standard modules" and how extra modules are billed on annual plans are to be confirmed (monthly is assumed, like other options).

/**
 * Internal pricing catalog. Components must read prices from here only -
 * never use price literals in component code.
 */
export const pricingCatalog = Object.freeze({
  // v3: standard-module quota and additional-module price added; Standard Sector Pack removed; Industry+ moved to V2 data
  catalogVersion: "internal-v3",
  approvedForPublic: false,
  currency: "FCFA",
  taxBasis: "excluding tax",
  annualBilledMonths: 10,

  /** @type {Plan[]} */
  plans: [
    {
      id: "start",
      key: "START",
      monthly: 49000,
      annual: 490000,
      monthlyPrice: 49000,
      annualPrice: 490000,
      users: 5,
      legalEntities: 1,
      storageGb: 10,
      includedModules: 4,
    },
    {
      id: "business",
      key: "BUSINESS",
      featured: true,
      monthly: 129000,
      annual: 1290000,
      monthlyPrice: 129000,
      annualPrice: 1290000,
      users: 15,
      legalEntities: 1,
      storageGb: 25,
      includedModules: 6,
    },
    {
      id: "professional",
      key: "PROFESSIONAL",
      monthly: 249000,
      annual: 2490000,
      monthlyPrice: 249000,
      annualPrice: 2490000,
      users: 40,
      legalEntities: 2,
      storageGb: 50,
      includedModules: 8,
    },
    {
      id: "enterprise",
      key: "ENTERPRISE",
      monthly: null,
      annual: null,
      monthlyPrice: null,
      annualPrice: null,
      users: null,
      legalEntities: null,
      storageGb: null,
      includedModules: null,
    },
  ],
});

export const plans = pricingCatalog.plans;

/**
 * Optional add-on, connector, and capacity pricing rules.
 * All amounts in FCFA, excluding tax, per month.
 */
export const optionalCharges = {
  modules: [{ id: "additional-module", rule: { kind: "fixed", amount: 15000 } }],
  capacity: [
    { id: "user-1", rule: { kind: "fixed", amount: 5000 } },
    { id: "users-5", rule: { kind: "fixed", amount: 20000 } },
    { id: "users-10", rule: { kind: "fixed", amount: 35000 } },
    { id: "legal-entity", rule: { kind: "fixed", amount: 25000 } },
  ],
  addOns: [
    { id: "advanced-workflow", rule: { kind: "fixed", amount: 20000 } },
    { id: "advanced-bi", rule: { kind: "fixed", amount: 25000 } },
    { id: "marketing-automation", rule: { kind: "fixed", amount: 20000 } },
    { id: "customer-portal-plus", rule: { kind: "fixed", amount: 15000 } },
    { id: "field-service-plus", rule: { kind: "fixed", amount: 25000 } },
    { id: "assets-maintenance-plus", rule: { kind: "fixed", amount: 25000 } },
    { id: "data-api-plus", rule: { kind: "fixed", amount: 25000 } },
    { id: "nelias-ai", rule: { kind: "fromPlusUsage", amount: 15000 } },
    { id: "audit-compliance", rule: { kind: "fixed", amount: 20000 } },
  ],
  connectors: [
    { id: "connector-standard", rule: { kind: "includedOr", amount: 10000 } },
    { id: "connector-business", rule: { kind: "range", min: 15000, max: 35000 } },
    { id: "connector-premium", rule: { kind: "from", amount: 50000 } },
    { id: "connector-custom", rule: { kind: "quote" } },
  ],
};

export const additionalModuleRule = optionalCharges.modules[0].rule;
