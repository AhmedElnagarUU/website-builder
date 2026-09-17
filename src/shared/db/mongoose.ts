import mongoose from "mongoose";

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
  var _mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

let connectionPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongooseConnectionPromise) {
    global._mongooseConnectionPromise = mongoose.connect(uri, { dbName });
  }
  connectionPromise = global._mongooseConnectionPromise;
} else {
  connectionPromise = mongoose.connect(uri, { dbName });
}

export async function getMongooseConnection(): Promise<mongoose.Connection> {
  await connectionPromise;
  return mongoose.connection;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getModel(
  name: string,
  schema: mongoose.Schema
): mongoose.Model<any> {
  const existing = mongoose.models[name] as mongoose.Model<any> | undefined;
  if (existing) return existing;
  return mongoose.model<any>(name, schema);
}
/* eslint-enable @typescript-eslint/no-explicit-any */