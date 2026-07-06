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
  console.log('=== CTA TEMPLATE SECTIONS IN DB ===');
  const tplSecs = await db.select().from(schema.templateSections);
  const ctaTplSecs = tplSecs.filter(s => s.type.endsWith('-cta') || s.type === 'about-us-cta' || s.type === 'career-cta');
  for (const s of ctaTplSecs) {
    console.log(`Template Section: ID=${s.id}, Type=${s.type}, Keys=${Object.keys(s.contentJson as any)}, Values=${JSON.stringify(s.contentJson)}`);
  }

  console.log('\n=== CTA PAGE SECTIONS IN DB ===');
  const pageSecs = await db.select().from(schema.pageSections);
  const ctaPageSecs = pageSecs.filter(s => s.type.endsWith('-cta') || s.type === 'about-us-cta' || s.type === 'career-cta');
  for (const s of ctaPageSecs) {
    console.log(`Page Section: ID=${s.id}, Type=${s.type}, Keys=${Object.keys(s.content as any)}, Values=${JSON.stringify(s.content)}`);
  }

  await client.end();
}

main().catch(console.error);
