import mongoose from "mongoose";
import { BusinessItemModel } from "./business-item.schema";
import { PROTECTED_ITEM_QUERY } from "./lib/merge-items";
import type {
  BusinessItem,
  BusinessItemDTO,
  BusinessItemData,
  BusinessItemPatch,
  CreateBusinessItemInput,
  ListBusinessItemsFilter,
} from "./types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

function toObjectIdIfValid(id: string): mongoose.Types.ObjectId | null {
  return mongoose.Types.ObjectId.isValid(id) ? toObjectId(id) : null;
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: number }).code === 11000
  );
}

function toDataFieldPatch(data: BusinessItemData): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(data)) {
    if (value === undefined) continue;
    patch[`data.${field}`] = value;
  }
  return patch;
}

export function toBusinessItemDTO(item: BusinessItem): BusinessItemDTO {
  return {
    _id: item._id.toString(),
    siteId: item.siteId.toString(),
    kind: item.kind,
    locale: item.locale,
    baseKey: item.baseKey,
    data: item.data,
    origin: item.origin,
    edited: item.edited,
    active: item.active,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function listBusinessItemsForSite(
  filter: ListBusinessItemsFilter
): Promise<BusinessItem[]> {
  const query: mongoose.FilterQuery<unknown> = {
    siteId: toObjectId(filter.siteId),
    ownerId: toObjectId(filter.ownerId),
  };
  if (filter.kind) query.kind = filter.kind;
  if (filter.locale) query.locale = filter.locale;
  if (!filter.includeInactive) query.active = true;
  return (await BusinessItemModel.find(query)
    .sort({ sortOrder: 1, createdAt: 1 })
    .lean()) as unknown as BusinessItem[];
}

export async function getBusinessItemForOwner(
  id: string,
  siteId: string,
  ownerId: string
): Promise<BusinessItem | null> {
  const _id = toObjectIdIfValid(id);
  if (!_id) return null;
  return (await BusinessItemModel.findOne({
    _id,
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  }).lean()) as unknown as BusinessItem | null;
}

export async function findBusinessItemByBaseKey(
  siteId: string,
  ownerId: string,
  baseKey: string,
  locale: BusinessItem["locale"]
): Promise<BusinessItem | null> {
  return (await BusinessItemModel.findOne({
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
    baseKey,
    locale,
  }).lean()) as unknown as BusinessItem | null;
}

export async function createBusinessItem(
  input: CreateBusinessItemInput
): Promise<BusinessItem | null> {
  const now = new Date();
  try {
    const doc = await BusinessItemModel.create({
      siteId: toObjectId(input.siteId),
      ownerId: toObjectId(input.ownerId),
      kind: input.kind,
      locale: input.locale,
      baseKey: input.baseKey ?? new mongoose.Types.ObjectId().toString(),
      data: input.data,
      origin: input.origin ?? "user",
      edited: input.edited ?? false,
      active: input.active ?? true,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
    });
    return doc as unknown as BusinessItem;
  } catch (error) {
    if (isDuplicateKeyError(error)) return null;
    throw error;
  }
}

export async function updateBusinessItem(
  id: string,
  siteId: string,
  ownerId: string,
  patch: BusinessItemPatch
): Promise<BusinessItem | null> {
  const _id = toObjectIdIfValid(id);
  if (!_id) return null;
  const set: mongoose.UpdateQuery<unknown> = { updatedAt: new Date() };
  if (patch.active !== undefined) set.active = patch.active;
  if (patch.sortOrder !== undefined) set.sortOrder = patch.sortOrder;
  if (patch.origin !== undefined) set.origin = patch.origin;
  if (patch.edited !== undefined) set.edited = patch.edited;
  if (patch.data !== undefined) Object.assign(set, toDataFieldPatch(patch.data));
  const doc = await BusinessItemModel.findOneAndUpdate(
    { _id, siteId: toObjectId(siteId), ownerId: toObjectId(ownerId) },
    { $set: set },
    { new: true }
  ).lean();
  return (doc as unknown as BusinessItem) ?? null;
}

export async function deleteBusinessItem(
  id: string,
  siteId: string,
  ownerId: string
): Promise<boolean> {
  const _id = toObjectIdIfValid(id);
  if (!_id) return false;
  const result = await BusinessItemModel.deleteOne({
    _id,
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  });
  return result.deletedCount === 1;
}

/**
 * Owner-scoped count of items the merge protection rule would keep (`edited === true` OR
 * `origin !== "ai"`) — i.e. how many catalog items a regeneration would NOT overwrite.
 * Consume via `api/count-edited-items` `countEditedItemsForCurrentUser` (the callable seam
 * for the EPIC 5 confirm-gate), never directly.
 */
export async function countEditedItems(
  siteId: string,
  ownerId: string,
  options: { kind?: BusinessItem["kind"]; locale?: BusinessItem["locale"] } = {}
): Promise<number> {
  const query: mongoose.FilterQuery<unknown> = {
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
    ...PROTECTED_ITEM_QUERY,
  };
  if (options.kind) query.kind = options.kind;
  if (options.locale) query.locale = options.locale;
  return BusinessItemModel.countDocuments(query);
}

export async function getMaxBusinessItemSortOrder(
  siteId: string,
  ownerId: string,
  kind?: BusinessItem["kind"]
): Promise<number> {
  const query: mongoose.FilterQuery<unknown> = {
    siteId: toObjectId(siteId),
    ownerId: toObjectId(ownerId),
  };
  if (kind) query.kind = kind;
  const result = (await BusinessItemModel.findOne(query)
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean()) as unknown as { sortOrder?: number } | null;
  return result ? (result.sortOrder ?? -1) : -1;
}
