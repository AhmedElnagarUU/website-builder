import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSession } from "@/features/auth/lib/session";
import { Landing } from "@/features/landing/components/Landing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (session) {
    redirect(`/${locale}/dashboard`);
  }
  return <Landing />;
}
