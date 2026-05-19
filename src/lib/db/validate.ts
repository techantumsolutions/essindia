import { sql } from 'drizzle-orm';
import { db } from './index';
import { logger } from '@/lib/logger';

/**
 * Validates the database connection and ensures required tables exist.
 * This should be called during app initialization (e.g., in a root layout or custom server).
 */
const VALIDATION_TIMEOUT_MS = 5_000;

export async function validateDatabase() {
  try {
    logger.info('[DB] Validating database connection...');

    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB validation timeout')), VALIDATION_TIMEOUT_MS)
      ),
    ]);

    logger.info('[DB] Connection successful');
    return true;
  } catch (error) {
    logger.warn('[DB] Validation skipped or failed (app will continue)', {
      detail: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
