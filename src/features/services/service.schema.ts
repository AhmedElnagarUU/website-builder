import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";
import type { Service } from "./types";

const serviceSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    image: { type: String, default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

serviceSchema.index({ siteId: 1, sortOrder: 1 });
serviceSchema.index({ siteId: 1, name: 1 });

export const ServiceModel = getModel("Service", serviceSchema);
export type { Service };
