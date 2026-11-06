import { cn } from "@/lib/cn";

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-6 w-6 border-3",
};

/**
 * Small SVG or circular spinner.
 *
 * @param {Object} props
 * @param {"sm"|"md"|"lg"} [props.size="md"]
 * @param {string} [props.className]
 */
export function Spinner({ size = "md", className, ...rest }) {
  return (
    <span
      role="status"
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent",
        sizeMap[size] || sizeMap.md,
        className,
      )}
      {...rest}
    />
  );
}
