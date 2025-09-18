import { NextRequest } from "next/server";
import { appConfig } from "@/lib/backend/config";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

function clearAuthCookie() {
  const name = appConfig.COOKIE_NAME || "myeasypage_auth";
  const isProd = (appConfig.NODE_ENV || "development") === "production";
  let cookie = `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
  if (isProd) cookie += "; Secure";
  return cookie;
}

export async function POST(req: NextRequest) {
  try {
    const res = successResponse({}, "Logged out", 200, req);
    res.headers.append("Set-Cookie", clearAuthCookie());
    return res;
  } catch (err: any) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}
