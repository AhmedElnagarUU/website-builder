import { Db } from "mongodb";
import { getMongoClient } from "./client";

let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME!;
  cachedDb = client.db(dbName);
  return cachedDb;
}