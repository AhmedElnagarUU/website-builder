import mongoose from "mongoose";
import { CustomerModel } from "./customer.schema";
import { ServiceRequestModel } from "@/features/requests/request.schema";
import type { Customer, CustomerDTO, CustomerListItemDTO } from "./types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

export function toCustomerDTO(customer: Customer): CustomerDTO {
  return {
    _id: customer._id.toString(),
    siteId: customer.siteId.toString(),
    name: customer.name,
    email: customer.email ?? null,
    phone: customer.phone ?? null,
    notes: customer.notes ?? [],
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
  };
}

export function toCustomerListItemDTO(
  customer: Customer,
  requestCount: number
): CustomerListItemDTO {
  return {
    ...toCustomerDTO(customer),
    requestCount,
  };
}

export async function createCustomer(input: {
  siteId: string;
  ownerId: string;
  name: string;
  email: string | null;
  phone: string | null;
}): Promise<Customer> {
  const now = new Date();
  const doc = await CustomerModel.create({
    siteId: toObjectId(input.siteId),
    ownerId: toObjectId(input.ownerId),
    name: input.name,
    email: input.email ?? null,
    phone: input.phone ?? null,
    notes: [],
    createdAt: now,
    updatedAt: now,
  });
  return doc as unknown as Customer;
}

export async function getCustomerForOwner(
  id: string,
  siteId: string,
  ownerId: string
): Promise<Customer | null> {
  return (await CustomerModel.findOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  }).lean()) as unknown as Customer | null;
}

export async function findCustomerByIdentity(
  siteId: string,
  email?: string,
  phone?: string
): Promise<Customer | null> {
  const or: mongoose.FilterQuery<unknown>[] = [];
  if (email) or.push({ email });
  if (phone) or.push({ phone });
  if (or.length === 0) return null;
  return (await CustomerModel.findOne({
    siteId: toObjectId(siteId),
    $or: or,
  }).lean()) as unknown as Customer | null;
}

export async function listCustomersForSite(siteId: string): Promise<Customer[]> {
  return (await CustomerModel.find({ siteId: toObjectId(siteId) })
    .sort({ createdAt: -1 })
    .lean()) as unknown as Customer[];
}

export async function searchCustomers(
  siteId: string,
  query: string
): Promise<Customer[]> {
  const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  return (await CustomerModel.find({
    siteId: toObjectId(siteId),
    $or: [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ],
  })
    .sort({ createdAt: -1 })
    .lean()) as unknown as Customer[];
}

export async function countCustomersForSite(siteId: string): Promise<number> {
  return CustomerModel.countDocuments({ siteId: toObjectId(siteId) });
}

export async function countNewCustomersForSite(
  siteId: string,
  since: Date
): Promise<number> {
  return CustomerModel.countDocuments({
    siteId: toObjectId(siteId),
    createdAt: { $gte: since },
  });
}

export async function countRequestsForCustomer(customerId: string): Promise<number> {
  return ServiceRequestModel.countDocuments({
    customerId: toObjectId(customerId),
  });
}

export async function countRequestsForCustomers(
  customerIds: string[]
): Promise<Map<string, number>> {
  const result = await ServiceRequestModel.aggregate([
    {
      $match: {
        customerId: { $in: customerIds.map(toObjectId) },
      },
    },
    {
      $group: {
        _id: "$customerId",
        count: { $sum: 1 },
      },
    },
  ]);
  const map = new Map<string, number>();
  for (const r of result) {
    map.set(r._id.toString(), r.count);
  }
  return map;
}

export async function updateCustomer(
  id: string,
  siteId: string,
  patch: Partial<Pick<Customer, "name" | "email" | "phone" | "notes">>,
): Promise<Customer | null> {
  const doc = await CustomerModel.findOneAndUpdate(
    { _id: toObjectId(id), siteId: toObjectId(siteId) },
    { $set: { ...patch, updatedAt: new Date() } },
    { new: true }
  ).lean();
  return (doc as unknown as Customer) ?? null;
}

export async function deleteCustomer(id: string, siteId: string): Promise<boolean> {
  const result = await CustomerModel.deleteOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
  });
  return result.deletedCount === 1;
}

export { toObjectId };
