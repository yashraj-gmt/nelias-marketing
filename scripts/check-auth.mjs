/**
 * @file check-auth.mjs
 * Validation suite for auth validators and redirect safety.
 * Run with: node scripts/check-auth.mjs
 */

import {
  LIMITS,
  SIGNUP_LIMITS,
  COMMON_PASSWORD_FRAGMENTS,
  normalizeEmail,
  validateEmail,
  validateSignInPassword,
  validateSignIn,
  isSafeRedirect,
  normalizeText,
  validateFullName,
  validateCompany,
  validateCountry,
  normalizePhone,
  validatePhone,
  passwordChecks,
  validateNewPassword,
  validateConfirmPassword,
  validateTerms,
  validateSignUp,
} from "../src/lib/auth/validators.js";

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failures++;
  } else {
    console.log(`OK: ${message}`);
  }
}

console.log("=== CHECK AUTH SUITE ===\n");

// 0. LIMITS
console.log("--- 0. LIMITS ---");
assert(
  LIMITS.email === 254 && LIMITS.emailLocal === 64 && LIMITS.passwordMax === 128,
  `LIMITS matches specification (254, 64, 128)`,
);
assert(
  SIGNUP_LIMITS.fullName[0] === 2 &&
    SIGNUP_LIMITS.fullName[1] === 80 &&
    SIGNUP_LIMITS.company[0] === 2 &&
    SIGNUP_LIMITS.company[1] === 100 &&
    SIGNUP_LIMITS.passwordMin === 10,
  `SIGNUP_LIMITS matches specification`,
);
assert(
  Array.isArray(COMMON_PASSWORD_FRAGMENTS) && COMMON_PASSWORD_FRAGMENTS.includes("nelias"),
  `COMMON_PASSWORD_FRAGMENTS defined and contains "nelias"`,
);

// 1. validateEmail
console.log("\n--- 1. validateEmail ---");
const validEmails = [
  "name@company.com",
  "first.last+tag@sub.domain.co",
  "ÉLODIE@exemple.fr",
  " a@b.co ",
];
for (const email of validEmails) {
  const res = validateEmail(email);
  assert(res === null, `validateEmail("${email}") is valid (null)`);
}

const requiredEmails = ["", "   "];
for (const email of requiredEmails) {
  const res = validateEmail(email);
  assert(
    res?.code === "email.required",
    `validateEmail("${email}") returns email.required (got ${res?.code})`,
  );
}

const invalidFormatEmails = [
  "name",
  "name@",
  "@company.com",
  "name@company",
  "name@@company.com",
  "na me@company.com",
  ".name@company.com",
  "name.@company.com",
  "na..me@company.com",
  "name@-company.com",
  "name@company..com",
  "name@company.c",
];
for (const email of invalidFormatEmails) {
  const res = validateEmail(email);
  assert(
    res?.code === "email.invalid",
    `validateEmail("${email}") returns email.invalid (got ${res?.code})`,
  );
}

const longEmail = "a".repeat(245) + "@company.com"; // 245 + 12 = 257 > 254
const resLong = validateEmail(longEmail);
assert(
  resLong?.code === "email.tooLong",
  `validateEmail(>254 chars) returns email.tooLong (got ${resLong?.code})`,
);

// 2. normalizeEmail
console.log("\n--- 2. normalizeEmail & normalization ---");
const normalized = normalizeEmail("  Name@Company.COM ");
assert(
  normalized === "name@company.com",
  `normalizeEmail("  Name@Company.COM ") returns "name@company.com" (got "${normalized}")`,
);
const normText = normalizeText("  Debass   Technologies   SARL  ");
assert(
  normText === "Debass Technologies SARL",
  `normalizeText collapses whitespace correctly (got "${normText}")`,
);
const normPhone = normalizePhone("  00225 (07) 00-00.00 00  ");
assert(
  normPhone === "+2250700000000",
  `normalizePhone strips punctuation and maps 00 to + (got "${normPhone}")`,
);

// 3. validateSignInPassword
console.log("\n--- 3. validateSignInPassword ---");
const emptyPw = validateSignInPassword("");
assert(
  emptyPw?.code === "password.required",
  `validateSignInPassword("") returns password.required (got ${emptyPw?.code})`,
);

const simplePw = validateSignInPassword("x");
assert(simplePw === null, `validateSignInPassword("x") is valid (null)`);

const longPw = "p".repeat(129);
const resLongPw = validateSignInPassword(longPw);
assert(
  resLongPw?.code === "password.tooLong",
  `validateSignInPassword(129 chars) returns password.tooLong (got ${resLongPw?.code})`,
);

