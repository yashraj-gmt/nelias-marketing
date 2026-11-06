import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/button-styles";
import { CtaLink } from "@/components/common/CtaLink";
import { Seo } from "@/components/common/Seo";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <>
      <Seo pageKey="notFound" noIndex />
      <Section tone="tint" spacing="lg" className="py-16 text-center md:py-24">
        <Container className="flex max-w-xl flex-col items-center">
          <p className="text-sm font-bold tracking-wider text-accent uppercase">404</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-heading sm:text-4xl md:text-5xl">
            {t("notFound.title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            {t("notFound.message")}
          </p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "w-full text-center sm:w-auto",
              })}
            >
              {t("nav.home")}
            </Link>
            {/* TODO(Debass): temporary target after the restructure; the page is rewritten in a later step. */}
            <CtaLink
              intent="demo"
              variant="outline"
              size="lg"
              className="w-full text-center sm:w-auto"
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
