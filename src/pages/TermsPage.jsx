import { LegalPage } from "@/sections/legal/LegalPage.jsx";

// TODO(Debass): the official French text of version 5.0 has not been supplied. The French page still shows the previous version (1.1) while the English notice says the French version prevails. Do not publish this English version until the French text is supplied or Debass decides otherwise.
// TODO(Debass): the SEO title and description are derived from the document header; no approved SEO text exists for legal pages.
// TODO(Debass): this document refers to the Terms of Sale and Subscription (articles 1, 4, 9, 11, 12), the SLA and the DPA. The Terms of Sale and Subscription page was removed from the website (the text is kept in cgv.json, not rendered); decide where it is published or whether the references change. Cross-references appear as plain text.
// TODO(Debass): articles 1 and 4 refer to the configurator, but the configurator page no longer exists on the website. Decide whether the official text is amended in a later version or the configurator returns.
// TODO(Debass): article 14 says the Privacy Policy is accessible from the footer and from the forms. Make sure the footer link and the form links exist (the footer step and the Sign Up page).
// TODO(Debass): article 9 treats the Industry+ Packs as "coming soon" and not orderable; keep the Pricing, Features and Industries pages consistent with it.
// TODO(Debass): article 13 hosting statement (Hodi, Grand-Bassam, DRP in Johannesburg) must stay consistent with the SLA (article 4), the DPA (article 7), the Privacy Policy (article 7), the Home page and the FAQ answer on hosting.

/**
 * Terms of Use legal document page.
 *
 * @returns {import("react").JSX.Element}
 */
export default function TermsPage() {
  return <LegalPage ns="terms" />;
}
