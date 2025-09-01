// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const RESERVED = ["www", "admin", "superadmin", "api"];
const BASE_DOMAIN = "myeasypage.com";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const cleanHost = host.replace(/:\d+$/, ""); // remove port if exists
  const parts = cleanHost.split(".");

  // 1. If it's a custom domain (not *.myeasypage.com)
  if (!cleanHost.endsWith(BASE_DOMAIN)) {
    url.pathname = `/custom/${cleanHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Subdomain (username.myeasypage.com)
  if (parts.length === 3) {
    const subdomain = parts[0].toLowerCase();
    if (!RESERVED.includes(subdomain)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Base domain (myeasypage.com) → Promotion / Marketing site
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|static|api).*)"],
};
