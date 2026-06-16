/**
 * Applies page hierarchy columns (depth_level, sort_order).
 * Run: npm run db:apply-page-hierarchy
 */
import postgres from 'postgres';
import { readFileSync, existsSync } from 'fs';
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
const migrationPath = resolve(process.cwd(), 'src/lib/db/migrations/0006_page_hierarchy.sql');

async function main() {
  const migrationSql = readFileSync(migrationPath, 'utf8');
  for (const statement of migrationSql.split(';').map((s) => s.trim()).filter(Boolean)) {
    await sql.unsafe(`${statement};`);
    console.log('OK:', statement.slice(0, 55).replace(/\s+/g, ' '), '...');
  }
  console.log('Page hierarchy migration applied.');
  await sql.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
