import { cn } from "@/lib/cn";

const toneMap = {
  default: "bg-surface border-line text-fg",
  muted: "bg-surface-muted border-line text-fg",
  tint: "bg-surface-tint border-accent-line text-fg",
  inverse: "bg-brand-deep border-white/10 text-fg-inverse",
};

const elevationMap = {
  none: "",
  card: "shadow-card",
  raised: "shadow-raised",
};

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Standard Card surface.
 *
 * @param {Object} props
 * @param {import("react").ElementType} [props.as="div"]
 * @param {"default"|"muted"|"tint"|"inverse"} [props.tone="default"]
 * @param {"none"|"card"|"raised"} [props.elevation="none"]
 * @param {"sm"|"md"|"lg"} [props.padding="md"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Card({
  as: Component = "div",
  tone = "default",
  elevation = "none",
  padding = "md",
  className,
  children,
  ...rest
}) {
  const isInverse = tone === "inverse";

  return (
    <Component
      data-tone={isInverse ? "inverse" : undefined}
      className={cn(
        "rounded-lg border transition-colors",
        toneMap[tone] || toneMap.default,
        elevationMap[elevation],
        paddingMap[padding] || paddingMap.md,
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Card title element.
 *
 * @param {Object} props
 * @param {import("react").ElementType} [props.as="h3"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function CardTitle({ as: Component = "h3", className, children, ...rest }) {
  return (
    <Component
      className={cn(
        "font-display text-lg leading-snug font-semibold tracking-tight text-heading group-data-[tone=inverse]:text-white md:text-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Card body paragraph element.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function CardText({ className, children, ...rest }) {
  return (
    <p
      className={cn(
        "text-sm leading-relaxed text-fg-muted group-data-[tone=inverse]:text-fg-inverse-muted md:text-base",
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}
