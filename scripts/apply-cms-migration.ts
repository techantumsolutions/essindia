/**
 * Applies enterprise CMS schema extensions safely (idempotent).
 * Run: npm run db:apply-cms
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

const migrationPath = resolve(process.cwd(), 'src/lib/db/migrations/0001_enterprise_cms.sql');

async function main() {
  const migrationSql = readFileSync(migrationPath, 'utf8');
  const statements = migrationSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
      console.log('OK:', statement.slice(0, 70).replace(/\s+/g, ' ') + '...');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        console.log('SKIP (exists):', statement.slice(0, 50) + '...');
      } else {
        throw err;
      }
    }
  }
  console.log('CMS migration applied successfully.');
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
