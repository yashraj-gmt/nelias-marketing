import { cn } from "@/lib/cn";

/**
 * Shared card shell for authentication pages (Sign In, Sign Up).
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {import("react").ReactNode} props.children
 */
export function AuthCard({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-xl border border-line bg-surface-raised p-6 shadow-raised md:p-8",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

