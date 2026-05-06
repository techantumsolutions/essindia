import Redis from "ioredis";
import { logger } from "@/lib/logger";

declare global {
  var redis: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_TIMEOUT_MS = 500; // Snappier timeout for enterprise UX

export const redisClient =
  global.redis ||
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    lazyConnect: true,
    retryStrategy(times) {
      // Very aggressive backoff if Redis is missing to avoid log spam
      if (times > 3) return null; // Stop retrying after 3 attempts if it fails
      return Math.min(times * 1000, 5000);
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redisClient;
}

let isRedisHealthy = true;
let hasLoggedMissingRedis = false;

redisClient.on('error', (err) => {
  isRedisHealthy = false;
  if (!hasLoggedMissingRedis) {
    logger.debug('[Redis] Cache unavailable, using direct database fallback', { 
      detail: err.message || 'Connection refused' 
    });
    hasLoggedMissingRedis = true;
  }
});

redisClient.on('connect', () => {
  isRedisHealthy = true;
  hasLoggedMissingRedis = false;
  logger.info('[Redis] Cache connection established');
});

/**
 * Executes a cache operation with a timeout
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Redis Timeout')), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  // If Redis is unhealthy or not connected, bypass immediately
  if (!isRedisHealthy || redisClient.status !== 'ready') {
    return await fetcher();
  }

  try {
    const cached = await withTimeout(redisClient.get(key), REDIS_TIMEOUT_MS);
    
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (e) {
        logger.debug('[Redis] Serialization error', { key });
      }
    }

    const data = await fetcher();
    
    if (data !== undefined && data !== null) {
      // Non-blocking set
      redisClient.setex(key, ttlSeconds, JSON.stringify(data)).catch(() => {
        // Silently fail on set errors
      });
    }

    return data;
  } catch (error) {
    // Graceful fallback
    return await fetcher();
  }
}

export default redisClient;
