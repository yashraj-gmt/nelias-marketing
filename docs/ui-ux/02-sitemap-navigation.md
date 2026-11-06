# NELIAS Marketing Portal - UI/UX Specification: Sitemap & Navigation

## 1. Complete Sitemap

All routes declared in [`src/app/router.jsx`](file:///d:/Projects/NELIAS/nelias-marketing/src/app/router.jsx) are lazy-loaded for route-level code splitting:

| Route Path          | Page Component         | Purpose                                                                      | Feature Gating                                   |
| ------------------- | ---------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| `/`                 | `HomePage`             | Core marketing landing, platform vision, 3 pillars, sector selector, closing | None                                             |
| `/why-nelias`       | Redirect to `/`        | Removed page (redirected)                                                    | None                                             |
| `/how-it-works`     | Redirect to `/`        | Removed page (redirected)                                                    | None                                             |
| `/industries`       | `IndustriesPage`       | 12 industry sectors hub with search and category filtering                   | None                                             |
| `/industries/:slug` | `IndustryDetailPage`   | Sector-specific deep dive, capabilities, walkthrough, and FAQ                | None                                             |
| `/features`         | `FeaturesPage`         | 12 standard platform capability areas with industry filtering                | None                                             |
| `/pricing`          | `PricingPage`          | Plan tiers, comparison table, and optional charges                           | `features.pricingPublic` gates amounts           |
| `/about`            | `AboutPage`            | Debass Technologies company profile, mission, leadership signature           | None                                             |
| `/about-us`         | `AboutPage`            | Legacy URL alias redirecting to `/about`                                     | None                                             |
| `/faq`              | `FaqPage`              | Centralized frequently asked questions by topic                              | `features.pricingPublic` gates pricing questions |
| `/contact`          | `ContactPage`          | General inquiry lead form with direct communication channels                 | None                                             |
| `/demo`             | `DemoPage`             | Product demonstration request form with advisor scheduling                   | None                                             |
| `/sign-in`          | `SignInPage`           | Sign-in page (or external redirect when features.authPages is false)          | `features.authPages`                             |
| `/sign-up`          | `SignUpPage`           | Registration page (or external redirect when features.authPages is false)      | `features.authPages`                             |
| `/terms`            | `TermsPage`            | General Terms of Use (official verbatim text)                                | None                                             |
| `/terms-of-sale`    | Redirect to `/terms`   | Removed page (redirected)                                                    | None                                             |
| `/cgv`              | Redirect to `/terms`   | Francophone alias for Terms of Sale / CGV (redirected)                       | None                                             |
| `/dpa`              | `DpaPage`              | Data Processing Agreement (official verbatim text)                           | None                                             |
| `/privacy`          | `PrivacyPage`          | Privacy Policy & Data Protection (official verbatim text)                    | None                                             |
| `/sla`              | `SlaPage`              | Service Level Agreement (official verbatim text)                             | None                                             |
| `/resources`        | Redirect to `/`        | Removed page (redirected)                                                    | None                                             |
| `/configure`        | Redirect to `/pricing` | Removed page (redirected)                                                    | None                                             |
| `*`                 | `NotFoundPage`         | 404 error page with navigation escape routes (Home and Demo CTA)             | None                                             |

_Note: Dev-only routes `/__design` and `/__ui` exist exclusively in development environments._

---

## 2. Global Navigation Architecture

### 2.1 Utility Bar (`src/components/layout/UtilityBar.jsx`)

- **Placement:** Topmost strip above main header. Fixed deep navy tone (`bg-navy-950`).
- **Contents:**
  - Phone contact link: `tel:+2250700000000`
  - Email contact link: `mailto:contact@nelias.app`
  - Language Switcher dropdown (desktop view)
  - Theme Toggle icon button (desktop view)
  - Direct "Sign In" link to the platform application (`site.loginUrl`)

### 2.2 Sticky Main Header (`src/components/layout/Header.jsx`)

- **Placement:** Sticky at the top (`sticky top-0 z-40`).
- **Dimensions:** Height `64px` (`h-16`) on mobile, `72px` (`md:h-[4.5rem]`) on desktop.
- **Scroll Behavior:** Adds border `border-line` and shadow `shadow-card` when scrolled past `8px`.
- **Anchor Offset:** `scroll-padding-top: 5.5rem` on `<html>` ensures anchor jumps do not hide beneath the sticky header.
- **Left:** Official NELIAS logo with responsive dimensions.
- **Center:** Desktop navigation links (`DesktopNav`).
  - Active State Rule: `end={to === "/"}` ensures `/industries` remains active when viewing any `/industries/:slug` nested sub-page. Active link renders a bottom accent bar (`after:bg-accent after:h-0.5`).
- **Right Cluster:**
  - Theme toggle (visible below `xl`).
  - Header CTA: Primary action ("Request a Demo").
  - Mobile hamburger menu button (visible below `xl`).

### 2.3 Mobile Navigation Drawer (`src/components/layout/MobileMenu.jsx`)

- **Pattern:** Native HTML `<dialog>` with focus trap, backdrop dismissal, and `Escape` key handler.
- **Navigation Items:** Full-width 56px rows with clear active indicators (`border-l-[3px] border-l-accent`).
- **Footer:** Language switcher, theme toggle, and full-width CTA buttons.

### 2.4 Sticky Mobile CTA (`src/components/layout/StickyMobileCta.jsx`)

- **Placement:** Fixed bottom bar for viewport widths `< 768px`.
- **Visibility:** Automatically hidden on pages with primary forms (`/contact`, `/demo`) to prevent UI occlusion.
- **Content:** Single primary button executing the main action (`CtaLink`).

### 2.5 Site Footer (`src/components/layout/Footer.jsx`)

- **Tone:** Authoritative deep background (`bg-brand-deep`).
- **Columns:**
  1. Brand presentation with logo plate, tagline, and registered address.
  2. Platform navigation links (`mainNav`).
  3. Industry sector shortcuts.
  4. Legal & Regulatory links (`legalNav`: Privacy, Terms, DPA, SLA).

---

## 3. Deep Links & URL Query Parameters Contract

The portal supports several standardized query parameters across routes:

| Parameter  | Allowed Values                  | Target Routes        | Behavior Description                                                                                           |
| ---------- | ------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| `lang`     | `en`, `fr`                      | All routes           | Forces the active interface language and persists preference to `localStorage`.                                |
| `theme`    | `light`, `dark`                 | All routes           | Forces the color theme (`data-theme`) and persists to `localStorage`.                                          |
| `industry` | Valid slug from `industries.js` | `/features`, `/demo` | Pre-selects sector filter on Features, or sector dropdown in Demo form. Invalid values are silently discarded. |
| `needs`    | Comma-separated module IDs      | `/demo`, `/contact`  | Pre-checks corresponding capability checkboxes in the lead form.                                               |

---

## 4. Breadcrumb Navigation

- Implemented on deep routes (`IndustryBreadcrumbs.jsx` on `/industries/:slug`).
- Structured hierarchy: `Home > Industries > [Sector Name]`.
- Implements semantic HTML `<nav aria-label="Breadcrumb">` and `<ol>` markup with `aria-current="page"` on the current node.
