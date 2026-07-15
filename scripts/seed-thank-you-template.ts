/**
 * Seeds the "Thank You Page Template" and a published page at /thank-you.
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
  console.error('DATABASE_URL is required to seed the thank-you template.');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('--- START SEEDING THANK YOU TEMPLATE + PAGE ---');

  const templateSlug = 'thank-you-page-template';
  const pagePath = '/thank-you';

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

  const existingTemplate = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, templateSlug))
    .limit(1);

  if (existingTemplate.length > 0) {
    console.log(`Found existing template "${templateSlug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, templateSlug));
  }

  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'Thank You Page Template',
      slug: templateSlug,
      description:
        'Post-form confirmation page. Used after contact/CTA form submission; supports delayed PDF open via ?pdf=.',
      categoryId: category.id,
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Created template: ${newTemplate.name} (${newTemplate.id})`);

  const sectionsData = [
    {
      type: 'thank-you-hero',
      name: 'Thank You Hero',
      orderIndex: 0,
      contentJson: {
        badgeText: 'Success',
        badgeBgColor: '#dcfce7',
        badgeTextColor: '#166534',
        title: 'Thank you for reaching out',
        titleColor: '#0f172a',
        description:
          'We have received your details. Our team will get back to you shortly.',
        descriptionColor: '#64748b',
        pdfNotice:
          'If a document was requested, it will open in a new tab in a few seconds.',
        primaryButtonText: 'Back to Home',
        primaryButtonUrl: '/',
        primaryButtonBgColor: '#4B2A63',
        primaryButtonTextColor: '#ffffff',
        secondaryButtonText: 'Explore Solutions',
        secondaryButtonUrl: '/solutions',
        bgColor: '#ffffff',
      },
    },
  ];

  const librarySectionIds: Record<string, string> = {};

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

    librarySectionIds[section.type] = librarySectionId;

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

  // Create or refresh the live /thank-you page
  const existingPage = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.fullPath, pagePath))
    .limit(1);

  let pageId: string;

  if (existingPage.length > 0) {
    pageId = existingPage[0].id;
    console.log(`Found existing page at "${pagePath}". Refreshing sections...`);
    await db.delete(schema.pageSections).where(eq(schema.pageSections.pageId, pageId));
    await db
      .update(schema.pages)
      .set({
        templateId: newTemplate.id,
        title: 'Thank You',
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.pages.id, pageId));
  } else {
    const [seo] = await db
      .insert(schema.seoMetadata)
      .values({
        title: 'Thank You | Eastern Software Solutions',
        description: 'Thank you for contacting Eastern Software Solutions.',
        noIndex: true,
      })
      .returning();

    const [newPage] = await db
      .insert(schema.pages)
      .values({
        title: 'Thank You',
        slug: 'thank-you',
        fullPath: pagePath,
        status: 'published',
        pageType: 'standard',
        templateId: newTemplate.id,
        seoId: seo.id,
        publishedAt: new Date(),
      })
      .returning();

    pageId = newPage.id;
    console.log(`Created page at "${pagePath}" (${pageId})`);
  }

  for (const section of sectionsData) {
    await db.insert(schema.pageSections).values({
      pageId,
      sectionLibraryId: librarySectionIds[section.type],
      name: section.name,
      type: section.type,
      variant: 'default',
      content: section.contentJson,
      orderIndex: section.orderIndex,
      isActive: true,
    });
  }

  const existingRegistry = await db
    .select()
    .from(schema.pageRegistry)
    .where(eq(schema.pageRegistry.routePath, pagePath))
    .limit(1);

  if (existingRegistry.length === 0) {
    await db.insert(schema.pageRegistry).values({
      routePath: pagePath,
      source: 'database',
      pageId,
      title: 'Thank You',
      pageType: 'standard',
      isDynamic: true,
    });
    console.log(`Registered route "${pagePath}" in page_registry.`);
  } else {
    await db
      .update(schema.pageRegistry)
      .set({
        pageId,
        title: 'Thank You',
        source: 'database',
        isDynamic: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.pageRegistry.routePath, pagePath));
  }

  // Default form settings → /thank-you
  const existingFormSettings = await db
    .select()
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.key, 'form_settings'))
    .limit(1);

  const formSettingsValue = {
    contact: { thankYouUrl: '/thank-you' },
    cta: { thankYouUrl: '/thank-you' },
  };

  if (existingFormSettings.length === 0) {
    await db.insert(schema.siteSettings).values({
      key: 'form_settings',
      value: formSettingsValue,
    });
    console.log('Created default form_settings in site_settings.');
  } else {
    console.log('form_settings already exists — leaving admin values unchanged.');
  }

  console.log('--- THANK YOU TEMPLATE + PAGE SEEDED SUCCESSFULLY ---');
  console.log('Page: /thank-you | Template: Thank You Page Template');
  console.log('Admin → Forms → set thank-you URL per form if needed');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
