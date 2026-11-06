# NELIAS Marketing Portal

Public marketing website for **NELIAS**, a Business Management Platform by Debass Technologies (nelias.app). Target audience: owners and managers of small and mid-size businesses, primarily in Côte d'Ivoire and wider Africa.

## Commands

```bash
npm run dev         # Start Vite dev server
npm run lint        # Run oxlint
npm run build       # Production build
npm run check:copy  # Scan for banned pre-launch phrases
npm run check:theme # Scan for raw palette color usage
npm run check:industries # Validate industry sectors, areas, and translations
npm run check:docs       # Validate UI/UX documentation parity
npm run verify      # lint + build + check:copy + check:i18n + check:theme + check:contrast + check:legal + check:config + check:industries + check:docs
npm run format      # Prettier
```

## Stack and conventions

- **JavaScript** (ES modules + JSX). No TypeScript - no `.ts`, `.tsx`, `tsconfig.json`, `@types` packages, or `typescript` dependency.
- **Vite 8** with `@vitejs/plugin-react` and `@tailwindcss/vite`.
- Function components. **Named exports** for components, **default export** for pages.
- JSDoc for props and non-obvious functions. Do NOT install `prop-types`.
- **Tailwind CSS v4** - CSS-first config. All design tokens in `src/styles/index.css`. No `tailwind.config.js`, `postcss.config.js`, or inline styles, CSS modules.
- Class merging via `cn()` from `src/lib/cn.js`.
- **`@` alias** maps to `src/` (configured in `vite.config.js` and `jsconfig.json`).
- All visible text through `t()` from `react-i18next`. Never hard-code text in JSX.
- Helper functions live in `.js` files, not next to components (keeps the `react-refresh/only-export-components` lint rule happy).
- `.gitkeep` only in empty folders.

## Design rules

- Tokens in `src/styles/index.css` are the **single source of truth**.
- **Orange** (`cta`) = primary action only. **Azure** = links and information. **Navy** = authority and dark sections.
- The one bold device is the orange-to-amber ribbon (`bg-brand-ribbon`); keep everything else calm.
- **Avoid:** identical card grids on every section, gradient washes as decoration, a tracked all-caps eyebrow above every heading, accenting a single word of a headline, numbered markers unless the content is a real sequence, arrow glyphs on buttons, one radius or one shadow on everything.
- Use the radius scale by hierarchy (`sm` inputs/chips, `md` buttons, `lg` cards, `xl` feature panels).
- Headlines: sentence case, plain verbs. CTAs say exactly what happens.
- **Motion brief:** lightweight one-time scroll reveals (opacity + translate up to 12px), user-triggered motion (tabs, accordions, selectors), no decorative loops. Always respect `prefers-reduced-motion`.

## Content rules

- Use the **exact approved copy** given in each step prompt.
- **No pre-launch language:** "coming soon", "waitlist", "waiting list", "pre-launch", "prelaunch", "countdown", "launching soon", "january 2027", "stay tuned".
- Never present an unvalidated module, connector, or AI feature as live.
- Never promise certifications, uptime, data residency, payment rails or regulatory compliance.
- NELIAS is **one platform** with sector configuration - not a separate ERP per industry.
- Healthcare and finance copy must avoid unverified clinical or regulatory claims.
- Product imagery is a validated screenshot or labelled "Illustrative preview".

## Gating rules

- `features.pricingPublic`: controls whether prices are displayed. When `false`, show plan structure without amounts and route to a conversation.
- Prices come only from `src/data/pricing-catalog.js`, never from component code.
- Never simulate a payment or an activation.

## Responsive and accessibility baseline

- **Mobile-first**. No horizontal scroll from 320px up.
- Verify at: 320, 375, 414, 768, 1024, 1280, 1440, and 1920px.
- Fluid type from the token scale.
- Touch targets ≥ 44px.
- Visible keyboard focus.
- Images: always set `width`/`height` or `aspect-ratio` and meaningful `alt` text.
- Semantic landmarks and one `<h1>` per page.
- Colour is never the only carrier of meaning.
- Text contrast ≥ 4.5:1.

## Definition of done (every step)

1. `npm run verify` passes.
2. The new page works at all widths listed above and by keyboard.
3. No new dependency without asking.
4. A short report of files changed.

## Agent safety

