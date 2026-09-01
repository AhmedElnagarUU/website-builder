import { setRequestLocale } from "next-intl/server";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm locale={locale} />
    </div>
  );
}