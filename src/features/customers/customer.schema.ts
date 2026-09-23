import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";
import type { Customer } from "./types";

const customerSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: null, index: true },
    phone: { type: String, default: null, index: true },
    notes: { type: [String], default: [] },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

customerSchema.index({ siteId: 1, ownerId: 1 });
customerSchema.index({ siteId: 1, email: 1 }, { unique: true, sparse: true });
customerSchema.index({ siteId: 1, phone: 1 }, { unique: true, sparse: true });

export const CustomerModel = getModel("Customer", customerSchema);
export type { Customer };
