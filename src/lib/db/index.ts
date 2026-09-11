import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Prefer direct connection when set — avoids pooler statement timeouts on heavy admin queries.
const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

const poolMax = Number(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 10 : 5));

type DbGlobals = {
  postgresClient?: ReturnType<typeof postgres>;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

const globalDb = globalThis as typeof globalThis & DbGlobals;

function createClient() {
  return postgres(connectionString, {
    prepare: false,
    max: Number(process.env.DB_POOL_MAX || (process.env.NODE_ENV === 'production' ? 5 : 3)),
    idle_timeout: 5,
    connect_timeout: 10,
    max_lifetime: 60 * 5,
  });
}

/** Singleton client — prevents "Connection is closed" during Next.js HMR. */
export const client = globalDb.postgresClient ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalDb.postgresClient = client;
}

export const db = globalDb.drizzleDb ?? drizzle(client, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalDb.drizzleDb = db;
}
