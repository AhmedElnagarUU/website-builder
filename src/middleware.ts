import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/shared/i18n/config";

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

const localeLikePattern = /^[a-z]{2,3}(-[a-zA-Z0-9]{2,8})?$/;

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  if (firstSegment === "live") {
    return NextResponse.next();
  }

  if (
    firstSegment &&
    (locales as readonly string[]).includes(firstSegment) === false &&
    localeLikePattern.test(firstSegment)
  ) {
    return new NextResponse(null, { status: 404 });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};