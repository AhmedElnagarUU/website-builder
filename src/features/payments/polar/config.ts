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