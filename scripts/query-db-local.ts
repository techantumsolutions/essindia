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
  console.log('--- ALL PAGES ---');
  
  const pagesList = await db.select().from(schema.pages).where(eq(schema.pages.isTemplate, false));
  console.log(JSON.stringify(pagesList.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    fullPath: p.fullPath,
    navigationItemId: p.navigationItemId,
    megaMenuCategoryId: p.megaMenuCategoryId,
    megaMenuSubCategoryId: p.megaMenuSubCategoryId,
    megaMenuSubSubCategoryId: p.megaMenuSubSubCategoryId
  })), null, 2));

  await client.end();
}

import { eq } from 'drizzle-orm';
main().catch(console.error);
