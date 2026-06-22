import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './src/lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { safeRedisDel } from './src/lib/redis';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();
const conn = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!conn) {
  console.error('DATABASE_URL required');
  process.exit(1);
}

const client = postgres(conn, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const pages = await db.select().from(schema.pages);
  console.log('--- Pages with Mega Menu IDs & Sort Orders ---');
  console.log(pages.map(p => ({
    id: p.id,
    title: p.title,
    navigationItemId: p.navigationItemId,
    megaMenuCategoryId: p.megaMenuCategoryId,
    megaMenuSubCategoryId: p.megaMenuSubCategoryId,
    megaMenuSubSubCategoryId: p.megaMenuSubSubCategoryId,
    sortOrder: p.sortOrder
  })));

  await client.end();
}

main().catch(console.error);
