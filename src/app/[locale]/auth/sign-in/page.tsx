import { setRequestLocale } from "next-intl/server";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm locale={locale} />
    </div>
  );
}