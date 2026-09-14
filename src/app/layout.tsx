import { cookies } from "next/headers";
import { fontVariables } from "@/shared/ui/fonts";
import { locales, dirFor } from "@/shared/i18n/config";
import "./globals.css";

async function getLocaleFromCookie(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("NEXT_LOCALE");
    const locale = localeCookie?.value;
    if (locale && locales.includes(locale as (typeof locales)[number])) {
      return locale;
    }
  } catch {
    // Not in a Server Component context
  }
  return "en";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleFromCookie();
  return (
    <html lang={locale} dir={dirFor(locale)} className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
