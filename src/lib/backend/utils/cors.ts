import { appConfig } from "../config";

export function getCorsHeaders(origin?: string) {
  const frontend = appConfig.FRONTEND_BASE_URL || "";
  const o = origin || frontend || "";
  const allowOrigin = o || "*";
  const allowCredentials = Boolean(o || frontend);

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,DELETE",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": String(allowCredentials),
  } as Record<string, string>;
}
