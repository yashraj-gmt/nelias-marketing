/**
 * check-home-content.mjs
 * Validates Home page pricing parity, module rules, absence of hard-coded FCFA amounts,
 * and key parity between en/home.json and fr/home.json.
 *
 * Usage: node scripts/check-home-content.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getHomePricing,
  MODULES_INCLUDED,
  EXTRA_MODULE_MONTHLY,
  exampleStart,
} from "../src/data/home-pricing.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");

let failures = 0;

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures++;
}

console.log("=== CHECK HOME CONTENT SUITE ===\n");

// 1. Assert catalog figures equal the figures of the document of 26 October 2026
console.log("--- 1. Document Figure Comparison ---");
// Figures of the document of 26 October 2026
const expectedDocumentFigures = {
  start: {
    monthly: 49000,
    annual: 490000,
    users: 5,
    legalEntities: 1,
    storageGb: 10,
  },
  business: {
    monthly: 129000,
    annual: 1290000,
    users: 15,
    legalEntities: 1,
    storageGb: 25,
  },
  professional: {
    monthly: 249000,
    annual: 2490000,
    users: 40,
    legalEntities: 2,
    storageGb: 50,
  },
};

const homePricing = getHomePricing();

for (const planId of ["start", "business", "professional"]) {
  const actual = homePricing.plans[planId];
  const expected = expectedDocumentFigures[planId];

  for (const field of ["monthly", "annual", "users", "legalEntities", "storageGb"]) {
    if (actual[field] === expected[field]) {
      ok(`Plan ${planId.toUpperCase()} ${field} matches expected ${expected[field]}`);
    } else {
      fail(
        `Plan ${planId.toUpperCase()} ${field}: expected ${expected[field]}, got ${actual[field]}`,
      );
    }
  }
}

// Check that each annual plan price equals 10 × its monthly price
// Figures of the document of 26 October 2026
for (const planId of ["start", "business", "professional"]) {
  const p = homePricing.plans[planId];
  if (p.annual === p.monthly * 10) {
    ok(
      `Plan ${planId.toUpperCase()} annual price (${p.annual}) equals 10 × monthly (${p.monthly})`,
    );
  } else {
    fail(
      `Plan ${planId.toUpperCase()} annual price (${p.annual}) != 10 × monthly (${p.monthly * 10})`,
    );
  }
}

// 2. Assert MODULES_INCLUDED is 4, 6, 8 and extra module is 15000
console.log("\n--- 2. Modules Included & Extra Module ---");
// Figures of the document of 26 October 2026
if (
  MODULES_INCLUDED.start === 4 &&
  MODULES_INCLUDED.business === 6 &&
  MODULES_INCLUDED.professional === 8
) {
  ok("MODULES_INCLUDED matches { start: 4, business: 6, professional: 8 }");
} else {
  fail(`MODULES_INCLUDED mismatch: ${JSON.stringify(MODULES_INCLUDED)}`);
}

if (EXTRA_MODULE_MONTHLY === 15000) {
  ok("EXTRA_MODULE_MONTHLY equals 15,000 FCFA");
} else {
  fail(`EXTRA_MODULE_MONTHLY expected 15000, got ${EXTRA_MODULE_MONTHLY}`);
}

// Check catalog extension amounts equal 5000, 20000, 35000, 25000, industryPack = 50000
// Figures of the document of 26 October 2026
const expectedExtensions = {
  user1: 5000,
  users5: 20000,
  users10: 35000,
  legalEntity: 25000,
  industryPack: 50000,
};

for (const [key, expectedVal] of Object.entries(expectedExtensions)) {
  if (homePricing.extensions[key] === expectedVal) {
    ok(`Extension ${key} matches expected ${expectedVal}`);
  } else {
    fail(`Extension ${key}: expected ${expectedVal}, got ${homePricing.extensions[key]}`);
  }
}

// Check exampleStart(5) gives 49000, 15000, 64000
const ex5 = exampleStart(5);
if (ex5.base === 49000 && ex5.extra === 15000 && ex5.total === 64000) {
  ok("exampleStart(5) returns { base: 49000, extra: 15000, total: 64000 }");
} else {
  fail(`exampleStart(5) mismatch: ${JSON.stringify(ex5)}`);
}

// 3. Scan src/sections/home/**/*.jsx, src/sections/pricing/**/*.jsx, src/pages/PricingPage.jsx,
// en/home.json, fr/home.json, en/faq.json, fr/faq.json, en/pricing.json, fr/pricing.json for NO amount literal (regex \d[\d.,\s\u00A0\u202F]*FCFA)
console.log("\n--- 3. FCFA Amount Literal Scan ---");
const amountRegex = /\d[\d.,\s\u00A0\u202F]*FCFA/g;

