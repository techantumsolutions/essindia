import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaServicesContent = {
  badgeText: 'OUR SERVICES',
  title: 'We provide great services for our customers based on needs',
  cards: [
    { image: '/About-Uganda/Designer-rafiki.png', title: 'Custom Software Development', description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.', ctaText: 'Learn more', ctaUrl: '/contact-us' },
    { image: '/About-Uganda/Programming-rafiki.png', title: 'Web & Mobile App Development', description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.', ctaText: 'Learn more', ctaUrl: '/contact-us' },
    { image: '/About-Uganda/Notes-rafiki.png', title: 'Enterprise & ERP Solutions', description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.', ctaText: 'Learn more', ctaUrl: '/contact-us' },
    { image: '/About-Uganda/image 148.png', title: 'Cloud Application Development', description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.', ctaText: 'Learn more', ctaUrl: '/contact-us' },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-services'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-services').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-services', 'Uganda Services', ${hash}, ${sql.json(defaultUgandaServicesContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Services to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-services'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 2
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-services', ${sql.json(defaultUgandaServicesContent)}, '{}', '{}', '{}', '{}', 2, NOW(), NOW())`;
      console.log(`Inserted uganda-services into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
