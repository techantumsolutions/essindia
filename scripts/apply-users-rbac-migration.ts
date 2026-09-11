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
  console.log('🚀 Applying users & RBAC schema updates...');

  const statements = [
    `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "plain_password" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" varchar(50) DEFAULT 'active' NOT NULL;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "access_permissions" jsonb DEFAULT '{"cms": true, "charts": true}'::jsonb;`
  ];

  for (const statement of statements) {
    try {
      await sql.unsafe(statement);
      console.log('✅ OK:', statement);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists') || msg.includes('duplicate')) {
        console.log('ℹ️ SKIP (exists):', statement);
      } else {
        console.error('❌ Error executing SQL statement:', statement, err);
      }
    }
  }

  console.log('🎉 Users RBAC migration completed successfully!');
  await sql.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
