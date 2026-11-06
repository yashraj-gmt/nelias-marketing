# Page Specification: Legal Pages (`/terms`, `/terms-of-sale`, `/cgv`, `/dpa`, `/privacy`, `/sla`)

## 1. Purpose

Publishes official, legally binding documentation governing the use of NELIAS and Debass Technologies services: Terms of Use, Terms of Sale and Subscription (CGV), Data Processing Agreement (DPA), Privacy Policy, and Service Level Agreement (SLA).

---

## 2. Page Structure & Components in Order

All legal routes utilize the shared `LegalPage` framework:

1. **`LegalPage` (`src/components/patterns/LegalPage.jsx`)**
   - _Components:_ `Container`, `Section` (tone="default"), `Seo`, `TextLink`, `ResponsiveTable`.
   - _Meta Cluster:_ Document title, version, last updated date, publisher, and official bilingual notice.
   - _Table of Contents:_ Sticky sidebar navigation on desktop for direct anchor jumping to articles.
   - _Articles:_ Sequentially numbered sections (`LegalArticle`) holding paragraphs, unordered lists, and multi-column tables.

---

## 3. Supported Legal Documents & Schemas

- **Terms of Use (`/terms`):** 15 articles (`terms.json`).
- **Terms of Sale & Subscription / CGV (`/terms-of-sale`, `/cgv`):** 19 articles (`cgv.json`).
- **Data Processing Agreement (`/dpa`):** 15 articles including Annexes 1 and 2 rendered as accessible tables (`dpa.json`).
- **Privacy Policy (`/privacy`):** 10 articles including 4-column sub-processor table (`privacy.json`).
- **Service Level Agreement (`/sla`):** 14 articles including 3-column uptime and maintenance tables (`sla.json`).

---

## 4. Strict Legal Content Rules

- Official verbatim text only. No AI translation, re-writing, or re-punctuation is permitted on legal documents.
- English legal pages display the official notice stating that the French version prevails.
- Multi-column tables inside articles are wrapped in keyboard-scrollable focusable containers to eliminate horizontal page scroll at 320px.

---

## 5. Copy Source Files

- `locales/*/terms.json`, `locales/*/cgv.json`, `locales/*/dpa.json`, `locales/*/privacy.json`, `locales/*/sla.json`.

---

## 6. Open Items (`TODO(Debass)`)

- Hosting statements alignment between Terms of Use Article 10 and marketing FAQ.
- Interactive cross-linking between newly published legal documents.
