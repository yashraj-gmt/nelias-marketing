import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

let hasErrors = false;

function error(msg) {
  console.error(`FAIL: ${msg}`);
  hasErrors = true;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

console.log("=== CHECK UI/UX DOCUMENTATION SUITE ===");

// 1. Verify all routes from router.jsx are documented in 02-sitemap-navigation.md
console.log("\n--- 1. Sitemap Routes Parity ---");
const sitemapPath = path.join(rootDir, "docs", "ui-ux", "02-sitemap-navigation.md");
if (!fs.existsSync(sitemapPath)) {
  error(`Missing sitemap file: ${sitemapPath}`);
} else {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
  const routerPath = path.join(rootDir, "src", "app", "router.jsx");
  const routerContent = fs.readFileSync(routerPath, "utf-8");

  // Extract declared routes
  const routeMatches = [
    "/", // index: true
    ...Array.from(routerContent.matchAll(/path:\s*["']([^"']+)["']/g)).map((m) =>
      m[1].startsWith("/") ? m[1] : `/${m[1]}`,
    ),
  ];

  // Exclude dev-only routes
  const productionRoutes = routeMatches.filter(
    (r) => !r.includes("__design") && !r.includes("__ui"),
  );

  for (const route of productionRoutes) {
    // For wildcard, check for "*" or "404"
    if (route === "/*" || route === "*") {
      if (sitemapContent.includes("`*`") || sitemapContent.includes("404")) {
        ok(`Route ${route} is documented in sitemap`);
      } else {
        error(`Route ${route} is missing from docs/ui-ux/02-sitemap-navigation.md`);
      }
    } else if (sitemapContent.includes(`\`${route}\``) || sitemapContent.includes(route)) {
      ok(`Route ${route} is documented in sitemap`);
    } else {
      error(`Route ${route} is missing from docs/ui-ux/02-sitemap-navigation.md`);
    }
  }
}

// 2. Verify all UI and pattern components are documented in 01-design-system.md
console.log("\n--- 2. Design System Components Parity ---");
const designSystemPath = path.join(rootDir, "docs", "ui-ux", "01-design-system.md");
if (!fs.existsSync(designSystemPath)) {
  error(`Missing design system document: ${designSystemPath}`);
} else {
  const dsContent = fs.readFileSync(designSystemPath, "utf-8");

  const componentDirs = [
    path.join(rootDir, "src", "components", "ui"),
    path.join(rootDir, "src", "components", "ui", "forms"),
    path.join(rootDir, "src", "components", "patterns"),
  ];

  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === "index.js") continue;
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) continue;

      if (file.endsWith(".jsx") || file.endsWith(".js")) {
        if (dsContent.includes(file)) {
          ok(`Component ${file} is documented in design system`);
        } else {
          error(`Component file ${file} is missing from docs/ui-ux/01-design-system.md`);
        }
      }
    }
  }
}

// 3. Verify page specification exists for every route
console.log("\n--- 3. Page Specs Parity ---");
const pageSpecsDir = path.join(rootDir, "docs", "ui-ux", "04-page-specs");
if (!fs.existsSync(pageSpecsDir)) {
  error(`Missing page specs directory: ${pageSpecsDir}`);
} else {
  const routeToSpec = {
    "/": "home.md",
    "/why-nelias": "why-nelias.md",
    "/how-it-works": "how-it-works.md",
    "/industries": "industries.md",
    "/industries/:slug": "industry-detail.md",
    "/features": "features.md",
    "/pricing": "pricing.md",
    "/about": "about.md",
    "/about-us": "about.md",
    "/faq": "faq.md",
    "/contact": "contact.md",
    "/demo": "demo.md",
    "/terms": "terms.md",
    "/terms-of-sale": "terms.md",
    "/cgv": "terms.md",
    "/dpa": "terms.md",
    "/privacy": "terms.md",
    "/sla": "terms.md",
    "/resources": "resources.md",
    "/configure": "configure.md",
    "/*": "404.md",
    "*": "404.md",
  };

  const checkedSpecs = new Set();
  for (const [route, specFile] of Object.entries(routeToSpec)) {
    const fullSpecPath = path.join(pageSpecsDir, specFile);
    if (!fs.existsSync(fullSpecPath)) {
      error(`Page spec ${specFile} for route ${route} does not exist at ${fullSpecPath}`);
    } else if (!checkedSpecs.has(specFile)) {
      checkedSpecs.add(specFile);
      ok(`Page spec ${specFile} exists for route ${route}`);
    }
  }
}

if (hasErrors) {
  console.error("\ncheck-docs FAILED");
  process.exit(1);
} else {
  console.log("\ncheck-docs OK");
  process.exit(0);
}
