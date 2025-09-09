import { appConfig } from "../config";

export function getCorsHeaders(origin?: string) {
  const allowed = appConfig.FRONTEND_BASE_URL || "*";
  const o = origin || allowed;
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Credentials": "true",
  } as Record<string, string>;
}
