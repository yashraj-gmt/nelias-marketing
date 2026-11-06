import {
  TrendingUp,
  Users,
  ShoppingCart,
  Boxes,
  Wallet,
  FolderKanban,
  Link2,
  ListChecks,
  KeyRound,
  Coins,
  MapPin,
  SlidersHorizontal,
  Route,
  Handshake,
  CreditCard,
  Store,
  Briefcase,
  Factory,
  Stethoscope,
  BedDouble,
  GraduationCap,
  ShieldCheck,
  Zap,
  Building2,
  Pill,
  HardHat,
  Laptop,
} from "lucide-react";
import { industryAreas } from "./industry-areas.js";

export const heroTiles = [
  { id: "sales", icon: TrendingUp },
  { id: "crm", icon: Users },
  { id: "purchasing", icon: ShoppingCart },
  { id: "inventory", icon: Boxes },
  { id: "accounting", icon: Wallet },
  { id: "projects", icon: FolderKanban },
];

export const moduleFamilies = [
  {
    id: "customerRelations",
    modules: ["sales", "crm", "marketing", "customerSupport", "pointOfSale"],
  },
  {
    id: "operations",
    modules: ["purchasing", "inventory", "production", "quality", "assets"],
  },
  {
    id: "financeTeams",
    modules: ["accounting", "payroll", "hr", "projects"],
  },
];

export const moduleBenefits = [
  { id: "zeroReentry", icon: Link2 },
  { id: "tracking", icon: ListChecks },
  { id: "roles", icon: KeyRound },
];

export const securityKeys = ["access", "encryption", "isolation", "audit"];

// show:false keeps an item off the page until Debass confirms it; needsPrices:true hides it when features.pricingPublic is false.
export const whyItems = [
  { id: "prices", icon: Coins, needsPrices: true },
  { id: "africa", icon: MapPin },
  { id: "configured", icon: SlidersHorizontal },
  { id: "path", icon: Route },
  { id: "proximity", icon: Handshake },
  // TODO(Debass): the document marks "Local payment" as "to be confirmed before publication"; it stays hidden until confirmed.
  { id: "payment", icon: CreditCard, show: false },
];

const industryIcons = {
  "retail-distribution": Store,
  "professional-services": Briefcase,
  manufacturing: Factory,
  healthcare: Stethoscope,
  hospitality: BedDouble,
  "education-training": GraduationCap,
  "insurance-financial-services": ShieldCheck,
  "energy-field-services": Zap,
  "real-estate": Building2,
  pharmacies: Pill,
  "construction-btp": HardHat,
  "it-technology-services": Laptop,
};

// TODO(Debass): capability suggestions are derived only from words in each approved industry summary. Confirm.
export const industryProfiles = Object.fromEntries(
  Object.entries(industryAreas).map(([slug, areas]) => [
    slug,
    {
      icon: industryIcons[slug],
      areas,
    },
  ]),
);
