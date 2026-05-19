/**
 * Ensures header navigation shell exists only — no demo mega menu content.
 * All categories/sub-items must be created in Admin → Navigation.
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as schema from '../src/lib/db/schema';

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

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  let [menu] = await db
    .select()
    .from(schema.navigationMenus)
    .where(eq(schema.navigationMenus.location, 'header-main'))
    .limit(1);

  if (!menu) {
    [menu] = await db
      .insert(schema.navigationMenus)
      .values({ name: 'Main Header', location: 'header-main' })
      .returning();
    console.log('Created header-main menu');
  }

  const existing = await db.query.navigationItems.findMany({
    where: eq(schema.navigationItems.menuId, menu.id),
  });

  if (existing.length === 0) {
    const defaults = [
      { label: 'Home', slug: 'home', url: '/', orderIndex: 0, megaMenuEnabled: false },
      { label: 'About', slug: 'about', url: '/about', orderIndex: 1, megaMenuEnabled: false },
      { label: 'Solutions', slug: 'solutions', url: '/solutions', orderIndex: 2, megaMenuEnabled: true },
      { label: 'Industries', slug: 'industries', url: '/industries', orderIndex: 3, megaMenuEnabled: true },
      { label: 'Contact', slug: 'contact', url: '/contact', orderIndex: 4, megaMenuEnabled: false },
    ];
    for (const item of defaults) {
      await db.insert(schema.navigationItems).values({ menuId: menu.id, ...item });
    }
    console.log('Created navigation items (no mega menu demo content).');
  } else {
    console.log('Navigation items already exist — skipped.');
  }

  console.log('Configure mega menu content in Admin → Navigation → Manage Mega Menu Structure.');
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
