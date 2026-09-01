import { NextResponse } from "next/server";
import { getMongoClient } from "@/shared/db/client";

export async function GET(): Promise<NextResponse> {
  try {
    const client = await getMongoClient();
    await client.db().command({ ping: 1 });
    return NextResponse.json({ status: "ok", db: true });
  } catch {
    return NextResponse.json({ status: "error", db: false }, { status: 503 });
  }
}