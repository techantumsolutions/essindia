import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

function uuidv4() {
  return crypto.randomUUID();
}

const defaultPrivacyPolicyContent = {
  title: 'Privacy Policy',
  contentHtml: `
    <p>We value your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our website.</p>
    <h3>1. Information Collection</h3>
    <p>We collect information that you voluntarily provide to us when registering, filling out contact forms, or subscribing to our newsletters.</p>
    <h3>2. Information Usage</h3>
    <p>Your information is used to personalize your experience, improve customer service, and process transaction requests.</p>
    <h3>3. Information Security</h3>
    <p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
  `
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'privacy-policy-block'`;
  if (existingLib.length === 0) {
    const libId = uuidv4();
    const hash = crypto.createHash('sha256').update('privacy-policy-block').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'privacy-policy-block', 'Privacy Policy Block', ${hash}, ${sql.json(defaultPrivacyPolicyContent)}, NOW(), NOW())`;
    console.log(`Added Privacy Policy Block to sections library.`);
  }

  // 2. Create Privacy Policy Template if it does not exist
  let templateId = '';
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'privacy-policy-template'`;
  if (existingTemplate.length === 0) {
    templateId = uuidv4();
    await sql`INSERT INTO templates (id, name, slug, description, status, created_at, updated_at) 
      VALUES (${templateId}, 'Privacy Policy Template', 'privacy-policy-template', 'Rich text content page for Privacy Policy and Terms of Use', 'active', NOW(), NOW())`;
    console.log(`Created Privacy Policy Template`);
  } else {
    templateId = existingTemplate[0].id;
    console.log(`Privacy Policy Template already exists with ID: ${templateId}`);
  }

  // 3. Insert privacy-policy-block into template_sections for Privacy Policy Template
  const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'privacy-policy-block'`;
  if (existingSection.length === 0) {
    const sectionId = uuidv4();
    await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
      VALUES (${sectionId}, ${templateId}, 'privacy-policy-block', ${sql.json(defaultPrivacyPolicyContent)}, '{}', '{}', '{}', '{}', 0, NOW(), NOW())`;
    console.log(`Inserted privacy-policy-block into template_sections for Privacy Policy Template`);
  }

  await sql.end();
}

main().catch(console.error);
