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
  console.log('🚀 Starting migration of rpa-frameworks sections in database...');

  // 1. Update Template Sections
  const tplSecs = await db.select().from(schema.templateSections).where(eq(schema.templateSections.type, 'rpa-frameworks'));
  console.log(`Found ${tplSecs.length} template sections to check.`);
  for (const s of tplSecs) {
    const content = (s.contentJson as Record<string, any>) || {};
    if (!('autoScroll' in content)) {
      content.autoScroll = true;
      await db.update(schema.templateSections)
        .set({ contentJson: content })
        .where(eq(schema.templateSections.id, s.id));
      console.log(`Updated Template Section ID ${s.id} with autoScroll: true`);
    }
  }

  // 2. Update Library Sections
  const libSecs = await db.select().from(schema.sections).where(eq(schema.sections.type, 'rpa-frameworks'));
  console.log(`Found ${libSecs.length} library sections to check.`);
  for (const s of libSecs) {
    const content = (s.contentJson as Record<string, any>) || {};
    if (!('autoScroll' in content)) {
      content.autoScroll = true;
      await db.update(schema.sections)
        .set({ contentJson: content })
        .where(eq(schema.sections.id, s.id));
      console.log(`Updated Library Section ID ${s.id} with autoScroll: true`);
    }
  }

  // 3. Update Page Sections
  const pageSecs = await db.select().from(schema.pageSections).where(eq(schema.pageSections.type, 'rpa-frameworks'));
  console.log(`Found ${pageSecs.length} page sections to check.`);
  for (const s of pageSecs) {
    const content = (s.content as Record<string, any>) || {};
    if (!('autoScroll' in content)) {
      content.autoScroll = true;
      await db.update(schema.pageSections)
        .set({ content: content })
        .where(eq(schema.pageSections.id, s.id));
      console.log(`Updated Page Section ID ${s.id} with autoScroll: true`);
    }
  }

  console.log('✅ Database migration completed successfully!');
  await client.end();
}

main().catch(console.error);
