import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const client = postgres(connectionString || '', { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const pageSecs = await db.select().from(schema.pageSections).where(eq(schema.pageSections.type, 'rpa-overview'));
  console.log('Page sections found in DB:', pageSecs.length);
  for (const s of pageSecs) {
    console.log(`ID: ${s.id}, PageID: ${s.pageId}, Content: ${JSON.stringify(s.content)}`);
  }

  const tplSecs = await db.select().from(schema.templateSections).where(eq(schema.templateSections.type, 'rpa-overview'));
  console.log('Template sections found in DB:', tplSecs.length);
  for (const s of tplSecs) {
    console.log(`ID: ${s.id}, TemplateID: ${s.templateId}, ContentJson: ${JSON.stringify(s.contentJson)}`);
  }

  await client.end();
}

main().catch(console.error);
