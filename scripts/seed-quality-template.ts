/**
 * Seeds the "Quality Policy Template" and its sections into the database,
 * and creates a page at "/quality-policy" linked to this template.
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
  console.log('--- START SEEDING QUALITY POLICY TEMPLATE & PAGE ---');

  const slug = 'quality-policy-template';
  const pagePath = '/quality-policy';

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

  // 2. Insert new Quality Policy Template
  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'Quality Policy Template',
      slug,
      description: 'A premium Quality Policy landing page template containing the banner and certification/policies content.',
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Successfully created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  // 3. Define content payload for both sections
  const sectionsData = [
    { 
      type: 'quality-hero', 
      orderIndex: 0, 
      contentJson: {
        badge: 'Quality Policy',
        title: 'A Legacy of Quality. A Culture of Continuous Improvement.',
        subtitle: 'Since beginning our quality journey in 1998, ESS has continuously evolved its systems, processes, and delivery standards to build a strong culture of excellence and innovation.',
        bgImage: '/QualityPolicy/BgGradient.png'
      } 
    },
    { 
      type: 'quality-content', 
      orderIndex: 1, 
      contentJson: {
        title1: 'Our Quality Certifications',
        isoTitle: 'ISO – 9001:2000 (1999), upgraded to 2008 standards and further upgraded to 2015 standards.',
        isoDescription: 'ESS was awarded ISO 9001:1994 certification in August 1999 by BVQI(Bureau Veritas Quality International). In August 2002, ESS was re-certified against the new standards ISO 9001:2000, by BVQI. ESS is certified for ISO for the processes in Product Development and Maintenance, Project Implementation, Marketing, Human Resources, Finance and Support. In Aug 2009, ESS was successfully upgraded to 2008 standards post an audit by BVQI. Subsequently, it was further upgraded to ISO-9001: 2015 standard in October, 2017.',
        cmmTitle: 'SEI-CMM Level 5 (2002)',
        cmmDescription1: 'SEI-CMM stands for Capability Maturity Model from Software Engineering Institute from Carnegie Mellon University. A company can be assessed at any CMM level from Level 1 to Level 5 with Level 5 being the highest.',
        cmmDescription2: 'Eastern Software Solutions went in for CBA – IPI in April 2002 and our processes for product enhancement and customization operations were assessed at Level 5 of CMM (Ver 1.1). We are now in SEI’s list of High Maturity organizations. According to the Carnegie Mellon University Software Engineering Institute, CMM is a common-sense application of software or business process management and quality improvement concepts to software development and maintenance. The CMM is a framework that describes the key elements of an effective software process. The CMM helps to measure and establish an improvement path from an immature, out-of-control processes to a mature and in-control processes. The CMM helps establish measurable targets against which it is possible to judge and improve the maturity of an organization’s software processes.',
        title2: 'ESS’s Quality Policy',
        policies: [
          'To achieve a step by step improvement in whatever we do, by implementing our documented Quality System – a system that focuses on continuous improvement and is supported by various International Certifications.',
          'To discover better and better ways to serve our customers, shareholders and colleagues, with each incremental step bringing consistency in our work.',
          'To ensure that each interaction with our customers, shareholders and colleagues is a meaningful experience; an interaction that contributes to the growth of the organization as well as the individual.'
        ]
      } 
    },
  ];

  // 4. Insert each section into the library AND the template
  const librarySectionIds: Record<string, string> = {};
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

    librarySectionIds[section.type] = librarySectionId;

    // Link it to the template
    await db
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
      });

    console.log(`Linked template section "${section.type}" at order ${section.orderIndex}`);
  }

  // 5. Create or Update Page at "/quality-policy"
  const existingPage = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.fullPath, pagePath))
    .limit(1);

  let pageId: string;

  if (existingPage.length > 0) {
    pageId = existingPage[0].id;
    console.log(`Found existing page at "${pagePath}". Updating template association and recreating sections...`);
    
    // Clean existing page sections
    await db.delete(schema.pageSections).where(eq(schema.pageSections.pageId, pageId));
    
    // Update association
    await db
      .update(schema.pages)
      .set({
        templateId: newTemplate.id,
        title: 'Quality Policy',
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.pages.id, pageId));
  } else {
    // Create new page metadata
    const [seo] = await db.insert(schema.seoMetadata).values({
      title: 'Quality Policy | Eastern Software Solutions',
      description: 'Explore ESS\'s quality policy, ISO 9001:2015 certifications, and SEI-CMM Level 5 maturity achievements.',
    }).returning();

    const [newPage] = await db
      .insert(schema.pages)
      .values({
        title: 'Quality Policy',
        slug: 'quality-policy',
        fullPath: pagePath,
        status: 'published',
        pageType: 'standard',
        templateId: newTemplate.id,
        seoId: seo.id,
        publishedAt: new Date(),
      })
      .returning();

    pageId = newPage.id;
    console.log(`Created new page at "${pagePath}" (ID: ${pageId})`);
  }

  // 6. Insert page sections
  for (const section of sectionsData) {
    await db.insert(schema.pageSections).values({
      pageId,
      sectionLibraryId: librarySectionIds[section.type],
      name: section.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      type: section.type,
      variant: 'default',
      content: section.contentJson,
      orderIndex: section.orderIndex,
      isActive: true,
    });
    console.log(`Inserted page section instance "${section.type}" for page.`);
  }

  // 7. Ensure page is registered in page_registry for routing
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
      title: 'Quality Policy',
      pageType: 'standard',
      isDynamic: true,
    });
    console.log(`Registered route "${pagePath}" in page_registry.`);
  } else {
    await db
      .update(schema.pageRegistry)
      .set({
        pageId,
        title: 'Quality Policy',
        source: 'database',
        isDynamic: true,
        updatedAt: new Date(),
      })
      .where(eq(schema.pageRegistry.routePath, pagePath));
  }

  console.log('--- SEEDING QUALITY POLICY COMPLETED SUCCESSFULLY ---');
  await client.end();
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
