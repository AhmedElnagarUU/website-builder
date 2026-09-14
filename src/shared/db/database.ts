import { Db } from "mongodb";
import { getMongoClient } from "./client";
import { ensureIndexes } from "./indexes";

let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME!;
  cachedDb = client.db(dbName);
  // Ensure all required indexes exist (idempotent — safe to call on every init)
  await ensureIndexes(cachedDb).catch((err) => {
    console.error("Failed to ensure database indexes:", err);
  });
  return cachedDb;
}