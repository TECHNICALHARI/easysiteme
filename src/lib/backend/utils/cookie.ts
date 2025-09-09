import { appConfig } from "../config";

export function createAuthCookie(token: string) {
  const maxAge = appConfig.JWT_EXPIRES_IN?.endsWith("d")
    ? parseInt(appConfig.JWT_EXPIRES_IN) * 24 * 60 * 60
    : 7 * 24 * 60 * 60;
  const secure = appConfig.NODE_ENV === "production";
  return `${
    appConfig.COOKIE_NAME
  }=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge};${
    secure ? " Secure;" : ""
  }`;
}