1. Work only inside the project folder. Never read or change anything outside it.
2. Read any file before editing or overwriting it.
3. No destructive commands: no `rm -rf`, `git reset --hard`, `git clean`, `npm audit fix --force`, global installs, or `sudo`.
4. Do not commit, push, or add git remotes.
5. No secrets - use `.env.example` for placeholders.
6. Install only explicitly listed packages. If an install fails, stop and report.
7. Never invent product copy, prices, statistics, certifications, testimonials or customer names.
8. Commands must work on Windows PowerShell, macOS and Linux.

## Layout

- Header, footer and the sticky mobile CTA live in `RootLayout`. Pages render only their own content inside `<main>`; never add a second header or footer.
- The header is sticky (64px mobile, 72px from md). Anchor targets rely on `scroll-padding-top: 5.5rem`.
- The logo PNG is opaque with a white background: use it only on white surfaces, or inside the white plate (`Logo variant="plate"`) on dark ones.
- CTA rule: Show a single "Request a Demo" CTA, never two buttons to the same destination. Use `HeaderCtas` or `CtaLink`; do not hand-roll CTAs.
- The language switcher is visible by default (hidden only when `VITE_FEATURE_FRENCH=false`).
- Navigation data lives in `src/config/navigation.js` only.

## UI kit

- Import primitives from `@/components/ui` (barrel) and patterns from `@/components/patterns`. Never hand-roll an accordion, tabs, modal, form field, badge, alert, table or toggle; extend the kit instead.
- Form controls: borders stay `border-field`; text size at least 16px; every control sits inside `Field` or `Fieldset`; errors need icon plus text; consent checkboxes are never pre-checked.
- Use varied surfaces: `Card` for bounded items, `Panel` for big feature areas, `RuledList` for quiet lists. Do not put every section into the same card grid.
- `Reveal` is the only scroll-reveal mechanism (one-time, 12px max). Do not add other scroll animations.
- Selection widgets must use `ChoiceCard`, `SegmentedControl` or `Tabs`; each follows the matching ARIA pattern.
- Dev galleries: `/__design` (tokens) and `/__ui` (components) exist only in development.

## Home & Copy Guidelines

- Copy single source: capability-area copy lives in `features.json` (`areas.<key>`), industry copy in `industries.json` (`items.<slug>`). Pages reuse these; never duplicate the text.
- `PrimaryCta` is the single main-CTA helper (configure when `features.configurator` is on, otherwise demo). Never place two buttons with the same destination side by side.
- The Home page uses PDF Section 3 ('ready-to-use copy': hero, the problem, the NELIAS approach, three pillars, industries teaser, closing conversion) as its skeleton, with the V3 interactive modules (scenarios, six capability cards, industry selector, four-step journey, product preview) embedded. Where the PDF contradicts itself, Section 3 wins on the hero and the closing; V3 supplies the module titles. Conflicts are marked `TODO(Debass)`.
- Open copy items for Debass (marked `TODO(Debass)` in code): scenario impact/benefit texts, the six capability use cases, industry selector examples and capability mapping, validated product screenshots.
- Mocks and previews contain no text, no numbers and no invented metrics, and always carry the "Illustrative preview" label.

## Internationalisation (mandatory rules)

1. Every visible string, `aria-label`, `alt`, `title`, `placeholder`, SEO text, error or validation message, tooltip and modal text comes from i18n through `useTranslation` / `t`. Never type display text in JSX, in `src/data/` or in `src/config/` (those hold ids, slugs, icons, flags and language-neutral contact data only). Dev-only pages (`DesignPreviewPage.jsx`, `UiKitPreviewPage.jsx`) are exempt.
2. Every new or changed key MUST be added to BOTH `locales/en/<ns>.json` and `locales/fr/<ns>.json` in the same change: identical structure, array lengths and `{{placeholders}}`. Never leave `fr` empty or in English (except the kept names). This applies even when a task prompt supplies only English copy: translate it yourself using `docs/FRENCH_GLOSSARY.md`, and add the new keys to `docs/FRENCH_REVIEW.md` as "Draft".
3. New namespaces are registered automatically from the JSON files (Vite glob). Create the `en` and `fr` file together.
4. Never call `t()` at module scope or freeze its result in `useMemo`/`useState` without the language as a dependency; call it inside components so text updates when the language changes.
5. Use `useFormat` / `src/lib/format.js` for numbers, currency (FCFA) and dates. Never hard-code separators.
6. Follow `docs/FRENCH_GLOSSARY.md` (formal "vous", sentence case, typographic apostrophe, `\u00A0` before `: ; ? !`, glossary terms, kept names).
7. `npm run check:i18n` is part of `npm run verify` and must pass. In development, missing keys are logged as `[i18n] missing key`.
8. The French copy is an AI-drafted translation until Debass approves it (`docs/FRENCH_REVIEW.md`). Do not change English text while translating.
9. The initial language is English (or `?lang=fr`); the choice is saved in localStorage `nelias-lang`. `VITE_FEATURE_FRENCH=false` hides the switcher.

