/**
 * Shared Tailwind classes for form controls (Input, Textarea, Select).
 * Text size stays >= 16px to prevent automatic zooming on iOS.
 * Border contrast ink-500 meets 5.1:1 non-text contrast against white.
 */
export const fieldControlClasses =
  "block w-full min-h-12 rounded-sm border border-field bg-surface-raised px-4 py-3 text-[1.0625rem] text-fg placeholder:text-fg-subtle transition-colors hover:border-heading focus-visible:border-accent focus-visible:outline-offset-0 aria-[invalid=true]:border-danger aria-[invalid=true]:border-2 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-fg-subtle";
