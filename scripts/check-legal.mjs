/**
 * check-legal.mjs
 * Validates structural parity and schema conformance of legal document locales.
 *
 * Checks per namespace and language (en, fr):
 * - articles array has expected length (e.g. 15 for terms, 16 for privacy)
 * - titles match ^\d+\.  and numbers are consecutive 1, 2, 3...
 * - every article has non-empty blocks array
 * - each block entry has exactly one key ("p", "ul" or "table")
 * - p values are non-empty strings
 * - ul values are non-empty arrays of non-empty strings
 * - table values have valid head and rows
 * - article list and table requirements match lists and tables maps
 * - block-type sequence and table shape of each article is identical between en and fr (except pendingFrench)
 */

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = join(__dirname, "..");
const localesDir = join(projectRoot, "src", "i18n", "locales");

const LEGAL_NAMESPACES = ["terms", "cgv", "dpa", "privacy", "sla"];
const expected = {
  terms: 18,
  cgv: 19,
  dpa: 20,
  privacy: 16,
  sla: 19,
};
const lists = {
  terms: { 6: 7 },
  cgv: { 19: 5 },
  dpa: { 17: 9 },
  privacy: {},
  sla: {},
};
const tables = {
  dpa: {
    16: { cols: 2, rows: 7 },
    18: { cols: 2, rows: 3 },
    20: { cols: 2, rows: 2 },
  },
  privacy: {
    8: { cols: 2, rows: 8 },
  },
  sla: {
    3: { cols: 3, rows: 4 },
    9: { cols: 3, rows: 4 },
    17: { cols: 2, rows: 8 },
    18: { cols: 3, rows: 4 },
    19: { cols: 2, rows: 2 },
  },
};
const plainTitles = {
  dpa: ["Signatures"],
};
const pendingFrench = ["dpa", "privacy", "sla", "terms"];

/**
 * Validates entry titles according to numbering, annexes and plain titles rules.
 */
function validateTitles(articles, ns, fileErrors) {
  const allowedPlain = plainTitles[ns] || [];
  let stage = "numbered"; // "numbered" -> "annex" -> "plain"
  let expectedNum = 1;
  let expectedAnnexLetterCode = 65; // 'A'
  let plainIndex = 0;

  for (let idx = 0; idx < articles.length; idx++) {
    const art = articles[idx];
    const entryNum = idx + 1;

    if (!art.title || typeof art.title !== "string" || art.title.trim() === "") {
      fileErrors.push(`Article ${entryNum}: title is missing or not a non-empty string`);
      continue;
    }

    if (stage === "numbered") {
      const match = art.title.match(/^(\d+)\. /);
      if (match) {
        const num = Number(match[1]);
        if (num !== expectedNum) {
          fileErrors.push(
            `Article ${entryNum}: title "${art.title}" does not start with "${expectedNum}. "`,
          );
        }
        expectedNum++;
        continue;
      }
      stage = "annex";
    }

    if (stage === "annex") {
      const match = art.title.match(/^Annex ([A-Z]) — /);
      if (match) {
        const expectedLetter = String.fromCharCode(expectedAnnexLetterCode);
        if (match[1] !== expectedLetter) {
          fileErrors.push(
            `Article ${entryNum}: expected "Annex ${expectedLetter} — ", got "${art.title}"`,
          );
        }
        expectedAnnexLetterCode++;
        continue;
      }
      stage = "plain";
    }

    if (stage === "plain") {
      if (plainIndex < allowedPlain.length) {
        const expectedPlain = allowedPlain[plainIndex];
        if (art.title !== expectedPlain) {
          fileErrors.push(
            `Article ${entryNum}: expected plain title "${expectedPlain}", got "${art.title}"`,
          );
        }
        plainIndex++;
      } else {
        fileErrors.push(
          `Article ${entryNum}: title "${art.title}" does not match numbered, annex, or allowed plain titles`,
        );
      }
    }
  }

  if (plainIndex < allowedPlain.length) {
    fileErrors.push(
      `Missing expected plain title(s): ${allowedPlain.slice(plainIndex).join(", ")}`,
    );
  }
}

/**
 * Validates blocks structure and non-emptiness for an article.
 */