const spacedPw = " password with spaces ";
const resSpaced = validateSignInPassword(spacedPw);
assert(
  resSpaced === null,
  `validateSignInPassword(" password with spaces ") is accepted unchanged`,
);

// 4. validateSignIn
console.log("\n--- 4. validateSignIn ---");
const emptySignErrors = validateSignIn({ email: "", password: "" });
assert(
  emptySignErrors.email?.code === "email.required" &&
    emptySignErrors.password?.code === "password.required",
  `validateSignIn({ email: "", password: "" }) returns errors for both fields`,
);

const validSignErrors = validateSignIn({
  email: "user@nelias.app",
  password: "any-valid-password",
});
assert(
  Object.keys(validSignErrors).length === 0,
  `validateSignIn with valid pair returns empty object`,
);

// 5. isSafeRedirect
console.log("\n--- 5. isSafeRedirect ---");
const safeUrls = [
  "https://nelias.app/",
  "https://login.nelias.app/",
  "https://yourcompany.nelias.app/app",
];
for (const url of safeUrls) {
  assert(isSafeRedirect(url) === true, `isSafeRedirect("${url}") is true`);
}

const unsafeUrls = [
  "http://nelias.app",
  "https://evilnelias.app",
  "https://nelias.app.evil.com",
  "https://user:pass@nelias.app",
  "//nelias.app",
  "/dashboard",
  "javascript:alert(1)",
  "data:text/html,x",
  "",
  undefined,
];
for (const url of unsafeUrls) {
  assert(isSafeRedirect(url) === false, `isSafeRedirect(${JSON.stringify(url)}) is false`);
}

// 6. validateFullName
console.log("\n--- 6. validateFullName ---");
const validNames = ["Aïcha Koné", "Jean-Pierre O'Neil", "Marie-Claire N’Guessan"];
for (const name of validNames) {
  assert(validateFullName(name) === null, `validateFullName("${name}") is valid`);
}

const invalidNames = ["A", "Jean3", "12345", "-Jean", "J@ne", "a".repeat(81)];
for (const name of invalidNames) {
  const res = validateFullName(name);
  assert(
    res?.code === "fullName.invalid",
    `validateFullName("${name}") returns fullName.invalid (got ${res?.code})`,
  );
}

const requiredNames = ["", "  "];
for (const name of requiredNames) {
  const res = validateFullName(name);
  assert(
    res?.code === "fullName.required",
    `validateFullName("${name}") returns fullName.required (got ${res?.code})`,
  );
}

// 7. validateCompany
console.log("\n--- 7. validateCompany ---");
const validCompanies = ["Debass Technologies SARL", "A&B (Abidjan) 2", "L'Atelier"];
for (const comp of validCompanies) {
  assert(validateCompany(comp) === null, `validateCompany("${comp}") is valid`);
}

const invalidCompanies = ["X", "12345", "<script>", "a".repeat(101), "Company\nName"];
for (const comp of invalidCompanies) {
  const res = validateCompany(comp);
  assert(
    res?.code === "company.invalid",
    `validateCompany("${comp.replace(/\n/g, "\\n")}") returns company.invalid (got ${res?.code})`,
  );
}
assert(
  validateCompany("")?.code === "company.required",
  `validateCompany("") returns company.required`,
);

// 8. validateCountry
console.log("\n--- 8. validateCountry ---");
assert(
  validateCountry("CI", ["CI", "SN"]) === null,
  `validateCountry("CI", ["CI","SN"]) is valid (null)`,
);
assert(
  validateCountry("", ["CI", "SN"])?.code === "country.required",
  `validateCountry("") returns country.required`,
);
assert(
  validateCountry("XX", ["CI", "SN"])?.code === "country.invalid",
  `validateCountry("XX", ["CI","SN"]) returns country.invalid`,
);

// 9. validatePhone
console.log("\n--- 9. validatePhone ---");
assert(validatePhone("") === null, `validatePhone("") is valid (null)`);
const validPhones = ["+225 00 00 00 00 00", "0033 1 23 45 67 89", "+1 (415) 555-0100"];
for (const p of validPhones) {
  assert(validatePhone(p) === null, `validatePhone("${p}") is valid (null)`);
}

const invalidPhones = ["0505050505", "+0123456789", "+22", "+225abc", "+1" + "9".repeat(19)];
for (const p of invalidPhones) {
  const res = validatePhone(p);
  assert(
    res?.code === "phone.invalid",
    `validatePhone("${p}") returns phone.invalid (got ${res?.code})`,
  );
}

