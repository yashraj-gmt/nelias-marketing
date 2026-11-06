/**
 * Applies French typographic spacing rules.
 * When the language is French, normal spaces before :, ;, ?, !, and » are
 * replaced with a non-breaking space (U+00A0), and « followed by a space
 * is replaced with « followed by U+00A0.
 * In every other language, the text is returned completely unchanged.
 *
 * @param {string} text - Input text
 * @param {string} [lng] - Active language code (e.g. "fr", "en")
 * @returns {string} Text with typographic adjustments applied for French
 */
export function frenchSpacing(text, lng) {
  if (typeof text !== "string" || !text) return text;
  if (!lng || !lng.startsWith("fr")) return text;

  return text.replace(/ ([;:?!»])/g, "\u00A0$1").replace(/« /g, "«\u00A0");
}
