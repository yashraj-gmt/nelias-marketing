import { useTranslation } from "react-i18next";
import { Section, Container } from "@/components/ui";
import { LeadForm } from "./LeadForm.jsx";
import { ContactDetails } from "./ContactDetails.jsx";
import { DemoExpectations } from "./DemoExpectations.jsx";

/**
 * 2-column layout for Contact and Demo pages.
 * Contact page uses a concise form + direct contact details.
 * Demo page uses the comprehensive qualification form + demo expectations walkthrough.
 *
 * @param {object} props
 * @param {"contact"|"demo"} [props.type="contact"]
 */
export function ContactLayout({ type = "contact" }) {
  const { t } = useTranslation();
  const isContact = type === "contact";

  return (
    <Section tone="default" spacing="lg">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left column: Lead form in raised card */}
          <div className="lg:col-span-7">
            <h2 className="sr-only">{t(`contact:form.srTitle.${type}`)}</h2>
            <div className="rounded-xl border border-line bg-surface-raised p-6 md:p-8">
              <LeadForm type={type} short={isContact} />
            </div>
          </div>

          {/* Right column: Contact details on Contact page, Demo expectations on Demo page */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            {isContact ? <ContactDetails type="contact" /> : <DemoExpectations />}
          </div>
        </div>
      </Container>
    </Section>
  );
}
