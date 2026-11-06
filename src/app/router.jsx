import { createBrowserRouter, Navigate, useParams } from "react-router-dom";
import RootLayout from "./RootLayout";
import { industries } from "@/data/industries";
import { features } from "@/config/features";
import { site } from "@/config/site";
import { ExternalRedirect } from "@/components/common/ExternalRedirect";

/**
 * Lazy-load helper: wraps a dynamic import so createBrowserRouter
 * can use route-level code splitting.
 * @param {() => Promise<{default: import("react").ComponentType}>} load
 */
const page = (load) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

// TODO(Debass): old industry addresses redirect to the inline detail; confirm.
function IndustryRedirect() {
  const { slug } = useParams();
  const target = slug && industries.includes(slug) ? `/industries#${slug}` : "/industries";
  return <Navigate to={target} replace />;
}

// TODO(Debass): redirect targets are proposals; confirm.
const removedRoutes = [
  { path: "why-nelias", element: <Navigate to="/" replace /> },
  { path: "how-it-works", element: <Navigate to="/" replace /> },
  { path: "resources", element: <Navigate to="/" replace /> },
  { path: "terms-of-sale", element: <Navigate to="/terms" replace /> },
  { path: "cgv", element: <Navigate to="/terms" replace /> },
];

/** @type {import("react-router-dom").RouteObject[]} */
const routes = [
  {
    element: <RootLayout />,
    children: [
      { index: true, ...page(() => import("@/pages/HomePage")) },
      { path: "industries", ...page(() => import("@/pages/IndustriesPage")) },
      { path: "industries/:slug", element: <IndustryRedirect /> },
      { path: "features", ...page(() => import("@/pages/FeaturesPage")) },
      { path: "pricing", ...page(() => import("@/pages/PricingPage")) },
      { path: "configure", ...page(() => import("@/pages/ConfigurePage")) },
      { path: "about", ...page(() => import("@/pages/AboutPage")) },
      { path: "about-us", ...page(() => import("@/pages/AboutPage")) },
      { path: "faq", ...page(() => import("@/pages/FaqPage")) },
      { path: "contact", ...page(() => import("@/pages/ContactPage")) },
      { path: "demo", ...page(() => import("@/pages/DemoPage")) },
      {
        path: "sign-in",
        ...(features.authPages
          ? page(() => import("@/pages/SignInPage"))
          : { element: <ExternalRedirect to={site.externalSignUpUrl || "https://login.nelias.app/"} /> }),
      },
      {
        path: "sign-up",
        ...(features.authPages
          ? page(() => import("@/pages/SignUpPage"))
          : { element: <ExternalRedirect to={site.externalSignUpUrl || "https://login.nelias.app/"} /> }),
      },
      { path: "terms", ...page(() => import("@/pages/TermsPage")) },
      { path: "dpa", ...page(() => import("@/pages/DpaPage")) },
      { path: "privacy", ...page(() => import("@/pages/PrivacyPage")) },
      { path: "sla", ...page(() => import("@/pages/SlaPage")) },
      ...removedRoutes,
      { path: "*", ...page(() => import("@/pages/NotFoundPage")) },
    ],
  },
];

// DEV-only preview routes - not reachable in production builds
if (import.meta.env.DEV) {
  routes[0].children.unshift(
    {
      path: "__design",
      ...page(() => import("@/pages/DesignPreviewPage")),
    },
    {
      path: "__ui",
      ...page(() => import("@/pages/UiKitPreviewPage")),
    },
  );
}

export const router = createBrowserRouter(routes);
