import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";
import { CATEGORIES } from "./types";

const businessInfoSchema = new mongoose.Schema(
  {
    name: String,
    category: { type: String, enum: CATEGORIES },
    description: String,
    targetCustomers: String,
    services: String,
    location: String,
    contactPhone: String,
    contactEmail: String,
    usps: [String],
    notes: [String],
  },
  { _id: false }
);

const generationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["idle", "queued", "running", "complete", "failed"],
      default: "idle",
    },
    error: String,
    startedAt: Date,
    finishedAt: Date,
  },
  { _id: false }
);

const siteSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      required: true,
      default: "draft",
    },
    currentStep: {
      type: String,
      enum: [
        "business_info",
        "templates",
        "language",
        "generating",
        "editing",
      ],
      required: true,
      default: "business_info",
    },
    businessInfo: businessInfoSchema,
    templateId: String,
    languagesRequested: { type: [String], default: [] },
    activeLanguages: { type: [String], default: [] },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    images: { type: mongoose.Schema.Types.Mixed, default: {} },
    brandColor: { type: String, default: "" },
    slug: String,
    publishedSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
    hasUnpublishedChanges: { type: Boolean, default: false },
    generation: generationSchema,
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false }
);

siteSchema.index({ ownerId: 1 });
siteSchema.index({ slug: 1 }, { unique: true, sparse: true });

export const SiteModel = getModel("Site", siteSchema);