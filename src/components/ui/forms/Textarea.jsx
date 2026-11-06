import { forwardRef } from "react";
import { fieldControlClasses } from "./field-styles";
import { cn } from "@/lib/cn";

/**
 * Multi-line textarea forwarding refs and native textarea props.
 */
export const Textarea = forwardRef(function Textarea({ className, rows = 4, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(fieldControlClasses, "min-h-32 resize-y", className)}
      {...props}
    />
  );
});
