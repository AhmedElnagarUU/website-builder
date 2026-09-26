export type PaywallReason =
  | "limit_reached"
  | "requires_upgrade"
  | "account_frozen"
  | "account_suspended"
  | "trial_expired";

export interface PaywallInfo {
  reason: PaywallReason;
  plan: "free" | "pro";
  limitKey: string;
}

const PAYWALL_REASONS: PaywallReason[] = [
  "limit_reached",
  "requires_upgrade",
  "account_frozen",
  "account_suspended",
  "trial_expired",
];

export async function paywallFromResponse(
  res: Response
): Promise<PaywallInfo | null> {
  if (res.status !== 402 && res.status !== 403) return null;
  const body: unknown = await res.json().catch(() => null);
  if (!body || typeof body !== "object") return null;
  const { error: reason, plan, limitKey } = body as {
    error?: unknown;
    plan?: unknown;
    limitKey?: unknown;
  };
  if (typeof reason !== "string" || !PAYWALL_REASONS.includes(reason as PaywallReason)) {
    return null;
  }
  return {
    reason: reason as PaywallReason,
    plan: plan === "pro" ? "pro" : "free",
    limitKey: typeof limitKey === "string" ? limitKey : "",
  };
}