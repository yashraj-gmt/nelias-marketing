/** Site-wide configuration sourced from environment variables. */
export const site = Object.freeze({
  name: "NELIAS",
  legalName: "Debass Technologies",
  url: import.meta.env.VITE_SITE_URL || "https://nelias.app",
  loginUrl: import.meta.env.VITE_LOGIN_URL || "/sign-in",
  signUpUrl: import.meta.env.VITE_SIGNUP_URL || "/sign-up",
  externalSignUpUrl: "https://login.nelias.app/",
  contact: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "contact@nelias.app",
    phone: import.meta.env.VITE_CONTACT_PHONE || "+225 05 64 05 90 60",
    whatsapp: import.meta.env.VITE_WHATSAPP || "+225 07 00 40 92 41",
  },
  address: "Abidjan, Côte d'Ivoire",
  noindex: import.meta.env.VITE_NOINDEX === "true",
});
