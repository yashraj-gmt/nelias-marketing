import { LegalPage } from "@/sections/legal/LegalPage.jsx";

// TODO(Debass): the official French text of version 2.0 has not been supplied. The French page still shows the previous version (1.1) while the English notice says the French version prevails. Do not publish this English version until the French text is supplied or Debass decides otherwise.
// TODO(Debass): the SEO title and description are derived from the document header; no approved SEO text exists for legal pages.
// TODO(Debass): this document refers to the Terms of Sale and Subscription (articles 11, 15, 16), the ToU and the DPA. The Terms of Sale and Subscription page was removed from the website (the text is kept in cgv.json, not rendered); decide where it is published or whether the references change. Cross-references appear as plain text.
// TODO(Debass): article 4 states the hosting architecture as at the date of the SLA (Hodi, Grand-Bassam, DRP in Johannesburg, CRMPUNCH). Keep it consistent with the Terms of Use (article 13), the DPA (article 7 and annex C), the Privacy Policy (article 7), the Home page and the FAQ answer on hosting.
// TODO(Debass): article 3 lists the service levels by plan (START Standard, BUSINESS Standard+, PROFESSIONAL Priority, ENTERPRISE per quote). Keep it consistent with the service-level row of the Pricing page.
// TODO(Debass): articles 8 and annex A mention a support portal or form "where activated" and the channel contact@nelias.app. Confirm which channels really exist.
// TODO(Debass): annex C contains a signature block (handwritten or electronic signature) next to the portal acceptance. It is shown as published; confirm how it is used on the website.

/**
 * Service Level Agreement (SLA) legal document page.
 *
 * @returns {import("react").JSX.Element}
 */
export default function SlaPage() {
  return <LegalPage ns="sla" />;
}
