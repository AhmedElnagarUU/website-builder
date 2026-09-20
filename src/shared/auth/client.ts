"use client";

import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const authClient = createAuthClient({
  baseURL: appUrl,
  plugins: [phoneNumberClient()],
});
