import { PAYMOB_BASE_URL, PAYMOB_SECRET_KEY } from "./config";

export interface PaymobIntentionRequest {
  amount: number; // minor units (EGP 499 → 49900)
  currency: string; // "EGP"
  paymentMethods: number[]; // Paymob Integration ID(s), not UI method names
  items: { name: string; amount: number; description?: string }[];
  billingData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number: string;
  };
  notificationUrl?: string;
  specialReference?: string; // our PaymentRecord id
}

interface PaymobIntentionResponse {
  id?: unknown;
  intention_order_id?: unknown;
  client_secret?: unknown;
}

export class PaymobProviderError extends Error {
  readonly providerCode?: string;
  readonly status?: number;

  constructor(
    message: string,
    options?: { providerCode?: string; status?: number }
  ) {
    super(message);
    this.name = "PaymobProviderError";
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

export async function createPaymobIntention(req: PaymobIntentionRequest): Promise<{
  intentionId: string; // id
  orderId: string; // intention_order_id
  clientSecret: string; // client_secret
}> {
  if (!req.billingData.phone_number || !req.billingData.phone_number.trim()) {
    throw new PaymobProviderError("billing phone_number is required");
  }

  const payload: Record<string, unknown> = {
    amount: req.amount,
    currency: req.currency,
    payment_methods: req.paymentMethods,
    items: req.items,
    billing_data: req.billingData,
  };
  if (req.notificationUrl) payload.notification_url = req.notificationUrl;
  if (req.specialReference) payload.special_reference = req.specialReference;

  const res = await fetch(`${PAYMOB_BASE_URL}/v1/intention/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${PAYMOB_SECRET_KEY}`,
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
    throw new PaymobProviderError(
      `Paymob intention request failed with status ${res.status}${detail}`,
      { status: res.status }
    );
  }

  let data: PaymobIntentionResponse;
  try {
    data = (await res.json()) as PaymobIntentionResponse;
  } catch {
    throw new PaymobProviderError(
      "Paymob intention response is not valid JSON",
      { status: res.status }
    );
  }

  if (!data.client_secret) {
    throw new PaymobProviderError(
      "Paymob intention response is missing client_secret",
      { status: res.status }
    );
  }

  return {
    intentionId: String(data.id ?? ""),
    orderId: String(data.intention_order_id ?? ""),
    clientSecret: String(data.client_secret),
  };
}