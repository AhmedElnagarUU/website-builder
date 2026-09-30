import mongoose from "mongoose";
import { locales } from "@/shared/i18n/config";
import { getModel } from "@/shared/db/mongoose";
import type { BusinessItem, BusinessItemKind } from "./types";

const businessItemSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    kind: {
      type: String,
      enum: ["service", "menu_item", "gallery_item", "hours", "contact"],
      required: true,
    },
    locale: { type: String, enum: [...locales], required: true },
    baseKey: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    origin: {
      type: String,
      enum: ["ai", "user", "placeholder"],
      default: "user",
      required: true,
    },
    edited: { type: Boolean, default: false, required: true },
    active: { type: Boolean, default: true, required: true },
    sortOrder: { type: Number, default: 0, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false, collection: "businessitems" }
);

businessItemSchema.index(
  { siteId: 1, baseKey: 1, locale: 1 },
  { unique: true }
);
businessItemSchema.index({ siteId: 1, kind: 1, sortOrder: 1 });
businessItemSchema.index({ ownerId: 1, siteId: 1 });

export const BusinessItemModel = getModel("BusinessItem", businessItemSchema);
export type { BusinessItem, BusinessItemKind };
