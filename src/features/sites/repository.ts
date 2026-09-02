import { ObjectId } from "mongodb";
import { getDb } from "@/shared/db/database";
import { isLegacyFlatContent, migrateFlatContent } from "./lib/migrate-content";
import type {
  CreateSiteInput,
  Site,
  SiteDTO,
  UpdateSitePatch,
} from "./types";

const COLLECTION = "sites";

function toObjectId(id: string): ObjectId {
  return new ObjectId(id);
}

async function maybeMigrateContent(site: Site): Promise<Site> {
  if (!isLegacyFlatContent(site.content)) return site;
  const content = migrateFlatContent(site.content);
  const db = await getDb();
  await db
    .collection<Site>(COLLECTION)
    .updateOne({ _id: site._id }, { $set: { content, updatedAt: new Date() } });
  return { ...site, content };
}

export function toSiteDTO(site: Site): SiteDTO {
  return {
    _id: site._id.toString(),
    ownerId: site.ownerId.toString(),
    status: site.status,
    currentStep: site.currentStep,
    businessInfo: site.businessInfo,
    templateId: site.templateId,
    languagesRequested: site.languagesRequested,
    activeLanguages: site.activeLanguages,
    content: site.content,
    images: site.images,
    brandColor: site.brandColor,
    slug: site.slug,
    publishedSnapshot: site.publishedSnapshot,
    hasUnpublishedChanges: site.hasUnpublishedChanges,
    generation: site.generation,
    createdAt: site.createdAt.toISOString(),
    updatedAt: site.updatedAt.toISOString(),
  };
}

export async function createSite(input: CreateSiteInput): Promise<Site> {
  const db = await getDb();
  const now = new Date();
  const doc: Omit<Site, "_id"> = {
    ownerId: toObjectId(input.ownerId),
    status: "draft",
    currentStep: "business_info",
    businessInfo: { name: "", category: undefined as never },
    languagesRequested: [],
    activeLanguages: [],
    content: {},
    images: {},
    brandColor: "",
    publishedSnapshot: null,
    hasUnpublishedChanges: false,
    generation: { status: "idle" },
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<Omit<Site, "_id">>(COLLECTION).insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function getSiteById(id: string): Promise<Site | null> {
  const db = await getDb();
  const _id = toObjectId(id);
  const doc = await db.collection<Site>(COLLECTION).findOne({ _id });
  return doc ? maybeMigrateContent(doc) : null;
}

export async function getSiteForOwner(
  id: string,
  ownerId: string
): Promise<Site | null> {
  const db = await getDb();
  const _id = toObjectId(id);
  const ownerOid = toObjectId(ownerId);
  const doc = await db.collection<Site>(COLLECTION).findOne({ _id, ownerId: ownerOid });
  return doc ? maybeMigrateContent(doc) : null;
}

export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const db = await getDb();
  const doc = await db.collection<Site>(COLLECTION).findOne({ slug });
  return doc ? maybeMigrateContent(doc) : null;
}

export async function updateSite(
  id: string,
  patch: UpdateSitePatch
): Promise<Site | null> {
  const db = await getDb();
  const _id = toObjectId(id);
  const { ...rest } = patch;
  const updateDoc = { ...rest, updatedAt: new Date() };
  const result = await db
    .collection<Site>(COLLECTION)
    .findOneAndUpdate(
      { _id },
      { $set: updateDoc },
      { returnDocument: "after" }
    );
  return result;
}

export async function listSitesByOwner(ownerId: string): Promise<Site[]> {
  const db = await getDb();
  const ownerOid = toObjectId(ownerId);
  const docs = await db
    .collection<Site>(COLLECTION)
    .find({ ownerId: ownerOid })
    .toArray();
  return Promise.all(docs.map((doc) => maybeMigrateContent(doc)));
}

export async function deleteSite(id: string): Promise<boolean> {
  const db = await getDb();
  const _id = toObjectId(id);
  const result = await db.collection<Site>(COLLECTION).deleteOne({ _id });
  return result.deletedCount === 1;
}