function validateBlocks(art, entryNum, fileErrors) {
  if (!Array.isArray(art.blocks) || art.blocks.length === 0) {
    fileErrors.push(`Article ${entryNum}: blocks is missing or empty`);
    return;
  }

  art.blocks.forEach((block, bIdx) => {
    const keys = Object.keys(block);
    if (keys.length !== 1 || (keys[0] !== "p" && keys[0] !== "ul" && keys[0] !== "table")) {
      fileErrors.push(
        `Article ${entryNum}, block ${bIdx + 1}: block must have exactly one key ('p', 'ul' or 'table'), got [${keys.join(", ")}]`,
      );
    } else if (keys[0] === "p") {
      if (typeof block.p !== "string" || block.p.trim() === "") {
        fileErrors.push(
          `Article ${entryNum}, block ${bIdx + 1}: 'p' value must be a non-empty string`,
        );
      }
    } else if (keys[0] === "ul") {
      if (
        !Array.isArray(block.ul) ||
        block.ul.length === 0 ||
        block.ul.some((item) => typeof item !== "string" || item.trim() === "")
      ) {
        fileErrors.push(
          `Article ${entryNum}, block ${bIdx + 1}: 'ul' value must be a non-empty array of non-empty strings`,
        );
      }
    } else if (keys[0] === "table") {
      const tbl = block.table;
      if (!tbl || typeof tbl !== "object" || Array.isArray(tbl)) {
        fileErrors.push(
          `Article ${entryNum}, block ${bIdx + 1}: 'table' value must be an object`,
        );
      } else if (
        !Array.isArray(tbl.head) ||
        tbl.head.length === 0 ||
        tbl.head.some((col) => typeof col !== "string" || col.trim() === "")
      ) {
        fileErrors.push(
          `Article ${entryNum}, block ${bIdx + 1}: 'table.head' must be a non-empty array of non-empty strings`,
        );
      } else if (
        !Array.isArray(tbl.rows) ||
        tbl.rows.length === 0 ||
        tbl.rows.some(
          (row) =>
            !Array.isArray(row) ||
            row.length !== tbl.head.length ||
            row.some((cell) => typeof cell !== "string" || cell.trim() === ""),
        )
      ) {
        fileErrors.push(
          `Article ${entryNum}, block ${bIdx + 1}: 'table.rows' must be a non-empty array of rows where each row has ${tbl.head.length} non-empty strings`,
        );
      }
    }
  });
}

