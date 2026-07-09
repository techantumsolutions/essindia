import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaCapabilitiesContent = {
  subtitle: 'Key Benefits',
  title: 'Core enterprise capabilities,\nredesigned around everyday work.',
  description: 'ERP value is grouped into outcome-led cards that are easy for leaders, finance teams, and operations teams to scan.',
  cards: [
    { icon: '/About-Uganda/Frame 276.png', title: 'Financial Command', description: 'General ledger, receivables, payables, fixed assets, cash flow, budgets, and consolidated reporting.' },
    { icon: '/About-Uganda/Frame 277.png', title: 'Supply chain clarity', description: 'Purchasing, vendor management, inventory movement, reorder planning, landed cost, and stock reconciliation.' },
    { icon: '/About-Uganda/Frame 278.png', title: 'Order-to-cash flow', description: 'Quotations, orders, pricing controls, dispatch, invoicing, collections, and customer performance tracking.' },
    { icon: '/About-Uganda/bill-receipt_svgrepo.com.png', title: 'Production planning', description: 'Bill of materials, shop-floor controls, quality checks, job costing, and production visibility for manufacturers.' },
    { icon: '/About-Uganda/Frame 280.png', title: 'People operations', description: 'Employee records, payroll workflows, leave, attendance, role structures, and workforce reporting.' },
    { icon: '/About-Uganda/Frame 279.png', title: 'Analytics and alerts', description: 'Executive dashboards, exception reports, performance scorecards, and alerts that surface what needs attention.' },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-capabilities'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-capabilities').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-capabilities', 'Uganda Capabilities', ${hash}, ${sql.json(defaultUgandaCapabilitiesContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Capabilities to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-capabilities'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 4
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-capabilities', ${sql.json(defaultUgandaCapabilitiesContent)}, '{}', '{}', '{}', '{}', 4, NOW(), NOW())`;
      console.log(`Inserted uganda-capabilities into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
