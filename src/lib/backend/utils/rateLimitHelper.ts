import { NextRequest, NextResponse } from "next/server";
import { RATE_CONFIG, RateConfigKey } from "@/lib/backend/config/rate";
import { rateLimit } from "@/lib/backend/utils/rateLimiter";

export function buildRateLimitResponse(
  message: string,
  limit: number,
  rl: { remaining: number; reset: number },
  status = 429
) {
  const res = NextResponse.json({ success: false, message }, { status });
  const retryAfter = Math.max(1, rl.reset - Math.floor(Date.now() / 1000));
  res.headers.set("Retry-After", String(retryAfter));
  res.headers.set("X-RateLimit-Limit", String(limit));
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
  res.headers.set("X-RateLimit-Reset", String(rl.reset));
  return res;
}

export async function enforceRateLimit(
  type: RateConfigKey,
  identifier: string,
  req: NextRequest,
  message?: string
): Promise<NextResponse | null> {
  const cfg = RATE_CONFIG[type];
  const rl = await rateLimit(
    `${type.toLowerCase()}:${identifier}`,
    cfg.LIMIT,
    cfg.WINDOW_SECONDS
  );
  if (!rl.allowed) {
    return buildRateLimitResponse(
      message ?? `Too many ${type.toLowerCase()} requests`,
      cfg.LIMIT,
      rl
    );
  }
  return null;
}
