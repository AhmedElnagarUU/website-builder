// Server-only constants — never import from client code.
// All getters are lazy: they throw at call time, never at module import, so the
// app builds and boots without the POLAR_* secrets set (empty env values are
// fine; only checkout/webhook calls surface a provider_error at runtime).
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
 * True when the operator has finished wiring Polar's checkout credentials
 * (access token + webhook secret + org + Pro product). Polar is the only
 * payment provider; this check lets UI/ops report whether checkout is live
 * before the first payment attempt (unset values surface as provider_error).
 */
export function isPolarProCheckoutConfigured(): boolean {
  const has = (name: string): boolean => {
    const value = process.env[name];
    return typeof value === "string" && value.trim() !== "";
  };
  // Polar's standard hosted checkout only needs the PRODUCT id
  // (`products: [POLAR_PRODUCT_ID_PRO]`) — Polar resolves the applicable catalog
  // price server-side (polar.md §16: Price ID is NOT required for checkout; the
  // deprecated `product_price_id`/Price-ID-only model is Stripe-shaped). If a
  // PRICE id is ever required later, add its gate HERE only.
  return (
    has("POLAR_ACCESS_TOKEN") &&
    has("POLAR_WEBHOOK_SECRET") &&
    has("POLAR_ORGANIZATION_ID") &&
    has("POLAR_PRODUCT_ID_PRO")
  );
}