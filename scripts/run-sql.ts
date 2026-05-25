import postgres from 'postgres';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

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
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false });

async function main() {
  console.log('Running manual migration statements...');
  
  // 1. Add page_id column to mega_menu_categories
  try {
    await sql.unsafe(`
      ALTER TABLE mega_menu_categories 
      ADD COLUMN IF NOT EXISTS page_id uuid REFERENCES pages(id) ON DELETE SET NULL;
    `);
    console.log('SUCCESS: Added page_id column to mega_menu_categories');
  } catch (err) {
    console.error('ERROR adding page_id:', err);
  }

  // 2. Truncate page_registry to satisfy the new unique constraint check
  try {
    await sql.unsafe(`TRUNCATE TABLE page_registry CASCADE;`);
    console.log('SUCCESS: Truncated page_registry');
  } catch (err) {
    console.error('ERROR truncating page_registry:', err);
  }

  await sql.end();
}

main().catch(console.error);
