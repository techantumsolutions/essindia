import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

function uuidv4() {
  return crypto.randomUUID();
}

const defaultAiMonitorContent = {
  image: '/About-Europe/image 144.png',
  badgeText: 'ESS AI',
  title: 'Monitor everything, so your brand is prepared for anything',
  description: 'Stay ahead of trends, safeguard your brand health, and uncover what your audience really cares about. Talkwalker by Hootsuite tracks billions of conversations and turns them into your competitive edge.',
  buttonText: 'Meet our team',
  buttonUrl: '/contact-us',
};

async function main() {
  // 1. Add to library (sections table)
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'europe-ai-monitor'`;
  if (existingLib.length === 0) {
    const libId = uuidv4();
    const hash = crypto.randomUUID(); // Simple unique uuid hash is fine
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'europe-ai-monitor', 'Europe AI Monitor', ${hash}, ${sql.json(defaultAiMonitorContent)}, NOW(), NOW())`;
    console.log(`Added Europe AI Monitor to sections library.`);
  }

  // 2. Insert into template_sections before europe-product-showcase
  const tSections = await sql`SELECT id, template_id, order_index FROM template_sections WHERE type = 'europe-product-showcase'`;
  for (const ts of tSections) {
    const existing = await sql`SELECT id FROM template_sections WHERE template_id = ${ts.template_id} AND type = 'europe-ai-monitor'`;
    if (existing.length === 0) {
      const newId = uuidv4();
      const targetIndex = ts.order_index;
      // Shift subsequent template_sections
      await sql`UPDATE template_sections SET order_index = order_index + 1 WHERE template_id = ${ts.template_id} AND order_index >= ${targetIndex}`;
      // Insert new section
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${newId}, ${ts.template_id}, 'europe-ai-monitor', ${sql.json(defaultAiMonitorContent)}, '{}', '{}', '{}', '{}', ${targetIndex}, NOW(), NOW())`;
      console.log(`Inserted europe-ai-monitor into template_sections for template ${ts.template_id} before order_index ${targetIndex}`);
    }
  }

  // 3. Insert into page_sections before europe-product-showcase
  const pSections = await sql`SELECT id, page_id, order_index FROM page_sections WHERE type = 'europe-product-showcase'`;
  for (const ps of pSections) {
    const existing = await sql`SELECT id FROM page_sections WHERE page_id = ${ps.page_id} AND type = 'europe-ai-monitor'`;
    if (existing.length === 0) {
      const newId = uuidv4();
      const targetIndex = ps.order_index;
      // Shift subsequent page_sections
      await sql`UPDATE page_sections SET order_index = order_index + 1 WHERE page_id = ${ps.page_id} AND order_index >= ${targetIndex}`;
      // Insert new section
      await sql`INSERT INTO page_sections (id, page_id, type, content, style_json, settings_json, responsive_json, animation_json, order_index, is_active, created_at, updated_at) 
        VALUES (${newId}, ${ps.page_id}, 'europe-ai-monitor', ${sql.json(defaultAiMonitorContent)}, '{}', '{}', '{}', '{}', ${targetIndex}, true, NOW(), NOW())`;
      console.log(`Inserted europe-ai-monitor into page_sections for page ${ps.page_id} before order_index ${targetIndex}`);
    }
  }

  await sql.end();
}

main().catch(console.error);
