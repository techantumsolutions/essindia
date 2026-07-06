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
  console.log('=== PAGE REGISTRY AUDIT ===\n');
  
  // Show registry rows with stale/old paths
  const registryRows = await sql`
    SELECT route_path, source, page_id, title, updated_at
    FROM page_registry
    ORDER BY source, route_path
  `;
  
  console.log('All registry entries:');
  for (const row of registryRows) {
    console.log(`  [${row.source}] ${row.route_path} -> pageId: ${row.page_id ?? 'NULL'} (${row.title})`);
  }

  console.log('\n=== CROSS-CHECK: Pages whose fullPath != any registry entry ===');
  const pages = await sql`
    SELECT p.id, p.title, p.full_path,
           pr.route_path as registry_path
    FROM pages p
    LEFT JOIN page_registry pr ON pr.page_id = p.id
    WHERE p.is_template = false
    ORDER BY p.title
  `;
  
  for (const p of pages) {
    if (p.registry_path !== p.full_path) {
      console.log(`  MISMATCH: "${p.title}"`);
      console.log(`    DB path:       ${p.full_path}`);
      console.log(`    Registry path: ${p.registry_path ?? 'NOT IN REGISTRY'}`);
    }
  }
  
  console.log('\n=== STALE REGISTRY (old path entries without matching page) ===');
  const stale = await sql`
    SELECT pr.id, pr.route_path, pr.source, pr.title
    FROM page_registry pr
    WHERE pr.page_id IS NULL
    ORDER BY pr.route_path
  `;
  
  for (const row of stale) {
    console.log(`  [${row.source}] ${row.route_path} - "${row.title}"`);
  }

  await sql.end();
}

main().catch(console.error);
