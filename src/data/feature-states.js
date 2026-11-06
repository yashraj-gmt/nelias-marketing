/**
 * Availability states for platform capabilities.
 * @readonly
 * @enum {string}
 */
export const AVAILABILITY = Object.freeze({
  AVAILABLE: "available",
  DEMO_ONLY: "demo-only",
  COMING_LATER: "coming-later",
  HIDDEN: "hidden",
});

/**
 * Current availability state for each capability key.
 * TODO: Debass must confirm each state before public launch.
 *
 * @type {Record<string, string>}
 */
export const capabilityStates = Object.freeze({
  "finance-accounting": AVAILABILITY.DEMO_ONLY,
  "crm-sales": AVAILABILITY.DEMO_ONLY,
  "purchasing-inventory": AVAILABILITY.DEMO_ONLY,
  "point-of-sale": AVAILABILITY.DEMO_ONLY,
  "projects-timesheets": AVAILABILITY.DEMO_ONLY,
  "human-resources": AVAILABILITY.DEMO_ONLY,
  "manufacturing-quality": AVAILABILITY.DEMO_ONLY,
  "assets-maintenance": AVAILABILITY.DEMO_ONLY,
  "customer-support-portal": AVAILABILITY.DEMO_ONLY,
  "reporting-analytics": AVAILABILITY.DEMO_ONLY,
  "workflows-automation": AVAILABILITY.DEMO_ONLY,
  "connectors-apis": AVAILABILITY.DEMO_ONLY,
});
