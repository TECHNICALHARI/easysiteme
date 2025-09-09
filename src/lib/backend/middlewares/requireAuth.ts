import { appConfig } from "@/lib/backend/config";
import { verifyJwt } from "@/lib/backend/utils/jwt";
import { ApiError } from "@/lib/backend/utils/errors";
import { User } from "@/lib/backend/models/User.model";
import type { NextRequest } from "next/server";

export async function getAuthUserFromCookie(req: Request | NextRequest) {
  const cookie = (req.headers?.get?.("cookie") ?? "") as string;
  const name = appConfig.COOKIE_NAME || "myeasypage_auth";
  const match = cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!match) throw new ApiError("Unauthorized", 401);
  const token = match.split("=")[1];
  try {
    const payload = verifyJwt<{ sub: string; roles?: string[] }>(token);
    const user = await User.findById(payload.sub).exec();
    if (!user) throw new ApiError("Unauthorized", 401);
    return user;
  } catch (err) {
    throw new ApiError("Unauthorized", 401);
  }
}
