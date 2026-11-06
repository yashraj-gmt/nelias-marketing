import { LegalPage } from "@/sections/legal/LegalPage.jsx";

// TODO(Debass): the official French text of version 5.0 has not been supplied. The French page still shows the previous version (1.1) while the English notice says the French version prevails. Do not publish this English version until the French text is supplied or Debass decides otherwise.
// TODO(Debass): the SEO title and description are derived from the document header; no approved SEO text exists for legal pages.
// TODO(Debass): this document refers to the DPA and, indirectly, the Terms of Sale. The Terms of Sale and Subscription page was removed from the website (the text is kept in cgv.json, not rendered); decide where it is published or whether the references change. Cross-references appear as plain text.
// TODO(Debass): articles 1 and 3 mention the configurator, but the configurator page no longer exists on the website. Decide whether the official text is amended in a later version or the configurator returns.
// TODO(Debass): article 11 says an optional, unticked marketing-consent box is offered separately. The Sign Up page currently has no such box. Add it or adjust the policy.
// TODO(Debass): article 12 refers to a choice panel for optional cookies and audience-measurement trackers where the law requires. Confirm the website has one (or uses no optional trackers).
// TODO(Debass): article 8 (retention periods) and article 7 (hosting) must match real practice and the DPA, SLA and Terms of Use.

/**
 * Privacy Policy legal document page.
 *
 * @returns {import("react").JSX.Element}
 */
export default function PrivacyPage() {
  return <LegalPage ns="privacy" />;
}
