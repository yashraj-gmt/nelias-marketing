// TODO(Debass): the area order per sector is derived only from words in the approved industry descriptions; the Sector Engine Matrix is not provided. Confirm.
export const industryAreas = {
  "retail-distribution": ["crm-sales", "purchasing-inventory"],
  "professional-services": [
    "crm-sales",
    "projects-timesheets",
    "finance-accounting",
    "reporting-analytics",
  ],
  manufacturing: ["purchasing-inventory", "manufacturing-quality"],
  healthcare: ["purchasing-inventory", "customer-support-portal"],
  hospitality: ["purchasing-inventory", "finance-accounting", "human-resources"],
  "education-training": ["finance-accounting", "projects-timesheets"],
  "insurance-financial-services": ["crm-sales", "customer-support-portal", "workflows-automation"],
  "energy-field-services": ["assets-maintenance", "projects-timesheets"],
  "real-estate": ["crm-sales", "projects-timesheets", "finance-accounting", "reporting-analytics"],
  pharmacies: ["purchasing-inventory", "point-of-sale", "finance-accounting"],
  "construction-btp": ["purchasing-inventory", "projects-timesheets", "finance-accounting"],
  "it-technology-services": [
    "crm-sales",
    "projects-timesheets",
    "customer-support-portal",
    "reporting-analytics",
    "finance-accounting",
  ],
};
