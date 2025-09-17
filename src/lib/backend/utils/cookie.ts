import { appConfig } from "../config";

export function createAuthCookie(token: string) {
  const maxAge = appConfig.JWT_EXPIRES_IN?.endsWith("d")
    ? parseInt(appConfig.JWT_EXPIRES_IN) * 24 * 60 * 60
    : 7 * 24 * 60 * 60;
  const secure = appConfig.NODE_ENV === "production";
  const domain =
    secure && appConfig.BASE_URL
      ? `; Domain=.${appConfig.BASE_URL.replace(/^https?:\/\//, "")}`
      : "";
  return `${appConfig.COOKIE_NAME}=${encodeURIComponent(
    token
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${
    secure ? " Secure;" : ""
  }${domain}`;
}