## Theming (mandatory rules)

1. The site has a light and a dark theme. The theme is the `data-theme` attribute on `<html>`; `src/theme/theme.js` manages it (first visit follows the system, an explicit choice is saved in localStorage `nelias-theme`, `?theme=dark|light` forces and saves it). `ThemeToggle` lives in the utility bar, the header (below xl) and the mobile menu.
2. Components must use ROLE classes only, never raw palette classes (`bg-white`, `text-navy-*`, `text-ink-*`, `bg-ink-*`, `bg-azure-*`, `border-ink-*`, `border-azure-*`). Mapping to use (copy the full table from the dark-mode task into this file):

| Raw class                                                                                                                                      | Replace with                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `bg-white` (cards, panels, inputs, modals, frames)                                                                                             | `bg-surface-raised`                                                                      |
| `bg-white` (header, page-level)                                                                                                                | `bg-surface`                                                                             |
| `bg-white/95` (and similar alpha)                                                                                                              | `bg-surface-raised/95`                                                                   |
| `bg-ink-50`                                                                                                                                    | `bg-surface-muted`                                                                       |
| `bg-azure-50` (and `hover:bg-azure-50`)                                                                                                        | `bg-surface-tint`                                                                        |
| `bg-ink-100`                                                                                                                                   | `bg-surface-sunken`                                                                      |
| `bg-ink-200` (tracks, rails, dots, thin bars)                                                                                                  | `bg-line`                                                                                |
| `bg-azure-100`                                                                                                                                 | `bg-accent-soft`                                                                         |
| `bg-azure-500` (rules, underline bars, accent fills)                                                                                           | `bg-accent`                                                                              |
| `bg-navy-900` + `text-white` on selected, active, checked, reached states (pill tab, segmented option, checkbox, radio indicator, step marker) | `bg-selected text-selected-fg`                                                           |
| `bg-navy-900` + `text-white` on the secondary button and the Toggletip bubble                                                                  | `bg-secondary text-secondary-fg`; `hover:bg-navy-800` becomes `hover:bg-secondary-hover` |
| `bg-flame-100` + `text-flame-700` (highlight badge)                                                                                            | `bg-highlight-soft text-highlight-strong`                                                |
| `text-navy-900`, `text-navy-800`                                                                                                               | `text-heading`                                                                           |
| `text-ink-900`, `text-ink-800`                                                                                                                 | `text-fg`                                                                                |
| `text-ink-700`                                                                                                                                 | `text-fg-strong`                                                                         |
| `text-ink-600`                                                                                                                                 | `text-fg-muted`                                                                          |
| `text-ink-500`, `text-ink-400`, `text-ink-300`                                                                                                 | `text-fg-subtle`                                                                         |
| `text-azure-600` (links, info text)                                                                                                            | `text-link` (icons: `text-accent`)                                                       |
| `text-azure-700`                                                                                                                               | `text-accent-strong`                                                                     |
| `text-azure-500`                                                                                                                               | `text-accent`                                                                            |
| `border-ink-200`, `divide-ink-200`                                                                                                             | `border-line`, `divide-line`                                                             |
| `border-ink-300`                                                                                                                               | `border-line-strong`                                                                     |
| `border-ink-500`, `hover:border-navy-900` (form fields, indicators)                                                                            | `border-field`, `hover:border-heading`                                                   |
| `border-azure-200`                                                                                                                             | `border-accent-line`                                                                     |
| `border-azure-500`, `ring-azure-500`                                                                                                           | `border-accent`, `ring-accent`                                                           |
| `border-navy-900 text-navy-900` (outline button)                                                                                               | `border-heading text-heading hover:bg-secondary hover:text-secondary-fg`                 |
| ghost button `hover:bg-azure-50`                                                                                                               | `hover:bg-surface-tint`                                                                  |
| SVG `fill`/`stroke`/inline-style colours: `var(--color-ink-100)`                                                                               | `var(--surface-sunken)`                                                                  |
| `var(--color-ink-200)`                                                                                                                         | `var(--line)`                                                                            |
| `var(--color-ink-300)`                                                                                                                         | `var(--line-strong)`                                                                     |
| `var(--color-azure-50)`                                                                                                                        | `var(--surface-tint)`                                                                    |
| `var(--color-azure-100)`                                                                                                                       | `var(--accent-soft)`                                                                     |
| `var(--color-azure-500)`                                                                                                                       | `var(--accent)`                                                                          |
| `var(--color-navy-900)`                                                                                                                        | `var(--selected)`                                                                        |
| `white`, `#fff`, `#ffffff` fills                                                                                                               | `var(--surface-raised)`                                                                  |

