// Maps Polar webhook event types to the app's PaymentWebhookResult status
// semantics. Invariant (EPIC 24): only `order.paid` / `subscription.active`
// may restore access (status "paid"). All other events map to "failed" or
// "pending" (no-op on the PaymentRecord); subscription-level transitions
// (canceled/revoked/past_due) are handled by the webhook processing layer
// (POLAR-M04), never behind a "paid".
export type PolarWebhookEvent =
  | "order.paid"
  | "order.failed"
  | "subscription.active"
  | "subscription.created"
  | "subscription.canceled"
  | "subscription.revoked"
  | "subscription.past_due"
  | "customer.state_changed";

export function statusFromPolarEvent(eventType: string): "paid" | "failed" | "pending" {
  switch (eventType) {
    case "order.paid":
    case "subscription.active":
      return "paid"; // the only two events that restore access
    case "order.failed":
      return "failed";
    case "subscription.canceled":
    case "subscription.revoked":
    case "subscription.past_due":
    case "customer.state_changed":
      return "pending"; // no money movement on the PaymentRecord
    default:
      return "pending"; // unknown events are ignored safely
  }
}