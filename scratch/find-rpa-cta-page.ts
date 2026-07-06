import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const pageSecs = await db.select().from(schema.pageSections).where(eq(schema.pageSections.type, 'rpa-cta'));
  console.log(`Found ${pageSecs.length} rpa-cta sections:`);
  for (const s of pageSecs) {
    const page = await db.query.pages.findFirst({
      where: eq(schema.pages.id, s.pageId)
    });
    console.log(`Page Section ID: ${s.id}, Page ID: ${s.pageId}, Page Title: ${page?.title}, Page Slug: ${page?.slug}, Full Path: ${page?.fullPath}`);
  }
  await client.end();
}

main().catch(console.error);
