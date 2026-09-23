import { NextResponse } from "next/server";
import { submitPublicRequest } from "@/features/requests/api/submit-public-request";

const RATE_LIMIT: Record<string, { count: number; reset: number }> = {};
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT[ip];
  if (!entry || entry.reset < now) {
    RATE_LIMIT[ip] = { count: 1, reset: now + RATE_LIMIT_WINDOW };
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;
  const ip = getClientIP(request);

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const result = await submitPublicRequest(slug, body);
  if (result.ok) {
    return NextResponse.json(result);
  }
  if (result.error === "validation_error")
    return NextResponse.json({ error: "Validation error" }, { status: 422 });
  if (result.error === "not_live")
    return NextResponse.json({ error: "Site not live" }, { status: 404 });
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
