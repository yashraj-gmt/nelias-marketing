# Page Specification: Resources (`/resources`)

## 1. Purpose

Provides prospects and customers with an educational knowledge base, frequently asked questions (FAQs), and upcoming operational guides to accelerate platform understanding and adoption.

---

## 2. Page Structure & Components in Order

1. **`ResourcesHero` (`src/sections/resources/ResourcesHero.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Copy Source:_ `resources:hero.title`, `resources:hero.lead`.
2. **`ResourcesSearch` (`src/sections/resources/ResourcesSearch.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Input` (search query).
   - _Interaction:_ Real-time filter across both FAQ items and future articles.
3. **`ResourcesArticles` (`src/sections/resources/ResourcesArticles.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Card`, `AvailabilityBadge`.
   - _Data Source:_ `src/data/resources.js` (all currently state `coming-later`).
4. **`ResourcesFaq` (`src/sections/resources/ResourcesFaq.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `Accordion`.
   - _Copy Source:_ All 10 approved answers from `faq.json`.
5. **`ResourcesClosing` (`src/sections/resources/ResourcesClosing.jsx`)**
   - _Components:_ `CtaBand`, `PrimaryCta`.
   - _Copy Source:_ Approved closing text.

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Single-column article previews and full-width FAQ accordion headers.
- **Desktop (>= 1024px):** 3-column article cards with clean metadata badges.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`: Directs to `/configure`.
- If `features.configurator === false`: Directs to `/demo`.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/resources.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/resources.json) and [`src/i18n/locales/fr/resources.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/resources.json).
- Shared FAQs: `faq:items.*`.

---

## 6. Open Items (`TODO(Debass)`)

- Confirmation whether the full FAQ belongs on this page.
- Alignment of the data hosting FAQ answer with the definitive statements in Terms of Use Article 10.
