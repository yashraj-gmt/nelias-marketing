/**
 * check-i18n.mjs
 * Validates translations between English and French locales.
 *
 * Checks:
 * - Namespace file parity
 * - Key parity (missing or extra keys)
 * - Empty or whitespace-only French values
 * - Array length and type consistency
 * - Placeholder consistency ({{placeholder}})
 * - Warns on untranslated values not present in scripts/i18n-allowlist.json
 * - Optional heuristic scan for hard-coded strings in JSX (--hardcoded)
 *
 * Usage: node scripts/check-i18n.mjs [--hardcoded]
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const enDir = join(projectRoot, "src", "i18n", "locales", "en");
const frDir = join(projectRoot, "src", "i18n", "locales", "fr");
const allowlistPath = join(__dirname, "i18n-allowlist.json");

const isHardcodedScan = process.argv.includes("--hardcoded");

/**
 * Extract {{variable}} placeholders from a string.
 * @param {string} str
 * @returns {string[]}
 */
function extractPlaceholders(str) {
  if (typeof str !== "string") return [];
  const matches = str.match(/\{\{([^}]+)\}\}/g);
  return matches ? matches.map((m) => m.slice(2, -2).trim()).sort() : [];
}

/**
 * Recursively compare English and French translation objects.
 */
function compareObjects(enObj, frObj, ns, path = "", allowlist, errors, warnings, stats) {
  const enKeys = Object.keys(enObj);
  const frKeys = Object.keys(frObj || {});
  const enOnly = allowlist.enOnly || [];

  // Extra keys in French
  for (const k of frKeys) {
    const fullKey = path ? `${ns}.${path}.${k}` : `${ns}.${k}`;
    if (enOnly.includes(fullKey)) {
      errors.push(`[Key must not exist in French (enOnly)] ${fullKey}`);
      continue;
    }
    if (!(k in enObj)) {
      errors.push(`[Extra key in French] ${fullKey}`);
    }
  }

  for (const k of enKeys) {
    const currentPath = path ? `${path}.${k}` : k;
    const fullKey = `${ns}.${currentPath}`;

    if (enOnly.includes(fullKey)) {
      if (stats.foundEnOnly) {
        stats.foundEnOnly.add(fullKey);
      }
      stats.keyCount++;
      if (k in (frObj || {})) {
        errors.push(`[Key must not exist in French (enOnly)] ${fullKey}`);
      }
      continue;
    }

    if (!(k in (frObj || {}))) {
      errors.push(`[Missing key in French] ${fullKey}`);
      continue;
    }

    const enVal = enObj[k];
    const frVal = frObj[k];

    const enType = Array.isArray(enVal) ? "array" : typeof enVal;
    const frType = Array.isArray(frVal) ? "array" : typeof frVal;

    if (enType !== frType) {
      errors.push(`[Type mismatch] ${fullKey}: expected ${enType}, got ${frType}`);
      continue;
    }

    if (enType === "object" && enVal !== null) {
      compareObjects(enVal, frVal, ns, currentPath, allowlist, errors, warnings, stats);
    } else if (enType === "array") {
      stats.keyCount++;
      if (enVal.length !== frVal.length) {
        errors.push(
          `[Array length mismatch] ${fullKey}: EN has ${enVal.length}, FR has ${frVal.length}`,
        );
      }
      for (let i = 0; i < enVal.length; i++) {
        const itemKey = `${fullKey}[${i}]`;
        const itemEn = enVal[i];
        const itemFr = frVal[i];

        if (typeof itemEn === "string") {
          if (typeof itemFr !== "string" || itemFr.trim() === "") {
            errors.push(`[Empty or whitespace value] ${itemKey}: French value is empty`);
          } else {
            // Check placeholders
            const enPh = extractPlaceholders(itemEn);
            const frPh = extractPlaceholders(itemFr);
            if (enPh.join(",") !== frPh.join(",")) {
              errors.push(
                `[Placeholder mismatch] ${itemKey}: EN {{${enPh.join(", ")}}} vs FR {{${frPh.join(", ")}}}`,
              );
            }
            // Check identical warning
            if (
              itemEn === itemFr &&
              !allowlist.values.includes(itemFr) &&
              !allowlist.keys.includes(fullKey)
            ) {
              warnings.push(`[Untranslated value] ${itemKey}: "${itemFr}" is identical to English`);
            }
          }
        } else if (typeof itemEn === "object" && itemEn !== null) {
          compareObjects(
            itemEn,
            itemFr,
            ns,
            `${currentPath}[${i}]`,
            allowlist,
            errors,
            warnings,
            stats,
          );
        }
      }
    } else if (enType === "string") {
      stats.keyCount++;
      if (frVal.trim() === "") {
        errors.push(`[Empty or whitespace value] ${fullKey}: French value is empty`);
      } else {
        const enPh = extractPlaceholders(enVal);
        const frPh = extractPlaceholders(frVal);
        if (enPh.join(",") !== frPh.join(",")) {
          errors.push(
            `[Placeholder mismatch] ${fullKey}: EN {{${enPh.join(", ")}}} vs FR {{${frPh.join(", ")}}}`,
          );
        }

        if (
          enVal === frVal &&
          !allowlist.values.includes(frVal) &&
          !allowlist.keys.includes(fullKey)
        ) {
          warnings.push(`[Untranslated value] ${fullKey}: "${frVal}" is identical to English`);
        }
      }
    } else {
      stats.keyCount++;
    }
  }
}

