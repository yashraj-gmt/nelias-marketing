import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Hero / Page header pattern with responsive grid layout and optional accent ribbon.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.lead]
 * @param {import("react").ReactNode} [props.breadcrumbs]
 * @param {import("react").ReactNode} [props.actions]
 * @param {import("react").ReactNode} [props.media]
 * @param {"tint"|"default"|"inverse"} [props.tone="tint"]
 * @param {"sm"|"md"|"lg"} [props.spacing="lg"]
 * @param {boolean} [props.accent=false]
 * @param {string} [props.titleId]
 * @param {string} [props.className]
 */
export function PageHeader({
  title,
  lead,
  breadcrumbs,
  actions,
  media,
  tone = "tint",
  spacing = "lg",
  accent = false,
  titleId,
  className,
  titleClassName,
  leadClassName,
}) {
  const isInverse = tone === "inverse";

  return (
    <Section tone={tone} spacing={spacing} className={cn("overflow-hidden", className)}>
      <Container>
        <div
          className={cn(media ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : "max-w-3xl")}
        >
          {/* Text column */}
          <div className={cn(media && "lg:col-span-7")}>
            {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

            {accent && (
              <div className="mb-6 h-1 w-12 rounded-full bg-brand-ribbon" role="presentation" />
            )}

            <h1
              id={titleId}
              className={cn(
                "font-display text-h1 leading-tight font-bold tracking-tight text-heading",
                isInverse && "text-white",
                titleClassName,
              )}
            >
              {title}
            </h1>

            {lead && (
              <p
                className={cn(
                  "mt-6 text-lead leading-relaxed text-fg-muted",
                  isInverse && "text-fg-inverse-muted",
                  leadClassName,
                )}
              >
                {lead}
              </p>
            )}

            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </div>

          {/* Media column */}
          {media && (
            <div className="mt-8 flex justify-center lg:col-span-5 lg:mt-0 lg:justify-end">
              {media}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
