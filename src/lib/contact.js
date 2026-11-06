/**
 * Format phone number as a tel: href.
 * Retains only digits and an optional leading '+'.
 * @param {string} phone
 * @returns {string}
 */
export function toTelHref(phone) {
  if (!phone || typeof phone !== "string") return "";
  const cleaned = phone.trim().replace(/(?!^\+)[^\d]/g, "");
  return `tel:${cleaned}`;
}

/**
 * Format phone number as a WhatsApp wa.me link.
 * Retains digits only (no '+').
 * @param {string} number
 * @returns {string}
 */
export function toWhatsAppHref(number) {
  if (!number || typeof number !== "string") return "";
  const cleaned = number.replace(/\D/g, "");
  return `https://wa.me/${cleaned}`;
}