// 10. validateNewPassword
console.log("\n--- 10. validateNewPassword ---");
assert(
  validateNewPassword("")?.code === "password.required",
  `validateNewPassword("") returns password.required`,
);
assert(
  validateNewPassword("Short1a")?.code === "password.tooShort",
  `validateNewPassword("Short1a") returns password.tooShort`,
);
assert(
  validateNewPassword("alllowercase12")?.code === "password.noCase",
  `validateNewPassword("alllowercase12") returns password.noCase`,
);
assert(
  validateNewPassword("NoDigitsHereAb")?.code === "password.noDigit",
  `validateNewPassword("NoDigitsHereAb") returns password.noDigit`,
);
assert(
  validateNewPassword("Marketing2026x", { email: "marketing@co.com" })?.code ===
    "password.containsEmail",
  `validateNewPassword("Marketing2026x", { email: "marketing@co.com" }) returns password.containsEmail`,
);
assert(
  validateNewPassword("Nelias2026Strong")?.code === "password.common",
  `validateNewPassword("Nelias2026Strong") returns password.common`,
);
assert(
  validateNewPassword("Qwerty12345Ab")?.code === "password.common",
  `validateNewPassword("Qwerty12345Ab") returns password.common`,
);
assert(
  validateNewPassword("Tr0ub4dor-Horse") === null,
  `validateNewPassword("Tr0ub4dor-Horse") is valid (null)`,
);
assert(
  validateNewPassword("A1" + "a".repeat(127))?.code === "password.tooLong",
  `validateNewPassword(129 chars) returns password.tooLong`,
);
assert(
  validateNewPassword("  Valid1Passw0rd  ") === null,
  `validateNewPassword("  Valid1Passw0rd  ") spaces kept, is valid (null)`,
);

// 11. validateConfirmPassword
console.log("\n--- 11. validateConfirmPassword ---");
assert(
  validateConfirmPassword("abc", "abd")?.code === "confirm.mismatch",
  `validateConfirmPassword("abc", "abd") returns confirm.mismatch`,
);
assert(
  validateConfirmPassword("", "abd")?.code === "confirm.required",
  `validateConfirmPassword("", "abd") returns confirm.required`,
);
assert(
  validateConfirmPassword("match123", "match123") === null,
  `validateConfirmPassword("match123", "match123") is valid (null)`,
);

// 12. validateTerms
console.log("\n--- 12. validateTerms ---");
assert(validateTerms(false)?.code === "terms.required", `validateTerms(false) returns terms.required`);
assert(validateTerms(true) === null, `validateTerms(true) is valid (null)`);

// 13. passwordChecks
console.log("\n--- 13. passwordChecks ---");
const checksValid = passwordChecks("Abcdefghi1");
assert(
  checksValid.length === true && checksValid.case === true && checksValid.digit === true,
  `passwordChecks("Abcdefghi1") returns { length: true, case: true, digit: true }`,
);
const checksInvalid = passwordChecks("abc");
assert(
  checksInvalid.length === false && checksInvalid.case === false && checksInvalid.digit === false,
  `passwordChecks("abc") returns all false`,
);

// 14. validateSignUp
console.log("\n--- 14. validateSignUp ---");
const validSignUpData = {
  fullName: "Aïcha Koné",
  email: "aicha@company.ci",
  company: "Koné Trading",
  country: "CI",
  phone: "+225 07 00 00 00 00",
  password: "Tr0ub4dor-Horse",
  confirm: "Tr0ub4dor-Horse",
  terms: true,
};
const validSignUpErrors = validateSignUp(validSignUpData, { countries: ["CI", "SN"] });
assert(
  Object.keys(validSignUpErrors).length === 0,
  `validateSignUp with valid object returns empty object`,
);

const emptySignUpErrors = validateSignUp({}, { countries: ["CI", "SN"] });
assert(
  emptySignUpErrors.fullName?.code === "fullName.required" &&
    emptySignUpErrors.email?.code === "email.required" &&
    emptySignUpErrors.company?.code === "company.required" &&
    emptySignUpErrors.country?.code === "country.required" &&
    emptySignUpErrors.password?.code === "password.required" &&
    emptySignUpErrors.confirm?.code === "confirm.required" &&
    emptySignUpErrors.terms?.code === "terms.required" &&
    emptySignUpErrors.phone === undefined,
  `validateSignUp with empty object returns errors for required fields and none for phone`,
);

console.log("\n================================");
if (failures > 0) {
  console.error(`check:auth FAILED (${failures} failures)`);
  process.exit(1);
} else {
  console.log("check:auth OK");
  process.exit(0);
}
