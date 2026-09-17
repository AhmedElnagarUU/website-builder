import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const pageviewSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: String, required: true },
    page: { type: String, required: true },
    locale: { type: String, enum: ["en", "ar"], required: true },
    views: { type: Number, required: true, default: 1 },
  },
  { timestamps: false }
);

pageviewSchema.index(
  { siteId: 1, date: 1, page: 1, locale: 1 },
  { unique: true }
);

export const PageviewModel = getModel("Pageview", pageviewSchema);