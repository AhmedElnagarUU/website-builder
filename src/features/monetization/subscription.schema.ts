import mongoose from "mongoose";
import { getModel } from "@/shared/db/mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    planId: { type: String, enum: ["free", "pro"], required: true },
    status: {
      type: String,
      enum: ["active", "trialing", "past_due", "canceled", "ended"],
      required: true,
    },
    provider: String,
    providerSubscriptionId: String,
    currency: String,
    amountMinorUnits: Number,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEndsAt: Date,
    cancelAtPeriodEnd: Boolean,
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: false }
);

subscriptionSchema.index({ userId: 1 }, { unique: true });

export const SubscriptionModel = getModel("Subscription", subscriptionSchema);