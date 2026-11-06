# NELIAS Marketing Portal - UI/UX Specification: Design System

## 1. Design Tokens

The single source of truth for all styling tokens is [`src/styles/index.css`](file:///d:/Projects/NELIAS/nelias-marketing/src/styles/index.css). Tailwind CSS v4 CSS-first configuration is utilized without intermediate configuration files.

### 1.1 Color Palette & Semantic Roles

#### Static Brand Palette

- **Navy (Authority & Structure):**
  - Navy 950: `#001A33`
  - Navy 900: `#002B52` (Primary authority base)
  - Navy 800: `#0B3A66`
  - Navy 700: `#0A4C85`
- **Azure (Information & Interactive Accents):**
  - Azure 50: `#F0F7FD`
  - Azure 100: `#DDEEFA`
  - Azure 200: `#BFE0F7`
  - Azure 300: `#8CC8F0`
  - Azure 400: `#4DAAE6`
  - Azure 500: `#0A78C8` (Core link / accent)
  - Azure 600: `#0A5FA8`
  - Azure 700: `#084C8A`
- **Flame (Action & Primary CTA):**
  - Flame 50: `#FFF4EA`
  - Flame 100: `#FFE5CC`
  - Flame 300: `#FFB26B`
  - Flame 400: `#FF920B` (Hover)
  - Flame 500: `#FA6F00` (Core primary CTA)
  - Flame 600: `#D95B00`
  - Flame 700: `#B04700`
- **Sun (Ribbon Gradient Highlight):**
  - Sun 200: `#FFE58A`
  - Sun 300: `#FFD543`
  - Sun 400: `#FAAB20`
- **Ink (Balanced Cool Neutrals):**
  - Ink 50: `#F6F9FC` | Ink 100: `#EAF0F6` | Ink 200: `#D8E1EB` | Ink 300: `#B9C6D4`
  - Ink 400: `#8A9AAD` | Ink 500: `#5E6F84` | Ink 600: `#475569` | Ink 700: `#33415A`
  - Ink 800: `#1E2B3E` | Ink 900: `#0E1B2C`

#### Dual-Theme Semantic Roles Table

| Role Variable       | Light Theme Value     | Dark Theme Value | Usage Purpose                              |
| ------------------- | --------------------- | ---------------- | ------------------------------------------ |
| `--surface`         | `#FFFFFF`             | `#04172B`        | Default page background                    |
| `--surface-raised`  | `#FFFFFF`             | `#08213D`        | Elevated cards, panels, inputs, modals     |
| `--surface-muted`   | `#F6F9FC` (ink-50)    | `#0B2A4C`        | Quiet section backgrounds, subtle wells    |
| `--surface-tint`    | `#F0F7FD` (azure-50)  | `#0E345E`        | Highlighted cards, interactive table rows  |
| `--surface-sunken`  | `#EAF0F6` (ink-100)   | `#031222`        | Stepper backgrounds, sunken controls       |
| `--heading`         | `#002B52` (navy-900)  | `#F0F7FD`        | Main headings (`h1` through `h4`)          |
| `--fg`              | `#1E2B3E` (ink-800)   | `#D8E1EB`        | Body text, standard typography             |
| `--fg-strong`       | `#33415A` (ink-700)   | `#EAF0F6`        | Emphasized text, high contrast copy        |
| `--fg-muted`        | `#475569` (ink-600)   | `#8CC8F0`        | Subtitles, meta captions, field helpers    |
| `--fg-subtle`       | `#5E6F84` (ink-500)   | `#4DAAE6`        | Disclaimers, trailing units, disabled copy |
| `--line`            | `#D8E1EB` (ink-200)   | `#173C66`        | Hairlines, card borders, tab rails         |
| `--line-strong`     | `#B9C6D4` (ink-300)   | `#234D7E`        | Interactive element borders on hover       |
| `--field`           | `#5E6F84` (ink-500)   | `#4DAAE6`        | Default borders on form inputs             |
| `--link`            | `#0A5FA8` (azure-600) | `#4DAAE6`        | Standard hyperlink text                    |
| `--accent`          | `#0A78C8` (azure-500) | `#38B6FF`        | Focus markers, active indicator rules      |
| `--accent-soft`     | `#DDEEFA` (azure-100) | `#124278`        | Soft accent badges, info pills             |
| `--accent-line`     | `#BFE0F7` (azure-200) | `#1D4F8A`        | Tinted borders, active tab borders         |
| `--focus`           | `#0A78C8`             | `#38B6FF`        | Focus visible outline (`outline-3`)        |
| `--selected`        | `#002B52` (navy-900)  | `#1D6CB0`        | Selected toggle pill, active radio fill    |
| `--selected-fg`     | `#FFFFFF`             | `#FFFFFF`        | Text color on selected tokens              |
| `--secondary`       | `#002B52`             | `#124278`        | Secondary button background                |
| `--secondary-hover` | `#0B3A66`             | `#175394`        | Secondary button hover state               |
| `--secondary-fg`    | `#FFFFFF`             | `#F0F7FD`        | Secondary button text                      |
| `--cta`             | `#FA6F00`             | `#FA6F00`        | Fixed primary action orange                |
| `--cta-hover`       | `#FF920B`             | `#FF920B`        | Primary action orange hover                |
| `--cta-fg`          | `#001A33`             | `#001A33`        | Deep navy text on orange action            |

---

### 1.2 Typography Scale

Font Family: **Outfit Variable**, `system-ui`, `sans-serif`.

- `text-display`: `clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem)` / line-height `1.05` / tracking `-0.025em`
- `text-h1`: `clamp(2.125rem, 1.5rem + 2.6vw, 3.25rem)` / line-height `1.15` / tracking `-0.02em`
- `text-h2`: `clamp(1.75rem, 1.35rem + 1.6vw, 2.375rem)` / line-height `1.2` / tracking `-0.015em`
- `text-h3`: `clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)` / line-height `1.3` / tracking `-0.01em`
- `text-h4`: `1.25rem` (`20px`) / line-height `1.35` / tracking `-0.005em`
- `text-lead`: `clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)` / line-height `1.6`
- `text-body`: `1.0625rem` (`17px`) / line-height `1.6`
- `text-sm`: `0.9375rem` (`15px`) / line-height `1.5`
- `text-caption`: `0.8125rem` (`13px`) / line-height `1.4`

Line Length Constraint: Max `65ch` - `70ch` for continuous prose to maintain high readability.

---

### 1.3 Spacing, Section Rhythm & Breakpoints

- **Breakpoints:**
  - `sm`: `640px` (Tablets / large mobile)
  - `md`: `768px` (Portrait tablets, nav break)
  - `lg`: `1024px` (Small laptops, desktop layouts)
  - `xl`: `1280px` (Main desktop nav breakpoint)
  - `2xl`: `1536px` (Wide desktop)
- **Section Vertical Padding Rhythm:**
  - `spacing="sm"`: `py-8 md:py-12`
  - `spacing="md"`: `py-12 md:py-16 lg:py-20`
  - `spacing="lg"`: `py-16 md:py-24 lg:py-32`
- **Section Tone Alternation:**
  - Standard rhythm alternates between `default` (`bg-surface`) and `tint` (`bg-surface-tint`) or `muted` (`bg-surface-muted`). Deep bands (`bg-brand-deep`) are used exclusively for hero footers, conversion strips, and site footers.

---

### 1.4 Radius, Elevation & Shadows

- **Corner Radii Hierarchy:**
  - `rounded-sm` (`4px`): Micro-chips, status indicators
  - `rounded-md` (`8px`): Buttons, form inputs, segmented control segments
  - `rounded-lg` (`12px`): Sub-panels, list cards, nested callouts
  - `rounded-xl` (`16px`): Primary cards, pricing plan tiers, feature mosaic containers
  - `rounded-2xl` (`24px`): Hero cards, large dialog modals
  - `rounded-full` (`9999px`): Pill tabs, circular icon badges
- **Elevation:**
  - `--shadow-card`: Subtle ambient drop shadow for cards and tiles
  - `--shadow-raised`: Prominent shadow for elevated dropdowns, dialog modals, and sticky bars

---

### 1.5 Motion & Reduced-Motion Rules

- **Scroll Reveal:** One-time lightweight scroll reveals via `<Reveal>` (max `12px` translation with opacity fade). No looping animations or ambient floating objects.
- **Interactions:** Subtle micro-interactions on hover/focus (`transition-colors duration-150` or `transition-transform duration-200`).
- **Reduced Motion:** Fully enforced via `@media (prefers-reduced-motion: reduce)` in CSS and `usePrefersReducedMotion()`. All animations and transitions resolve instantaneously (`0.01ms`).

---

## 2. Component Library Specification

### 2.1 Core UI Primitives (`src/components/ui/`)

1. **`Accordion.jsx`**
   - _Purpose:_ Collapsible content disclosure for FAQs and deep capability descriptions.
   - _Variants:_ Multi-expandable or single-item open mode.
   - _Accessibility:_ `aria-expanded`, `aria-controls`, full keyboard navigation (Enter/Space to toggle, arrows).
2. **`Alert.jsx`**
   - _Purpose:_ Contextual callouts for notices, over-quota states, and disclaimers.
   - _Variants:_ `tone="info" | "warning" | "note" | "danger"`.
   - _Accessibility:_ Includes `role="alert"` or `role="region"` with live announcements (`polite`).
3. **`AvailabilityBadge.jsx`**
   - _Purpose:_ Standard indicator for module commercial availability.
   - _Variants:_ `available`, `demo-only`, `coming-later`.
4. **`Badge.jsx`**
   - _Purpose:_ Compact status and category tags.
   - _Variants:_ `tone="neutral" | "info" | "highlight" | "success" | "warning"`.
5. **`Button.jsx`**
   - _Purpose:_ Standalone interactive button with consistent role styling.
   - _Variants:_ Uses `buttonStyles`: `variant="primary" | "secondary" | "outline" | "ghost" | "onDark"`, `size="sm" | "md" | "lg"`.
   - _Accessibility:_ Touch targets strictly `>= 44px`.
6. **`Card.jsx`**
   - _Purpose:_ Structured boundary container for features, plans, and scenarios.
   - _Variants:_ `tone="default" | "tint" | "raised" | "sunken"`.
7. **`CardLink.jsx`**
   - _Purpose:_ Entire card surface as an accessible hyperlink.
   - _Accessibility:_ Uses absolute stretch overlay anchor pattern to prevent nested interactive controls.
8. **`Container.jsx`**
   - _Purpose:_ Centered page wrapper with responsive horizontal gutters (`px-4 sm:px-6 lg:px-8`, max `1280px`).
9. **`IconBadge.jsx`**
   - _Purpose:_ Circular or rounded icon backdrop.
   - _Variants:_ Matches sector and capability color accents.
10. **`Modal.jsx`**
    - _Purpose:_ Accessible overlay dialog for share drawers and detail inspections.
    - _Accessibility:_ Focus trap, Esc key dismiss, `aria-modal="true"`, background scroll locking.
11. **`Panel.jsx`**
    - _Purpose:_ Large feature area background with optional ruled header.
12. **`ResponsiveTable.jsx`**
    - _Purpose:_ Matrix comparison for plan specifications and legal annexes.
    - _Accessibility:_ Keyboard scrollable container, sticky row headers, clear column headers.
13. **`Reveal.jsx`**
    - _Purpose:_ Single-run scroll reveal controller.
14. **`RuledList.jsx`**
    - _Purpose:_ Minimal comparison list separated by subtle line dividers without heavy card wrapping.
15. **`Section.jsx`**
    - _Purpose:_ Page landmark section container supporting alternating tones and spacing.
16. **`SectionHeading.jsx`**
    - _Purpose:_ Standardized section title, eyebrow, and lead text cluster.
17. **`SegmentedControl.jsx`**
    - _Purpose:_ Horizontal exclusive selector (e.g. Monthly / Annual toggle).
    - _Accessibility:_ ARIA radio group pattern with arrow key switching.
18. **`Spinner.jsx`**
    - _Purpose:_ Accessible loading spinner for async operations.
19. **`Tabs.jsx`**
    - _Purpose:_ Accessible tab navigation for sector filtering and multi-panel displays.
    - _Variants:_ `variant="pill" | "line"`.
    - _Accessibility:_ Full WAI-ARIA tabs pattern (`tablist`, `tab`, `tabpanel`).
20. **`TextLink.jsx`**
    - _Purpose:_ In-line hyperlink with subtle underline transition and external link icon support.
21. **`Toggletip.jsx`**
    - _Purpose:_ Accessible user-triggered information bubble for technical definitions.
    - _Accessibility:_ Click/keyboard triggered, Esc dismiss, accessible screen-reader announcement.
22. **`button-styles.js`**
    - _Purpose:_ Central class builder for consistent button styling across links, buttons, and CTAs.

---

### 2.2 Form Controls (`src/components/ui/forms/`)

1. **`Checkbox.jsx`**: Custom styled accessible checkbox with clear check indicator and focus ring.
2. **`ChoiceCard.jsx`**: Selectable card wrapping radio or checkbox inputs for configurator options.
3. **`Field.jsx`**: Wrapper associating label, control, helper text, and validation error messages with unique generated IDs.
4. **`Fieldset.jsx`**: Semantic grouping for related inputs (`<fieldset>` and `<legend>`).
5. **`Input.jsx`**: Text and email input element styled with `--field` borders and 16px minimum font size.
6. **`NumberStepper.jsx`**: Stepper widget with increment/decrement buttons and accessible direct input.
7. **`PasswordField.jsx`**: Password input with integrated show/hide visibility toggle and accessible states.
8. **`Select.jsx`**: Native `<select>` element styled with custom arrow chevron.
9. **`Textarea.jsx`**: Multi-line text field with vertical resize and character count support.
10. **`field-styles.js`**: Shared focus, disabled, and error styling classes for form inputs.

---

### 2.3 Composite Patterns (`src/components/patterns/`)

1. **`PageHeader.jsx`**: Standard page hero pattern holding breadcrumbs, single `h1`, lead paragraph, and right-side emblem or visual mosaic.
2. **`CtaBand.jsx`**: Closing call-to-action strip for pages with single primary action and reassurance badge.
3. **`ProcessSteps.jsx`**: Numbered sequence display for linear guides (e.g. How It Works).
4. **`PreviewFrame.jsx`**: Device mock frame for product screenshots with mandatory "Illustrative preview" badge.
5. **`StepProgress.jsx`**: Linear wizard step indicator with completed, active, and upcoming step states for the Configurator.
6. **`DataTable.jsx`**: Shared accessible data table with keyboard focusable scroll container, row headers, and column highlights.

---

## 3. Illustration & Visual Media Rules

- **Shape & Role Colors Only:** All illustrations (`WhyIllustration`, `StepVisual`, `FoundationIllustration`, `CapabilityMosaic`, `VisionRipple`) use SVG shapes and semantic CSS role variables (`var(--surface-raised)`, `var(--line)`, `var(--accent)`, `var(--selected)`).
- **No Invented Copy or Metrics:** Mocks and illustrations contain zero text, fake numbers, or charts.
- **Preview Labeling:** Any product simulation must carry the approved disclaimer badge: _"Illustrative preview" / "Aperçu illustratif"_.

---

## 4. French Layout & Typographic Rules

- **Formal "Vous":** All communication addresses the user with the formal register.
- **Typographic Apostrophe:** Real typographical apostrophes (`’`, `\u2019`) are used throughout, avoiding typewriter apostrophes (`'`).
- **Non-Breaking Spaces:** High-punctuation marks (`:`, `;`, `?`, `!`) must be preceded by a non-breaking space (`\u00A0`).
- **Text Length Expansion:** French copy typically expands in volume by 15–25% compared to English. All button widths, navigation bars, and grid columns must permit fluid wrapping without clipping.
