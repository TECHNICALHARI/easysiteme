import { redis } from "@/lib/backend/config/redis";
import { RATE_CONFIG } from "../config/rate";

export type RateResult = {
  allowed: boolean;
  count: number;
  remaining: number;
  reset: number;
};

async function incrWithExpire(key: string, windowSec: number) {
  const tx = redis.multi();
  tx.incr(key);
  tx.expire(key, windowSec);
  const res = (await tx.exec()) as any[];
  const count = Number(res?.[0] ?? 0);
  return count;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateResult> {
  const redisKey = `ratelimit:${key}`;
  const count = await incrWithExpire(redisKey, windowSec);
  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);
  const reset = Math.floor(Date.now() / 1000) + windowSec;
  return { allowed, count, remaining, reset };
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
