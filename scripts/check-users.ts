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

async function main() {
  console.log('🔍 Checking users in database...');
  const rows = await sql`SELECT id, email, role, status, plain_password, password_hash FROM users`;
  console.log('User rows:', rows);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
