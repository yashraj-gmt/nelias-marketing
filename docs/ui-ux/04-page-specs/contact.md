# Page Specification: Contact (`/contact`)

## 1. Purpose

Enables prospective customers, partners, and enterprise clients to initiate direct communication with the Debass Technologies team. Provides transparent contact channels and an accessible inquiry form.

---

## 2. Page Structure & Components in Order

1. **`ContactHeader` (`src/sections/contact/ContactHeader.jsx`)**
   - _Components:_ `PageHeader`, `Seo`.
   - _Copy Source:_ `contact:hero.title`, `contact:hero.lead`.
2. **`ContactChannels` (`src/sections/contact/ContactChannels.jsx`)**
   - _Components:_ `Section` (tone="default"), `Container`, `Card`, `IconBadge`.
   - _Channels:_ Direct telephone (`tel:+2250700000000`), email (`mailto:contact@nelias.app`), physical headquarters (Abidjan, Côte d'Ivoire).
3. **`LeadForm` (`src/sections/contact/LeadForm.jsx`)**
   - _Components:_ `Field`, `Input`, `Select`, `Checkbox`, `Textarea`, `Button`, `FormFeedback`.
   - _Submit Action:_ "Request a Conversation" (`contact:form.submitContact`) plus secondary "Explore NELIAS" (`/how-it-works`).
   - _Privacy:_ Zero personal data sent to analytics or cached in client storage.

---

## 3. Responsive Behavior

- **Mobile (< 768px):** Single-column stacked fields with minimum 44px touch targets. Sticky mobile CTA bar is suppressed on this page.
- **Desktop (>= 1024px):** 2-column form grid with side-by-side contact channel cards.

---

## 4. Copy Source Files

- Primary: [`src/i18n/locales/en/contact.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/en/contact.json) and [`src/i18n/locales/fr/contact.json`](file:///d:/Projects/NELIAS/nelias-marketing/src/i18n/locales/fr/contact.json).

---

## 5. Open Items (`TODO(Debass)`)

- Official legal consent checkbox wording under Côte d'Ivoire data protection law.
- Backend lead endpoint configuration (`VITE_LEAD_ENDPOINT`).
