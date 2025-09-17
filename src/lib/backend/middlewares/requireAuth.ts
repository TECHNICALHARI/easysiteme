import { appConfig } from "@/lib/backend/config";
import { verifyJwt } from "@/lib/backend/utils/jwt";
import { User } from "@/lib/backend/models/User.model";
import { ApiError } from "@/lib/backend/utils/errors";

function parseCookies(cookieHeader: string) {
  const kvs: Record<string, string> = {};
  if (!cookieHeader) return kvs;
  const parts = cookieHeader.split(";");
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    kvs[k] = decodeURIComponent(v);
  }
  return kvs;
}

export async function getAuthUserFromCookie(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const name = appConfig.COOKIE_NAME || "myeasypage_auth";
  const cookies = parseCookies(cookieHeader);
  const token = cookies[name];
  if (!token) return null;

  try {
    const payload = verifyJwt<{ sub: string }>(token);
    if (!payload?.sub) return null;
    const user = await User.findById(payload.sub);
    return user || null;
  } catch {
    return null;
  }
}
