import { NextResponse } from "next/server";
import { findPhoneIdentity } from "@/features/monetization/repository";
import { validateAndNormalizePhone } from "@/features/auth/lib/phone";
import { z } from "zod";

const CheckPhoneSchema = z.object({
  phoneNumber: z.string().min(1),
});

/**
 * POST /api/auth/check-phone
 * Checks if a phone number is already registered (verified) in the system.
 * Used during signup to prevent trial abuse.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = CheckPhoneSchema.safeParse(body);
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

    const existing = await findPhoneIdentity(normalized);
    if (existing) {
      return NextResponse.json(
        { available: false, reason: "phone_already_registered" }
      );
    }

    return NextResponse.json({ available: true });
  } catch {
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
