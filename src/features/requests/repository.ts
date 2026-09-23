import mongoose from "mongoose";
import { ServiceRequestModel } from "./request.schema";
import { CustomerModel } from "@/features/customers/customer.schema";
import { ServiceModel } from "@/features/services/service.schema";
import type {
  RecentRequestDTO,
  RequestStatus,
  RequestStatusHistoryEntry,
  ServiceRequest,
  ServiceRequestDTO,
} from "./types";
import type { Customer } from "@/features/customers/types";
import type { Service } from "@/features/services/types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

export function toServiceRequestDTO(
  request: ServiceRequest,
  customer: Customer | null | undefined,
  service: Service | null | undefined
): ServiceRequestDTO {
  return {
    _id: request._id.toString(),
    siteId: request.siteId.toString(),
    customerId: request.customerId.toString(),
    customerName: customer?.name ?? "Unknown",
    customerEmail: customer?.email ?? null,
    customerPhone: customer?.phone ?? null,
    serviceId: request.serviceId ? request.serviceId.toString() : null,
    serviceName: service?.name ?? null,
    message: request.message,
    status: request.status,
    statusHistory: request.statusHistory.map((entry: RequestStatusHistoryEntry) => ({
      status: entry.status,
      changedAt: entry.changedAt.toISOString(),
      changedBy: entry.changedBy,
    })),
    internalNotes: request.internalNotes.map((note) => ({
      _id: note._id ? note._id.toString() : "",
      note: note.note,
      createdAt: note.createdAt.toISOString(),
      createdBy: note.createdBy,
    })),
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

export async function createRequest(input: {
  siteId: string;
  ownerId: string;
  customerId: string;
  serviceId: string | null;
  message: string;
}): Promise<ServiceRequest> {
  const now = new Date();
  const doc = await ServiceRequestModel.create({
    siteId: toObjectId(input.siteId),
    ownerId: toObjectId(input.ownerId),
    customerId: toObjectId(input.customerId),
    serviceId: input.serviceId ? toObjectId(input.serviceId) : null,
    message: input.message,
    status: "new",
    statusHistory: [{ status: "new", changedBy: "system" }],
    internalNotes: [],
    createdAt: now,
    updatedAt: now,
  });
  return doc as unknown as ServiceRequest;
}

export async function getRequestForOwner(
  id: string,
  siteId: string,
  ownerId: string
): Promise<ServiceRequest | null> {
  return (await ServiceRequestModel.findOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  }).lean()) as unknown as ServiceRequest | null;
}

export interface ListRequestsFilters {
  status?: RequestStatus;
  search?: string;
}

async function fetchCustomersMap(
  customerIds: string[]
): Promise<Map<string, Customer>> {
  if (customerIds.length === 0) return new Map();
  const customers = (await CustomerModel.find({
    _id: { $in: customerIds.map(toObjectId) },
  }).lean()) as unknown as Customer[];
  return new Map(customers.map((c) => [c._id.toString(), c]));
}

async function fetchServicesMap(
  serviceIds: string[]
): Promise<Map<string, Service>> {
  if (serviceIds.length === 0) return new Map();
  const services = (await ServiceModel.find({
    _id: { $in: serviceIds.map(toObjectId) },
  }).lean()) as unknown as Service[];
  return new Map(services.map((s) => [s._id.toString(), s]));
}

