// Server-only constants — never import from client code.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not defined`);
  return value;
}

export const PAYMOB_SECRET_KEY = requireEnv("PAYMOB_SECRET_KEY");
export const PAYMOB_PUBLIC_KEY = requireEnv("PAYMOB_PUBLIC_KEY");
export const PAYMOB_HMAC_SECRET = requireEnv("PAYMOB_HMAC_SECRET");
export const PAYMOB_BASE_URL = (
  process.env.PAYMOB_BASE_URL || "https://accept.paymob.com"
).replace(/\/+$/, "");
export const PAYMOB_PAYMENT_METHODS = (
  process.env.PAYMOB_PAYMENT_METHODS || "card"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);