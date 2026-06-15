/**
 * Migration script: Add slug column to careers and backfill slugs for existing rows.
 * Run: npx tsx scripts/migrate-careers-slug.ts
 */
import 'dotenv/config';
import { db } from '../src/lib/db/index';
import { careers } from '../src/lib/db/schema';
import { sql, eq, isNull } from 'drizzle-orm';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function run() {
  console.log('🔄 Adding slug column if it does not exist...');

  // Step 1: Add column as nullable first (so existing rows are fine)
  await db.execute(sql`
    ALTER TABLE careers
    ADD COLUMN IF NOT EXISTS slug VARCHAR(300);
  `);
  console.log('✅ Column added (nullable)');

  // Step 2: Backfill slugs for rows that don't have one yet
  const rows = await db.select({ id: careers.id, title: careers.title }).from(careers);
  console.log(`🔄 Backfilling slugs for ${rows.length} career(s)...`);

  const usedSlugs = new Set<string>();
  for (const row of rows) {
    let base = slugify(row.title);
    let slug = base;
    let counter = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${counter}`;
      counter++;
    }
    usedSlugs.add(slug);

    await db.execute(sql`
      UPDATE careers SET slug = ${slug} WHERE id = ${row.id} AND slug IS NULL
    `);
    console.log(`  ✔ "${row.title}" → "${slug}"`);
  }

  // Step 3: Make column NOT NULL and add UNIQUE constraint
  await db.execute(sql`
    ALTER TABLE careers
    ALTER COLUMN slug SET NOT NULL;
  `);
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'careers_slug_unique'
      ) THEN
        ALTER TABLE careers ADD CONSTRAINT careers_slug_unique UNIQUE (slug);
      END IF;
    END
    $$;
  `);

  console.log('✅ Migration complete: slug column is now NOT NULL + UNIQUE');
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
