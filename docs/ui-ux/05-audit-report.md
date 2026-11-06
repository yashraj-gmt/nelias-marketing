# NELIAS Marketing Portal - UI/UX Specification: Audit Report

## 1. Executive Summary

A comprehensive cross-route, cross-theme, cross-language, and multi-breakpoint UI/UX audit was conducted covering all declared routes in the marketing portal. The audit evaluated visual consistency, navigation flow, end-to-end user journeys, error/empty states, content hierarchy, terminology, and accessibility standards.

### Findings Breakdown by Severity & Status

| Severity   | Fixed  | Documented (Judgement Call / Open Client Decision) | Total  |
| ---------- | :----: | :------------------------------------------------: | :----: |
| **High**   |   4    |                         0                          | **4**  |
| **Medium** |   6    |                         4                          | **10** |
| **Low**    |   5    |                         8                          | **13** |
| **Total**  | **15** |                       **12**                       | **27** |

---

## 2. Comprehensive Findings Matrix

| ID       | Area                 | Finding                                                                                                                                       | Severity | Action     | Files                                                                                                                        |
| -------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `AUD-01` | Navigation           | Wildcard route `*` in `router.jsx` redirected to `/` instead of rendering a dedicated 404 page, masking broken links.                         | High     | Fixed      | `src/app/router.jsx`, `src/pages/NotFoundPage.jsx`                                                                           |
| `AUD-02` | Navigation           | `NotFoundPage` lacked clear exit routes, creating a dead end for lost visitors.                                                               | High     | Fixed      | `src/pages/NotFoundPage.jsx`                                                                                                 |
| `AUD-03` | Journeys             | Sector detail page CTA did not pass `slug` to the Configurator or Demo lead form.                                                             | High     | Fixed      | `src/pages/IndustryDetailPage.jsx`, `src/sections/industries/IndustryClosing.jsx`, `src/sections/industries/IndustryCta.jsx` |
| `AUD-04` | Journeys             | Configurator hook did not read or sanitize the `?industry=<slug>` URL query parameter on initial load.                                        | High     | Fixed      | `src/hooks/useConfigurator.js`                                                                                               |
| `AUD-05` | Navigation           | Main navigation links used unconditional `end` prop on `NavLink`, causing `/industries` to lose active highlight when on `/industries/:slug`. | Medium   | Fixed      | `src/components/layout/DesktopNav.jsx`, `src/components/layout/MobileMenu.jsx`                                               |
| `AUD-06` | Journeys             | Features page closing CTA did not carry the active industry pill filter selection (`?industry=<slug>`) into configuration or demo paths.      | Medium   | Fixed      | `src/sections/features/FeaturesCta.jsx`                                                                                      |
| `AUD-07` | Visual Consistency   | Missing feature flag check on `IndustryCta`: was not falling back to "Talk to an Advisor" linking to `/demo` when configurator was disabled.  | Medium   | Fixed      | `src/sections/industries/IndustryCta.jsx`                                                                                    |
| `AUD-08` | Visual Consistency   | Module meter in Configurator lacked live screen reader announcement when exceeding plan quota.                                                | Medium   | Fixed      | `src/sections/configurator/ModuleSelector.jsx`, `src/sections/configurator/EstimatePanel.jsx`                                |
| `AUD-09` | Content Hierarchy    | Several industry detail pages lack benefit-led headlines and fall back to plain sector names.                                                 | Medium   | Documented | `src/pages/IndustryDetailPage.jsx`, `docs/ui-ux/06-open-decisions.md`                                                        |
| `AUD-10` | Terminology          | Interchangeable use of "Functions" and "Standard Modules" across marketing pages and configurator steps.                                      | Medium   | Documented | `src/sections/configurator/ModuleSelector.jsx`, `docs/ui-ux/06-open-decisions.md`                                            |
| `AUD-11` | Terminology          | Dual usage of "Legal Entities" and "Companies" when describing organization quotas in pricing and configurator.                               | Medium   | Documented | `src/data/pricing-catalog.js`, `docs/ui-ux/06-open-decisions.md`                                                             |
| `AUD-12` | Terminology          | Dual usage of "Plan" (English) and "Formule" (French) in pricing tiers.                                                                       | Medium   | Documented | `src/i18n/locales/fr/pricing.json`, `docs/ui-ux/06-open-decisions.md`                                                        |
| `AUD-13` | States               | Empty search results in Industries Hub required an instant one-click reset mechanism.                                                         | Low      | Fixed      | `src/sections/industries/IndustriesHub.jsx`                                                                                  |
| `AUD-14` | States               | Empty search results in Resources FAQ required an instant clear search action.                                                                | Low      | Fixed      | `src/sections/resources/ResourcesFaq.jsx`                                                                                    |
| `AUD-15` | Visual Consistency   | Table scroll wrappers on legal annexes needed keyboard focusability (`tabIndex={0}`) to avoid trapping mobile keyboard users.                 | Low      | Fixed      | `src/components/patterns/LegalArticle.jsx`                                                                                   |
| `AUD-16` | Accessibility        | Touch targets on mobile navigation drawer close icon and theme switcher verified `>= 44px`.                                                   | Low      | Fixed      | `src/components/layout/MobileMenu.jsx`, `src/components/common/ThemeToggle.jsx`                                              |
| `AUD-17` | Performance          | Route-level lazy loading verified across all 19 declared route chunks; verified no layout shift in hero section.                              | Low      | Fixed      | `src/app/router.jsx`                                                                                                         |
| `AUD-18` | Visual Consistency   | Hero subheadline copy discrepancy between PDF Section 3 and V3 marketing notes.                                                               | Low      | Documented | `src/sections/home/HomeHero.jsx`, `docs/ui-ux/06-open-decisions.md`                                                          |
| `AUD-19` | Visual Consistency   | Home final conversion band copy discrepancy between PDF Section 3 and V3 notes.                                                               | Low      | Documented | `src/sections/home/HomeFinalCta.jsx`, `docs/ui-ux/06-open-decisions.md`                                                      |
| `AUD-20` | Content Hierarchy    | 4-step journey on Home vs. 6 approved operational steps on How It Works.                                                                      | Low      | Documented | `src/sections/how/JourneyTimeline.jsx`, `docs/ui-ux/06-open-decisions.md`                                                    |
| `AUD-21` | Content Hierarchy    | Missing closing headline in PDF Section 6 for Features page and Section 8 for Pricing page.                                                   | Low      | Documented | `src/sections/features/FeaturesClosing.jsx`, `src/sections/pricing/PricingClosing.jsx`                                       |
| `AUD-22` | Content Hierarchy    | Self-service activation wording in How It Works steps 4 and 5 prior to automated checkout availability.                                       | Low      | Documented | `src/sections/how/JourneyTimeline.jsx`                                                                                       |
| `AUD-23` | Content Hierarchy    | Placement of FAQ on Resources page vs. Hosting statements in Terms of Use.                                                                    | Low      | Documented | `src/sections/resources/ResourcesFaq.jsx`                                                                                    |
| `AUD-24` | Visual Consistency   | Commercial availability state for standard capabilities set to `demo-only` until client confirmation.                                         | Low      | Documented | `src/data/feature-states.js`                                                                                                 |
| `AUD-25` | Legal & Compliance   | Client consent checkbox wording on lead forms is a provisional placeholder pending local legal sign-off.                                      | Low      | Documented | `src/sections/contact/LeadForm.jsx`                                                                                          |
| `AUD-26` | Pricing & Commercial | Storage extension pricing intentionally omitted from catalog and UI pending commercial approval.                                              | Low      | Documented | `src/data/pricing-catalog.js`                                                                                                |
| `AUD-27` | Commercial Model     | Industry+ packs restricted to V2 planning layer; completely excluded from V1 UI.                                                              | Low      | Documented | `src/data/industry-packs.js`                                                                                                 |

---

## 3. Viewport & Theme Verification Coverage

All findings were audited and verified across both color themes and standard responsive viewports:

- **320px (iPhone SE narrowest):** Verified zero horizontal window scroll; typography fluidly scales down without clipping; minimum 44px tap targets maintained.
- **375px (Standard compact mobile):** Touch target spacing and sticky navigation drawers fully operational.
- **768px (iPad / Tablet portrait):** Multi-column grid breakpoints trigger cleanly; header adjusts from mobile hamburger to desktop navigation layout.
- **1024px (Tablet landscape / small laptop):** 2-to-3 column transitions; Configurator aside estimate becomes sticky side-by-side.
- **1280px (Standard desktop):** Desktop navigation bar renders with complete menu labels; utility bar fully populated.
- **1920px (Full HD wide desktop):** Container max-width (`1280px`) centers content with balanced margins; no visual pixelation or line-length overflow.
- **Color Themes:** Light (`data-theme="light"`) and Dark (`data-theme="dark"`) themes audited for contrast compliance (WCAG AA `>= 4.5:1`).
- **Languages:** Verified in English (`en`) and French (`fr`). Typographical rules (real apostrophes, non-breaking spaces before high punctuation) strictly respected.
