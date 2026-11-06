# NELIAS Marketing Portal - UI/UX Specification: Overview

## 1. Purpose and Scope

This documentation formalizes the complete UI/UX design and interaction specifications for the **NELIAS** Business Management Platform (BMP) marketing website (`nelias.app`), developed by Debass Technologies.

- **Scope Statement:** Refine and formalize; no redesign. The visual identity, brand colors, typography, logo treatments, page concepts, and section structures are preserved in their entirety.
- **Objective:** Eliminate visual and interactive friction, ensure coherent navigation across all desktop and mobile viewports, guarantee rigorous accessibility (WCAG AA), enforce strict theming parity (light and dark), and ensure bidirectional consistency between English and French.

---

## 2. Brand Principles & Design Pillars

1. **Authority & Clarity (Navy - `#002B52`):**
   - Navy conveys enterprise authority, stability, and institutional trust across West Africa and international markets. Used for headlines, deep structural bands, and authoritative surfaces.
2. **Action & Purpose (Orange/Flame - `#FA6F00`):**
   - Orange is reserved strictly for primary user actions (main CTAs) and the brand ribbon. It is never used decoratively as random background fills or text body color. There is at most one primary orange action per viewport region.
3. **Information & Connectivity (Azure - `#0A78C8`):**
   - Azure governs interactive links, informative accents, focus rings, and soft tonal backgrounds (`bg-surface-tint`, `text-link`).
4. **The One Bold Device (Brand Ribbon):**
   - The orange-to-amber ribbon (`bg-brand-ribbon`: Flame 500 `#FA6F00` to Sun 300 `#FFD543`) represents the dynamic agility of African businesses. All other surfaces remain calm, structured, and legible.
5. **Role-Driven Aesthetics:**
   - Every interface element maps to semantic role tokens (`bg-surface`, `bg-surface-raised`, `text-heading`, `text-fg`, `border-line`, etc.). Raw palette classes (`bg-white`, `text-navy-900`) are banned in favor of dual-theme compatibility.

---

## 3. How to Read These Documents

- [`00-overview.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/00-overview.md): High-level scope, brand foundation, and copy governance.
- [`01-design-system.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/01-design-system.md): Tokens (colors, typography, spacing, radius, shadows, motion) and component library specifications for `@/components/ui` and `@/components/patterns`.
- [`02-sitemap-navigation.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/02-sitemap-navigation.md): Global sitemap, navigation layers (Header, Utility Bar, Mobile Drawer, Footer), deep links, and URL query parameter contracts.
- [`03-user-journeys.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/03-user-journeys.md): Core user flows (Discovery, Buying, Pricing Config, Features Filtering, Lead Ingestion) modeled as Mermaid state diagrams with feature-flag branches.
- [`04-page-specs/`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/04-page-specs/): Detailed specifications per route (layout, section hierarchy, component composition, responsive rules, copy sources, and open decisions).
- [`05-audit-report.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/05-audit-report.md): Findings from the comprehensive cross-route, cross-theme, and cross-breakpoint UX audit.
- [`06-open-decisions.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/06-open-decisions.md): Exhaustive log of client decision items (`TODO(Debass)`) and terminology alignments.
- [`screenshots/README.md`](file:///d:/Projects/NELIAS/nelias-marketing/docs/ui-ux/screenshots/README.md): Visual verification protocols, capture matrix, and asset naming standards.

---

## 4. Status of Copy: Approved vs. Draft

All user-facing copy is managed strictly through i18n JSON files (`src/i18n/locales/en/` and `src/i18n/locales/fr/`):

1. **Approved English Copy:**
   - Source: Debass Specifications PDF (Sections 1 through 9) and the official About document (`NELIAS_About_Us_For_Rahul_EN.docx`).
   - Verbatim Legal Copy: Official documents for Terms of Use (`terms.json`), Terms of Sale & Subscription / CGV (`cgv.json`), Data Processing Agreement (`dpa.json`), Privacy Policy (`privacy.json`), and Service Level Agreement (`sla.json`).
2. **Draft & Extrapolated Copy (`TODO(Debass)`):**
   - French translations are AI-drafted following formal "vous" and typographic rules pending native validation by Debass Technologies.
   - The four newest industry sectors (Real Estate, Pharmacies, Construction / BTP, IT & Technology Services) use vocabulary derived strictly from existing capability names.
   - Functional placeholders (e.g. hidden-price labels, capability badge states, scenario benefit text) are tagged for client sign-off.
