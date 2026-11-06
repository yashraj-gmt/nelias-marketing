import { cn } from "@/lib/cn";

/**
 * Editorial pull statement callout for key takeaways and quotes.
 *
 * @param {Object} props
 * @param {"accent"|"ribbon"|"plain"} [props.variant="accent"]
 * @param {"md"|"lg"} [props.size="md"]
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.className]
 */
export function PullStatement({ variant = "accent", size = "md", children, className }) {
  const isPlain = variant === "plain";
  const sizeClass =
    size === "custom" ? "" : size === "lg" ? "text-h2 md:text-h1" : "text-h3 md:text-h2";

  return (
    <p
      className={cn(
        "relative font-display leading-snug font-semibold text-heading",
        sizeClass,
        !isPlain && "pl-6",
        className,
      )}
    >
      {!isPlain && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 bottom-1 left-0 w-1 rounded-full",
            variant === "ribbon" ? "bg-brand-ribbon" : "bg-accent",
          )}
        />
      )}
      {children}
    </p>
  );
}
