import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prefer pooled transaction connection (port 6543) for app queries to prevent EMAXCONNSESSION
const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

type DbGlobals = {
  postgresClient?: ReturnType<typeof postgres>;
  postgresConnStr?: string;
  postgresConfigVersion?: number;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalDb = globalThis as typeof globalThis & DbGlobals;
const CLIENT_CONFIG_VERSION = 3;

function createClient() {
  const masked = connectionString.replace(/:[^:@]+@/, ':****@');
  console.log('[DB] Initializing postgres client with:', masked);
  // max_pipeline must be 0 on Supabase transaction pooler (port 6543). postgres.js
  // otherwise pipelines queued queries onto a busy connection and the pool deadlocks
  // until the TCP timeout (~2 min), which makes pages and APIs appear to hang.
  return postgres(connectionString, {
    prepare: false,
    max: Number(process.env.DB_POOL_MAX || 10),
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
    max_pipeline: 0,
  } as Parameters<typeof postgres>[1]);
}

// Reset client if connection string or pool options changed (HMR / config bump)
if (
  globalDb.postgresClient &&
  (globalDb.postgresConnStr !== connectionString || globalDb.postgresConfigVersion !== CLIENT_CONFIG_VERSION)
) {
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
  globalDb.postgresConfigVersion = CLIENT_CONFIG_VERSION;
}

export const db = globalDb.drizzleDb ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalDb.drizzleDb = db;
}
