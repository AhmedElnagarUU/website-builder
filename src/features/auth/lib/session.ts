import { getAuth } from "@/shared/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession(): Promise<{ user: { id: string; email: string; name?: string } } | null> {
  const auth = await getAuth();
  if (!auth) throw new Error("Auth not initialized");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return { user: { id: session.user.id, email: session.user.email, name: session.user.name } };
}

export async function requireSession(locale: string): Promise<{ user: { id: string; email: string; name?: string } }> {
  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }
  return session;
}