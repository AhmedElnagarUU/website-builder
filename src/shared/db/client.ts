import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}
if (!dbName) {
  throw new Error("MONGODB_DB_NAME is not defined in environment variables");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri);
  }
  client = global._mongoClient;
} else {
  client = new MongoClient(uri);
}

let isConnected = false;

export async function getMongoClient(): Promise<MongoClient> {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client;
}