import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { db } from '../src/lib/db';
import { pages, pageSections, templates, templateSections, sections, categories } from '../src/lib/db/schema';
import { defaultCaseStudies } from '../src/lib/case-studies-data';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('Starting Case Study Details template seeding...');

  try {
    // 1. Ensure the 'case-study-detail' section exists in section_library
    const type = 'case-study-detail';
    const name = 'Case Study Detail';
    const identityHash = crypto.createHash('sha256').update(type + name).digest('hex');
    
    let section = await db.query.sections.findFirst({
      where: eq(sections.identityHash, identityHash),
    });

    if (!section) {
      const [newSection] = await db.insert(sections).values({
        name,
        type,
        identityHash,
        contentJson: {},
        status: 'published',
      }).returning();
      section = newSection;
      console.log('Created section: Case Study Detail');
    } else {
      console.log('Section "Case Study Detail" already exists.');
    }

    // 2. Ensure "Case Study Details Template" exists
    let template = await db.query.templates.findFirst({
      where: eq(templates.slug, 'case-study-details-template'),
    });

    if (template) {
      console.log('Template already exists. Cleared old template sections.');
      await db.delete(templateSections).where(eq(templateSections.templateId, template.id));
    } else {
      // Find category
      let category = await db.query.categories.findFirst({
        where: eq(categories.slug, 'case-studies'),
      });
      if (!category) {
         const [c] = await db.insert(categories).values({ name: 'Case Studies', slug: 'case-studies' }).returning();
         category = c;
      }

      const [newTemplate] = await db.insert(templates).values({
        name: 'Case Study Details Template',
        slug: 'case-study-details-template',
        description: 'Standard template for individual case studies',
        categoryId: category.id,
        status: 'active'
      }).returning();
      template = newTemplate;
      console.log('Created template: Case Study Details Template');
    }

    // Add section to template
    await db.insert(templateSections).values({
      templateId: template.id,
      sectionLibraryId: section.id,
      type: section.type,
      orderIndex: 0,
      contentJson: {}
    });

    // 3. Find the "Case Studies" root page
    const rootPage = await db.query.pages.findFirst({
      where: eq(pages.slug, 'studies')
    });
    
    if (!rootPage) {
      throw new Error('Case Studies root page not found! Please run create-case-studies-template.ts first.');
    }

    // 4. Generate the 9 case studies
    for (let i = 0; i < defaultCaseStudies.length; i++) {
      const cs = defaultCaseStudies[i];
      console.log(`Processing: ${cs.title}...`);

      let page = await db.query.pages.findFirst({
        where: and(eq(pages.slug, cs.slug), eq(pages.parentId, rootPage.id)),
      });

      if (page) {
        await db.delete(pageSections).where(eq(pageSections.pageId, page.id));
        console.log(`  Page already exists. Cleared old sections.`);
      } else {
        const [newPage] = await db.insert(pages).values({
          title: cs.title,
          slug: cs.slug,
          fullPath: `/case-studies/${cs.slug}`,
          parentId: rootPage.id,
          templateId: template.id,
          status: 'published',
          pageType: 'standard'
        }).returning();
        page = newPage;
        console.log(`  Created new page.`);
      }

      // Add the case-study-detail section with the dummy content
      await db.insert(pageSections).values({
        pageId: page.id,
        sectionLibraryId: section.id,
        type: section.type,
        name: 'Case Study Detail',
        orderIndex: 0,
        content: cs
      });
    }

    console.log('Successfully seeded all 9 Case Studies!');

  } catch (error) {
    console.error('Failed to seed case studies:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).finally(() => process.exit(0));
