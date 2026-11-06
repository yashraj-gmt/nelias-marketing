# Page Specification: Pricing (`/pricing`)

## 1. Purpose

Presents the four NELIAS commercial plans (START, BUSINESS, PROFESSIONAL, ENTERPRISE), capacity quotas, included standard modules, interactive plan comparison, and optional charges. Governed strictly by the public pricing feature gate.

---

## 2. Page Structure & Components in Order

1. **`PricingHero` (`src/sections/pricing/PricingHero.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Copy Source:_ `pricing:hero.title`, `pricing:hero.lead`.
2. **`PlansSection` (`src/sections/pricing/PlansSection.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `SegmentedControl` (billing toggle), `PlanCard`.
   - _Gating:_ Amounts, the Monthly/Annual toggle, and the "12 months for 10" notice render ONLY when `features.pricingPublic === true`.
3. **`CompareSection` (`src/sections/pricing/CompareSection.jsx`)**
   - _Components:_ `Section` (tone="muted"), `Container`, `ResponsiveTable`.
   - _Contents:_ Detailed breakdown of users, storage, modules, and platform inclusions across all tiers.
4. **`OptionalChargesSection` (`src/sections/pricing/OptionalChargesSection.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `RuledList`.
   - _Gating:_ Renders ONLY when `features.pricingPublic === true`. Lists modules (+15,000 FCFA/mo), capacity, add-ons, and connectors.
5. **`PricingFaq` (`src/sections/pricing/PricingFaq.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `Accordion`.
   - _Copy Source:_ Approved billing & licensing answers from `faq.json`.
6. **`PricingClosing` (`src/sections/pricing/PricingClosing.jsx`)**
   - _Components:_ `CtaBand`, `CtaLink`.
   - _Copy Source:_ Approved closing text from PDF Section 8.

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Plan cards stacked vertically; Featured plan (BUSINESS) visually distinguished; Compare table features horizontal scroll with keyboard focus.
- **Desktop (>= 1024px):** 4-column plan card grid; sticky column headers in comparison matrix.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`:
  - Plan buttons: "Configure <PLAN>" (`/configure?plan=<id>&billing=<cadence>`).
  - Enterprise button: "Talk to an Expert" (`/contact`).
- If `features.configurator === false`:
  - Plan buttons: "Talk to an Advisor" (`/demo`).
  - Enterprise button: "Talk to an Expert" (`/contact`).

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/pricing.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/pricing.json) and [`src/i18n/locales/fr/pricing.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/pricing.json).
- Commercial Catalog: `src/data/pricing-catalog.js`.

---

## 6. Open Items (`TODO(Debass)`)

- Official validation of catalog public release (`approvedForPublic: false`).
- Confirmation of FAQ answers belonging on Pricing page.
- Storage extension price approval (currently completely excluded).
