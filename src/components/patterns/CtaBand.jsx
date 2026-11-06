import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { HeaderCtas } from "@/components/layout/HeaderCtas";
import { cn } from "@/lib/cn";

/**
 * Full-width call-to-action band section on dark brand navy background.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.body
 * @param {import("react").ReactNode} [props.actions]
 * @param {string} [props.className]
 */
export function CtaBand({
  title,
  titleClassName,
  body,
  actions,
  tone = "tint",
  className,
  id,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const headingId = ariaLabelledBy || (id ? `${id}-heading` : undefined);
  const isInverse = tone === "inverse";

  return (
    <Section
      id={id}
      tone={tone}
      spacing="md"
      aria-labelledby={headingId}
      className={cn(
        "relative overflow-hidden",
        tone === "tint" && "border-t border-accent-line/50",
        className,
      )}
      {...rest}
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2
              id={headingId}
              className={cn(
                "font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl",
                isInverse ? "text-white" : "text-heading",
                titleClassName,
              )}
            >
              {title}
            </h2>
            {body && (
              <p
                className={cn(
                  "mt-4 max-w-2xl text-lead leading-relaxed",
                  isInverse ? "text-fg-inverse-muted" : "text-fg-muted",
                )}
              >
                {body}
              </p>
            )}
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:col-span-4 lg:justify-end">
            {actions || <HeaderCtas location="cta-band" size="lg" onDark={isInverse} />}
          </div>
        </div>
      </Container>
    </Section>
  );
}
