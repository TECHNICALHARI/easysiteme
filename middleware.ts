// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const RESERVED = ['www', 'admin', 'superadmin', 'api'];
const BASE_DOMAIN = 'easysiteme.com';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();
  const cleanHost = host.replace(/:\d+$/, ''); // remove port

  // 💡 if it's a custom domain (not easysiteme.com)
  const isCustom = !cleanHost.endsWith(BASE_DOMAIN);
  if (isCustom) {
    url.pathname = `/custom/${cleanHost}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // 💡 Subdomain (rahul.easysiteme.com)
  const parts = cleanHost.split('.');
  if (parts.length === 3) {
    const subdomain = parts[0];
    if (!RESERVED.includes(subdomain)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 💡 Base domain: easysiteme.com — let it render normally (no rewrite)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|static|api).*)'],
};
