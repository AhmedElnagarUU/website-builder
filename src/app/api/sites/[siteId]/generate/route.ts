import { NextResponse } from "next/server";
import { startGeneration } from "@/features/generation/api/start-generation";
import { withEntitlement } from "@/features/monetization/lib/entitlement";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  return withEntitlement(
    { siteId, limitKey: "dailyAiGenerations" },
    async () => {
      const result = await startGeneration(siteId);
      if (result.ok) {
        return NextResponse.json({ accepted: true }, { status: 202 });
      }
      if (result.error === "unauthorized") {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      if (result.error === "not_found") {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
  );
}