function collectFiles(dir, ext = ".jsx") {
  const results = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const st = statSync(full);
      if (st.isDirectory()) {
        results.push(...collectFiles(full, ext));
      } else if (extname(entry) === ext) {
        results.push(full);
      }
    }
  } catch {
    // Directory might not exist or be empty
  }
  return results;
}

const homeSectionsDir = join(projectRoot, "src", "sections", "home");
const faqSectionsDir = join(projectRoot, "src", "sections", "faq");
const pricingSectionsDir = join(projectRoot, "src", "sections", "pricing");
const featuresSectionsDir = join(projectRoot, "src", "sections", "features");
const homeJsxFiles = collectFiles(homeSectionsDir, ".jsx");
const faqJsxFiles = collectFiles(faqSectionsDir, ".jsx");
const pricingJsxFiles = collectFiles(pricingSectionsDir, ".jsx");
const featuresJsxFiles = collectFiles(featuresSectionsDir, ".jsx");
const filesToScan = [
  ...homeJsxFiles,
  ...faqJsxFiles,
  ...pricingJsxFiles,
  ...featuresJsxFiles,
  join(projectRoot, "src", "pages", "FaqPage.jsx"),
  join(projectRoot, "src", "pages", "PricingPage.jsx"),
  join(projectRoot, "src", "pages", "FeaturesPage.jsx"),
  join(projectRoot, "src", "i18n", "locales", "en", "home.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "home.json"),
  join(projectRoot, "src", "i18n", "locales", "en", "faq.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "faq.json"),
  join(projectRoot, "src", "i18n", "locales", "en", "pricing.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "pricing.json"),
  join(projectRoot, "src", "i18n", "locales", "en", "features.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "features.json"),
];

for (const file of filesToScan) {
  try {
    const content = readFileSync(file, "utf-8");
    const matches = content.match(amountRegex);
    const rel = file.replace(projectRoot, "").replace(/^[\\/]/, "");
    if (matches && matches.length > 0) {
      fail(`Found amount literal in ${rel}: ${matches.join(", ")}`);
    } else {
      ok(`No amount literals in ${rel}`);
    }
  } catch (err) {
    fail(`Could not read ${file}: ${err.message}`);
  }
}

// 4. Assert en/home.json and fr/home.json, en/faq.json and fr/faq.json, and en/pricing.json and fr/pricing.json have identical key structure
console.log("\n--- 4. i18n Key Structure Parity ---");
function checkKeyParity(enPath, frPath, label) {
  try {
    const enObj = JSON.parse(readFileSync(enPath, "utf-8"));
    const frObj = JSON.parse(readFileSync(frPath, "utf-8"));

    const enKeys = getKeyPaths(enObj);
    const frKeys = getKeyPaths(frObj);

    const missingInFr = enKeys.filter((k) => !frKeys.includes(k));
    const extraInFr = frKeys.filter((k) => !enKeys.includes(k));

    if (missingInFr.length === 0 && extraInFr.length === 0) {
      ok(`Key structure parity verified for ${label} (${enKeys.length} leaf keys)`);
    } else {
      if (missingInFr.length > 0) {
        fail(`Missing in fr/${label}: ${missingInFr.join(", ")}`);
      }
      if (extraInFr.length > 0) {
        fail(`Extra in fr/${label}: ${extraInFr.join(", ")}`);
      }
    }
  } catch (err) {
    fail(`Key parity check failed for ${label}: ${err.message}`);
  }
}

function getKeyPaths(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...getKeyPaths(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys.sort();
}

checkKeyParity(
  join(projectRoot, "src", "i18n", "locales", "en", "home.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "home.json"),
  "home.json",
);

checkKeyParity(
  join(projectRoot, "src", "i18n", "locales", "en", "faq.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "faq.json"),
  "faq.json",
);

checkKeyParity(
  join(projectRoot, "src", "i18n", "locales", "en", "pricing.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "pricing.json"),
  "pricing.json",
);

checkKeyParity(
  join(projectRoot, "src", "i18n", "locales", "en", "features.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "features.json"),
  "features.json",
);

checkKeyParity(
  join(projectRoot, "src", "i18n", "locales", "en", "industries.json"),
  join(projectRoot, "src", "i18n", "locales", "fr", "industries.json"),
  "industries.json",
);

console.log("\n================================");
if (failures > 0) {
  console.error(`check:home FAILED with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log("check:home OK");
  process.exit(0);
}
