import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaIndustriesContent = {
  subtitle: 'ESS for Industry',
  title: 'Built for Ugandan businesses with\ncomplex operating models.',
  description: 'The page now makes industry relevance visible early, with practical scenarios instead of a long navigation list.',
  cards: [
    { image: '/About-Uganda/Frame 284.png', title: 'Manufacturing', description: 'Plan production, monitor quality, and control material costs.' },
    { image: '/About-Uganda/Frame 283.png', title: 'Distribution', description: 'Keep inventory, dispatch, and dealer orders synchronized.' },
    { image: '/About-Uganda/Frame 282.png', title: 'Retail and Trading', description: 'Connect sales, procurement, collections, and branch stock.' },
    { image: '/About-Uganda/Frame 281.png', title: 'Services', description: 'Manage projects, people, billing, and business performance.' },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-industries'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-industries').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-industries', 'Uganda Industries', ${hash}, ${sql.json(defaultUgandaIndustriesContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Industries to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-industries'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 5
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-industries', ${sql.json(defaultUgandaIndustriesContent)}, '{}', '{}', '{}', '{}', 5, NOW(), NOW())`;
      console.log(`Inserted uganda-industries into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
