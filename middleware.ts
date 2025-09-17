import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME || "myeasypage_auth";
const RESERVED = ["www", "admin", "superadmin", "api"];
const BASE_DOMAIN = process.env.BASE_DOMAIN || "myeasypage.com";

function hasAuthCookie(req: NextRequest) {
  return Boolean(req.cookies.get(COOKIE_NAME)?.value);
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const hostHeader = req.headers.get("host") || "";
  const cleanHost = hostHeader.replace(/:\d+$/, "");
  const parts = cleanHost.split(".");

  if (
    !cleanHost.includes("localhost") &&
    !cleanHost.endsWith(BASE_DOMAIN) &&
    parts.length >= 2
  ) {
    url.pathname = `/custom/${cleanHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  if (parts.length >= 3) {
    const subdomain = parts[0].toLowerCase();
    if (!RESERVED.includes(subdomain)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  const isAdminPath = pathname.startsWith("/admin");
  const isSuperAdminPath = pathname.startsWith("/superadmin");

  if (isAdminPath || isSuperAdminPath) {
    if (hasAuthCookie(req)) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "next",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static|api).*)"],
};
