import { NextResponse } from "next/server";
import { requestImageUpload } from "@/features/images/api/request-image-upload";
import { withEntitlement } from "@/features/monetization/lib/entitlement";
import type { RequestedScope } from "@/features/monetization/types";

function fileSizeScope(rawBody: unknown): RequestedScope | undefined {
  if (!rawBody || typeof rawBody !== "object") return undefined;
  const fileSize = (rawBody as { fileSize?: unknown }).fileSize;
  return typeof fileSize === "number" && fileSize > 0 ? fileSize : undefined;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const scope = fileSizeScope(body);

  return withEntitlement(
    { siteId, limitKey: "maxImageBytes", requestedScope: scope },
    async () => {
      const result = await requestImageUpload(siteId, body);

      if (result.ok) {
        return NextResponse.json({ uploadUrl: result.uploadUrl, s3Key: result.s3Key }, { status: 200 });
      }
      if (result.error === "unauthorized") {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }
      if (result.error === "not_found") {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
      return NextResponse.json({ error: result.error }, { status: 422 });
    }
  );
}