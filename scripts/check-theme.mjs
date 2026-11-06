/**
 * check-theme.mjs
 * Validates that no raw palette classes, unpermitted color literals,
 * or obsolete CSS custom property usages exist in application code.
 *
 * Usage: node scripts/check-theme.mjs
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const srcDir = join(projectRoot, "src");

// Excluded files
const EXCLUDED_FILES = new Set([
  "src/theme/theme.js",
  "src/pages/DesignPreviewPage.jsx",
  "src/pages/UiKitPreviewPage.jsx",
]);

// Load allowlist
let allowlist = { files: {} };
try {
  const allowlistContent = await readFile(join(__dirname, "theme-allowlist.json"), "utf8");
  allowlist = JSON.parse(allowlistContent);
} catch {
  // Allowlist optional or empty
}

/**
 * Collect all JS and JSX files in dir
 */
async function collectFiles(dir) {
  const entries = await readdir(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      if (entry === "node_modules") continue;
      const nested = await collectFiles(fullPath);
      files.push(...nested);
    } else {
      const ext = extname(entry).toLowerCase();
      if (ext === ".js" || ext === ".jsx") {
        files.push(fullPath);
      }
    }
  }

  return files;
}

// Patterns to check
// 1. Raw palette classes: navy/azure/ink (any prefix except backdrop:), with or without opacity
const RAW_PALETTE_REGEX =
  /(?:^|[\s"'`])((?:(?!backdrop:)[a-zA-Z0-9:-]+:)?(?:bg|text|border|ring|divide|outline|decoration|placeholder|from|via|to|fill|stroke|accent|caret|shadow)-(?:navy|azure|ink)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/\d+)?)(?=[\s"'`:]|$)/g;

// 2. flame/sun utilities except gradient helpers from/via/to
const FLAME_SUN_REGEX =
  /(?:^|[\s"'`])((?:(?!backdrop:)[a-zA-Z0-9:-]+:)?(?:bg|text|border|ring|divide|outline|decoration|placeholder|fill|stroke|accent|caret|shadow)-(?:flame|sun)-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/\d+)?)(?=[\s"'`:]|$)/g;

// 3. bg-white, border-white, bg-black, text-black WITHOUT opacity suffix
const WHITE_BLACK_REGEX =
  /(?:^|[\s"'`])((?:(?!backdrop:)[a-zA-Z0-9:-]+:)?(?:bg-white|border-white|bg-black|text-black))(?![/\w-])(?=[\s"'`:]|$)/g;

// 4. Color literals and SVG attributes
const HEX_REGEX = /#([0-9a-fA-F]{3,8})\b/g;
const COLOR_FN_REGEX = /\b(rgb|rgba|hsl)\s*\(/g;
const SVG_WHITE_ATTR_REGEX = /\b(fill|stroke)=["']white["']/g;

// 5. var(--color-(navy|azure|ink)...) or moved roles
const VAR_COLOR_REGEX =
  /var\(--color-(?:navy|azure|ink|surface|fg|line|link|focus|success|warning|danger|selected|secondary|accent|highlight|deep|elev)(?:-[a-zA-Z0-9]+)?\)/g;

function isAllowlisted(relPath, token) {
  const fileConfig = allowlist.files?.[relPath];
  if (!fileConfig) return false;
  return fileConfig.tokens?.some((t) => token.includes(t) || t === token);
}

async function main() {
  const allFiles = await collectFiles(srcDir);
  const errors = [];

  for (const filePath of allFiles) {
    const relPath = relative(projectRoot, filePath).replace(/\\/g, "/");
    if (EXCLUDED_FILES.has(relPath)) continue;

    const content = await readFile(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Skip comment-only lines
      if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
        return;
      }

      // Check raw palette
      let match;
      RAW_PALETTE_REGEX.lastIndex = 0;
      while ((match = RAW_PALETTE_REGEX.exec(line)) !== null) {
        const token = match[1];
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "raw palette class" });
        }
      }

      // Check flame/sun non-gradient
      FLAME_SUN_REGEX.lastIndex = 0;
      while ((match = FLAME_SUN_REGEX.exec(line)) !== null) {
        const token = match[1];
        if (!isAllowlisted(relPath, token)) {
          errors.push({
            file: relPath,
            line: lineNum,
            token,
            rule: "flame/sun non-gradient class",
          });
        }
      }

      // Check white/black without opacity
      WHITE_BLACK_REGEX.lastIndex = 0;
      while ((match = WHITE_BLACK_REGEX.exec(line)) !== null) {
        const token = match[1];
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "white/black without opacity" });
        }
      }

      // Check hex literals (excluding URL query or comments)
      HEX_REGEX.lastIndex = 0;
      while ((match = HEX_REGEX.exec(line)) !== null) {
        const token = match[0];
        // Ignore if within a line comment
        const commentIdx = line.indexOf("//");
        if (commentIdx !== -1 && match.index > commentIdx) continue;
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "hex color literal" });
        }
      }

      // Check rgb/rgba/hsl
      COLOR_FN_REGEX.lastIndex = 0;
      while ((match = COLOR_FN_REGEX.exec(line)) !== null) {
        const token = match[0];
        const commentIdx = line.indexOf("//");
        if (commentIdx !== -1 && match.index > commentIdx) continue;
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "color function (rgb/hsl)" });
        }
      }

      // Check fill="white" / stroke="white"
      SVG_WHITE_ATTR_REGEX.lastIndex = 0;
      while ((match = SVG_WHITE_ATTR_REGEX.exec(line)) !== null) {
        const token = match[0];
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "white SVG attribute" });
        }
      }

      // Check var(--color-...)
      VAR_COLOR_REGEX.lastIndex = 0;
      while ((match = VAR_COLOR_REGEX.exec(line)) !== null) {
        const token = match[0];
        if (!isAllowlisted(relPath, token)) {
          errors.push({ file: relPath, line: lineNum, token, rule: "moved role var(--color-...)" });
        }
      }
    });
  }

  if (errors.length > 0) {
    console.error(`\n❌ check:theme failed with ${errors.length} error(s):\n`);
    for (const err of errors) {
      console.error(`  ${err.file}:${err.line} - [${err.rule}] ${err.token}`);
    }
    console.error(
      "\nRun the theme migration to replace raw palette classes with semantic role tokens.\n",
    );
    process.exit(1);
  } else {
    console.log("check:theme OK");
  }
}

main().catch((err) => {
  console.error("check:theme execution error:", err);
  process.exit(1);
});
