import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

const CTA_TYPES = [
  'about-us-cta',
  'career-cta',
  'ass-cta',
  'fmcg-cta',
  'oracle-cta',
  'rpa-cta',
  'oracle-apex-cta'
];

async function main() {
  console.log('🚀 Starting migration of CTA sections in database...');

  // 1. Update Template Sections
  const tplSecs = await db.select().from(schema.templateSections).where(inArray(schema.templateSections.type, CTA_TYPES));
  console.log(`Found ${tplSecs.length} template sections to check.`);
  for (const s of tplSecs) {
    const content = (s.contentJson as Record<string, any>) || {};
    if (!('pdfUrl' in content)) {
      content.pdfUrl = '';
      await db.update(schema.templateSections)
        .set({ contentJson: content })
        .where(eq(schema.templateSections.id, s.id));
      console.log(`Updated Template Section ID ${s.id} (${s.type}) with pdfUrl`);
    }
  }

  // 2. Update Library Sections
  const libSecs = await db.select().from(schema.sections).where(inArray(schema.sections.type, CTA_TYPES));
  console.log(`Found ${libSecs.length} library sections to check.`);
  for (const s of libSecs) {
    const content = (s.contentJson as Record<string, any>) || {};
    if (!('pdfUrl' in content)) {
      content.pdfUrl = '';
      await db.update(schema.sections)
        .set({ contentJson: content })
        .where(eq(schema.sections.id, s.id));
      console.log(`Updated Library Section ID ${s.id} (${s.type}) with pdfUrl`);
    }
  }

  // 3. Update Page Sections
  const pageSecs = await db.select().from(schema.pageSections).where(inArray(schema.pageSections.type, CTA_TYPES));
  console.log(`Found ${pageSecs.length} page sections to check.`);
  for (const s of pageSecs) {
    const content = (s.content as Record<string, any>) || {};
    if (!('pdfUrl' in content)) {
      content.pdfUrl = '';
      await db.update(schema.pageSections)
        .set({ content: content })
        .where(eq(schema.pageSections.id, s.id));
      console.log(`Updated Page Section ID ${s.id} (${s.type}) with pdfUrl`);
    }
  }

  console.log('✅ Database migration completed successfully!');
  await client.end();
}

main().catch(console.error);
