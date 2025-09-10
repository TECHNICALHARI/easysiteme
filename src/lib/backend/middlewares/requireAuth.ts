import { appConfig } from "@/lib/backend/config";
import { verifyJwt } from "@/lib/backend/utils/jwt";
import { User } from "@/lib/backend/models/User.model";
import { ApiError } from "@/lib/backend/utils/errors";

export async function getAuthUserFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const name = appConfig.COOKIE_NAME || "myeasypage_auth";
  const match = cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!match) throw new ApiError("Unauthorized", 401);
  const token = match.split("=")[1];
  try {
    const payload = verifyJwt<{ sub: string }>(token);
    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError("Unauthorized", 401);
    return user;
  } catch {
    throw new ApiError("Unauthorized", 401);
  }
}
