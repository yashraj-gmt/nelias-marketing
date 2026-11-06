import { cn } from "@/lib/cn";

const widthMap = {
  narrow: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[96rem]",
};

/**
 * Centered content wrapper with responsive horizontal padding.
 * @param {Object} props
 * @param {"narrow"|"default"|"wide"} [props.width="default"]
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function Container({ width = "default", className, children, ...rest }) {
  return (
    <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", widthMap[width], className)} {...rest}>
      {children}
    </div>
  );
}
