import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

/**
 * Device framing wrapper for screenshots and product previews.
 *
 * @param {Object} props
 * @param {"desktop"|"mobile"} [props.device="desktop"]
 * @param {boolean} [props.illustrative=true]
 * @param {string} [props.caption]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function PreviewFrame({
  device = "desktop",
  illustrative = true,
  caption,
  className,
  children,
}) {
  const { t } = useTranslation();

  if (device === "mobile") {
    return (
      <figure className={cn("inline-flex flex-col items-center", className)}>
        <div className="relative aspect-[9/19] w-[min(100%,17.5rem)] overflow-hidden rounded-[2rem] border-[6px] border-heading bg-surface-raised shadow-raised">
          {/* Subtle mobile sensor notch */}
          <div
            className="pointer-events-none absolute top-2 left-1/2 z-20 h-1 w-12 -translate-x-1/2 rounded-full bg-heading/30"
            role="presentation"
          />

          <div className="relative h-full w-full overflow-hidden">
            {children}

            {illustrative && (
              <div className="pointer-events-none absolute bottom-3 left-3 z-10">
                <Badge tone="neutral" size="sm">
                  {t("ui.illustrativePreview")}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {caption && (
          <figcaption className="mt-3 text-center text-xs text-fg-muted">{caption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={cn("flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface-raised shadow-raised">
        {/* Browser window chrome dots */}
        <div
          className="flex items-center gap-1.5 border-b border-line bg-surface-muted px-4 py-3"
          role="presentation"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong/80" />
        </div>

        <div className="relative overflow-hidden">
          {children}

          {illustrative && (
            <div className="pointer-events-none absolute bottom-3 left-3 z-10">
              <Badge tone="neutral" size="sm">
                {t("ui.illustrativePreview")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-left text-xs text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  );
}
