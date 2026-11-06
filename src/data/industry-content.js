import {
  Wallet,
  Users,
  Boxes,
  ReceiptText,
  FolderKanban,
  UserRound,
  Cog,
  Wrench,
  Headset,
  ChartColumn,
  Workflow,
  Plug,
} from "lucide-react";

// If a lucide name does not exist in the installed version, use the closest icon and report it.
export const areaIcons = {
  "finance-accounting": Wallet,
  "crm-sales": Users,
  "purchasing-inventory": Boxes,
  "point-of-sale": ReceiptText,
  "projects-timesheets": FolderKanban,
  "human-resources": UserRound,
  "manufacturing-quality": Cog,
  "assets-maintenance": Wrench,
  "customer-support-portal": Headset,
  "reporting-analytics": ChartColumn,
  "workflows-automation": Workflow,
  "connectors-apis": Plug,
};

// Indexes into why.json challenges.items used as the default three challenge/outcome pairs.
// TODO(Debass): the PDF gives no sector-specific challenges or outcomes; these approved pairs are shown on every industry page.
export const defaultPairIndexes = [0, 4, 2];

// FAQ keys (from faq.json). TODO(Debass): confirm which approved answers belong on industry pages.
export const defaultFaqKeys = [
  "sectorEngine",
  "isErp",
  "addLater",
  "connect",
  "moreThanOneCompany",
];

export const industryFaqExtras = {
  "retail-distribution": ["multipleOffices"],
};
