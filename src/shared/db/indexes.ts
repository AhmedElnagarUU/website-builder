import { Db } from "mongodb";

export async function ensureIndexes(db: Db): Promise<void> {
  await db.collection("sites").createIndex({ ownerId: 1 });
  await db.collection("sites").createIndex(
    { slug: 1 },
    { unique: true, sparse: true }
  );
}