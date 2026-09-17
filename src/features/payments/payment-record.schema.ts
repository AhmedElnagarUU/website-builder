import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const paymentRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    planId: { type: String, enum: ["pro"], required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "refunded", "voided"],
      default: "pending",
      required: true,
    },
    amountMinorUnits: { type: Number, required: true },
    currency: { type: String, required: true },
    description: String,
    provider: String,
    providerPaymentId: String,
    providerOrderId: String,
    providerTransactionId: String,
    providerMetadata: mongoose.Schema.Types.Mixed,
    paymentMethod: String,
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: false }
);

paymentRecordSchema.index({ userId: 1 });
paymentRecordSchema.index({ providerTransactionId: 1 }, { unique: true, sparse: true });
paymentRecordSchema.index({ status: 1 });

export const PaymentRecordModel = getModel("Payment", paymentRecordSchema);