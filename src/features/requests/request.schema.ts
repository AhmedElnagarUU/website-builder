import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";
import type {
  RequestNote,
  RequestStatus,
  RequestStatusHistoryEntry,
  ServiceRequest,
} from "./types";

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, required: true },
  },
  { _id: false }
);

const requestNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
  },
  { _id: false }
);

const serviceRequestSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "completed", "cancelled"],
      default: "new",
      index: true,
    },
    statusHistory: { type: [statusHistoryEntrySchema], default: [] },
    internalNotes: { type: [requestNoteSchema], default: [] },
    createdAt: { type: Date, required: true, default: Date.now, index: true },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

serviceRequestSchema.index({ siteId: 1, createdAt: -1 });
serviceRequestSchema.index({ siteId: 1, status: 1 });
serviceRequestSchema.index({ siteId: 1, customerId: 1 });

export const ServiceRequestModel = getModel(
  "ServiceRequest",
  serviceRequestSchema
);
export type {
  RequestNote,
  RequestStatus,
  RequestStatusHistoryEntry,
  ServiceRequest,
};
