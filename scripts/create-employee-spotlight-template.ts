import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Employee Spotlight Template';

  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.name, templateName)
  });

  if (existingTemplate) {
    console.log(`Template "${templateName}" already exists with ID:`, existingTemplate.id);
    console.log('Deleting existing template to recreate it with fields...');
    await db.delete(templates).where(eq(templates.slug, existingTemplate.slug));
  }

  const sectionsData = [
    { 
      name: 'Employee Spotlight Hero', 
      type: 'employee-spotlight-hero',
      contentJson: {} // Hero currently does not have dynamic properties in component, but this creates the section
    },
    { 
      name: 'Employee Spotlight Cards', 
      type: 'employee-spotlight-cards',
      contentJson: {}
    }
  ];

  const targetSections = [];
  for (const s of sectionsData) {
    const existingSection = await db.query.sections.findFirst({
      where: eq(sections.name, s.name)
    });

    if (existingSection) {
      console.log(`Section "${s.name}" already exists. Using existing ID.`);
      await db.update(sections)
        .set({ contentJson: s.contentJson })
        .where(eq(sections.id, existingSection.id));
        
      targetSections.push(existingSection);
    } else {
      const hash = crypto.randomBytes(16).toString('hex');
      const [created] = await db.insert(sections).values({
        name: s.name,
        type: s.type,
        variant: 'default',
        identityHash: hash,
        contentJson: s.contentJson,
        status: 'published',
      }).returning();
      console.log(`Created new section "${s.name}".`);
      targetSections.push(created);
    }
  }

  const slug = slugify(templateName) + '-' + Date.now();
  
  const [template] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'A template for showcasing employee spotlights with hero and interactive cards.',
    status: 'active',
  }).returning();

  await db.insert(templateSections).values(
    targetSections.map((s, i) => ({
      templateId: template.id,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant || 'default',
      contentJson: sectionsData[i].contentJson,
      orderIndex: i,
    }))
  );

  console.log('Template created with ID:', template.id);
  console.log('Sections added to library:', targetSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));
