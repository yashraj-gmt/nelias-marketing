import { useTranslation } from "react-i18next";
import { Section, Container, SectionHeading } from "@/components/ui";

/**
 * Interactive Google Maps location section for Contact page.
 * Displays Debass Technologies / NELIAS location in Abidjan, Côte d'Ivoire.
 *
 * @returns {import("react").JSX.Element}
 */
export function ContactLocation() {
  const { t } = useTranslation();

  return (
    <Section tone="muted" spacing="md" className="py-12 md:py-16">
      <Container>
        <SectionHeading
          title={t("contact:map.title")}
          lead={t("contact:map.lead")}
          className="mb-8 max-w-2xl"
        />

        <div className="overflow-hidden rounded-xl border border-line bg-surface-raised shadow-xs">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d219477.61399100997!2d-4.144481114936321!3d5.348769971165939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959121%3A0x3fe70ddce19221a6!2sAbidjan%2C%20C%C3%B4te%20d'Ivoire!5e1!3m2!1sen!2sin!4v1792130626467!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={t("contact:map.title")}
            className="block w-full"
          />
        </div>
      </Container>
    </Section>
  );
}
