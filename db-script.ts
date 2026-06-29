import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/lib/db/schema';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function run() {
  try {
    const allTemplates = await db.query.templates.findMany();
    console.log(JSON.stringify(allTemplates, null, 2));
  } catch(e) {
    console.error(e);
  } finally {
    client.end();
  }
}
run();
