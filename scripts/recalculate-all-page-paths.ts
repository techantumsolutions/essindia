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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildFullPath(parentPath: string | null, slug: string): string {
  if (!parentPath || parentPath === '/') {
    return slug === 'index' ? '/' : `/${slug}`;
  }
  const base = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
  return `${base}/${slug}`;
}

function buildPagePathFromNavHierarchy(input: {
  navSlug: string;
  categorySlug?: string;
  subSlug?: string;
  subSubSlug?: string;
  pageSlug?: string;
}): string {
  const parts = [input.navSlug.replace(/^\//, '')];
  if (input.categorySlug) parts.push(input.categorySlug);
  if (input.subSlug) parts.push(input.subSlug);
  if (input.subSubSlug) parts.push(input.subSubSlug);
  
  if (input.pageSlug) {
    const lastPart = parts[parts.length - 1];
    if (input.pageSlug !== lastPart && input.pageSlug !== input.navSlug.replace(/^\//, '')) {
      parts.push(input.pageSlug);
    }
  }
  return `/${parts.join('/')}`;
}

function buildPagePathFromNavAndCategorySlugs(
  navSlug: string,
  categorySlugs: string[],
  pageSlug?: string
): string {
  const parts = [navSlug.replace(/^\//, ''), ...categorySlugs].filter(Boolean);
  if (pageSlug) {
    const lastPart = parts[parts.length - 1];
    if (pageSlug !== lastPart && pageSlug !== navSlug.replace(/^\//, '')) {
      parts.push(pageSlug);
    }
  }
  return `/${parts.join('/')}`;
}

async function getCategorySlugPath(categoryId: string): Promise<string[]> {
  const slugs: string[] = [];
  let currentId: string | null = categoryId;

  while (currentId) {
    const [row] = await sql<{ slug: string; parent_id: string | null; status: string }[]>`
      SELECT slug, parent_id, status FROM categories WHERE id = ${currentId} LIMIT 1
    `;

    if (!row || row.status === 'archived') {
      break;
    }
    slugs.unshift(row.slug);
    currentId = row.parent_id;
  }

  return slugs;
}

async function main() {
  console.log('Fetching all pages...');
  const allPages = await sql<{
    id: string;
    parent_id: string | null;
    title: string;
    slug: string;
    full_path: string;
    navigation_item_id: string | null;
    category_id: string | null;
    mega_menu_category_id: string | null;
    mega_menu_sub_category_id: string | null;
    mega_menu_sub_sub_category_id: string | null;
  }[]>`
    SELECT id, parent_id, title, slug, full_path, navigation_item_id, category_id, mega_menu_category_id, mega_menu_sub_category_id, mega_menu_sub_sub_category_id
    FROM pages
    WHERE is_template = false
  `;

  console.log('Fetching navigation structure...');
  const navs = await sql<{ id: string; label: string; slug: string | null }[]>`
    SELECT id, label, slug FROM navigation_items
  `;
  const navMap = new Map(navs.map(n => [n.id, n]));

  const megaCats = await sql<{ id: string; slug: string; navigation_item_id: string | null }[]>`
    SELECT id, slug, navigation_item_id FROM mega_menu_categories
  `;
  const megaCatMap = new Map(megaCats.map(c => [c.id, c]));

  const megaSubs = await sql<{ id: string; slug: string; category_id: string | null }[]>`
    SELECT id, slug, category_id FROM mega_menu_sub_categories
  `;
  const megaSubMap = new Map(megaSubs.map(s => [s.id, s]));

  const megaSubSubs = await sql<{ id: string; slug: string; sub_category_id: string | null }[]>`
    SELECT id, slug, sub_category_id FROM mega_menu_sub_sub_categories
  `;
  const megaSubSubMap = new Map(megaSubSubs.map(ss => [ss.id, ss]));

  const pagesMap = new Map(allPages.map(p => [p.id, p]));
  const resolvedPaths = new Map<string, string>();

  async function getPagePath(pageId: string): Promise<string> {
    if (resolvedPaths.has(pageId)) {
      return resolvedPaths.get(pageId)!;
    }

    const page = pagesMap.get(pageId);
    if (!page) return '/';

    let path = '';
    const pageSlug = page.slug || slugify(page.title);

    if (page.parent_id) {
      const parentPath = await getPagePath(page.parent_id);
      path = buildFullPath(parentPath, pageSlug);
    } else if (page.navigation_item_id) {
      const nav = navMap.get(page.navigation_item_id);
      const navSlug = nav ? (nav.slug || slugify(nav.label)) : '';

      if (page.category_id) {
        const categorySlugs = await getCategorySlugPath(page.category_id);
        path = buildPagePathFromNavAndCategorySlugs(navSlug, categorySlugs, pageSlug);
      } else {
        let categorySlug: string | undefined;
        let subSlug: string | undefined;
        let subSubSlug: string | undefined;

        if (page.mega_menu_category_id) {
          const cat = megaCatMap.get(page.mega_menu_category_id);
          if (cat) {
            categorySlug = cat.slug;

            if (page.mega_menu_sub_category_id) {
              const sub = megaSubMap.get(page.mega_menu_sub_category_id);
              if (sub) {
                subSlug = sub.slug;

                if (page.mega_menu_sub_sub_category_id) {
                  const subSub = megaSubSubMap.get(page.mega_menu_sub_sub_category_id);
                  if (subSub) {
                    subSubSlug = subSub.slug;
                  }
                }
              }
            }
          }
        }

        path = buildPagePathFromNavHierarchy({
          navSlug,
          categorySlug,
          subSlug,
          subSubSlug,
          pageSlug,
        });
      }
    } else {
      path = buildFullPath(null, pageSlug);
    }

    resolvedPaths.set(pageId, path);
    return path;
  }

  // Recalculate paths
  for (const page of allPages) {
    await getPagePath(page.id);
  }

  // Update mismatching paths in DB
  let updatedCount = 0;
  for (const page of allPages) {
    const newPath = resolvedPaths.get(page.id);
    if (newPath && newPath !== page.full_path) {
      console.log(`Updating "${page.title}":`);
      console.log(`  - Old path: ${page.full_path}`);
      console.log(`  - New path: ${newPath}`);

      try {
        // 1. Update pages table
        await sql`
          UPDATE pages
          SET full_path = ${newPath}, updated_at = NOW()
          WHERE id = ${page.id}
        `;

        // 2. Update page_registry table
        await sql`
          INSERT INTO page_registry (route_path, source, page_id, title, page_type, last_scanned_at, created_at, updated_at)
          VALUES (${newPath}, 'cms', ${page.id}, ${page.title}, 'standard', NOW(), NOW(), NOW())
          ON CONFLICT (route_path) DO UPDATE SET page_id = ${page.id}, updated_at = NOW()
        `;

        // Clean up old registry entry
        await sql`
          DELETE FROM page_registry WHERE route_path = ${page.full_path} AND page_id IS NULL
        `;

        updatedCount++;
      } catch (err) {
        console.error(`  - Failed to update:`, err instanceof Error ? err.message : err);
      }
    }
  }

  console.log(`\nRecalculation finished: updated ${updatedCount} page paths.`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