async function checkLegal() {
  let hasErrors = false;

  for (const ns of LEGAL_NAMESPACES) {
    const isPendingFr = pendingFrench.includes(ns);
    if (isPendingFr) {
      console.warn(`WARN: [${ns}] French translation pending official update; parity checks skipped`);
    }

    const expectedCount = expected[ns];
    const data = {};

    for (const lng of ["en", "fr"]) {
      const filePath = join(localesDir, lng, `${ns}.json`);
      let parsed;
      try {
        const raw = await readFile(filePath, "utf-8");
        parsed = JSON.parse(raw);
        data[lng] = parsed;
      } catch (err) {
        console.error(`X [${lng}/${ns}.json] Failed to read or parse JSON: ${err.message}`);
        hasErrors = true;
        continue;
      }

      const fileErrors = [];
      const articles = parsed.articles;

      if (!Array.isArray(articles)) {
        fileErrors.push("Property 'articles' is not an array");
      } else if (lng === "fr" && isPendingFr) {
        // For a namespace in pendingFrench: the French file is checked only for well-formedness
        if (articles.length === 0) {
          fileErrors.push("Property 'articles' is an empty array");
        }
        articles.forEach((art, idx) => {
          const entryNum = idx + 1;
          if (!art.title || typeof art.title !== "string" || art.title.trim() === "") {
            fileErrors.push(`Article ${entryNum}: title is missing or not a non-empty string`);
          }
          validateBlocks(art, entryNum, fileErrors);
        });
      } else {
        // Full check (all English files, and French files not in pendingFrench)
        if (articles.length !== expectedCount) {
          fileErrors.push(`Expected ${expectedCount} articles, found ${articles.length}`);
        }

        validateTitles(articles, ns, fileErrors);

        articles.forEach((art, idx) => {
          validateBlocks(art, idx + 1, fileErrors);
        });

        // List block checks from lists[ns]
        const nsLists = lists[ns] || {};
        for (const [artNumStr, reqItems] of Object.entries(nsLists)) {
          const artNum = Number(artNumStr);
          const artIdx = artNum - 1;
          const targetArticle = articles[artIdx];
          if (targetArticle && Array.isArray(targetArticle.blocks)) {
            const ulBlocks = targetArticle.blocks.filter((b) => b.ul !== undefined);
            if (ulBlocks.length !== 1) {
              fileErrors.push(
                `Article ${artNum}: expected exactly one 'ul' block, found ${ulBlocks.length}`,
              );
            } else if (!Array.isArray(ulBlocks[0].ul) || ulBlocks[0].ul.length !== reqItems) {
              fileErrors.push(
                `Article ${artNum}: expected exactly ${reqItems} items in 'ul' block, found ${ulBlocks[0].ul?.length}`,
              );
            }
          }
        }

        // Table block checks from tables[ns]
        const nsTables = tables[ns] || {};
        for (const [artNumStr, reqTbl] of Object.entries(nsTables)) {
          const artNum = Number(artNumStr);
          const artIdx = artNum - 1;
          const targetArticle = articles[artIdx];
          if (targetArticle && Array.isArray(targetArticle.blocks)) {
            const tblBlocks = targetArticle.blocks.filter((b) => b.table !== undefined);
            if (tblBlocks.length !== 1) {
              fileErrors.push(
                `Article ${artNum}: expected exactly one 'table' block, found ${tblBlocks.length}`,
              );
            } else {
              const tbl = tblBlocks[0].table;
              if (tbl && Array.isArray(tbl.head) && Array.isArray(tbl.rows)) {
                if (tbl.head.length !== reqTbl.cols) {
                  fileErrors.push(
                    `Article ${artNum}: expected ${reqTbl.cols} columns in 'table' block, found ${tbl.head.length}`,
                  );
                }
                if (tbl.rows.length !== reqTbl.rows) {
                  fileErrors.push(
                    `Article ${artNum}: expected ${reqTbl.rows} rows in 'table' block, found ${tbl.rows.length}`,
                  );
                }
              }
            }
          }
        }
      }

      if (fileErrors.length > 0) {
        hasErrors = true;
        console.error(`X [${lng}/${ns}.json] Validation failed:`);
        fileErrors.forEach((e) => console.error(`    - ${e}`));
      } else {
        console.log(`OK: ${lng}/${ns}.json`);
      }
    }

    // Parity check between en and fr (skipped for pendingFrench)
    if (!isPendingFr && data.en && data.fr && Array.isArray(data.en.articles) && Array.isArray(data.fr.articles)) {
      const enArts = data.en.articles;
      const frArts = data.fr.articles;
      const minLen = Math.min(enArts.length, frArts.length);

      for (let i = 0; i < minLen; i++) {
        const enBlocks = enArts[i]?.blocks || [];
        const frBlocks = frArts[i]?.blocks || [];

        const enSequence = enBlocks.map((b) => Object.keys(b)[0]).join(",");
        const frSequence = frBlocks.map((b) => Object.keys(b)[0]).join(",");

        if (enSequence !== frSequence) {
          console.error(
            `X [${ns}] Block sequence mismatch in Article ${i + 1}: EN=[${enSequence}] vs FR=[${frSequence}]`,
          );
          hasErrors = true;
        }

        // Table shape parity check
        enBlocks.forEach((b, bIdx) => {
          if (b.table && frBlocks[bIdx]?.table) {
            const enTbl = b.table;
            const frTbl = frBlocks[bIdx].table;
            if (
              enTbl.head?.length !== frTbl.head?.length ||
              enTbl.rows?.length !== frTbl.rows?.length
            ) {
              console.error(
                `X [${ns}] Table shape mismatch in Article ${i + 1}, block ${bIdx + 1}: EN=[${enTbl.head?.length} cols, ${enTbl.rows?.length} rows] vs FR=[${frTbl.head?.length} cols, ${frTbl.rows?.length} rows]`,
              );
              hasErrors = true;
            }
          }
        });
      }
    }
  }

  if (hasErrors) {
    console.error("\ncheck:legal FAILED.");
    process.exit(1);
  } else {
    console.log("\ncheck:legal OK");
    process.exit(0);
  }
}

checkLegal().catch((err) => {
  console.error("Fatal error in check:legal:", err);
  process.exit(1);
});
