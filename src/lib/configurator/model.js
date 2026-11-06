import { LIMITS, PLAN_IDS, SIZE_IDS, STORAGE_OPTIONS, BILLING } from "./constants.js";

/**
 * Returns default initial configurator state.
 */
export function defaultState() {
  return {
    industry: "",
    activity: "",
    country: "",
    companySize: "",
    modules: [],
    modulesTouched: false,
    users: 5,
    entities: 1,
    storage: 10,
    plan: "",
    addOns: [],
    connectors: [],
    billing: "monthly",
  };
}

/**
 * Clamps a numeric value between min and max after rounding.
 * @param {any} val
 * @param {number} min
 * @param {number} max
 * @param {number} fallback
 * @returns {number}
 */
function clampNumber(val, min, max, fallback) {
  const num = typeof val === "number" ? val : parseInt(val, 10);
  if (Number.isNaN(num)) return fallback;
  const rounded = Math.round(num);
  return Math.max(min, Math.min(max, rounded));
}

/**
 * Sanitizes and validates a raw configurator state against allowed catalogs.
 *
 * @param {any} raw
 * @param {Object} valid
 * @param {string[]} [valid.industries]
 * @param {string[]} [valid.modules]
 * @param {string[]} [valid.areas]
 * @param {string[]} [valid.countries]
 * @param {string[]} [valid.addOns]
 * @param {string[]} [valid.connectors]
 * @returns {ReturnType<typeof defaultState>}
 */
export function sanitizeState(raw, valid = {}) {
  const d = defaultState();
  if (!raw || typeof raw !== "object") return d;

  const validIndustries = Array.isArray(valid.industries) ? valid.industries : [];
  const validModules = Array.isArray(valid.modules)
    ? valid.modules
    : Array.isArray(valid.areas)
      ? valid.areas
      : [];
  const validCountries = Array.isArray(valid.countries) ? valid.countries : [];
  const validAddOns = Array.isArray(valid.addOns) ? valid.addOns : [];
  const validConnectors = Array.isArray(valid.connectors) ? valid.connectors : [];

  // Industry: must be in valid list or "other"
  let industry = "";
  if (typeof raw.industry === "string") {
    const trimmed = raw.industry.trim();
    if (validIndustries.includes(trimmed) || trimmed === "other") {
      industry = trimmed;
    }
  }

  // Activity: free text trimmed and truncated to activity limit
  let activity = "";
  if (typeof raw.activity === "string") {
    activity = raw.activity.trim().slice(0, LIMITS.activity);
  }

  // Country
  let country = "";
  if (typeof raw.country === "string") {
    const trimmed = raw.country.trim();
    if (validCountries.includes(trimmed)) {
      country = trimmed;
    }
  }

  // Company size
  let companySize = "";
  if (typeof raw.companySize === "string") {
    const trimmed = raw.companySize.trim();
    if (SIZE_IDS.includes(trimmed)) {
      companySize = trimmed;
    }
  }

  // Modules / legacy functions
  const sanitizeList = (list, allowed) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    const result = [];
    for (const item of list) {
      if (typeof item === "string") {
        const trimmed = item.trim();
        if (allowed.includes(trimmed) && !seen.has(trimmed)) {
          seen.add(trimmed);
          result.push(trimmed);
        }
      }
    }
    return result;
  };

  let modulesTouched = false;
  let rawModules = null;

  if (typeof raw.modulesTouched === "boolean") {
    modulesTouched = raw.modulesTouched;
    rawModules = raw.modules;
  } else if (Array.isArray(raw.modules)) {
    modulesTouched = true;
    rawModules = raw.modules;
  } else if (Array.isArray(raw.functions)) {
    // Legacy support for functions
    modulesTouched = true;
    rawModules = raw.functions;
  }

  const modules = modulesTouched ? sanitizeList(rawModules, validModules).slice(0, 12) : [];

  const addOns = sanitizeList(raw.addOns, validAddOns);
  const connectors = sanitizeList(raw.connectors, validConnectors);

  // Numbers clamped
  const users = clampNumber(raw.users, LIMITS.users.min, LIMITS.users.max, d.users);
  const entities = clampNumber(raw.entities, LIMITS.entities.min, LIMITS.entities.max, d.entities);

  // Storage
  let storage = d.storage;
  if (STORAGE_OPTIONS.includes(raw.storage)) {
    storage = raw.storage;
  } else if (typeof raw.storage === "string" && raw.storage === "more") {
    storage = "more";
  } else {
    const parsedStorage = parseInt(raw.storage, 10);
    if (STORAGE_OPTIONS.includes(parsedStorage)) {
      storage = parsedStorage;
    }
  }

  // Plan
  let plan = "";
  if (typeof raw.plan === "string" && PLAN_IDS.includes(raw.plan.trim())) {
    plan = raw.plan.trim();
  }

  // Billing
  let billing = d.billing;
  if (typeof raw.billing === "string" && BILLING.includes(raw.billing.trim())) {
    billing = raw.billing.trim();
  }

  return {
    industry,
    activity,
    country,
    companySize,
    modules,
    modulesTouched,
    users,
    entities,
    storage,
    plan,
    addOns,
    connectors,
    billing,
  };
}

/**
 * Encodes a configurator state into a URL-safe Base64 string without padding.
 * @param {Object} state
 * @returns {string}
 */
export function encodeState(state) {
  try {
    const jsonStr = JSON.stringify(state);
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

/**
 * Decodes a URL-safe Base64 string into a plain object.
 * Returns null on any error or if decoded string exceeds 4000 characters.
 * @param {string} text
 * @returns {Object|null}
 */
export function decodeState(text) {
  if (!text || typeof text !== "string" || text.length > 4000) {
    return null;
  }

  try {
    let base64 = text.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    if (jsonStr.length > 4000) {
      return null;
    }
    const parsed = JSON.parse(jsonStr);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
