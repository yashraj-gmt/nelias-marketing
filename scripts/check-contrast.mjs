/**
 * check-contrast.mjs
 * Validates WCAG contrast ratios for semantic color pairs in light and dark themes.
 *
 * Usage: node scripts/check-contrast.mjs
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const cssPath = join(__dirname, "..", "src", "styles", "index.css");

/**
 * Convert 3/6-character hex to { r, g, b } in 0..255
 */
function parseHex(hex) {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate relative luminance of an sRGB color per WCAG 2.1
 */
function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two hex colors
 */
function contrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(parseHex(hex1));
  const lum2 = relativeLuminance(parseHex(hex2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse tokens from a CSS block
 */
function parseBlockTokens(css, selector) {
  const tokens = {};
  const blockRegex = new RegExp(`${selector.replace(/[[\]]/g, "\\$&")}\\s*{([^}]+)}`, "m");
  const match = css.match(blockRegex);
  if (!match) return tokens;

  const lines = match[1].split(";");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("--")) continue;
    const [prop, val] = trimmed.split(":").map((s) => s.trim());
    if (prop && val && val.startsWith("#")) {
      const name = prop.replace(/^--/, "");
      tokens[name] = val;
    }
  }
  return tokens;
}

async function main() {
  const css = await readFile(cssPath, "utf8");

  const lightTokens = parseBlockTokens(css, ":root");
  const darkTokens = parseBlockTokens(css, '[data-theme="dark"]');

  const themes = [
    { name: "light", tokens: lightTokens },
    { name: "dark", tokens: darkTokens },
  ];

  // Contrast requirements per Section 10.2:
  // 4.5:
  // - fg, fg-strong, fg-muted, fg-subtle on surface, surface-raised, surface-muted, surface-tint
  // - fg-muted and fg-strong on surface-sunken
  // - heading on surface and surface-raised
  // - link on surface, surface-raised, surface-tint, surface-muted
  // - accent-strong on accent-soft
  // - success-strong on success-soft
  // - warning-strong on warning-soft
  // - danger-strong on danger-soft
  // - highlight-strong on highlight-soft
  // - selected-fg on selected
  // - secondary-fg on secondary
  // - danger on surface-raised
  // 4.5 fixed pairs:
  // - #001a33 on #fa6f00
  // - #ffffff and #b9c6d4 on deep-from, deep-via, deep-to
  // 3.0:
  // - field on surface-raised and surface
  // - focus on surface and surface-raised
  // - accent on surface and surface-raised

  const pairsToTest = [
    // 4.5 text on surfaces
    ...["fg", "fg-strong", "fg-muted", "fg-subtle"].flatMap((fg) =>
      ["surface", "surface-raised", "surface-muted", "surface-tint"].map((bg) => ({
        fg,
        bg,
        min: 4.5,
      })),
    ),
    { fg: "fg-muted", bg: "surface-sunken", min: 4.5 },
    { fg: "fg-strong", bg: "surface-sunken", min: 4.5 },
    { fg: "heading", bg: "surface", min: 4.5 },
    { fg: "heading", bg: "surface-raised", min: 4.5 },
    ...["surface", "surface-raised", "surface-tint", "surface-muted"].map((bg) => ({
      fg: "link",
      bg,
      min: 4.5,
    })),
    { fg: "accent-strong", bg: "accent-soft", min: 4.5 },
    { fg: "success-strong", bg: "success-soft", min: 4.5 },
    { fg: "warning-strong", bg: "warning-soft", min: 4.5 },
    { fg: "danger-strong", bg: "danger-soft", min: 4.5 },
    { fg: "highlight-strong", bg: "highlight-soft", min: 4.5 },
    { fg: "selected-fg", bg: "selected", min: 4.5 },
    { fg: "secondary-fg", bg: "secondary", min: 4.5 },
    { fg: "danger", bg: "surface-raised", min: 4.5 },

    // Fixed pairs
    { fgLiteral: "#001a33", bgLiteral: "#fa6f00", name: "CTA button text/bg", min: 4.5 },
    ...["deep-from", "deep-via", "deep-to"].flatMap((bg) => [
      { fgLiteral: "#ffffff", bg, min: 4.5 },
      { fgLiteral: "#b9c6d4", bg, min: 4.5 },
    ]),

    // 3.0 pairs
    { fg: "field", bg: "surface-raised", min: 3.0 },
    { fg: "field", bg: "surface", min: 3.0 },
    { fg: "focus", bg: "surface", min: 3.0 },
    { fg: "focus", bg: "surface-raised", min: 3.0 },
    { fg: "accent", bg: "surface", min: 3.0 },
    { fg: "accent", bg: "surface-raised", min: 3.0 },
  ];

  let totalFailures = 0;

  console.log("=== WCAG Contrast Checks ===");

  for (const { name: themeName, tokens } of themes) {
    console.log(`\nTheme: ${themeName.toUpperCase()}`);
    let themeFailures = 0;

    for (const test of pairsToTest) {
      const fgColor = test.fgLiteral || tokens[test.fg];
      const bgColor = test.bgLiteral || tokens[test.bg];
      const pairName = test.name || `${test.fgLiteral || test.fg} on ${test.bgLiteral || test.bg}`;

      if (!fgColor || !bgColor) {
        console.error(`  ⚠️ Missing token for ${pairName}`);
        themeFailures++;
        totalFailures++;
        continue;
      }

      const ratio = contrastRatio(fgColor, bgColor);
      const passed = ratio >= test.min;

      if (!passed) {
        themeFailures++;
        totalFailures++;
        console.error(
          `  ❌ FAIL: ${pairName.padEnd(35)} Ratio: ${ratio.toFixed(2)}:1 (Req: ${test.min}:1) [${fgColor} on ${bgColor}]`,
        );
      }
    }

    if (themeFailures === 0) {
      console.log(`  ✅ All contrast checks passed for ${themeName} theme.`);
    }
  }

  if (totalFailures > 0) {
    console.error(`\n❌ check:contrast failed with ${totalFailures} violation(s).\n`);
    process.exit(1);
  } else {
    console.log("\ncheck:contrast OK");
  }
}

main().catch((err) => {
  console.error("check:contrast execution error:", err);
  process.exit(1);
});
