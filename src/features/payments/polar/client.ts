import { getPolarAccessToken, getPolarBaseUrl } from "./config";

export interface PolarCheckoutRequest {
  productId: string; // Polar product ID (POLAR_PRODUCT_ID_PRO)
  priceId?: string; // Polar price ID (POLAR_PRICE_ID_PRO)
  customerExternalId: string; // our PaymentRecord id → Polar customer external id
  successUrl: string;
  currency?: string; // free-form string; Polar validates against the price
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
}

interface PolarCheckoutResponse {
  id?: unknown;
  url?: unknown;
  client_secret?: unknown;
  expires_at?: unknown;
}

export class PolarProviderError extends Error {
  readonly providerCode?: string;
  readonly status?: number;

  constructor(
    message: string,
    options?: { providerCode?: string; status?: number }
  ) {
    super(message);
    this.name = "PolarProviderError";
    this.providerCode = options?.providerCode;
    this.status = options?.status;
  }
}

function safeUpstreamDetail(body: string): string {
  const cleaned = body.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  if (cleaned.length > 120) return ` ${cleaned.slice(0, 120)}…`;
  return ` ${cleaned}`;
}

export async function createCheckoutSession(req: PolarCheckoutRequest): Promise<{
  checkoutId: string; // id
  url: string; // hosted checkout URL to redirect the customer to
  clientSecret: string; // client_secret
  expiresAt?: string; // expires_at
}> {
  const payload: Record<string, unknown> = {
    products: [req.productId],
    external_customer_id: req.customerExternalId,
    success_url: req.successUrl,
  };
  // Preselect a catalog price by mapping the product to that price (current
  // Polar `/v1/checkouts/` schema: `prices` keyed by product id).
  if (req.priceId) payload.prices = { [req.productId]: [req.priceId] };
  if (req.currency) payload.currency = req.currency;
  if (req.customerEmail) payload.customer_email = req.customerEmail;
  if (req.customerName) payload.customer_name = req.customerName;
  if (req.metadata) payload.metadata = req.metadata;

  const res = await fetch(`${getPolarBaseUrl()}/v1/checkouts/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPolarAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = safeUpstreamDetail(await res.text());
    } catch {
      detail = " (unreadable response body)";
    }
    throw new PolarProviderError(
      `Polar checkout request failed with status ${res.status}${detail}`,
      { status: res.status }
    );
  }

  let data: PolarCheckoutResponse;
  try {
    data = (await res.json()) as PolarCheckoutResponse;
  } catch {
    throw new PolarProviderError(
      "Polar checkout response is not valid JSON",
      { status: res.status }
    );
  }

  if (!data.client_secret || !data.url) {
    throw new PolarProviderError(
      "Polar checkout response is missing client_secret or url",
      { status: res.status }
    );
  }

  return {
    checkoutId: String(data.id ?? ""),
    url: String(data.url),
    clientSecret: String(data.client_secret),
    expiresAt: typeof data.expires_at === "string" ? data.expires_at : undefined,
  };
}