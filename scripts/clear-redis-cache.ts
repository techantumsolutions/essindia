import { safeRedisDel, safeRedisKeys } from '../src/lib/redis';
import 'dotenv/config';

async function main() {
  console.log('Clearing Redis cache...');
  
  try {
    const keys = await safeRedisKeys('page:*');
    console.log(`Found page keys:`, keys);
    if (keys.length > 0) {
      await safeRedisDel(...keys);
      console.log('Deleted page keys.');
    }
    
    const navKeys = await safeRedisKeys('nav:*');
    console.log(`Found nav keys:`, navKeys);
    if (navKeys.length > 0) {
      await safeRedisDel(...navKeys);
      console.log('Deleted nav keys.');
    }

    const regKeys = await safeRedisKeys('registry:*');
    console.log(`Found registry keys:`, regKeys);
    if (regKeys.length > 0) {
      await safeRedisDel(...regKeys);
      console.log('Deleted registry keys.');
    }

    // Also clear other keys
    await safeRedisDel('page_paths');
    await safeRedisDel('header-main');
    console.log('Cache cleared successfully!');
  } catch (err) {
    console.error('Failed to clear cache:', err);
  }
  
  process.exit(0);
}

main();
