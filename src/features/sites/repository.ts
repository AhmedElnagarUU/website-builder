import mongoose from "mongoose";
import { isLegacyFlatContent, migrateFlatContent } from "./lib/migrate-content";
import { SiteModel } from "./site.schema";
import type {
  CreateSiteInput,
  Site,
  SiteDTO,
  UpdateSitePatch,
} from "./types";

function toObjectId(id: string): mongoose.Types.ObjectId {
  return new mongoose.Types.ObjectId(id);
}

async function maybeMigrateContent(site: Site): Promise<Site> {
  if (!site.content || !isLegacyFlatContent(site.content)) {
    // Normalize null/undefined content to empty object so downstream
    // consumers (Object.keys, Object.values) never crash.
    if (!site.content) {
      await SiteModel.updateOne(
        { _id: site._id },
        { $set: { content: {}, updatedAt: new Date() } }
      );
      return { ...site, content: {} };
    }
    return site;
  }
  const content = migrateFlatContent(site.content);
  await SiteModel.updateOne(
    { _id: site._id },
    { $set: { content, updatedAt: new Date() } }
  );
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
  const created = await SiteModel.create({ ...doc } as Omit<Site, "_id">);
  return { _id: created._id as Site["_id"], ...doc };
}

export async function getSiteById(id: string): Promise<Site | null> {
  const _id = toObjectId(id);
  const doc = await SiteModel.findById(_id).lean();
  return doc ? maybeMigrateContent(doc as unknown as Site) : null;
}

export async function getSiteForOwner(
  id: string,
  ownerId: string
): Promise<Site | null> {
  const _id = toObjectId(id);
  const ownerOid = toObjectId(ownerId);
  const doc = await SiteModel.findOne({ _id, ownerId: ownerOid }).lean();
  return doc ? maybeMigrateContent(doc as unknown as Site) : null;
}

export async function getSiteBySlug(slug: string): Promise<Site | null> {
  const doc = await SiteModel.findOne({ slug }).lean();
  return doc ? maybeMigrateContent(doc as unknown as Site) : null;
}

export async function updateSite(
  id: string,
  patch: UpdateSitePatch
): Promise<Site | null> {
  const _id = toObjectId(id);
  const { ...rest } = patch;
  const updateDoc = { ...rest, updatedAt: new Date() };
  const doc = await SiteModel.findOneAndUpdate(
    { _id },
    { $set: updateDoc },
    { new: true }
  ).lean();
  return (doc as unknown as Site) ?? null;
}

export async function listSitesByOwner(ownerId: string): Promise<Site[]> {
  const ownerOid = toObjectId(ownerId);
  const docs = await SiteModel.find({ ownerId: ownerOid }).lean();
  return Promise.all(docs.map((doc) => maybeMigrateContent(doc as unknown as Site)));
}

export async function deleteSite(id: string): Promise<boolean> {
  const _id = toObjectId(id);
  const result = await SiteModel.deleteOne({ _id });
  return result.deletedCount === 1;
}
