// Server-side admin check for payment verification. The allow-list lives in
// env (ADMIN_EMAILS, comma-separated) — never in code. An empty/unset list
// means no one can verify: the endpoint is inert until configured.
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.length > 0 && allowed.includes(email.trim().toLowerCase());
}