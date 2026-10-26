import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prefer pooled transaction connection (port 6543) for app queries to prevent EMAXCONNSESSION
const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

type DbGlobals = {
  postgresClient?: ReturnType<typeof postgres>;
  postgresConnStr?: string;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalDb = globalThis as typeof globalThis & DbGlobals;

function createClient() {
  const masked = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log('[DB] Initializing postgres client with:', masked);
  return postgres(connectionString, {
    prepare: false,
    max: Number(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 10 : 3)),
    idle_timeout: 4,
    connect_timeout: 10,
    max_lifetime: 60,
  });
}

// Reset client if connection string changed during development
if (globalDb.postgresClient && globalDb.postgresConnStr !== connectionString) {
  try {
    globalDb.postgresClient.end({ timeout: 1 });
  } catch {}
  globalDb.postgresClient = undefined;
  globalDb.drizzleDb = undefined;
}

/** Singleton client — prevents "Connection is closed" during Next.js HMR. */
export const client = globalDb.postgresClient ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalDb.postgresClient = client;
  globalDb.postgresConnStr = connectionString;
}

export const db = globalDb.drizzleDb ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalDb.drizzleDb = db;
}