/**
 * Scan JSX files for hardcoded text nodes and attributes.
 */
async function scanHardcoded(dir, findings) {
  const entries = await readdir(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) {
      if (entry !== "node_modules") {
        await scanHardcoded(fullPath, findings);
      }
    } else if (fullPath.endsWith(".jsx") && !fullPath.includes("PreviewPage")) {
      const content = await readFile(fullPath, "utf-8");
      const lines = content.split("\n");
      const relPath = fullPath.replace(projectRoot, "").replace(/\\/g, "/").replace(/^\//, "");

      lines.forEach((line, idx) => {
        // Attributes: aria-label, alt, placeholder, title
        const attrMatches = line.matchAll(/(aria-label|alt|placeholder|title)=["']([^"']+)["']/g);
        for (const m of attrMatches) {
          const attr = m[1];
          const val = m[2].trim();
          if (
            val.length > 0 &&
            !line.includes("t(") &&
            !["NELIAS", "Debass Technologies", "FCFA"].includes(val)
          ) {
            findings.push(`${relPath}:${idx + 1} Hardcoded attribute ${attr}="${val}"`);
          }
        }

        // Visible text between > and <
        const textMatches = line.matchAll(/>([^<>{}\n]+)</g);
        for (const m of textMatches) {
          const text = m[1].trim();
          if (
            text.length > 2 &&
            !/^[\d\s\-_:;.,/\\()+=*&%#@!|?]+$/.test(text) &&
            !["NELIAS", "Debass Technologies", "FCFA", "WhatsApp"].includes(text)
          ) {
            findings.push(`${relPath}:${idx + 1} Hardcoded text "${text}"`);
          }
        }
      });
    }
  }
}

async function main() {
  let allowlist = { keys: [], values: [] };
  try {
    const allowlistContent = await readFile(allowlistPath, "utf-8");
    allowlist = JSON.parse(allowlistContent);
  } catch {
    // If missing, use empty arrays
  }

  const enFiles = (await readdir(enDir)).filter((f) => f.endsWith(".json"));
  const frFiles = (await readdir(frDir)).filter((f) => f.endsWith(".json"));
  const pendingFrench = allowlist.pendingFrench || [];

  const errors = [];
  const warnings = [];
  const perNamespaceSummary = [];
  const foundEnOnly = new Set();

  // Check for namespace files present in fr but not en
  for (const frFile of frFiles) {
    if (!enFiles.includes(frFile)) {
      errors.push(`[Extra namespace in French] ${frFile}`);
    }
  }

  for (const enFile of enFiles) {
    const ns = enFile.replace(/\.json$/, "");
    if (!frFiles.includes(enFile)) {
      errors.push(`[Missing namespace in French] ${enFile}`);
      continue;
    }

    const enRaw = await readFile(join(enDir, enFile), "utf-8");
    const frRaw = await readFile(join(frDir, enFile), "utf-8");

    let enData = {};
    let frData = {};

    try {
      enData = JSON.parse(enRaw);
    } catch (e) {
      errors.push(`[Invalid JSON in English] ${enFile}: ${e.message}`);
      continue;
    }

    try {
      frData = JSON.parse(frRaw);
    } catch (e) {
      errors.push(`[Invalid JSON in French] ${enFile}: ${e.message}`);
      continue;
    }

    const nsStats = { keyCount: 0, foundEnOnly };
    const nsErrorsBefore = errors.length;

    // TODO(Debass): remove the namespace from pendingFrench when the official French text is added.
    if (pendingFrench.includes(ns)) {
      console.warn(`WARN: [${ns}] French translation pending official update; parity checks skipped`);
      warnings.push(`[pendingFrench] Namespace '${ns}' French translation is pending official update; parity checks skipped`);

      const countEn = (obj, path = "") => {
        for (const [k, v] of Object.entries(obj || {})) {
          const currentPath = path ? `${path}.${k}` : k;
          const fullKey = `${ns}.${currentPath}`;
          if ((allowlist.enOnly || []).includes(fullKey)) {
            foundEnOnly.add(fullKey);
          }
          if (Array.isArray(v)) {
            nsStats.keyCount++;
            for (let i = 0; i < v.length; i++) {
              if (typeof v[i] === "object" && v[i] !== null) {
                countEn(v[i], `${currentPath}[${i}]`);
              }
            }
          } else if (v && typeof v === "object") {
            countEn(v, currentPath);
          } else {
            nsStats.keyCount++;
          }
        }
      };
      countEn(enData);

      perNamespaceSummary.push({
        namespace: ns,
        keys: nsStats.keyCount,
        errors: 0,
      });
      continue;
    }

    compareObjects(enData, frData, ns, "", allowlist, errors, warnings, nsStats);

    const nsErrorCount = errors.length - nsErrorsBefore;
    perNamespaceSummary.push({
      namespace: ns,
      keys: nsStats.keyCount,
      errors: nsErrorCount,
    });
  }

  for (const k of allowlist.enOnly || []) {
    if (!foundEnOnly.has(k)) {
      errors.push(`[enOnly key not found in English] ${k}`);
    }
  }

  console.log("=== i18n Translation Check ===");
  console.log("Namespace Summary:");
  for (const s of perNamespaceSummary) {
    console.log(`  - ${s.namespace.padEnd(14)} : ${s.keys} keys | ${s.errors} error(s)`);
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    for (const w of warnings) {
      console.log(`  ! ${w}`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nErrors (${errors.length}):`);
    for (const e of errors) {
      console.error(`  X ${e}`);
    }
  }

  if (isHardcodedScan) {
    console.log("\n=== Hardcoded String Heuristic Scan (--hardcoded) ===");
    const hardcodedFindings = [];
    await scanHardcoded(join(projectRoot, "src"), hardcodedFindings);
    if (hardcodedFindings.length === 0) {
      console.log("No hardcoded JSX strings found.");
    } else {
      console.log(`Found ${hardcodedFindings.length} potential finding(s):`);
      for (const f of hardcodedFindings) {
        console.log(`  ? ${f}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("\ncheck:i18n FAILED.");
    process.exit(1);
  } else {
    console.log("\ncheck:i18n OK");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
