# Page Specification: Configurator (`/configure`)

## 1. Purpose

The interactive 5-step NELIAS solution configurator. Allows customers to configure capacity, select and replace standard modules within plan quotas (START 4, BUSINESS 6, PROFESSIONAL 8, ENTERPRISE tailored), dynamically calculate monthly/annual pricing, and transition seamlessly into a demo or draft sharing.

---

## 2. Page Structure & Components in Order

1. **`ConfiguratorApp` (`src/sections/configurator/ConfiguratorApp.jsx`)**
   - _Components:_ `StepProgress`, `Container`, `Section`, `EstimatePanel`, `SummaryPanel`.
2. **`StepIntro`:** Welcome screen with estimated completion time and start button.
3. **`StepProfile` (Step 1):**
   - _Inputs:_ Industry selector (supports `?industry=<slug>`), activity description, country selector, company size.
4. **`StepOperations` (Step 2):**
   - _Components:_ `ModuleSelector`, `ModuleMeter`, `NumberStepper` (users, legal entities, storage).
   - _Behavior:_ Pre-recommends modules based on chosen sector. Module replacement within quota is free. Extra modules cost 15,000 FCFA/mo each.
   - _Aside:_ Displays `EstimatePanel` immediately for instant visual price updates.
5. **`StepRecommendation` (Step 3):**
   - _Components:_ Capacity-first recommended plan card, modules rationale bullet, selected modules badge grid, recommended modules comparison.
6. **`StepCustomize` (Step 4):**
   - _Components:_ `ModuleSelector` (as first customization group), Plan tier selector, Add-ons checkboxes, Connectors checkboxes, Capacity steppers.
7. **`StepSummary` (Step 5):**
   - _Components:_ Complete configuration review, Standard modules list with Edit shortcut, Save draft button, Share link button, and Book a Demo CTA carrying `?needs=<selectedModuleIds>`.

---

## 3. Responsive Behavior

- **Mobile (< 1024px):** Steps render full-width with sticky step header. Estimate panel displays beneath step content or as collapsible drawer.
- **Desktop (>= 1024px):** 2-column layout (7 cols step content, 5 cols sticky `EstimatePanel` and `SummaryPanel`).

---

## 4. Gating & Price Rules

- Governed by `features.configurator` (falls back to `/demo` if disabled).
- Pricing amounts appear ONLY when `features.pricingPublic === true`. With gate off, shows plan structure, quotas, and "billed per month" alert without amounts.
- Storage extension pricing is strictly omitted.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/configurator.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/configurator.json) and [`src/i18n/locales/fr/configurator.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/configurator.json).

---

## 6. Open Items (`TODO(Debass)`)

- Sector Engine Matrix confirmation for module recommendation priority.
- Customer-facing terminology ("standard modules" vs "functions").
- Annual billing policy for extra modules.
