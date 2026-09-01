import { betterAuth, BetterAuthOptions } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDb } from "@/shared/db/database";

const secret = process.env.BETTER_AUTH_SECRET;
const url = process.env.BETTER_AUTH_URL;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is not defined in environment variables");
}
if (!url) {
  throw new Error("BETTER_AUTH_URL is not defined in environment variables");
}

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth() {
  if (authInstance) return authInstance;
  const db = await getDb();
  const options: BetterAuthOptions = {
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
    },
    baseURL: url,
    secret,
  };
  authInstance = betterAuth(options);
  return authInstance;
}