import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/db/schema';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('--- DIAGNOSTICS: DB SCAN ---');
  
  // Get all templates
  const tpls = await db.select().from(schema.templates);
  console.log('\n--- TEMPLATES IN DB ---');
  console.log(tpls.map(t => ({ id: t.id, name: t.name, slug: t.slug, status: t.status })));

  // Get all sections inside template_sections
  const tplSecs = await db.select().from(schema.templateSections);
  console.log('\n--- UNIQUE TEMPLATE SECTION TYPES IN DB ---');
  const uniqueTplTypes = Array.from(new Set(tplSecs.map(s => s.type)));
  console.log(uniqueTplTypes);

  // Find templates using mfg section types
  const mfgTplSecs = tplSecs.filter(s => s.type.startsWith('mfg-'));
  console.log('\n--- TEMPLATE SECTIONS MATCHING mfg-* ---');
  console.log(JSON.stringify(mfgTplSecs.map(s => ({ id: s.id, templateId: s.templateId, type: s.type, orderIndex: s.orderIndex, contentJson: s.contentJson })), null, 2));

  // Get all page sections
  const pageSecs = await db.select().from(schema.pageSections);
  console.log('\n--- UNIQUE PAGE SECTION TYPES IN DB ---');
  const uniquePageTypes = Array.from(new Set(pageSecs.map(s => s.type)));
  console.log(uniquePageTypes);

  // Find page sections using mfg section types
  const mfgPageSecs = pageSecs.filter(s => s.type.startsWith('mfg-'));
  console.log('\n--- PAGE SECTIONS MATCHING mfg-* ---');
  console.log(mfgPageSecs.map(s => ({ id: s.id, pageId: s.pageId, type: s.type, orderIndex: s.orderIndex })));

  await client.end();
}

main().catch(console.error);
