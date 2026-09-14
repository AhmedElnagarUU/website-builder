import { NextResponse } from "next/server";
import { getSession } from "@/features/auth/lib/session";
import { storePhoneIdentity } from "@/features/monetization/repository";
import { validateAndNormalizePhone } from "@/features/auth/lib/phone";
import { z } from "zod";

const StorePhoneSchema = z.object({
  phoneNumber: z.string().min(1),
});

/**
 * POST /api/auth/store-phone
 * Stores a verified phone number for the current user.
 * Requires an active session (phone verification must be confirmed first).
 *
 * Uses insertOne with a unique index on phoneNumber to prevent races.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = StorePhoneSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "invalid_phone" },
        { status: 400 }
      );
    }

    const normalized = validateAndNormalizePhone(result.data.phoneNumber);
    if (!normalized) {
      return NextResponse.json(
        { error: "invalid_phone", reason: "format_invalid" },
        { status: 400 }
      );
    }

    const stored = await storePhoneIdentity(
      session.user.id,
      normalized,
      new Date()
    );

    if (stored.duplicate) {
      return NextResponse.json(
        { error: "phone_already_registered" },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
