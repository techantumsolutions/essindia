/**
 * Backfill page navigation hierarchy fields for existing CMS pages.
 * Run: npm run db:backfill-page-hierarchy
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

type PageRow = {
  id: string;
  parent_id: string | null;
  navigation_item_id: string | null;
  mega_menu_category_id: string | null;
  mega_menu_sub_category_id: string | null;
  mega_menu_sub_sub_category_id: string | null;
  depth_level: number;
  sort_order: number;
};

async function main() {
  const pages = await sql<PageRow[]>`
    SELECT
      id,
      parent_id,
      navigation_item_id,
      mega_menu_category_id,
      mega_menu_sub_category_id,
      mega_menu_sub_sub_category_id,
      depth_level,
      sort_order
    FROM pages
    WHERE is_template = false
  `;

  const byId = new Map(pages.map((page) => [page.id, page]));
  let updated = 0;

  for (const page of pages) {
    let navigationItemId = page.navigation_item_id;
    let depthLevel = page.depth_level || 0;
    let parentId = page.parent_id;

    if (parentId && byId.has(parentId)) {
      const parent = byId.get(parentId)!;
      if (!navigationItemId && parent.navigation_item_id) {
        navigationItemId = parent.navigation_item_id;
      }
    }

    if (!depthLevel || depthLevel <= 0) {
      if (page.mega_menu_sub_sub_category_id) depthLevel = 3;
      else if (page.mega_menu_sub_category_id) depthLevel = 2;
      else if (page.mega_menu_category_id) depthLevel = 1;
      else if (parentId && byId.has(parentId)) {
        const parentDepth = byId.get(parentId)!.depth_level || 0;
        depthLevel = parentDepth > 0 ? parentDepth + 1 : 2;
      } else if (navigationItemId) {
        depthLevel = 1;
      }
    }

    if (!navigationItemId && page.mega_menu_category_id) {
      const [cat] = await sql<{ navigation_item_id: string | null }[]>`
        SELECT navigation_item_id FROM mega_menu_categories WHERE id = ${page.mega_menu_category_id} LIMIT 1
      `;
      navigationItemId = cat?.navigation_item_id ?? null;
    }

    const siblings = pages.filter((candidate) => {
      if (candidate.id === page.id) return false;
      if ((candidate.parent_id ?? null) !== (parentId ?? null)) return false;
      if (navigationItemId) return candidate.navigation_item_id === navigationItemId;
      return !candidate.navigation_item_id;
    });

    const sortOrder =
      page.sort_order && page.sort_order > 0
        ? page.sort_order
        : siblings.length + 1;

    const changed =
      navigationItemId !== page.navigation_item_id ||
      depthLevel !== page.depth_level ||
      sortOrder !== page.sort_order;

    if (changed) {
      await sql`
        UPDATE pages
        SET
          navigation_item_id = ${navigationItemId},
          depth_level = ${depthLevel},
          sort_order = ${sortOrder},
          updated_at = NOW()
        WHERE id = ${page.id}
      `;
      page.navigation_item_id = navigationItemId;
      page.depth_level = depthLevel;
      page.sort_order = sortOrder;
      updated += 1;
    }
  }

  console.log(`Backfilled ${updated} of ${pages.length} pages.`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
