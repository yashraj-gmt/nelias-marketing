import { capabilityStates, AVAILABILITY } from "./feature-states.js";

// PDF order of the twelve capability areas (Section 7).
export const featureAreaOrder = [
  "finance-accounting",
  "crm-sales",
  "purchasing-inventory",
  "point-of-sale",
  "projects-timesheets",
  "human-resources",
  "manufacturing-quality",
  "assets-maintenance",
  "customer-support-portal",
  "reporting-analytics",
  "workflows-automation",
  "connectors-apis",
];

export const visibleAreas = featureAreaOrder.filter(
  (key) => capabilityStates[key] !== AVAILABILITY.HIDDEN,
);
