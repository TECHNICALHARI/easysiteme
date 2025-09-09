import { env } from "../config";
import { User } from "../models/User.model";
import { ApiError } from "../utils/errors";
import { verifyJwt } from "../utils/jwt";

export async function getAuthUserFromCookie(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const name = env.COOKIE_NAME || "myeasypage_auth";
  const match = cookie.split("; ").find((c) => c.startsWith(`${name}=`));
  if (!match) throw new ApiError("Unauthorized", 401);
  const token = match.split("=")[1];
  try {
    const payload = verifyJwt<{ userId: string }>(token);
    const user = await User.findById(payload.userId);
    if (!user) throw new ApiError("Unauthorized", 401);
    return user;
  } catch (err) {
    throw new ApiError("Unauthorized", 401);
  }
}
