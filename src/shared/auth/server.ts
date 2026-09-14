import { betterAuth, BetterAuthOptions } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { phoneNumber } from "better-auth/plugins";
import { getDb } from "@/shared/db/database";

const secret = process.env.BETTER_AUTH_SECRET;
const url = process.env.BETTER_AUTH_URL;

if (!secret) {
  throw new Error("BETTER_AUTH_SECRET is not defined in environment variables");
}
if (!url) {
  throw new Error("BETTER_AUTH_URL is not defined in environment variables");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let authInstance: any = null;

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
  authInstance = betterAuth({
    ...options,
    plugins: [
      phoneNumber({
        sendOTP: async ({ phoneNumber: phone, code }) => {
          // DEV: log OTP to console.
          // PROD: replace with a real SMS provider (Twilio, SNS, etc.).
          console.log(`[SMS] To ${phone}: OTP is ${code}`);
        },
        requireVerification: false,
      }),
    ],
  });
  return authInstance;
}
