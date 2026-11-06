// V2 ONLY. Industry+ Packs are planned and must not appear in the V1 site.
// Price rule: FCFA 50,000 per month, excluding taxes, per activated pack. Names and descriptions are added with the V2 UI.
export const industryPackRule = { kind: "fixed", amount: 50000 };
export const industryPacks = [
  { id: "immo-plus", industries: ["real-estate"], status: "planned" },
  {
    id: "courtage-plus",
    industries: ["insurance-financial-services"],
    status: "planned",
  },
  { id: "pharma-plus", industries: ["pharmacies"], status: "planned" },
  { id: "chantier-plus", industries: ["construction-btp"], status: "planned" },
  {
    id: "services-plus",
    industries: ["it-technology-services", "professional-services"],
    status: "planned",
  },
];
