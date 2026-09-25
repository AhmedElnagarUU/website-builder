import { NextResponse } from "next/server";
import { updateLanguages } from "@/features/sites/api/update-languages";
import { withEntitlement } from "@/features/monetization/lib/entitlement";

function targetLanguageCount(rawBody: unknown): number {
  if (!rawBody || typeof rawBody !== "object") return 1;
  const choice = (rawBody as { languageChoice?: unknown }).languageChoice;
  return choice === "both" ? 2 : 1;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  return withEntitlement(
    {
      siteId,
      limitKey: "maxLanguages",
      requestedScope: { siteId, amount: targetLanguageCount(body) },
    },
    async () => {
      try {
        const result = await updateLanguages(siteId, body);
        if (result.ok) {
          return NextResponse.json(result.site, { status: 200 });
        }
        if (result.error === "unauthorized") {
          return NextResponse.json({ error: result.error }, { status: 401 });
        }
        if (result.error === "not_found") {
          return NextResponse.json({ error: result.error }, { status: 404 });
        }
        if (result.error === "content_exists") {
          return NextResponse.json({ error: result.error }, { status: 409 });
        }
        return NextResponse.json({ error: result.error }, { status: 422 });
      } catch (e) {
        console.error("updateLanguages error:", e);
        return NextResponse.json({ error: "server_error" }, { status: 500 });
      }
    }
  );
}