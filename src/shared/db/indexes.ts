import { Db } from "mongodb";

export async function ensureIndexes(db: Db): Promise<void> {
  await db.collection("sites").createIndex({ ownerId: 1 });
  await db.collection("sites").createIndex(
    { slug: 1 },
    { unique: true, sparse: true }
  );
  await db
    .collection("pageviews")
    .createIndex(
      { siteId: 1, date: 1, page: 1, locale: 1 },
      { unique: true }
    );
  await db
    .collection("subscriptions")
    .createIndex({ userId: 1 }, { unique: true });
  await db
    .collection("memberships")
    .createIndex({ userId: 1 }, { unique: true });
  await db.collection("billing").createIndex({ userId: 1, createdAt: -1 });
  await db
    .collection("billing")
    .createIndex({ createdBy: 1, createdAt: -1 });
  await db
    .collection("billing")
    .createIndex(
      { providerEventId: 1 },
      { unique: true, sparse: true }
    );
}