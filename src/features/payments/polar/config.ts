// Server-only constants — never import from client code.
// All getters are lazy: they throw at call time, never at module import, so the
// app builds and boots without the POLAR_* secrets set (mirrors the Paymob
// lazy-import pattern in checkout.ts; empty env values are fine).
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not defined`);
  return value;
}

export function getPolarAccessToken(): string {
  return requireEnv("POLAR_ACCESS_TOKEN");
}

export function getPolarWebhookSecret(): string {
  return requireEnv("POLAR_WEBHOOK_SECRET");
}

export function getPolarOrganizationId(): string {
  return requireEnv("POLAR_ORGANIZATION_ID");
}

export function getPolarProductIdPro(): string {
  return requireEnv("POLAR_PRODUCT_ID_PRO");
}

export function getPolarPriceIdPro(): string {
  return requireEnv("POLAR_PRICE_ID_PRO");
}

/**
 * True when the operator has completed Polar's ENV wiring: an org + the Pro
 * product AND price IDs are all configured. This is the seam's flip-condition —
 * `getDefaultProvider()` routes checkout to Polar only when this reads true and
 * falls back to Paymob otherwise, so the app keeps working (and can be rolled
 * back by clearing the IDs) until all POLAR_* values are live.
 */
export function isPolarConfigured(): boolean {
  const token = (process.env.POLAR_ACCESS_TOKEN || "").trim();
  const org = (process.env.POLAR_ORGANIZATION_ID || "").trim();
  const product = (process.env.POLAR_PRODUCT_ID_PRO || "").trim();
  const price = (process.env.POLAR_PRICE_ID_PRO || "").trim();
  const secret = (process.env.POLAR_WEBHOOK_SECRET || "").trim();
  return Boolean(token && org && product && price && secret);
}

export function getPolarServer(): "sandbox" | "production" {
  const raw = (process.env.POLAR_SERVER || "production").trim();
  if (raw === "sandbox") return "sandbox";
  if (raw === "production") return "production";
  throw new Error("POLAR_SERVER must be 'sandbox' or 'production'");
}

export function getPolarBaseUrl(): string {
  const explicit = process.env.POLAR_BASE_URL;
  if (explicit && explicit.trim() !== "") {
    return explicit.trim().replace(/\/+$/, "");
  }
  return getPolarServer() === "sandbox"
    ? "https://sandbox-api.polar.sh"
    : "https://api.polar.sh";
}

/**
 * True when the operator has finished wiring Polar's real checkout credentials
 * (access token + webhook secret + org + Pro product + Pro price). This is the
 * seam's flip-condition: `getDefaultProvider()` in `api/checkout.ts` routes
 * checkout to Polar only when this reads true, falling back to Paymob
 * otherwise — so the app keeps building AND keeps serving Paymob until every
 * POLAR_* value is live, and rolls back the instant any is cleared.
 */
export function isPolarProCheckoutConfigured(): boolean {
  const has = (name: string): boolean => {
    const value = process.env[name];
    return typeof value === "string" && value.trim() !== "";
  };
  return (
    has("POLAR_ACCESS_TOKEN") &&
    has("POLAR_WEBHOOK_SECRET") &&
    has("POLAR_ORGANIZATION_ID") &&
    has("POLAR_PRODUCT_ID_PRO") &&
    has("POLAR_PRICE_ID_PRO")
  );
}