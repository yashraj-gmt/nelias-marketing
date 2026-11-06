import { LegalPage } from "@/sections/legal/LegalPage.jsx";

// TODO(Debass): the official French text of version 2.0 has not been supplied. The French page still shows the previous version (1.1) while the English notice says the French version prevails. Do not publish this English version until the French text is supplied or Debass decides otherwise.
// TODO(Debass): the SEO title and description are derived from the document header; no approved SEO text exists for legal pages.
// TODO(Debass): this document refers to the Terms of Sale and Subscription (articles 11, 14, 15, 18) and the SLA. The Terms of Sale and Subscription page was removed from the website (the text is kept in cgv.json, not rendered); decide where it is published or whether the references change. Cross-references appear as plain text.
// TODO(Debass): articles 6 and 7 and annex C name Hodi (Grand-Bassam, Johannesburg) and CRMPUNCH as sub-processors and describe the hosting as Tier III. Keep them consistent with the SLA (article 4), the Terms of Use (article 13), the Privacy Policy (articles 6 and 7), the Home page and the FAQ answer on hosting.
// TODO(Debass): the DPA mentions the SOVEREIGN offer and a data-location commitment only in special conditions; the Home, Pricing and FAQ pages spell it "Sovereign". Confirm the naming.
// TODO(Debass): annex D and the signature table are shown as published; confirm how the website uses them (acceptance is electronic under article 14).

/**
 * Data Processing Agreement (DPA) legal document page.
 *
 * @returns {import("react").JSX.Element}
 */
export default function DpaPage() {
  return <LegalPage ns="dpa" />;
}
