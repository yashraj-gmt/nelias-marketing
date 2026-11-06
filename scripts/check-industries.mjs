/**
 * check-industries.mjs
 * Validates industry sectors across data, content, and translations.
 *
 * Checks:
 * - No duplicate slugs in industries.js
 * - Every slug has an entry in industryAreas with >= 1 area
 * - Every area key in industryAreas is valid per featureAreaOrder
 * - items.<slug>.name and summary exist in both en and fr JSON
 * - items.<slug>.walkthrough has 3 to 5 non-empty strings in both en and fr JSON
 * - Walkthrough lengths are equal between en and fr
 * - No headline mismatch between en and fr (both present or both absent)
 * - industryAreas keys equal industries slugs
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { industries } from "../src/data/industries.js";
import { industryAreas } from "../src/data/industry-areas.js";
import { featureAreaOrder } from "../src/data/feature-order.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const enIndustriesPath = join(projectRoot, "src", "i18n", "locales", "en", "industries.json");
const frIndustriesPath = join(projectRoot, "src", "i18n", "locales", "fr", "industries.json");

let hasErrors = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    hasErrors = true;
  }
}

async function main() {
  console.log("=== CHECK INDUSTRIES SUITE ===");

  // 1. Assert no duplicate slugs
  const slugSet = new Set();
  const duplicates = [];
  for (const slug of industries) {
    if (slugSet.has(slug)) {
      duplicates.push(slug);
    }
    slugSet.add(slug);
  }
  assert(
    duplicates.length === 0,
    `Duplicate slugs found in industries.js: ${duplicates.join(", ")}`,
  );
  assert(industries.length > 0, "industries list must not be empty");

  // 2. Assert industryAreas keys equal industries slugs (and by extension industryProfiles keys)
  const areaKeys = Object.keys(industryAreas);
  assert(
    areaKeys.length === industries.length &&
      industries.every((slug, idx) => areaKeys[idx] === slug),
    `industryAreas keys must equal industries slugs in exact order. Expected ${industries.join(",")}, got ${areaKeys.join(",")}`,
  );

  // 3. Assert each slug has valid areas
  const validAreas = new Set(featureAreaOrder);
  for (const slug of industries) {
    const areas = industryAreas[slug];
    assert(
      Array.isArray(areas) && areas.length >= 1,
      `Slug "${slug}" must have an entry in industryAreas with at least one area`,
    );

    if (Array.isArray(areas)) {
      for (const area of areas) {
        assert(
          validAreas.has(area),
          `Slug "${slug}" references area "${area}" not present in featureAreaOrder`,
        );
      }
    }
  }

  // 4. Translation assertions
  const enJson = JSON.parse(await readFile(enIndustriesPath, "utf-8"));
  const frJson = JSON.parse(await readFile(frIndustriesPath, "utf-8"));

  const enItems = enJson.items || {};
  const frItems = frJson.items || {};

  for (const slug of industries) {
    const enItem = enItems[slug];
    const frItem = frItems[slug];

    assert(Boolean(enItem), `Missing English item for slug "${slug}"`);
    assert(Boolean(frItem), `Missing French item for slug "${slug}"`);

    if (!enItem || !frItem) continue;

    // name
    assert(
      typeof enItem.name === "string" && enItem.name.trim().length > 0,
      `English name for "${slug}" must be a non-empty string`,
    );
    assert(
      typeof frItem.name === "string" && frItem.name.trim().length > 0,
      `French name for "${slug}" must be a non-empty string`,
    );

    // summary
    assert(
      typeof enItem.summary === "string" && enItem.summary.trim().length > 0,
      `English summary for "${slug}" must be a non-empty string`,
    );
    assert(
      typeof frItem.summary === "string" && frItem.summary.trim().length > 0,
      `French summary for "${slug}" must be a non-empty string`,
    );

    // walkthrough
    assert(Array.isArray(enItem.walkthrough), `English walkthrough for "${slug}" must be an array`);
    assert(Array.isArray(frItem.walkthrough), `French walkthrough for "${slug}" must be an array`);

    if (Array.isArray(enItem.walkthrough) && Array.isArray(frItem.walkthrough)) {
      assert(
        enItem.walkthrough.length >= 3 && enItem.walkthrough.length <= 5,
        `English walkthrough for "${slug}" must have between 3 and 5 items (has ${enItem.walkthrough.length})`,
      );
      assert(
        frItem.walkthrough.length >= 3 && frItem.walkthrough.length <= 5,
        `French walkthrough for "${slug}" must have between 3 and 5 items (has ${frItem.walkthrough.length})`,
      );
      assert(
        enItem.walkthrough.length === frItem.walkthrough.length,
        `Walkthrough length mismatch for "${slug}": EN=${enItem.walkthrough.length}, FR=${frItem.walkthrough.length}`,
      );

      for (let i = 0; i < enItem.walkthrough.length; i++) {
        assert(
          typeof enItem.walkthrough[i] === "string" && enItem.walkthrough[i].trim().length > 0,
          `English walkthrough node ${i} for "${slug}" must be a non-empty string`,
        );
      }
      for (let i = 0; i < frItem.walkthrough.length; i++) {
        assert(
          typeof frItem.walkthrough[i] === "string" && frItem.walkthrough[i].trim().length > 0,
          `French walkthrough node ${i} for "${slug}" must be a non-empty string`,
        );
      }
    }

    // headline: both present or both absent
    const hasEnHeadline = Boolean(enItem.headline && enItem.headline.trim().length > 0);
    const hasFrHeadline = Boolean(frItem.headline && frItem.headline.trim().length > 0);
    assert(
      hasEnHeadline === hasFrHeadline,
      `Headline mismatch for "${slug}": EN present=${hasEnHeadline}, FR present=${hasFrHeadline}`,
    );
  }

  if (hasErrors) {
    console.error("\ncheck:industries FAILED");
    process.exit(1);
  } else {
    console.log("check:industries OK");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Unexpected error in check-industries.mjs:", err);
  process.exit(1);
});
