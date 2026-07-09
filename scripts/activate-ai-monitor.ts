import postgres from 'postgres';
import 'dotenv/config';
import Redis from 'ioredis';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

async function main() {
  // 1. Update isActive to true for europe-ai-monitor in page_sections
  const result = await sql`UPDATE page_sections SET is_active = true WHERE type = 'europe-ai-monitor'`;
  console.log(`Updated page_sections column is_active to true.`);

  // 2. Clear Redis cache for the page
  const redis = new Redis(REDIS_URL);
  const keys = await redis.keys('page:*');
  if (keys.length > 0) {
    await redis.del(...keys);
    console.log(`Deleted Redis cache keys: ${keys.join(', ')}`);
  } else {
    console.log('No cached pages found in Redis.');
  }

  await redis.quit();
  await sql.end();
}

main().catch(console.error);
