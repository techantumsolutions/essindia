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

async function testUpdate(id: string, title: string, newPath: string) {
  console.log(`Attempting to update page "${title}" (ID: ${id}) to new path "${newPath}"...`);
  try {
    // 1. Update pages table
    const resPages = await sql`
      UPDATE pages
      SET full_path = ${newPath}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, full_path
    `;
    console.log(`  - pages table update result:`, resPages);

    // 2. Update page_registry table
    const resReg = await sql`
      INSERT INTO page_registry (route_path, source, page_id, title, page_type, last_scanned_at, created_at, updated_at)
      VALUES (${newPath}, 'cms', ${id}, ${title}, 'standard', NOW(), NOW(), NOW())
      ON CONFLICT (route_path) DO UPDATE SET page_id = ${id}, updated_at = NOW()
      RETURNING id, route_path
    `;
    console.log(`  - page_registry insert/update result:`, resReg);

    console.log(`  - Update succeeded!`);
  } catch (err) {
    console.error(`  - ERROR updating "${title}":`, err);
  }
}

async function main() {
  await testUpdate(
    'db8e191c-71d8-49ce-af19-2c1db198453b',
    'BI ROI Calculator',
    '/solutions/bi/industry-solutions/bi-roi-calculator'
  );

  await testUpdate(
    '6de8b96d-4e97-483f-bb2c-f741807d901c',
    'RPA in Retail',
    '/solutions/rpa/industry-solutions/rpa-in-retail'
  );

  await testUpdate(
    '7075d8fb-00f4-42b4-b89e-e747f8d32a4a',
    'ERP Overview',
    '/solutions/erp/erp-overview'
  );

  await sql.end();
}

main().catch(console.error);
