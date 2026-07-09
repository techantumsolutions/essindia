import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

function uuidv4() {
  return crypto.randomUUID();
}

const defaultUgandaHeroContent = {
  backgroundGradient: 'radial-gradient(circle at center, #9fb2cc 0%, #839ab7 100%)',
  badgeBorderColor: '#8b5cf6',
  badgeBgColor: '#ffffff',
  badgeText: 'ebizframe ERP for Uganda',
  badgeTextColor: '#2b2657',
  title: 'Run finance, supply chain, operations,\nand growth from one ERP platform.',
  titleColor: '#ffffff',
  description: 'A modern enterprise resource planning experience for Ugandan businesses that need faster reporting, tighter controls, and connected workflows across branches, warehouses, plants, and field teams.',
  descriptionColor: 'rgba(255, 255, 255, 0.85)',
  primaryButtonText: 'Book a Consultation',
  primaryButtonBgColor: '#1d1b4b',
  primaryButtonTextColor: '#ffffff',
  primaryButtonBorderColor: '#1d1b4b',
  primaryButtonUrl: '/contact-us',
  secondaryButtonText: 'Explore Capabilities',
  secondaryButtonBgColor: '#ffffff',
  secondaryButtonTextColor: '#2b2657',
  secondaryButtonBorderColor: '#ffffff',
  secondaryButtonUrl: '/contact-us',
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-hero'`;
  if (existingLib.length === 0) {
    const libId = uuidv4();
    const hash = crypto.createHash('sha256').update('uganda-hero').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-hero', 'Uganda Hero', ${hash}, ${sql.json(defaultUgandaHeroContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Hero to sections library.`);
  }

  // 2. Create Uganda Template if it does not exist
  let templateId = '';
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length === 0) {
    templateId = uuidv4();
    await sql`INSERT INTO templates (id, name, slug, description, status, created_at, updated_at) 
      VALUES (${templateId}, 'Uganda Template', 'uganda-template', 'Uganda business and enterprise operations page template', 'active', NOW(), NOW())`;
    console.log(`Created Uganda Template`);
  } else {
    templateId = existingTemplate[0].id;
    console.log(`Uganda Template already exists with ID: ${templateId}`);
  }

  // 3. Insert uganda-hero into template_sections for Uganda Template
  const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-hero'`;
  if (existingSection.length === 0) {
    const sectionId = uuidv4();
    await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
      VALUES (${sectionId}, ${templateId}, 'uganda-hero', ${sql.json(defaultUgandaHeroContent)}, '{}', '{}', '{}', '{}', 0, NOW(), NOW())`;
    console.log(`Inserted uganda-hero into template_sections for Uganda Template`);
  }

  await sql.end();
}

main().catch(console.error);
