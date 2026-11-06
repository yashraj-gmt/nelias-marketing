/**
 * Analytics event constants.
 * The analytics provider is a later decision - for now, track() is a no-op
 * that logs to console.debug in development only.
 */
export const EVENTS = Object.freeze({
  CTA_CLICK: "cta_click",
  NAV_CLICK: "nav_click",
  DEMO_REQUEST_SUBMIT: "demo_request_submit",
  CONTACT_SUBMIT: "contact_submit",
  PRICING_VIEW: "pricing_view",
  PLAN_SELECT: "plan_select",
  LANGUAGE_CHANGE: "language_change",
  THEME_CHANGE: "theme_change",
  FILTER_CHANGE: "filter_change",
  BILLING_CHANGE: "billing_change",
  AUTH_SIGN_IN_RESULT: "auth_sign_in_result",
  AUTH_SIGN_UP_RESULT: "auth_sign_up_result",
});

/**
 * Track an analytics event. Currently a no-op; logs in DEV only.
 * @param {string} event - One of EVENTS values
 * @param {Record<string, unknown>} [props] - Additional event properties
 */
export function track(event, props) {
  if (import.meta.env.DEV) {
    console.debug("[analytics]", event, props);
  }
}
