import Redis from "ioredis";

declare global {
  var redis: Redis | undefined;
}

export const redisClient =
  global.redis ||
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    lazyConnect: true,
    retryStrategy(times) {
      return Math.min(times * 200, 2000);
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redisClient;
}

redisClient.on('error', (err) => {
  console.warn('[Redis] Connection error:', err.message);
});

export default redisClient;

// Helper to cache function results safely
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  try {
    if (redisClient.status !== 'ready') {
      return await fetcher();
    }

    const cached = await redisClient.get(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (e) {
        // Ignore parse error and fetch fresh
      }
    }

    const data = await fetcher();
    await redisClient.setex(key, ttlSeconds, JSON.stringify(data));
    return data;
  } catch (error) {
    console.warn('[Redis] Cache error, falling back to fetcher:', error);
    return await fetcher();
  }
}
