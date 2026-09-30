import { getAuth } from "@/shared/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  country?: string;
}

export async function getSession(): Promise<{ user: SessionUser } | null> {
  const auth = await getAuth();
  if (!auth) throw new Error("Auth not initialized");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = session.user as { id: string; email: string; name?: string; country?: string };
  return { user: { id: user.id, email: user.email, name: user.name, country: user.country } };
}

export async function requireSession(locale: string): Promise<{ user: SessionUser }> {
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }
  return session;
}