import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaPresenceContent = {
  image: '/About-Uganda/Frame%20303.png',
  stats: [
    { title: '20+', description: 'Countries served across Africa and beyond' },
    { title: '1,200+', description: 'Enterprise implementations and rollouts' },
    { title: 'Modular', description: 'Adopt what you need now, expand when ready' },
    { title: 'Localizable', description: 'Workflows tailored for policy, tax, and operations' },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-presence'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-presence').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-presence', 'Uganda Presence', ${hash}, ${sql.json(defaultUgandaPresenceContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Presence to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-presence'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 1
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-presence', ${sql.json(defaultUgandaPresenceContent)}, '{}', '{}', '{}', '{}', 1, NOW(), NOW())`;
      console.log(`Inserted uganda-presence into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