3. If a task prompt names raw palette classes (`bg-white`, `text-navy-900`, `bg-ink-100`, `bg-azure-50`, `border-ink-500` and so on), translate them with the mapping above instead of using them.
4. Fixed in both themes (allowed as-is): the orange primary button (`bg-cta text-cta-fg`), the logo ribbon (`bg-brand-ribbon`, flame to sun gradients), dark bands and footer (`bg-brand-deep` with `text-white` and `text-fg-inverse*`), `text-white`/`bg-white/NN`/`border-white/NN` on those inverse surfaces, `backdrop:` scrims, and the white logo chip and plate.
5. Do NOT use `dark:` utilities (the only exception is the logo chip) and never hard-code colour literals in components or SVGs. Illustrations use role variables (`var(--surface-raised)`, `var(--line)`, `var(--accent)`, `var(--accent-soft)`, `var(--selected)`) and the brand ribbon colours.
6. Every new component and page must be checked in both themes: backgrounds, text, borders, hover, focus, selected, disabled, error states, illustrations. `npm run check:theme` and `npm run check:contrast` are part of `npm run verify`.
7. Moved role tokens exist as plain variables (`var(--surface)`, `var(--fg)`, `var(--line)`…), not as `var(--color-surface)`.
8. Orange is for actions and the ribbon only; the dark palette follows the same rule.

## About Page Guidelines

- About page copy lives in `about.json` (en and fr) and follows `NELIAS_About_Us_For_Rahul_EN.docx`; it replaces PDF Section 9. The closing button text comes from the PDF (Section 9).
- Heading structure: one `<h1>`, four `<h2>`; pull statements and the signature are paragraphs.
- Design signature of the page: the short ribbon accent above the title and the ribbon arc in `VisionRipple` (the only animation) are the page's bold devices; `FoundationIllustration` and `VisionRipple` are shape-only (no text, numbers, map or flag).
- Open copy items for Debass (marked `TODO(Debass)`): replacement of the PDF text, the signature wording, the "leading platform" claim, French review.

## Industries Page Guidelines

- The portal has twelve sectors; all sector lists are data-driven (`src/data/industries.js`, `src/data/industry-areas.js`, `src/i18n/locales/*/industries.json`). Adding a future sector is a data-only change: add a slug to `industries.js`, an areas array to `industry-areas.js`, an icon to `home-content.js`, and en/fr copy to `industries.json`, then run `npm run check:industries`.
- Area order in `industry-areas.js` represents the Sector Engine relevance order.
- The four newest sectors (Real Estate, Pharmacies, Construction / BTP, IT & Technology Services) use existing standard modules only and their copy must NOT mention specialised functions (rent collection, lease agreements, batch or expiry tracking, progress billing, retention, subcontractors, SLAs, insurance policies and similar: they belong to future Industry+ packs).
- Industry copy lives in `industries.json` (names, summaries, headlines, walkthrough nodes, labels) in both languages. Home also reads `items.<slug>.name/summary/headline`. Missing approved text is flagged with `TODO(Debass)`. To add sector-specific challenges and outcomes later, add `pairs: [{ challenge, outcome }]` (three entries) to `items.<slug>` in BOTH languages; the template picks them up with no code change.
- `faq.json` (en and fr) holds all ten approved FAQ answers; later steps (Pricing and others) reuse it. The English `tryNelias` answer starts with a lowercase "demo" exactly as in the PDF; fix it only when Debass approves.
- Capability status badges on industry pages come from `feature-states.js` (placeholder `demo-only` until confirmed); `hidden` areas are excluded everywhere.
- Healthcare, pharmacies and insurance pages show the approved summaries (with their "subject to…" caveats) in full and carry no other regulatory or clinical statements.
- CTA rule on industry pages: `IndustryCta` shows the approved "configuration" label only when `features.configurator` is on; otherwise it shows "Talk to an Advisor" linking to `/demo`.
- Open copy items for Debass (marked `TODO(Debass)`): confirmation of sector names and order, sector-specific challenges and outcomes, walkthroughs, headlines for sectors without benefit-led headlines, which FAQ answers belong on industry pages, SEO copy for industry pages, the French terminology ("Hôtellerie", "Industrie manufacturière"), French review.

