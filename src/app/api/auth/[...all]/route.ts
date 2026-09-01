import { getAuth } from "@/shared/auth/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await getAuth();
  if (!auth) throw new Error("Auth not initialized");
  return auth.handler(request);
}

export async function POST(request: NextRequest): Promise<Response> {
  const auth = await getAuth();
  if (!auth) throw new Error("Auth not initialized");
  return auth.handler(request);
}