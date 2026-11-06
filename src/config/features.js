/** Feature flags - each is true only when the env value is the string "true", except frenchEnabled which is enabled unless explicitly "false". */
export const features = Object.freeze({
  pricingPublic: import.meta.env.VITE_FEATURE_PRICING_PUBLIC !== "false",
  frenchEnabled: import.meta.env.VITE_FEATURE_FRENCH !== "false",
  industryPlus: import.meta.env.VITE_FEATURE_INDUSTRY_PLUS === "true",
  configurator: import.meta.env.VITE_FEATURE_CONFIGURATOR !== "false",
  authPages: import.meta.env.VITE_FEATURE_AUTH_PAGES !== "false",
});
