import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaControlContent = {
  subtitle: 'Why Uganda teams choose ERP',
  title: 'Replace disconnected tools with governed, real-time business control.',
  desc1: "Over the years, ebizframe ERP has stood steadfast with Uganda's Enterprise in its march towards growth and development for many years. ebizframe has contributed significantly to the automation of several Ugandan enterprises and bringing them face to face with the world's leading technology platforms and IT solutions.",
  desc2: 'It is therefore not surprising that ebizframe is the no. 1 ERP Solution in the mid-segment in East Africa.',
  image: '/About-Uganda/Background+Border+Shadow.png',
  points: [
    { title: 'Regional branch visibility', description: 'Track sales, stock, collections, purchases, and approvals across Kampala, upcountry branches, and regional distribution networks.' },
    { title: 'Faster, cleaner reporting', description: 'Standardize ledgers, cost centers, budgeting, audit trails, and management dashboards to shorten reporting cycles.' },
    { title: 'Process controls built in', description: 'Use role-based access, approval hierarchies, document workflows, and exception alerts to keep decisions accountable.' },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-control'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-control').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-control', 'Uganda Control', ${hash}, ${sql.json(defaultUgandaControlContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Control to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-control'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 3
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-control', ${sql.json(defaultUgandaControlContent)}, '{}', '{}', '{}', '{}', 3, NOW(), NOW())`;
      console.log(`Inserted uganda-control into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
