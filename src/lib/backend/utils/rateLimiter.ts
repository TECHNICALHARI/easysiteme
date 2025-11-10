import { redis } from "@/lib/backend/config/redis";
import { RATE_CONFIG } from "../config/rate";

export type RateResult = {
  allowed: boolean;
  count: number;
  remaining: number;
  reset: number;
};

async function incrWithExpire(key: string, windowSec: number) {
  try {
    const count = Number(await redis.incr(key));
    if (count === 1) {
      await redis.expire(key, windowSec);
    }
    return count;
  } catch {
    return 1;
  }
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateResult> {
  const redisKey = `ratelimit:${key}`;
  try {
    const count = await incrWithExpire(redisKey, windowSec);
    let ttl = -1;
    try {
      ttl = Number(await redis.ttl(redisKey));
    } catch {
      ttl = -1;
    }
    if (!Number.isFinite(ttl) || ttl <= 0) {
      ttl = windowSec;
    }
    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    const reset = Math.floor(Date.now() / 1000) + ttl;
    return { allowed, count, remaining, reset };
  } catch {
    const now = Math.floor(Date.now() / 1000);
    const count = 1;
    const allowed = true;
    const remaining = Math.max(0, limit - count);
    const reset = now + windowSec;
    return { allowed, count, remaining, reset };
  }
}

export async function limitForContact(identifierKey: string) {
  const cfg = RATE_CONFIG.CONTACT;
  return rateLimit(`contact:${identifierKey}`, cfg.LIMIT, cfg.WINDOW_SECONDS);
}

export async function limitForOtp(identifierKey: string) {
  const cfg = RATE_CONFIG.OTP;
  return rateLimit(`otp:${identifierKey}`, cfg.LIMIT, cfg.WINDOW_SECONDS);
}

export async function limitPerIp(
  ip: string,
  opts?: { limit?: number; windowSec?: number }
) {
  const cfg = RATE_CONFIG.GLOBAL;
  return rateLimit(
    `ip:${ip}`,
    opts?.limit ?? cfg.LIMIT,
    opts?.windowSec ?? cfg.WINDOW_SECONDS
  );
}
