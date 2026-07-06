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
  console.log('=== FIXING PAGE REGISTRY ===\n');

  // Step 1: Get all non-template pages and their correct fullPaths
  const pages = await sql`
    SELECT id, title, full_path
    FROM pages
    WHERE is_template = false
    ORDER BY title
  `;

  // Step 2: For each page, ensure there is a registry row with route_path = full_path
  // and remove any stale registry rows for the same page_id but with a different route_path

  let fixed = 0;
  let deleted = 0;

  for (const page of pages) {
    // Find all registry rows for this page
    const regRows = await sql`
      SELECT id, route_path FROM page_registry WHERE page_id = ${page.id}
    `;

    const correctPath = page.full_path;
    const correctRow = regRows.find(r => r.route_path === correctPath);
    const staleRows = regRows.filter(r => r.route_path !== correctPath);

    if (!correctRow) {
      // Insert correct registry row
      await sql`
        INSERT INTO page_registry (route_path, source, page_id, title, page_type, last_scanned_at, created_at, updated_at)
        VALUES (${correctPath}, 'cms', ${page.id}, ${page.title}, 'standard', NOW(), NOW(), NOW())
        ON CONFLICT (route_path) DO UPDATE SET page_id = ${page.id}, title = ${page.title}, updated_at = NOW()
      `;
      console.log(`  INSERTED correct registry: "${page.title}" -> ${correctPath}`);
      fixed++;
    }

    // Delete stale rows for this page
    for (const stale of staleRows) {
      await sql`DELETE FROM page_registry WHERE id = ${stale.id}`;
      console.log(`  DELETED stale registry: "${page.title}" -> ${stale.route_path}`);
      deleted++;
    }
  }

  // Step 3: Delete orphaned registry rows (no page_id, source=cms)
  const orphans = await sql`
    SELECT id, route_path, title FROM page_registry
    WHERE page_id IS NULL AND source = 'cms'
  `;
  
  for (const orphan of orphans) {
    await sql`DELETE FROM page_registry WHERE id = ${orphan.id}`;
    console.log(`  DELETED orphan cms entry: ${orphan.route_path} ("${orphan.title}")`);
    deleted++;
  }

  console.log(`\n✅ Done. Inserted/updated: ${fixed}, Deleted stale: ${deleted}`);

  await sql.end();
}

main().catch(console.error);
