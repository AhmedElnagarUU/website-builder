import mongoose from "mongoose";
import type {
  CreatePaymentRecordInput,
  PaymentProviderId,
  PaymentRecord,
  PaymentStatus,
} from "./types";
import { PaymentRecordModel } from "./payment-record.schema";

export async function createPaymentRecord(
  input: CreatePaymentRecordInput
): Promise<PaymentRecord> {
  const now = new Date();
  const doc: Omit<PaymentRecord, "_id"> = {
    userId: new mongoose.Types.ObjectId(input.userId),
    planId: input.planId,
    status: "pending",
    amountMinorUnits: input.amountMinorUnits,
    currency: input.currency,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };
  const created = await PaymentRecordModel.create(doc);
  return { _id: created._id as mongoose.Types.ObjectId, ...doc };
}

export async function getPaymentRecordForUser(
  paymentId: string,
  userId: string
): Promise<PaymentRecord | null> {
  const paymentOid = new mongoose.Types.ObjectId(paymentId);
  const userOid = new mongoose.Types.ObjectId(userId);
  const doc = await PaymentRecordModel.findOne({
    _id: paymentOid,
    userId: userOid,
  }).lean();
  return (doc as unknown as PaymentRecord) ?? null;
}

export async function updatePaymentAfterProviderSession(
  paymentId: string,
  patch: {
    provider: PaymentProviderId;
    providerPaymentId: string;
    providerOrderId?: string;
    providerMetadata?: Record<string, unknown>;
  }
): Promise<void> {
  const paymentOid = new mongoose.Types.ObjectId(paymentId);
  await PaymentRecordModel.updateOne(
    { _id: paymentOid },
    {
      $set: {
        provider: patch.provider,
        providerPaymentId: patch.providerPaymentId,
        providerOrderId: patch.providerOrderId,
        providerMetadata: patch.providerMetadata,
        updatedAt: new Date(),
      },
    }
  );
}

export async function markPaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  extra?: {
    providerTransactionId?: string;
    paymentMethod?: string;
    providerMetadata?: Record<string, unknown>;
  }
): Promise<void> {
  const paymentOid = new mongoose.Types.ObjectId(paymentId);
  const updateDoc: Partial<PaymentRecord> = {
    status,
    updatedAt: new Date(),
  };
  if (extra?.providerTransactionId) {
    updateDoc.providerTransactionId = extra.providerTransactionId;
  }
  if (extra?.paymentMethod) {
    updateDoc.paymentMethod = extra.paymentMethod;
  }
  if (extra?.providerMetadata) {
    updateDoc.providerMetadata = extra.providerMetadata;
  }
  try {
    await PaymentRecordModel.updateOne({ _id: paymentOid }, { $set: updateDoc });
  } catch (err) {
    const isDuplicate =
      err instanceof Error &&
      "code" in err &&
      (err as { code: number }).code === 11000;
    if (isDuplicate) {
      return;
    }
    throw err;
  }
}

export async function findPaymentByProviderTransactionId(
  providerTransactionId: string
): Promise<PaymentRecord | null> {
  const doc = await PaymentRecordModel.findOne({
    providerTransactionId,
  }).lean();
  return (doc as unknown as PaymentRecord) ?? null;
}

export async function findPaymentByReference(
  ref: string
): Promise<PaymentRecord | null> {
  const byPaymentId = await PaymentRecordModel.findOne({
    providerPaymentId: ref,
  }).lean();
  if (byPaymentId) return byPaymentId as unknown as PaymentRecord;
  if (mongoose.Types.ObjectId.isValid(ref)) {
    const byId = await PaymentRecordModel.findOne({
      _id: new mongoose.Types.ObjectId(ref),
    }).lean();
    if (byId) return byId as unknown as PaymentRecord;
  }
  return null;
}