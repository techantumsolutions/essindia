import { sql } from 'drizzle-orm';
import { db } from './index';
import { logger } from '@/lib/logger';

/**
 * Validates the database connection and ensures required tables exist.
 * This should be called during app initialization (e.g., in a root layout or custom server).
 */
export async function validateDatabase() {
  try {
    logger.info('[DB] Validating database connection...');
    
    // Simple query to check connection
    await db.execute(sql`SELECT 1`);
    logger.info('[DB] Connection successful');

    // Check if "pages" table exists
    const tableCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pages'
      );
    `);

    const exists = tableCheck[0]?.exists;

    if (!exists) {
      logger.error('[DB] CRITICAL: Table "pages" does not exist. Application may not function correctly.');
      return false;
    }

    logger.info('[DB] Required tables verified');
    return true;
  } catch (error) {
    logger.error('[DB] Validation failed', error);
    return false;
  }
}
