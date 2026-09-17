import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const membershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "frozen"],
      required: true,
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: false }
);

membershipSchema.index({ userId: 1 }, { unique: true });

export const MembershipModel = getModel("Membership", membershipSchema);