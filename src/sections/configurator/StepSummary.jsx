import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/forms/Field";
import { Input } from "@/components/ui/forms/Input";
import { buttonStyles } from "@/components/ui/button-styles";
import { EstimatePanel } from "./EstimatePanel";
import { encodeState } from "@/lib/configurator/model";
import { features } from "@/config/features";
import { track, EVENTS } from "@/lib/analytics";

// TODO(Debass): confirm that this legal sentence may be shown on the summary.
// TODO(Debass): the transaction path (workspace address, account, checkout, provisioning, activation) is not built; render a checkout control here only when features.checkout is true AND that journey exists.

/**
 * Step 5: Your summary (Summary).
 *
 * @param {Object} props
 * @param {Object} props.data - Configurator state
 * @param {boolean} props.shared - Whether viewing a shared configuration
 * @param {boolean} props.saved - Whether configuration was just saved
 * @param {Object} props.rec - Recommendation result
 * @param {string} props.effectivePlan - Current plan
 * @param {Object} props.plansById - Plans map
 * @param {Object} props.est - Estimate calculation result
 * @param {Object} props.catalog - Pricing catalog
 * @param {(step: string) => void} props.goTo - Step navigation callback
 * @param {() => void} props.save - Save draft callback
 * @param {(partial: Object) => void} props.patch - State patch callback
 */
