/**
 * Removes all mega menu category/sub/sub-sub rows (keeps navigation items).
 * Use when demo seed data still appears in the public menu.
 * Run: npm run db:clear-mega-demo
 */
import postgres from 'postgres';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
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

const sql = postgres(connectionString, { prepare: false });

async function main() {
  await sql`DELETE FROM mega_menu_sub_sub_categories`;
  await sql`DELETE FROM mega_menu_sub_categories`;
  await sql`DELETE FROM mega_menu_categories`;
  console.log('Cleared all mega menu hierarchy rows. Configure content in Admin → Navigation.');
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
