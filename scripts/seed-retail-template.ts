/**
 * Seeds the "Retail ERP Template" and its sections into the database,
 * and populates the Section Library.
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as schema from '../src/lib/db/schema';
import { generateSectionIdentityHash } from '../src/lib/cms/utils';

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
  console.error('DATABASE_URL is required to seed the template.');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('--- START SEEDING RETAIL ERP TEMPLATE & LIBRARY ---');

  const slug = 'retail-erp-template';

  // 1. Clean up existing template
  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template with slug "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
    console.log('Old template deleted.');
  }

  // 2. Insert new Retail ERP Template
  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'Retail ERP Template',
      slug,
      description: 'A premium Retail ERP landing page template with 7 dynamic CMS blocks.',
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Successfully created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  // 3. Define content payload for all 6 sections
  const sectionsData = [
    { type: 'retail-hero', orderIndex: 0, contentJson: {} },
    { type: 'retail-nurture', orderIndex: 1, contentJson: {} },
    { type: 'retail-features', orderIndex: 2, contentJson: {} },
    { type: 'retail-operations', orderIndex: 3, contentJson: {} },
    { type: 'retail-mobile-dashboard', orderIndex: 4, contentJson: {} },
    { type: 'retail-clients', orderIndex: 5, contentJson: {} },
  ];

  // 4. Insert each section into the library AND the template
  for (const section of sectionsData) {
    const sectionName = section.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const identityHash = generateSectionIdentityHash(section.type, sectionName, section.contentJson);

    let librarySectionId: string;
    
    // Check if it's already in the section library
    const existingLib = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.identityHash, identityHash))
      .limit(1);

    if (existingLib.length === 0) {
      // Add to Section Library
      const [newLibSection] = await db.insert(schema.sections).values({
        identityHash,
        name: sectionName,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        status: 'active',
        version: 1,
      }).returning();
      
      librarySectionId = newLibSection.id;

      await db.insert(schema.sectionVersions).values({
        sectionId: librarySectionId,
        version: 1,
        contentJson: section.contentJson,
      });
      console.log(`Added "${sectionName}" to Section Library.`);
    } else {
      librarySectionId = existingLib[0].id;
      console.log(`Section "${sectionName}" already exists in Section Library.`);
    }

    // Link it to the template
    const inserted = await db
      .insert(schema.templateSections)
      .values({
        templateId: newTemplate.id,
        sectionLibraryId: librarySectionId,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        styleJson: {},
        settingsJson: {},
        responsiveJson: {},
        animationJson: {},
        orderIndex: section.orderIndex,
      })
      .returning();

    console.log(`Inserted template section "${section.type}" at order ${section.orderIndex} (ID: ${inserted[0].id})`);
  }

  console.log('--- SEEDING RETAIL ERP TEMPLATE & LIBRARY COMPLETED SUCCESSFULLY ---');
  await client.end();
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
