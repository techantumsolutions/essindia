import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('--- SEEDING TESTIMONIALS TEMPLATE ---');

  const templateName = 'Testimonials Template';

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.name, templateName)
  });

  if (existingTemplate) {
    console.log(`Template "${templateName}" already exists. Recreating it...`);
    // Delete existing template sections first due to cascade referencing if applicable
    await db.delete(templates).where(eq(templates.id, existingTemplate.id));
  }

  const sectionsData = [
    {
      name: 'Testimonials Content Section',
      type: 'testimonials-block',
      contentJson: {
        badgeText: 'Testimonials',
        headingText: 'Trusted by Businesses Worldwide',
        subheadingText: 'Empowering enterprises across industries with scalable digital solutions and intelligent automation. Trusted by growing businesses and enterprise teams across multiple countries for delivering innovation, efficiency, and measurable business outcomes.',
        bgImage: '',
        testimonials: [
          {
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco',
            authorName: 'Sophie Moore',
            authorTitle: 'Product Developer at Webflow',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
            companyName: 'Webflow',
            logoUrl: '',
            topic: 'ERP Solutions',
            industry: 'FMCG'
          },
          {
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco',
            authorName: 'Adam Smith',
            authorTitle: 'Web Designer at Airtable',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adam',
            companyName: 'Airtable',
            logoUrl: '',
            topic: 'IoT Solutions',
            industry: 'Pharma'
          },
          {
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco',
            authorName: 'Mike Warren',
            authorTitle: 'Product Manager at Zapier',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            companyName: 'Zapier',
            logoUrl: '',
            topic: 'ERP Solutions',
            industry: 'Manufacturing'
          },
          {
            quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quis nostrud exercitation ullamco',
            authorName: 'Adam Smith',
            authorTitle: 'Web Designer at Airtable',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adam2',
            companyName: 'Cisco',
            logoUrl: '',
            topic: 'IoT Solutions',
            industry: 'FMCG'
          }
        ]
      }
    }
  ];

  const targetSections = [];
  for (const s of sectionsData) {
    const existingSection = await db.query.sections.findFirst({
      where: eq(sections.name, s.name)
    });

    if (existingSection) {
      console.log(`Section "${s.name}" already exists in library. Updating content JSON.`);
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
    description: 'A premium testimonials page featuring client testimonials and dynamic filters.',
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

  console.log(`Successfully created Template "${templateName}" with ID:`, template.id);
  console.log('\n--- TEMPLATE SEEDING COMPLETED SUCCESSFULLY ---');
}

main().catch(console.error).finally(() => process.exit(0));
