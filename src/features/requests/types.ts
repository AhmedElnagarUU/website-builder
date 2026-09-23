import type { Types } from "mongoose";

export type RequestStatus = "new" | "contacted" | "in_progress" | "completed" | "cancelled";

export const REQUEST_STATUSES = [
  "new",
  "contacted",
  "in_progress",
  "completed",
  "cancelled",
] as const satisfies readonly RequestStatus[];

export const PENDING_STATUSES = [
  "new",
  "contacted",
  "in_progress",
] as const satisfies readonly RequestStatus[];

export interface RequestStatusHistoryEntry {
  status: RequestStatus;
  changedAt: Date;
  changedBy: string;
}

export interface RequestNote {
  _id: Types.ObjectId;
  note: string;
  createdAt: Date;
  createdBy: string;
}

export interface ServiceRequest {
  _id: Types.ObjectId;
  siteId: Types.ObjectId;
  ownerId: Types.ObjectId;
  customerId: Types.ObjectId;
  serviceId: Types.ObjectId | null;
  message: string;
  status: RequestStatus;
  statusHistory: RequestStatusHistoryEntry[];
  internalNotes: RequestNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequestDTO {
  _id: string;
  siteId: string;
  customerId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  serviceId: string | null;
  serviceName: string | null;
  message: string;
  status: RequestStatus;
  statusHistory: Array<{
    status: RequestStatus;
    changedAt: string;
    changedBy: string;
  }>;
  internalNotes: Array<{
    _id: string;
    note: string;
    createdAt: string;
    createdBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface RecentRequestDTO {
  _id: string;
  id: string;
  customerName: string;
  serviceName: string | null;
  status: RequestStatus;
  createdAt: string;
}

export interface DashboardOverview {
  totalCustomers: number;
  newCustomers: number;
  totalRequests: number;
  newRequests: number;
  completedRequests: number;
  recentRequests: RecentRequestDTO[];
}
