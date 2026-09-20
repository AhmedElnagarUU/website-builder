// Server-only constants — never import from client code.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not defined`);
  return value;
}

function parseIntegrationId(name: string): number {
  const raw = process.env[name] ?? process.env.PAYMOB_INTEGRATION_ID_CARD;
  if (raw === undefined || raw.trim() === "") {
    throw new Error(`${name} is not defined`);
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}

export const PAYMOB_SECRET_KEY = requireEnv("PAYMOB_SECRET_KEY");
export const PAYMOB_PUBLIC_KEY = requireEnv("PAYMOB_PUBLIC_KEY");
export const PAYMOB_HMAC_SECRET = requireEnv("PAYMOB_HMAC_SECRET");
export const PAYMOB_BASE_URL = (
  process.env.PAYMOB_BASE_URL || "https://accept.paymob.com"
).replace(/\/+$/, "");
export const PAYMOB_INTEGRATION_ID = parseIntegrationId("PAYMOB_INTEGRATION_ID");
export const PAYMOB_PAYMENT_METHODS = (
  process.env.PAYMOB_PAYMENT_METHODS || "card"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);