export async function listRequestsForSite(
  siteId: string,
  filters?: ListRequestsFilters
): Promise<ServiceRequestDTO[]> {
  const query: Record<string, unknown> = { siteId: toObjectId(siteId) };
  if (filters?.status) {
    query.status = filters.status;
  }

  const requests = (await ServiceRequestModel.find(query)
    .sort({ createdAt: -1 })
    .lean()) as unknown as ServiceRequest[];

  const customerIds = [
    ...new Set(requests.map((r) => r.customerId.toString())),
  ];
  const serviceIds = [
    ...new Set(
      requests
        .filter((r) => r.serviceId)
        .map((r) => r.serviceId!.toString())
    ),
  ];

  const customerMap = await fetchCustomersMap(customerIds);
  const serviceMap = await fetchServicesMap(serviceIds);

  let dtos = requests.map((r) =>
    toServiceRequestDTO(
      r,
      customerMap.get(r.customerId.toString()),
      r.serviceId ? serviceMap.get(r.serviceId.toString()) : undefined
    )
  );

  if (filters?.search) {
    const searchRegex = new RegExp(
      filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    dtos = dtos.filter(
      (dto) =>
        searchRegex.test(dto.customerName) ||
        (dto.serviceName !== null && searchRegex.test(dto.serviceName)) ||
        searchRegex.test(dto.message)
    );
  }

  return dtos;
}

export async function updateRequestStatus(
  id: string,
  siteId: string,
  status: RequestStatus,
  changedBy: string
): Promise<ServiceRequest | null> {
  const doc = await ServiceRequestModel.findOneAndUpdate(
    { _id: toObjectId(id), siteId: toObjectId(siteId) },
    {
      $set: { status, updatedAt: new Date() },
      $push: {
        statusHistory: { status, changedBy, changedAt: new Date() },
      },
    },
    { new: true }
  ).lean();
  return (doc as unknown as ServiceRequest) ?? null;
}

export async function addRequestNote(
  id: string,
  siteId: string,
  note: string,
  createdBy: string
): Promise<ServiceRequest | null> {
  const doc = await ServiceRequestModel.findOneAndUpdate(
    { _id: toObjectId(id), siteId: toObjectId(siteId) },
    {
      $push: { internalNotes: { note, createdBy } },
      $set: { updatedAt: new Date() },
    },
    { new: true }
  ).lean();
  return (doc as unknown as ServiceRequest) ?? null;
}

export async function deleteRequest(id: string, siteId: string): Promise<boolean> {
  const result = await ServiceRequestModel.deleteOne({
    _id: toObjectId(id),
    siteId: toObjectId(siteId),
  });
  return result.deletedCount === 1;
}

export async function countRequestsByStatus(
  siteId: string
): Promise<{
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}> {
  const statuses: RequestStatus[] = [
    "new",
    "contacted",
    "in_progress",
    "completed",
    "cancelled",
  ];

  const pipeline = [
    { $match: { siteId: toObjectId(siteId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        ...statuses.reduce(
          (acc, s) => {
            acc[`${s}`] = {
              $sum: { $cond: [{ $eq: ["$status", s] }, 1, 0] },
            };
            return acc;
          },
          {} as Record<string, unknown>
        ),
      },
    },
  ];

  const result = (await ServiceRequestModel.aggregate(pipeline).exec())[0];
  if (!result) {
    return {
      total: 0,
      new: 0,
      contacted: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
  }
  return {
    total: result.total ?? 0,
    new: result.new ?? 0,
    contacted: result.contacted ?? 0,
    in_progress: result.in_progress ?? 0,
    completed: result.completed ?? 0,
    cancelled: result.cancelled ?? 0,
  };
}

export async function countNewRequestsForSite(
  siteId: string,
  since: Date
): Promise<number> {
  return ServiceRequestModel.countDocuments({
    siteId: toObjectId(siteId),
    createdAt: { $gte: since },
  });
}

export async function countCompletedRequestsForSite(
  siteId: string
): Promise<number> {
  return ServiceRequestModel.countDocuments({
    siteId: toObjectId(siteId),
    status: "completed",
  });
}

export async function countRequestsForCustomer(
  customerId: string
): Promise<number> {
  return ServiceRequestModel.countDocuments({
    customerId: toObjectId(customerId),
  });
}

export async function listRecentRequestsForSite(
  siteId: string,
  limit: number
): Promise<RecentRequestDTO[]> {
  const requests = (await ServiceRequestModel.find({
    siteId: toObjectId(siteId),
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()) as unknown as ServiceRequest[];

  if (requests.length === 0) return [];

  const customerIds = [
    ...new Set(requests.map((r) => r.customerId.toString())),
  ];
  const serviceIds = [
    ...new Set(
      requests
        .filter((r) => r.serviceId)
        .map((r) => r.serviceId!.toString())
    ),
  ];

  const customerMap = await fetchCustomersMap(customerIds);
  const serviceMap = await fetchServicesMap(serviceIds);

  return requests.map((r) => {
    const customer = customerMap.get(r.customerId.toString());
    const service = r.serviceId
      ? serviceMap.get(r.serviceId.toString())
      : null;
    return {
      _id: r._id.toString(),
      id: r._id.toString(),
      customerName: customer?.name ?? "Unknown",
      serviceName: service?.name ?? null,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    };
  });
}

export async function resolveRequestDTO(
  request: ServiceRequest
): Promise<ServiceRequestDTO> {
  const customer = request.customerId
    ? (await CustomerModel.findById(request.customerId).lean()) as unknown as Customer | null
    : null;
  let service: Service | null = null;
  if (request.serviceId) {
    service = (await ServiceModel.findById(request.serviceId).lean()) as unknown as Service | null;
  }
  return toServiceRequestDTO(request, customer, service);
}

export { toObjectId };
