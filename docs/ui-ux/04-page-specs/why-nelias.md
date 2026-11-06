# Page Specification: Why NELIAS (`/why-nelias`)

## 1. Purpose

Addresses prospective business owners by demonstrating that NELIAS understands everyday operational realities in West Africa. Focuses strictly on PDF Section 4: five tangible challenge/response pairs, a unique architectural differentiator, and a closing action.

---

## 2. Page Structure & Components in Order

1. **`WhyHero` (`src/sections/why/WhyHero.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Media:_ `WhyIllustration` featuring the ribbon bridge as the page's single bold visual device.
   - _Copy Source:_ `why:hero.title`, `why:hero.lead`.
2. **`ChallengesSection` (`src/sections/why/ChallengesSection.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `SectionHeading`, `RuledList`.
   - _Design Pattern:_ Ruled list comparison (deliberately not cards) with an accent highlight bar marking the NELIAS response.
   - _Copy Source:_ `why:challenges.items.*`.
3. **`DifferentiatorSection` (`src/sections/why/DifferentiatorSection.jsx`)**
   - _Components:_ `Section` (tone="tint"), `Container`, `Panel`.
   - _Copy Source:_ `why:differentiator.title`, `why:differentiator.body`.
4. **`WhyClosing` (`src/sections/why/WhyClosing.jsx`)**
   - _Components:_ `CtaBand`, `PrimaryCta`.
   - _Copy Source:_ Approved closing button text from PDF Section 4.

---

## 3. Responsive Behavior

- **Mobile (< 640px):** Challenge rows stack vertically (Problem first, followed by NELIAS Solution with left accent rule).
- **Desktop (>= 1024px):** 2-column comparison layout with horizontal visual alignment.

---

## 4. CTA Logic per Feature Flag State

- If `features.configurator === true`: Button routes to `/configure`.
- If `features.configurator === false`: Button routes to `/demo`.

---

## 5. Copy Source Files

- Primary: [`src/i18n/locales/en/why.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/why.json) and [`src/i18n/locales/fr/why.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/why.json).
- Challenge/response texts are kept identical to `home:scenarios.items.*`.

---

## 6. Open Items (`TODO(Debass)`)

- Confirmation whether "Challenges and benefits" should be a visible customer-facing headline.
- Grammatical refinement of approved English differentiator sentence.
