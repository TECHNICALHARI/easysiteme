import { appConfig } from '@/backend/config';
import IORedis from 'ioredis';
const WINDOW_DEFAULT = 3600;
let redis: IORedis.Redis | null = null;
if (appConfig.REDIS_URL) redis = new IORedis(appConfig.REDIS_URL);
const mem = new Map<string, { count:number; expiresAt:number }>();
async function redisConsume(key:string,limit:number,windowSec:number){
  if(!redis) return inMemoryConsume(key,limit,windowSec);
  const val = await redis.incr(key);
  if(val===1) await redis.expire(key,windowSec);
  const ttl = await redis.ttl(key);
  return { success: val<=limit, remaining: Math.max(0, limit-val), reset: ttl };
}
function inMemoryConsume(key:string,limit:number,windowSec:number){
  const now = Date.now();
  const entry = mem.get(key);
  if(!entry || entry.expiresAt <= now){
    mem.set(key,{ count:1, expiresAt: now + windowSec*1000 });
    return { success: 1<=limit, remaining: Math.max(0, limit-1), reset: windowSec };
  }
  entry.count += 1;
  mem.set(key, entry);
  return { success: entry.count <= limit, remaining: Math.max(0, limit-entry.count), reset: Math.ceil((entry.expiresAt - now)/1000) };
}
export async function rateLimitConsume(key:string,limit=5,windowSec=WINDOW_DEFAULT){
  return redisConsume(key,limit,windowSec);
}
