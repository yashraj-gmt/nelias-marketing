import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CtaBand } from "@/components/patterns/CtaBand";
import { SignUpLink } from "@/components/common/SignUpLink";
import { Reveal } from "@/components/ui/Reveal";
import { buttonStyles } from "@/components/ui/button-styles";
import { EVENTS, track } from "@/lib/analytics";

// TODO(Debass): the document lists "Request a demo" and "Simulate my price"; the simulator no longer exists, so the second button is Sign Up.
export function HomeFinalCta() {
  const { t } = useTranslation();

  const actions = (
    <>
      <Link
        to="/demo"
        onClick={() => {
          track(EVENTS.CTA_CLICK, { intent: "demo", location: "home-final" });
        }}
        className={buttonStyles({ variant: "primary", size: "lg" })}
      >
        {t("common:cta.bookDemo")}
      </Link>
      <SignUpLink variant="onDark" size="lg" location="home-final">
        {t("common:cta.signUp")}
      </SignUpLink>
    </>
  );

  return (
    <Reveal>
      <CtaBand
        id="final-cta"
        tone="inverse"
        title={t("home:final.title")}
        body={t("home:final.body")}
        actions={actions}
      />
    </Reveal>
  );
}
