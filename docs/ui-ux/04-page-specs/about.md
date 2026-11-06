# Page Specification: About Us (`/about`, `/about-us`)

## 1. Purpose

Presents Debass Technologies, its institutional foundation, core leadership vision, and commitment to delivering enterprise-grade business management technology tailored to African enterprises. Replaces PDF Section 9 with the official document `NELIAS_About_Us_For_Rahul_EN.docx`.

---

## 2. Page Structure & Components in Order

1. **`AboutHero` (`src/sections/about/AboutHero.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Media:_ Short brand ribbon accent device.
   - _Copy Source:_ `about:hero.title`, `about:hero.lead`.
2. **`FoundationSection` (`src/sections/about/FoundationSection.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `FoundationIllustration` (shape-only).
   - _Copy Source:_ `about:foundation.title`, `about:foundation.body`.
3. **`VisionSection` (`src/sections/about/VisionSection.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `VisionRipple` (subtle ribbon arc).
   - _Copy Source:_ `about:vision.title`, `about:vision.statement`.
4. **`AnswerSection` (`src/sections/about/AnswerSection.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Card`.
   - _Copy Source:_ `about:answer.title`, `about:answer.pillars.*`.
5. **`AboutClosing` (`src/sections/about/AboutClosing.jsx`)**
   - _Components:_ `CtaBand`, `PrimaryCta`.
   - _Copy Source:_ Approved closing button from earlier PDF Section 9.

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Single-column stacked layouts, centered leadership signature block.
- **Desktop (>= 1024px):** 2-column alternating text/illustration layouts.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`: Directs to `/configure`.
- If `features.configurator === false`: Directs to `/demo`.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/about.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/about.json) and [`src/i18n/locales/fr/about.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/about.json).

---

## 6. Open Items (`TODO(Debass)`)

- Confirmation of "leading platform" vision statement wording under advertising evidence guidelines.
- Closing signature wording alignment ("automatically" vs "automatically configured").