## Features Page Guidelines

- Features copy lives in `features.json` (en and fr): `hero`, `page`, `disclaimer` and `areas.<key>` (shared with Home and the industry pages, which read the same names and descriptions). The visible order of the areas is `featureAreaOrder` in `src/data/feature-order.js`; `hidden` areas are excluded everywhere (list, mosaic, filter counts).
- Availability labels come from `feature-states.js`; every area is the placeholder `demo-only` until Debass confirms each state. To change an area, edit its state there (for example set it to `available` to remove the label); no copy changes are needed.
- The industry filter on `/features` (shareable as `?industry=<slug>`) uses `industryProfiles` from `home-content.js`; the mapping is derived from approved industry summaries and must be confirmed by Debass.
- CTA rule on the Features page: the approved button "Explore the Right Configuration" appears only when `features.configurator` is on; otherwise the strip shows "Talk to an Advisor" linking to `/demo`.
- Heading structure of `/features`: one `<h1>` and one `<h2>` per visible capability area; the disclaimer and the filter summary are not headings.
- The mosaic is shape-and-icon only (no text or numbers) and uses role colours; its ribbon is the page's one bold device.
- Open copy items for Debass (marked `TODO(Debass)`): confirmation of each availability state, the derived industry mapping, the hyphen in "usage-based", the missing closing headline, French review.

## Pricing Page Guidelines

- Pricing copy lives in `pricing.json` (en and fr). ALL amounts, capacities and module counts come from `src/data/pricing-catalog.js` (plans and `optionalCharges`) through `formatFcfa`/`formatNumber`; never type a price, user count, storage value or module quota in a component or an i18n file. Standard modules per plan (START 4, BUSINESS 6, PROFESSIONAL 8, ENTERPRISE tailored) are drawn from the catalog. Each additional standard module costs FCFA 15,000/month. The Sector Engine is included in every plan at no charge; there is NO separate or paid Sector Pack. Industry+ packs (FCFA 50,000/month) are V2 ONLY (data in `src/data/industry-packs.js`, feature flag `industryPlus` / `VITE_FEATURE_INDUSTRY_PLUS`, status gate, no V1 UI). Storage extension prices are provisional and must never be added anywhere.
- Catalog version is `internal-v3`. Optional charges now list 18 items across four groups: modules (additional standard module), capacity, add-ons, connectors.
- Display gate: amounts, the Monthly/Annual toggle, the "12 months for the price of 10" sentence, the optional-charges section and the price disclaimer render ONLY when `features.pricingPublic` is true; otherwise the page shows capacity, included modules and inclusions with "Pricing on request". The catalog's `approvedForPublic` stays false until Debass approves; in development a console warning appears when the gate is open and the catalog is not approved.
- The internal note "Prices below are internal commercial V2 reference figures…" is never displayed.
- CTA rules: plan buttons say "Configure <PLAN>" (linking to `/configure?plan=<id>`, plus `billing` when prices are public) only when `features.configurator` is on, otherwise "Talk to an Advisor" (to `/demo`); the Enterprise button is always "Talk to an Expert" (to `/contact`). Only the featured (BUSINESS) card uses the orange primary button. The later Configurator step reads the `plan` and `billing` query parameters.
- Heading structure of `/pricing`: one `<h1>`, a visually hidden `<h2>` "Plans" with one `<h3>` per plan, then `<h2>` sections (compare, optional charges when shown, FAQ).
- Open copy items for Debass (marked `TODO(Debass)`): wording for the hidden-price state, the "Included" lists ("Sector Engine" wording), modules note under the plan cards, standard modules on annual plans and which capability areas are standard modules, the Enterprise button destination, the labels "Compare plans" and "Optional charges", commercial readiness of every add-on, connector and NELIAS AI, FAQ selection, French review.

## Contact and Demo Page Guidelines

