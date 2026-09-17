import { NextResponse } from "next/server";
import { getMongooseConnection } from "@/shared/db/mongoose";

export async function GET(): Promise<NextResponse> {
  try {
    const conn = await getMongooseConnection();
    await conn.db!.admin().command({ ping: 1 });
    return NextResponse.json({ status: "ok", db: true });
  } catch {
    return NextResponse.json({ status: "error", db: false }, { status: 503 });
  }
}