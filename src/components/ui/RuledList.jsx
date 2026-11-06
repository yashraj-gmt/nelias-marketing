import { cn } from "@/lib/cn";

/**
 * Quieter alternative to a card grid. Renders a hairline-divided list.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function RuledList({ className, children, ...rest }) {
  return (
    <ul className={cn("divide-y divide-line", className)} {...rest}>
      {children}
    </ul>
  );
}

/**
 * Item in a RuledList featuring icon, title, and body description.
 *
 * @param {Object} props
 * @param {import("react").ComponentType} [props.icon]
 * @param {string} props.title
 * @param {import("react").ElementType} [props.headingLevel=3]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function RuledItem({
  icon: IconComponent,
  title,
  headingLevel = 3,
  className,
  children,
  ...rest
}) {
  const HeadingTag = `h${headingLevel}`;

  return (
    <li
      className={cn("flex flex-col gap-4 py-5 md:flex-row md:items-start md:py-6", className)}
      {...rest}
    >
      {IconComponent && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-surface-tint text-accent-strong">
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="flex-1">
        <HeadingTag className="mb-1 font-display text-lg font-semibold text-heading">
          {title}
        </HeadingTag>
        <div className="text-sm leading-relaxed text-fg-muted md:text-base">{children}</div>
      </div>
    </li>
  );
}