- Contact and Demo copy lives in `contact.json` (en and fr). Both pages share `LeadForm`; they differ only in the header and the submit label (Contact: "Request a Conversation" plus the secondary "Explore NELIAS"; Demo: "Book a Demo").
- Submission modes: with `VITE_LEAD_ENDPOINT` set, the form POSTs JSON (see `src/lib/leads.js`); otherwise it opens a `mailto:` message to the site email and says so. Never fake a success. `npm run dev:lead` starts a local test server (`scripts/dev-lead-server.mjs`; set `VITE_LEAD_ENDPOINT=http://127.0.0.1:8787/lead` in `.env.local`; `?fail=1` returns 500 and `?slow=1` delays).
- Privacy rules: never send personal data to analytics (`track` receives only `ok` and `mode`), never store it in localStorage, sessionStorage, cookies or URLs; `VITE_*` variables are public, so no secrets there.
- Form rules: validation messages come from i18n keys through `validators.js`; errors appear as an error summary (focus moves to it) plus inline messages; controls have stable ids; a hidden honeypot field silently drops bots; the consent checkbox is never pre-checked and its wording is a placeholder until legal approves.
- Country names come from `Intl.DisplayNames` in the active language; industry names from `industries.json`; business needs from `features.json` (hidden areas excluded).
- No `Reveal` on pages with forms.
- Open copy items for Debass (marked `TODO(Debass)`): consent wording (legal and compliance), where submissions go (endpoint, CRM or email) and who handles them, success and error wording and any response-time promise, company-size ranges, the destination of "Explore NELIAS", SEO copy, demo scheduling tool (if any), French review.

## Legal Document Guidelines

- The Terms of Use page now publishes the English official text of version 5.0 (29 October 2026): 18 entries (18 numbered articles). The French file is still version 1.1 and is listed in `pendingFrench` (check scripts print a WARN); when Debass supplies the official French text, replace `fr/terms.json`, remove the namespace from `pendingFrench` and update the maps in `check-legal.mjs`.
- Legal text schema now allows an optional `meta.intro` (shown after the publisher line, in the active language only), annex titles ("Annex A — …") after the numbered articles, and (DPA only) the plain title "Signatures". Typographic apostrophes and quotation marks of the new versions are kept as published.
- Never AI-translate legal text. Changes come only from official documents supplied by Debass.
- Legal pages have no animation, no `Reveal` and no marketing elements. Emails, URLs and phone numbers are auto-linked by `Linkified` without changing their characters.
- `npm run check:legal` (part of `npm run verify`) guards article counts, numbering and EN/FR structure parity.
- Open items for Debass (marked `TODO(Debass)`): the SEO text of legal pages (derived from the document header); alignment between the Terms (definitive hosting statements: Hodi in Grand-Bassam, disaster recovery in Johannesburg, storage remains in Africa) and the marketing FAQ answer on hosting ("being planned… subject to contractual confirmation"); the two contact addresses (`info@debasstechnologies.com` in the Terms, `contact@nelias.app` elsewhere); the Terms of Sale (CGV), DPA, SLA and Privacy Policy referenced by the Terms (shown as plain text until those documents and pages exist); legal review before publication.
- The Terms of Sale legal text (`cgv.json`, en and fr) is kept as official text but is not rendered anywhere. Do not delete or edit it without a decision from Debass. // TODO(Debass): decide whether the Terms of Sale text is deleted or reused later.
- The Data Processing Agreement (DPA) page now publishes the English official text of version 2.0 (29 October 2026): 20 entries (15 numbered articles, 4 annexes, plus the plain title "Signatures"). The French file is still version 1.1 and is listed in `pendingFrench` (check scripts print a WARN); when Debass supplies the official French text, replace `fr/dpa.json`, remove the namespace from `pendingFrench` and update the maps in `check-legal.mjs`.
- `scripts/check-legal.mjs` maps now are: `expected` (`terms` 18, `cgv` 19, `dpa` 20, `privacy` 16, `sla` 19), `lists` (`terms` 6 → 7, `cgv` 19 → 5, `dpa` 17 → 9, `privacy` and `sla` none), `tables` (`dpa` 16 → 2×7, 18 → 2×3, 20 → 2×2; `privacy` 8 → 2×8; `sla` 3 → 3×4, 9 → 3×4, 17 → 2×8, 18 → 3×4, 19 → 2×2), `plainTitles: { dpa: ["Signatures"] }`, and `pendingFrench: ["dpa", "privacy", "sla", "terms"]`.
- Open items for Debass (marked `TODO(Debass)`): SEO text of the DPA page (derived from the document header); French official text of version 2.0; cross-references to Terms of Sale (articles 11, 14, 15, 18) and SLA; sub-processors Hodi and CRMPUNCH and Tier III description; SOVEREIGN offer naming; annex D and signature table implementation.
- The Privacy Policy page now publishes the English official text of version 5.0 (29 October 2026): 16 entries (16 numbered articles). The French file is still version 1.1 and is listed in `pendingFrench` (check scripts print a WARN); when Debass supplies the official French text, replace `fr/privacy.json`, remove the namespace from `pendingFrench` and update the maps in `check-legal.mjs`.
- Open items for Debass (marked `TODO(Debass)`): SEO text of the Privacy page (derived from the document header); French official text of version 5.0; cross-references to DPA and Terms of Sale; configurator references in articles 1 and 3; marketing-consent box in article 11; cookie choice panel in article 12; alignment of retention periods and hosting with real practice.
- The Service Level Agreement (SLA) page now publishes the English official text of version 2.0 (29 October 2026): 19 entries (16 numbered articles, 3 annexes). The French file is still version 1.1 and is listed in `pendingFrench` (check scripts print a WARN); when Debass supplies the official French text, replace `fr/sla.json`, remove the namespace from `pendingFrench` and update the maps in `check-legal.mjs`.
- Legal text schema now allows an optional `meta.intro` (shown after the publisher line, in the active language only), annex titles ("Annex A — …") after the numbered articles, and (DPA only) the plain title "Signatures". Typographic apostrophes and quotation marks of the new versions are kept as published.
- Never AI-translate legal text. Changes come only from official documents supplied by Debass.
- Open items for Debass (marked `TODO(Debass)`): SEO text of the SLA page (derived from the document header); French official text of version 2.0; cross-references to the Terms of Sale, ToU and DPA; alignment of the hosting architecture with Terms of Use, DPA and Privacy Policy; alignment of the service levels with the pricing page; verification of support channels; annex C signature block implementation.

