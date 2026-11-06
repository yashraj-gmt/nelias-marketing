# Page Specification: Industries Hub (`/industries`)

## 1. Purpose

Showcases the twelve supported industry sectors as a data-driven hub. Proves that NELIAS is one unified platform configured to specific industries via its built-in Sector Engine, not fragmented ERP forks.

---

## 2. Page Structure & Components in Order

1. **`IndustriesHero` (`src/sections/industries/IndustriesHero.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Copy Source:_ `industries:hero.title`, `industries:hero.lead`.
2. **`IndustriesHub` (`src/sections/industries/IndustriesHub.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Input` (search), `CardLink`, `IconBadge`.
   - _Search & Filter Behavior:_ Real-time search query matching sector names and summaries. Includes clear empty state with "Reset filters" when no sector matches.
3. **`IndustryClosing` (`src/sections/industries/IndustryClosing.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `IndustryCta`.
   - _Copy Source:_ `industries:closing.title`, `industries:closing.subtitle`.

---

## 3. Responsive Behavior

- **Mobile (< 640px):** Single-column vertical list of sector cards.
- **Tablet (640px – 1024px):** 2-column grid.
- **Desktop (>= 1024px):** 3-column structured grid.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`: Button routes to `/configure`.
- If `features.configurator === false`: Button routes to `/demo`.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/industries.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/industries.json) and [`src/i18n/locales/fr/industries.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/industries.json).
- Data source: `src/data/industries.js`.

---

## 6. Open Items (`TODO(Debass)`)

- Confirmation of sector terminology (e.g. "Hôtellerie", "Industrie manufacturière").
- French native review of drafted industry summaries.
