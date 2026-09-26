import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { createS3Client, isImageKeyForSite, S3_BUCKET } from "@/features/images/lib/s3";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ siteId: string }> }
): Promise<Response> {
  const { siteId } = await params;
  const url = new URL(request.url);
  const s3Key = url.searchParams.get("key");

  if (!s3Key) {
    return NextResponse.json({ error: "missing_key" }, { status: 400 });
  }

  if (!isImageKeyForSite(siteId, s3Key)) {
    return NextResponse.json({ error: "invalid_key" }, { status: 400 });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const client = createS3Client();
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET!,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    return NextResponse.json({ signedUrl }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "config_error" }, { status: 500 });
  }
}