## UI/UX Specification Guidelines

- The `docs/ui-ux/` document set is the formal UI/UX specification for the NELIAS marketing portal.
- Any new page, route, or component MUST update the matching document in the same change (`npm run check:docs` enforces that all routes in `router.jsx`, component filenames in `src/components/ui` and `src/components/patterns`, and page specs in `docs/ui-ux/04-page-specs/` are documented).
- The audit report (`docs/ui-ux/05-audit-report.md`) records every refinement and finding across viewports, themes, and languages.
- Strict constraint: no redesign or modification of brand colors, typography, logo treatments, or approved copy without prior Debass approval.

## Restructure (October 2026)

- Site map after the restructure (October 2026). Menu: About Us, Industries, Features, Pricing, plus the Request a Demo button (`cta.bookDemo`, `/demo`), the only call-to-action in the header. Removed pages: Why NELIAS, How It Works, Resources, Terms of Sale and Subscription, Configure My NELIAS; their old addresses redirect (table in the router).
- The Terms of Sale legal text (`cgv.json`, en and fr) is kept as official text but is not rendered anywhere. Do not delete or edit it without a decision from Debass.
- There is no configurator, no `features.configurator` flag and no `features.checkout` flag. The primary CTA is always the demo button.
- Later steps rebuild one page at a time (Home, FAQ, Sign Up, Pricing, Features, Industries, footer). Until then, remaining pages may contain temporary links marked `TODO(Debass)`.

## Home Page (October 2026)

- Home page (October 2026) has seven sections: hero, modules, pricing, security, Why NELIAS, About NELIAS, final CTA; copy in `home.json` (en and fr) from "NELIAS BMP Website Content - Home Page (EN)" of 26 October 2026. The document's problem, platform, configurator, hosting, Industry+ packs and FAQ parts are intentionally not on Home (the FAQ gets its own page).
- Pricing gate on Home: every amount and every claim of public prices appears only when `features.pricingPublic` is true. Amounts come from `pricing-catalog.js` and `src/data/home-pricing.js`; `npm run check:home` (part of `verify`) checks them against the document figures and scans Home sources for amount literals.
- "Sign Up" is an external link to `site.signUpUrl` (`https://login.nelias.app/`) through `SignUpLink`; the site has no sign-up form, account or checkout. Reuse `SignUpLink` wherever a Sign Up button is required.
- `DataTable` (patterns) is the shared accessible table; reuse it for plan, module and comparison tables.
- Open items for Debass (marked `TODO(Debass)`): alignment of the Pricing page and catalog with the 19 October 2026 update (modules per plan, base sector configuration included); hosting wording versus the legal documents; confirmation of the audit-log, SSO and "Local payment" claims; hero and final button choices; sign-up address; French review.

## FAQ Page Guidelines

- The FAQ page (`/faq`) is the single place for frequently asked questions; no other page carries an FAQ section. Questions live in `faq.json` (en and fr) as `items.<key>.q/.a`; the page groups them through `src/data/faq-content.js` (pricing, modules, hosting, migration, general). To add a question: add its key in both languages and in a group.
- FAQ items that mention amounts (`moreModules`, `currency`) appear only when `features.pricingPublic` is true; amounts come from `home-pricing.js` through the formatter.
- The legacy `faq.json` items `hosting`, `multipleOffices`, `getStarted` and `tryNelias` are kept in the file but not rendered (replaced or outdated).

