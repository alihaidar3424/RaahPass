import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LANG_COOKIE } from "@/lib/constants";

export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  if (lang !== "en" && lang !== "ur") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw.js).*)"],
};
