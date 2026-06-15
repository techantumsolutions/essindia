import 'dotenv/config';
import { db } from '../src/lib/db';
import { templates, templateSections, sections, categories } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('Starting Case Studies template seeding...');

  // 1. Get or create category
  let category = await db.query.categories.findFirst({
    where: eq(categories.slug, 'case-studies'),
  });

  if (!category) {
    const [newCategory] = await db.insert(categories).values({
      name: 'Case Studies',
      slug: 'case-studies',
      description: 'Templates for Case Studies',
    }).returning();
    category = newCategory;
  }

  // 2. Check if template exists
  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.slug, 'case-studies-template'),
  });

  if (existingTemplate) {
    console.log(`Template "Case Studies Template" already exists with ID: ${existingTemplate.id}`);
    console.log('Deleting existing template to recreate it with fields...');
    await db.delete(templates).where(eq(templates.slug, existingTemplate.slug));
  }

  const sectionsData = [
    { 
      name: 'Case Study List', 
      type: 'case-study-list',
      contentJson: {
        badgeText: 'Case Studies',
        headingText: 'Explore our knowledge hub',
        subheadingText: 'Explore how Maathra has helped enterprises worldwide transform their operations with Oracle APEX and Cloud solutions.',
        bgImage: '/Case-studies/banner.png'
      }
    }
  ];

  // 3. Create or get Sections in Library
  const sectionIds = [];
  for (const sData of sectionsData) {
    const identityHash = crypto.createHash('sha256').update(sData.type + sData.name).digest('hex');
    
    let section = await db.query.sections.findFirst({
      where: eq(sections.identityHash, identityHash),
    });

    if (!section) {
      const [newSection] = await db.insert(sections).values({
        name: sData.name,
        type: sData.type,
        identityHash,
        contentJson: sData.contentJson,
        status: 'published',
      }).returning();
      section = newSection;
      console.log(`Created new section "${sData.name}".`);
    } else {
      console.log(`Section "${sData.name}" already exists. Using existing ID.`);
      await db.update(sections)
        .set({ contentJson: sData.contentJson })
        .where(eq(sections.id, section.id));
    }
    sectionIds.push(section.id);
  }

  // 4. Create Template
  const [template] = await db.insert(templates).values({
    name: 'Case Studies Template',
    slug: 'case-studies-template',
    description: 'Main listing page for Case Studies.',
    categoryId: category.id,
    status: 'active',
  }).returning();

  console.log(`Template created with ID: ${template.id}`);

  // 5. Link Sections to Template
  for (let i = 0; i < sectionIds.length; i++) {
    await db.insert(templateSections).values({
      templateId: template.id,
      sectionLibraryId: sectionIds[i],
      type: sectionsData[i].type,
      orderIndex: i,
      contentJson: sectionsData[i].contentJson,
    });
  }

  console.log('Sections added to library:', sectionIds);
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
}).finally(() => process.exit(0));
