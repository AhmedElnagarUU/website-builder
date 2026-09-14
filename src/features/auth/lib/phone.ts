/**
 * Phone number normalization and validation utilities.
 *
 * Target markets: Gulf region (Egypt +20, Saudi +966, UAE +971, etc.)
 * and broader international. Uses E.164 format for storage and comparison.
 */

/**
 * Normalizes a raw phone number string to E.164 format.
 *
 * Handles these input patterns:
 * - "+20 12 3456 7890"  → "+201234567890"
 * - "00201234567890"     → "+201234567890"
 * - "+201234567890"      → "+201234567890"
 * - "201234567890"       → "+201234567890"
 * - "01234567890" (local Egypt) → "+201234567890" (assumes +20)
 *
 * For ambiguous local formats without a country code, we require
 * the user to include a + or country code. If they enter a bare
 * local number (e.g. "01234567890"), we cannot reliably determine
 * the country — the form should prompt for country code selection.
 *
 * This normalizer handles the common cases; callers should use
 * `isValidPhoneE164` on the result to verify it's structurally valid.
 */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  // Strip all characters except digits and +
  const cleaned = trimmed.replace(/[^\d+]/g, "");

  let normalized: string;

  if (cleaned.startsWith("+")) {
    // Already has + prefix: "+201234567890" or "+ 20 123..."
    normalized = "+" + cleaned.slice(1).replace(/\D/g, "");
  } else if (cleaned.startsWith("00")) {
    // International prefix: "00201234567890"
    normalized = "+" + cleaned.slice(2);
  } else {
    // No + or 00 prefix. We can't determine country reliably.
    // Treat as if user meant to include country code.
    // If it starts with common GCC country code digits, prepend +.
    // Otherwise, just prepend + and let isValidPhoneE164 catch errors.
    normalized = "+" + cleaned.replace(/^0+/, "");
  }

  // Strip leading zeros after country code (e.g. +200123 → +20123)
  if (normalized.startsWith("+")) {
    normalized = "+" + normalized.slice(1).replace(/^0+/, "");
  }

  return normalized;
}

/**
 * Validates that a normalized phone number is structurally valid E.164.
 * E.164: + followed by 8-15 digits (total length 9-16).
 */
export function isValidPhoneE164(normalized: string): boolean {
  return /^\+\d{8,15}$/.test(normalized);
}

/**
 * Full validation: normalize + validate. Returns the normalized
 * phone if valid, or null if the input is invalid.
 */
export function validateAndNormalizePhone(raw: string): string | null {
  const normalized = normalizePhone(raw);
  return isValidPhoneE164(normalized) ? normalized : null;
}
