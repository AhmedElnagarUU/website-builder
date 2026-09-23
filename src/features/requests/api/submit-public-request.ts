import { getSiteBySlug } from "@/features/sites/repository";
import { submitPublicRequestSchema } from "@/features/requests/schemas";
import {
  findCustomerByIdentity,
  createCustomer,
} from "@/features/customers/repository";
import { createRequest } from "@/features/requests/repository";
import { findActiveService } from "@/features/services/repository";
import mongoose from "mongoose";

export type SubmitPublicRequestResult =
  | { ok: true; requestId: string }
  | { ok: false; error: "not_found" | "not_live" | "validation_error" };

export async function submitPublicRequest(
  slug: string,
  body: unknown
): Promise<SubmitPublicRequestResult> {
  const parsed = submitPublicRequestSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "validation_error" };

  const { name, email, phone, serviceId, message } = parsed.data;

  // Resolve site by slug — must be published with a snapshot
  const site = await getSiteBySlug(slug);
  if (!site) return { ok: false, error: "not_found" };
  if (site.status !== "published" || !site.publishedSnapshot)
    return { ok: false, error: "not_live" };

  const siteId = site._id.toString();
  const ownerId = site.ownerId.toString();

  // If serviceId provided, verify it is active and belongs to the site
  let resolvedServiceId: string | null = null;
  if (serviceId) {
    if (!mongoose.Types.ObjectId.isValid(serviceId))
      return { ok: false, error: "validation_error" };
    const service = await findActiveService(siteId, serviceId);
    if (!service) return { ok: false, error: "not_found" };
    resolvedServiceId = serviceId;
  }

  // Find existing customer by email or phone within the site (dedup)
  let customer = await findCustomerByIdentity(
    siteId,
    email ?? undefined,
    phone ?? undefined
  );

  if (!customer) {
    customer = await createCustomer({
      siteId,
      ownerId,
      name,
      email: email ?? null,
      phone: phone ?? null,
    });
  }

  const request = await createRequest({
    siteId,
    ownerId,
    customerId: customer._id.toString(),
    serviceId: resolvedServiceId,
    message,
  });

  return { ok: true, requestId: request._id.toString() };
}
