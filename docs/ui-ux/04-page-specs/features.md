# Page Specification: Features (`/features`)

## 1. Purpose

Exhaustively presents the platform's twelve standard capability areas. Provides an interactive industry filter allowing prospects to see how their sector configures these capabilities, leading directly to the configurator.

---

## 2. Page Structure & Components in Order

1. **`PageHeader` (`src/components/patterns/PageHeader.jsx`)**
   - _Components:_ `CapabilityMosaic`, `Seo`.
   - _Copy Source:_ `features:hero.title`, `features:hero.lead`.
2. **`FeatureFilterList` (`src/sections/features/FeatureFilterList.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Tabs` (variant="pill").
   - _Filter Behavior:_ URL-synchronized with `?industry=<slug>`.
   - _Sub-component:_ `FeatureList` rendering capability areas in `featureAreaOrder` with `AvailabilityBadge`.
3. **`FeaturesClosing` (`src/sections/features/FeaturesClosing.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `FeaturesCta`.
   - _CTA Contract:_ Carries active `?industry=<slug>` parameter to `/configure` (or `/demo`).

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Horizontal scrolling pill tab bar, stacked feature items with vertical badge alignment.
- **Desktop (>= 1024px):** 2-column capability area list, prominent visual icons, fluid pill wrapping.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`:
  - Destination: `/configure` (or `/configure?industry=<slug>` when filtered).
  - Label: `cta.exploreConfiguration`.
- If `features.configurator === false`:
  - Destination: `/demo` (or `/demo?industry=<slug>` when filtered).
  - Label: `cta.talkToAdvisor`.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/features.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/features.json) and [`src/i18n/locales/fr/features.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/features.json).
- Shared Area Names: `features:areas.<key>.name`, `features:areas.<key>.description`.

---

## 6. Open Items (`TODO(Debass)`)

- Confirmation of each area's commercial availability state in `feature-states.js` (currently `demo-only`).
- Missing closing headline text in official PDF Section 6.
