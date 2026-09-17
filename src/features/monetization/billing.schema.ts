import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const billingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    siteId: { type: mongoose.Schema.Types.ObjectId },
    kind: {
      type: String,
      enum: [
        "manual_payment",
        "manual_discount",
        "write_off",
        "gateway_charge",
        "gateway_refund",
        "credit",
      ],
      required: true,
    },
    amountMinor: { type: Number, required: true },
    currency: { type: String, required: true },
    description: String,
    provider: String,
    providerEventId: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  { timestamps: false }
);

billingSchema.index({ userId: 1, createdAt: -1 });
billingSchema.index({ createdBy: 1, createdAt: -1 });
billingSchema.index({ providerEventId: 1 }, { unique: true, sparse: true });

export const BillingModel = getModel("Billing", billingSchema);