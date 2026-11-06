import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CtaBand } from "@/components/patterns/CtaBand";
import { SignUpLink } from "@/components/common/SignUpLink";
import { Reveal } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/button-styles";
import { EVENTS, track } from "@/lib/analytics";

/**
 * Closing conversion band for Industries page.
 *
 * @returns {import("react").JSX.Element}
 */
export function IndustriesClosing() {
  const { t } = useTranslation();

  const actions = (
    <>
      <Link
        to="/demo"
        onClick={() => {
          track(EVENTS.CTA_CLICK, { intent: "demo", location: "industries-final" });
        }}
        className={buttonStyles({ variant: "primary", size: "lg" })}
      >
        {t("common:cta.bookDemo")}
      </Link>
      <SignUpLink variant="onDark" size="lg" location="industries-final">
        {t("common:cta.signUp")}
      </SignUpLink>
    </>
  );

  return (
    <Reveal>
      <CtaBand
        id="industries-final-cta"
        tone="inverse"
        title={t("home:final.title")}
        body={t("home:final.body")}
        actions={actions}
      />
    </Reveal>
  );
}
