import mongoose from "mongoose";
import { ServiceModel } from "./service.schema";
import { ServiceRequestModel } from "@/features/requests/request.schema";
import type { Service, ServiceDTO } from "./types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

export function toServiceDTO(service: Service): ServiceDTO {
  return {
    _id: service._id.toString(),
    siteId: service.siteId.toString(),
    name: service.name,
    description: service.description,
    active: service.active,
    sortOrder: service.sortOrder,
    image: service.image ?? null,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };
}

export async function createService(input: {
  siteId: string;
  ownerId: string;
  name: string;
  description: string;
  sortOrder: number;
}): Promise<Service> {
  const now = new Date();
  const doc = await ServiceModel.create({
    siteId: toObjectId(input.siteId),
    ownerId: toObjectId(input.ownerId),
    name: input.name,
    description: input.description,
    sortOrder: input.sortOrder,
    createdAt: now,
    updatedAt: now,
  });
  return doc as unknown as Service;
}

export async function getServiceForOwner(
  id: string,
  siteId: string,
  ownerId: string
): Promise<Service | null> {
  return (await ServiceModel.findOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  }).lean()) as unknown as Service | null;
}

export async function listServicesForSite(siteId: string): Promise<Service[]> {
  return (await ServiceModel.find({
    siteId: toObjectId(siteId),
    active: true,
  })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean()) as unknown as Service[];
}

export async function listAllServicesForSite(siteId: string): Promise<Service[]> {
  return (await ServiceModel.find({ siteId: toObjectId(siteId) })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean()) as unknown as Service[];
}

export async function updateService(
  id: string,
  siteId: string,
  patch: Partial<Pick<Service, "name" | "description" | "active" | "sortOrder" | "image">>
): Promise<Service | null> {
  const doc = await ServiceModel.findOneAndUpdate(
    { _id: toObjectId(id), siteId: toObjectId(siteId) },
    { $set: { ...patch, updatedAt: new Date() } },
    { new: true }
  ).lean();
  return (doc as unknown as Service) ?? null;
}

export async function deleteService(id: string, siteId: string): Promise<boolean> {
  const result = await ServiceModel.deleteOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
  });
  return result.deletedCount === 1;
}

export async function reorderServices(siteId: string, orderedIds: string[]): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await ServiceModel.updateOne(
      { _id: toObjectId(orderedIds[i]), siteId: toObjectId(siteId) },
      { $set: { sortOrder: i, updatedAt: new Date() } }
    );
  }
}

export async function countServicesForSite(siteId: string): Promise<number> {
  return ServiceModel.countDocuments({ siteId: toObjectId(siteId) });
}

export async function countServicesByIds(
  siteId: string,
  serviceIds: string[]
): Promise<number> {
  return ServiceModel.countDocuments({
    _id: { $in: serviceIds.map(toObjectId) },
    siteId: toObjectId(siteId),
  });
}

export async function getMaxSortOrder(siteId: string): Promise<number> {
  const result = (await ServiceModel.findOne({ siteId: toObjectId(siteId) })
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean()) as unknown as { sortOrder?: number } | null;
  return result ? (result.sortOrder ?? -1) : -1;
}

export async function findActiveService(
  siteId: string,
  serviceId: string
): Promise<Service | null> {
  if (!mongoose.Types.ObjectId.isValid(serviceId)) return null;
  return (await ServiceModel.findOne({
    _id: toObjectId(serviceId),
    siteId: toObjectId(siteId),
    active: true,
  }).lean()) as unknown as Service | null;
}

export async function hasRequestsForService(serviceId: string): Promise<boolean> {
  const count = await ServiceRequestModel.countDocuments({
    serviceId: toObjectId(serviceId),
  });
  return count > 0;
}

export async function countRequestsByService(
  serviceId: string
): Promise<number> {
  return ServiceRequestModel.countDocuments({
    serviceId: toObjectId(serviceId),
  });
}

export { toObjectId };
