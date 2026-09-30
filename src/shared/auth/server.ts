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

// Server-side country detection only. Never trust a client body for this:
// the value is read from proxy headers and frozen on the user document at
// signup (see 02-expansion-decisions.md DEC-1).
function normalizeCountry(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const value = raw.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(value) ? value : undefined;
}

function countryFromRequest(headers: HeadersInit | undefined): string | undefined {
  if (!headers) return undefined;
  const all = new Headers(headers);
  const proxied =
    all.get("cf-ipcountry") ?? all.get("x-vercel-ip-country") ?? undefined;
  const fromProxy = normalizeCountry(proxied);
  if (fromProxy) return fromProxy;
  const acceptLanguage = all.get("accept-language");
  if (!acceptLanguage) return undefined;
  const first = acceptLanguage.split(",")[0]?.trim();
  // "ar-EG;q=0.8" -> "EG" (region subtag only; a plain "ar"/"en" is not a country)
  if (first && /^[A-Za-z]{2}(-([A-Za-z0-9]{2,3}))?$/.test(first)) {
    const region = first.split("-")[1];
    return normalizeCountry(region);
  }
  return undefined;
}

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
    user: {
      additionalFields: {
        // ISO-3166-1 alpha-2, nullable, non-unique, unindexed. input:false so
        // clients can never set it themselves; only the signup hook writes it.
        country: { type: "string", required: false, input: false },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user, context) => {
            const headers = context?.headers;
            const country = headers ? countryFromRequest(headers) : undefined;
            if (!country) return { data: user };
            return { data: { ...user, country } };
          },
        },
      },
    },
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
