import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "mita-admin-token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Coming-soon mode: every public URL lands on the homepage.
  const keep =
    pathname === "/" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    /^\/(robots\.txt|sitemap\.xml|opengraph-image|icon)/.test(pathname);
  if (!keep) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /admin to /admin/crm
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/crm", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
