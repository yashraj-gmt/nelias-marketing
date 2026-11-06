import { forwardRef } from "react";
import { fieldControlClasses } from "./field-styles";
import { cn } from "@/lib/cn";

/**
 * Standard text/email/number input forwarding refs and native input props.
 */
export const Input = forwardRef(function Input({ className, type = "text", ...props }, ref) {
  return <input ref={ref} type={type} className={cn(fieldControlClasses, className)} {...props} />;
});
