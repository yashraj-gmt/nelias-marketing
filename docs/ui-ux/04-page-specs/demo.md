# Page Specification: Demo Booking (`/demo`)

## 1. Purpose

Provides a structured path for prospects to schedule a customized platform demonstration with a NELIAS operational advisor. Accepts incoming pre-selections from the industry detail pages (`?industry=<slug>`) and configurator (`?needs=mod1,mod2`).

---

## 2. Page Structure & Components in Order

1. **`DemoHeader` (`src/sections/contact/DemoHeader.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Copy Source:_ `contact:demo.title`, `contact:demo.lead`.
2. **`LeadForm` (`src/sections/contact/LeadForm.jsx`)**
   - _Mode:_ `mode="demo"`.
   - _Submit Action:_ "Book a Demo" (`contact:form.submitDemo`).
   - _Pre-selection Integration:_
     - `?industry=<slug>`: Automatically sets sector dropdown.
     - `?needs=<ids>`: Pre-selects corresponding capability checkboxes in the "Needs" fieldset.

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Clean single-column layout, sticky mobile CTA bar is suppressed to avoid keyboard conflict.
- **Desktop (>= 1024px):** 2-column layout with reassurance panel alongside form fields.

---

## 4. Copy Source Files

- Primary: [`src/i18n/locales/en/contact.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/contact.json) and [`src/i18n/locales/fr/contact.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/contact.json).

---

## 5. Open Items (`TODO(Debass)`)

- Integration with external demo scheduling tools (if any).
- SLA confirmation for lead response time promises.
