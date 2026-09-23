import { getSession } from "@/features/auth/lib/session";
import { getSiteForOwner } from "@/features/sites/repository";
import {
  getCustomerForOwner,
  toCustomerDTO,
  updateCustomer,
} from "@/features/customers/repository";
import { updateCustomerSchema } from "@/features/customers/schemas";
import type { CustomerDTO } from "@/features/customers/types";

export type UpdateCustomerResult =
  | { ok: true; customer: CustomerDTO }
  | {
      ok: false;
      error: "unauthorized" | "not_found" | "validation_error";
    };

export async function updateCustomerForCurrentUser(
  siteId: string,
  customerId: string,
  body: unknown
): Promise<UpdateCustomerResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "unauthorized" };

  const site = await getSiteForOwner(siteId, session.user.id);
  if (!site) return { ok: false, error: "not_found" };

  const customer = await getCustomerForOwner(
    customerId,
    siteId,
    session.user.id
  );
  if (!customer) return { ok: false, error: "not_found" };

  const parsed = updateCustomerSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const updated = await updateCustomer(customerId, siteId, parsed.data);
  if (!updated) return { ok: false, error: "not_found" };

  return { ok: true, customer: toCustomerDTO(updated) };
}
