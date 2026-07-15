/**
 * Seeds the "404 Page Template" for CMS-managed custom 404 pages.
 * Create a page with slug `404` from this template, then Publish.
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
  console.log('--- START SEEDING 404 PAGE TEMPLATE ---');

  const slug = '404-page-template';

  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, 'landing-page'),
  });

  if (!category) {
    const [newCategory] = await db
      .insert(schema.categories)
      .values({
        name: 'Landing Page',
        slug: 'landing-page',
        description: 'Landing page templates',
      })
      .returning();
    category = newCategory;
  }

  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
  }

  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: '404 Page Template',
      slug,
      description:
        'Custom Page Not Found (404) template. Create a page with slug "404" from this template and Publish it.',
      categoryId: category.id,
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Created template: ${newTemplate.name} (${newTemplate.id})`);

  const sectionsData = [
    {
      type: 'not-found-hero',
      name: '404 Hero',
      orderIndex: 0,
      contentJson: {
        badgeText: 'Page not found',
        badgeBgColor: '#ede9fe',
        badgeTextColor: '#4B2A63',
        codeText: '404',
        title: "We can't find that page",
        titleColor: '#0f172a',
        description:
          'The page you requested may have been moved, renamed, or no longer exists. Try heading home or exploring our solutions.',
        descriptionColor: '#64748b',
        primaryButtonText: 'Back to Home',
        primaryButtonUrl: '/',
        primaryButtonBgColor: '#4B2A63',
        primaryButtonTextColor: '#ffffff',
        secondaryButtonText: 'Contact Us',
        secondaryButtonUrl: '/contact-us',
        secondaryButtonBgColor: '#f1f5f9',
        secondaryButtonTextColor: '#0f172a',
        bgColor: '#ffffff',
      },
    },
    {
      type: 'not-found-links',
      name: '404 Helpful Links',
      orderIndex: 1,
      contentJson: {
        title: 'Helpful links',
        titleColor: '#0f172a',
        description: 'These popular pages may help you find what you need.',
        descriptionColor: '#64748b',
        bgColor: '#f8fafc',
        links: [
          { title: 'Home', description: 'Return to the ESS India homepage', url: '/' },
          { title: 'Solutions', description: 'Explore ERP, BI, and digital transformation solutions', url: '/solutions' },
          { title: 'Careers', description: 'See open roles and join our team', url: '/careers' },
          { title: 'Contact', description: 'Get in touch with our experts', url: '/contact-us' },
        ],
      },
    },
  ];

  for (const section of sectionsData) {
    const identityHash = generateSectionIdentityHash(section.type, section.name, section.contentJson);

    let librarySectionId: string;
    const existingLib = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.identityHash, identityHash))
      .limit(1);

    if (existingLib.length > 0) {
      librarySectionId = existingLib[0].id;
      await db
        .update(schema.sections)
        .set({ contentJson: section.contentJson, status: 'published' })
        .where(eq(schema.sections.id, librarySectionId));
      console.log(`Updated library section: ${section.name}`);
    } else {
      const [lib] = await db
        .insert(schema.sections)
        .values({
          identityHash,
          name: section.name,
          type: section.type,
          variant: 'default',
          contentJson: section.contentJson,
          status: 'published',
          version: 1,
        })
        .returning();
      librarySectionId = lib.id;
      await db.insert(schema.sectionVersions).values({
        sectionId: librarySectionId,
        version: 1,
        contentJson: section.contentJson,
      });
      console.log(`Created library section: ${section.name}`);
    }

    await db.insert(schema.templateSections).values({
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
    });
  }

  console.log('--- 404 PAGE TEMPLATE SEEDED SUCCESSFULLY ---');
  console.log('Next: Admin → Pages → Create Page → select "404 Page Template" → set slug to "404" → Publish');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
