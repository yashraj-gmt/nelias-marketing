/**
 * src/data/faq-content.js
 * Structure and grouping for the centralized FAQ page (/faq).
 */

// New questions from the document of 26 October 2026, grouped by topic.
export const faqGroups = [
  { id: "pricing", items: ["offices", "includes", "moreModules", "twoMonths", "currency"] },
  { id: "modules", items: ["modify", "packsDate"] },
  { id: "hosting", items: ["hosted"] },
  { id: "migration", items: ["migrate", "legacy"] },
  // Previously approved questions of faq.json that are still valid (see 6.2).
  {
    id: "general",
    items: ["whatIsNelias", "isErp", "sectorEngine", "addLater", "connect", "moreThanOneCompany"],
  },
];

// Items that mention amounts or public prices: rendered only when features.pricingPublic is true.
export const needsPrices = ["moreModules", "currency"];

// Excluded legacy questions:
// - hosting: replaced by "hosted" (previous text says hosting is "being planned… subject to contractual confirmation" and conflicts with published legal documents)
// - multipleOffices: replaced by "offices"
// - getStarted: describes the former start journey ("Configure My NELIAS")
// - tryNelias: describes former trial journey
// TODO(Debass): decide whether the excluded legacy questions (hosting, multipleOffices, getStarted, tryNelias and any other excluded above) are deleted or rewritten.
export const excludedLegacyItems = ["hosting", "multipleOffices", "getStarted", "tryNelias"];
