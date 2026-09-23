import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import { getRequestForOwner, addRequestNote } from "@/features/requests/repository";
import { addRequestNoteSchema } from "@/features/requests/schemas";

export type AddRequestNoteResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "not_found" | "validation_error" };

export async function addRequestNoteForCurrentUser(
  siteId: string,
  requestId: string,
  body: unknown
): Promise<AddRequestNoteResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  // Verify request belongs to this site and user
  const request = await getRequestForOwner(requestId, siteId, session.user.id);
  if (!request) return { ok: false, error: "not_found" };

  const parsed = addRequestNoteSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  await addRequestNote(requestId, siteId, parsed.data.note, session.user.id);
  return { ok: true };
}