export function StepSummary({
  data,
  shared,
  saved,
  rec,
  effectivePlan,
  plansById,
  est,
  catalog: _catalog,
  effectiveModules = [],
  info,
  goTo,
  save,
  patch,
}) {
  const { t } = useTranslation();

  const [shareStatus, setShareStatus] = useState(null); // "copied" | "failed"
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (import.meta.env.DEV && features.checkout) {
      console.warn("No checkout journey exists. Extension point in StepSummary.");
    }
  }, []);

  const industryName = useMemo(() => {
    if (!data.industry) return t("configurator:summary.none");
    if (data.industry === "other") return t("contact:form.other");
    return t(`industries:items.${data.industry}.name`);
  }, [data.industry, t]);

  const modulesNames = useMemo(() => {
    if (!effectiveModules || effectiveModules.length === 0) {
      return t("configurator:summary.none");
    }
    return effectiveModules.map((k) => t(`features:areas.${k}.name`)).join(", ");
  }, [effectiveModules, t]);

  const modulesLineText = useMemo(() => {
    if (!info) return "";
    const includedVal = info.unlimited ? t("pricing:plans.enterprise.modules") : info.included;
    return t("configurator:summary.modulesLine", {
      selected: info.selected,
      included: includedVal,
      extra: info.extra,
    });
  }, [info, t]);

  const countrySizeLabel = useMemo(() => {
    const parts = [];
    if (data.country) parts.push(data.country);
    if (data.companySize) parts.push(t(`contact:sizes.${data.companySize}`));
    return parts.length > 0 ? parts.join(", ") : t("configurator:summary.none");
  }, [data.country, data.companySize, t]);

  const optionsLabel = useMemo(() => {
    const list = [];
    (data.addOns || []).forEach((id) => list.push(t(`pricing:optional.items.${id}`)));
    (data.connectors || []).forEach((id) => list.push(t(`pricing:optional.items.${id}`)));
    return list.length > 0 ? list.join(", ") : t("configurator:summary.none");
  }, [data.addOns, data.connectors, t]);

  // Demo destination with query parameters
  const demoUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (data.industry && data.industry !== "other") {
      params.set("industry", data.industry);
    }
    if (effectiveModules && effectiveModules.length > 0) {
      params.set("needs", effectiveModules.join(","));
    }
    const query = params.toString();
    return query ? `/demo?${query}` : "/demo";
  }, [data.industry, effectiveModules]);

  const handleShare = async () => {
    track(EVENTS.CONFIGURATOR_SHARE);
    const url = `${window.location.origin}/configure?c=${encodeState(data)}`;
    setShareUrl(url);

    if (navigator.share) {
      try {
        await navigator.share({ url });
        setShareStatus("copied");
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus("copied");
        return;
      } catch {
        // Clipboard write failed
      }
    }

    setShareStatus("failed");
  };

  const groups = [
    {
      id: "industry",
      label: t("contact:form.industry"),
      targetStep: "profile",
      content: (
        <div>
          <p className="font-semibold text-fg">{industryName}</p>
          {data.activity && <p className="mt-0.5 text-sm text-fg-muted">{data.activity}</p>}
        </div>
      ),
    },
    {
      id: "profileExtra",
      label: `${t("contact:form.country")} & ${t("contact:form.companySize")}`,
      targetStep: "profile",
      content: <p className="font-semibold text-fg">{countrySizeLabel}</p>,
    },
    {
      id: "modules",
      label: t("configurator:panel.modules"),
      targetStep: "operations",
      content: (
        <div>
          <p className="font-semibold text-fg">{modulesNames}</p>
          {modulesLineText && <p className="mt-0.5 text-xs text-fg-muted">{modulesLineText}</p>}
        </div>
      ),
    },
    {
      id: "capacity",
      label: t("configurator:panel.capacity"),
      targetStep: "operations",
      content: (
        <p className="font-semibold text-fg">
          {data.users} {t("pricing:page.usersLabel").toLowerCase()} · {data.entities}{" "}
          {t("pricing:page.entitiesLabel").toLowerCase()}
        </p>
      ),
    },
    {
      id: "storage",
      label: t("configurator:panel.storage"),
      targetStep: "customize",
      content: (
        <p className="font-semibold text-fg">
          {data.storage === "more"
            ? t("configurator:customize.storageMore", { value: 50 })
            : t("pricing:page.storageValue", { value: data.storage })}
        </p>
      ),
    },
    {
      id: "plan",
      label: t("configurator:panel.plan"),
      targetStep: "customize",
      content: <p className="font-semibold text-fg">{t(`pricing:plans.${effectivePlan}.name`)}</p>,
    },
    {
      id: "options",
      label: t("configurator:panel.options"),
      targetStep: "customize",
      content: <p className="font-semibold text-fg">{optionsLabel}</p>,
    },
  ];

  return (
    <div>
      <h2 className="font-display text-h2 text-heading" tabIndex={-1}>
        {t("configurator:steps.summary")}
      </h2>

      {shared && (
        <div className="mt-6">
          <Alert tone="note">{t("configurator:summary.sharedNote")}</Alert>
        </div>
      )}

      {/* Configuration Review List */}
      <dl className="mt-8 divide-y divide-line rounded-lg border border-line bg-surface-raised">
        {groups.map((group) => (
          <div key={group.id} className="flex items-start justify-between gap-4 p-4 sm:p-5">
            <div>
              <dt className="text-xs font-semibold tracking-wider text-fg-subtle uppercase">
                {group.label}
              </dt>
              <dd className="mt-1">{group.content}</dd>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goTo(group.targetStep)}
              aria-label={`${t("configurator:summary.edit")} - ${group.label}`}
            >
              {t("configurator:summary.edit")}
            </Button>
          </div>
        ))}
      </dl>

      {/* Embedded Estimate */}
      <div className="mt-10">
        <EstimatePanel
          data={data}
          effectivePlan={effectivePlan}
          plansById={plansById}
          est={est}
          patch={patch}
        />
      </div>

      {/* Indicative Legal Note */}
      <div className="mt-8">
        <Alert tone="note">{t("configurator:summary.indicative")}</Alert>
      </div>

      {/* Share / Save announcements & fallbacks */}
      {saved && (
        <p role="status" className="mt-4 text-sm font-semibold text-success-strong">
          {t("configurator:summary.saved")}
        </p>
      )}

      {shareStatus === "copied" && (
        <p role="status" className="mt-4 text-sm font-semibold text-success-strong">
          {t("configurator:summary.shareCopied")}
        </p>
      )}

      {shareStatus === "failed" && (
        <div className="mt-4 space-y-2">
          <Alert tone="warning">{t("configurator:summary.shareFailed")}</Alert>
          <Field label={t("configurator:summary.shareLabel")}>
            <Input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
          </Field>
        </div>
      )}

      {/* Conversion Actions */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to={demoUrl} className={buttonStyles({ variant: "primary", size: "lg" })}>
          {t("cta.bookDemo")}
        </Link>

        {rec.needsReview && (
          <Link to="/contact" className={buttonStyles({ variant: "primary", size: "lg" })}>
            {t("cta.talkToExpert")}
          </Link>
        )}

        <Button variant="outline" size="lg" onClick={save}>
          {t("configurator:summary.save")}
        </Button>

        <Button variant="outline" size="lg" onClick={handleShare}>
          {t("configurator:summary.share")}
        </Button>
      </div>
    </div>
  );
}
