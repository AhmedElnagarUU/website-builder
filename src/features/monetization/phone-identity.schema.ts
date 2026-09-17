import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const phoneIdentitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    phoneNumber: { type: String, required: true },
    verifiedAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
  },
  { timestamps: false }
);

phoneIdentitySchema.index({ phoneNumber: 1 }, { unique: true });

export const PhoneIdentityModel = getModel("PhoneIdentity", phoneIdentitySchema);