## Pricing Page Guidelines (October 2026)

- The Pricing page (October 2026) has: header, plan cards with billing toggle (every plan button is a `SignUpLink` to `https://login.nelias.app/`), comparison table, extensions (prices public only, monthly only), add-ons and connectors (existing catalog list), sector configurations and Industry+ packs (coming soon), Enterprise block. It has no FAQ and no configure section (FAQ is on `/faq`).
- Plan facts and labels reuse `home:pricing.*` keys; do not duplicate them in `pricing.json`. Amounts come from `pricing-catalog.js` and `home-pricing.js`; `npm run check:home` verifies them and scans Pricing sources for amount literals. Storage extension prices never exist. Extensions never show an annual price.
- The catalog still holds `standard-pack` and `industry-plus` as options; the page does not show them (base sector configuration is included; Industry+ is coming soon). Update the catalog in the pricing update.

## Features Page Guidelines (October 2026)

- The Features page (October 2026) has: header, Modules (reused Home component, 14 modules in three families), the existing capability areas with availability badges, Security and data isolation (reused Home component), Sector configurations and Industry+ packs (coming soon, no price unless prices are public) and a closing band with Request a Demo and Sign Up. There are no separate Modules or Sectors pages and no FAQ section.
- `ModulesSection` and `SecuritySection` live in `src/sections/home/` and accept a `tone` prop; their copy is in `home.json`. Do not duplicate their text on other pages.
- Open items for Debass (marked `TODO(Debass)`): per-module descriptions (the document has none, so modules are shown as names grouped by family next to the existing capability areas), pack pages, SSO and audit-log confirmation, French review.

## Industries Page Guidelines (October 2026)

- The Industries page (October 2026) shows the eight industries as cards; clicking one opens its detail inline under its grid row (one at a time, hash `#<slug>`, focus moves to the detail). There are NO per-industry pages: `/industries/<slug>` redirects to `/industries#<slug>`. The page then has "Sector configurations and Industry+ Packs" (reused `FeaturesSectors`), "Why NELIAS" (reused `WhySection`) and a closing band with Request a Demo and Sign Up. No FAQ, no configuration button.
- To change an industry's content, edit `industries.json`, `home-content.js` (`industryProfiles`) and the other existing industry data; the inline detail reads them. Links to an industry use `/industries#<slug>`.
- Open items for Debass (marked `TODO(Debass)`): per-industry copy beyond the existing summaries and headlines; pack pages; redirect confirmation; French review.

## Auth Pages & Auth Kit Guidelines

- Auth pages (`/sign-in`, and `/sign-up` after the next step) are behind `features.authPages` (`VITE_FEATURE_AUTH_PAGES`, default false): when off, both routes redirect to `site.signUpUrl` (`https://login.nelias.app/`). Sign Up buttons elsewhere stay plain external links (`SignUpLink`); to point them to the internal page, change `site.signUpUrl` only after enabling the flag.
- All submission goes through `src/lib/auth/auth-client.js` (`VITE_AUTH_API_URL`, assumed JSON contract, marked `TODO(Debass)`); passwords are never stored, logged, put in URLs or sent to analytics; analytics receive only a result code. Validation logic is pure and tested in `npm run check:auth` (part of `verify`).
- Redirects after sign-in are followed only when `isSafeRedirect` accepts them (https, `nelias.app` or a subdomain).
- Open items for Debass (marked `TODO(Debass)`): backend contract and address, password reset, captcha and server-side rate limiting, French review.

## Sign Up Page Guidelines

- `/sign-up` follows the same rules as `/sign-in`: behind `features.authPages`, redirect to `site.signUpUrl` when off, adapter-only submission, no password or personal data in storage, URLs, logs or analytics.
- Sign-up fields and rules: full name, work email, company, country (from the country list), optional phone (international format), password (10 to 128 characters, upper and lower case, a digit, not containing the email local part, no common fragments), confirmation, terms checkbox (unticked by default; links to the Terms of Use and the Privacy Policy), hidden honeypot. All rules live in `validators.js` and are tested by `npm run check:auth`.
- The submitted payload carries the legal versions (`LEGAL_VERSIONS`); keep them in sync with the published legal documents.
- Open items for Debass (marked `TODO(Debass)`): backend contract and address, post-sign-up journey, account-enumeration policy, captcha and server rate limiting, marketing consent, whether free-mail addresses are accepted, French review.
