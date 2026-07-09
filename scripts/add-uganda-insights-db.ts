import postgres from 'postgres';
import 'dotenv/config';
import crypto from 'crypto';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const defaultUgandaInsightsContent = {
  tag: 'Insights',
  title: 'Leverage our expertise',
  description: 'Looking for more information that can help you grow your business? Make sure you check out our Insights. You are also welcome to sign up for our newsletter, find the link at the bottom of the page.',
  tabs: [
    {
      tabName: 'Understanding ERP Software',
      contentTitle: 'Understanding ERP Software and its role in real-life',
      body1: 'Enterprise Resource Planning (ERP) software is the backbone of modern business operations, integrating core functions like finance, HR, manufacturing, and supply chain into a single system.',
      body2: 'By breaking down data silos, a modern ERP system provides a single source of truth that helps teams make faster, more accurate operational decisions.',
      points: [
        { title: 'Centralized Database', description: 'Eliminates departmental silos by keeping all records in a single, accessible repository.' },
        { title: 'Process Automation', description: 'Streamlines repetitive manual workflows to reduce human errors and cycle times.' },
      ],
      image: '/About-Uganda/Container/Figure/Image.png',
    },
    {
      tabName: 'Finance and accounting',
      contentTitle: 'Finance and accounting: ERP examples for streamlined operations',
      body1: 'Finance and accounting are at the heart of any business, and an efficient ERP system can make a significant impact on these critical functions. ERP systems centralize financial data, automate routine tasks, and ensure compliance with financial regulations, allowing businesses to focus on strategy and growth rather than getting bogged down in manual processes. By looking at ERP examples within finance and accounting, we can see how these systems help businesses achieve greater accuracy and efficiency.',
      body2: 'Importance of Finance and Accounting in ERP: For businesses, maintaining accurate financial records, managing cash flow, and ensuring regulatory compliance are non-negotiable. As ERP examples in finance and accounting show, a tailored ERP system integrates all financial activities—from accounts payable and receivable to financial reporting and tax management. This integration not only improves accuracy also provides real-time insights into the financial health of the business.',
      points: [
        { title: 'Automated Invoicing and Billing', description: 'Reduces manual data entry, speeds up payment cycles, and minimizes errors.' },
        { title: 'General Ledger Management', description: 'Consolidates all financial data into one system, enabling easy access and reporting.' },
        { title: 'Accounts Payable and Receivable', description: 'Automates tracking and management of payments to suppliers and receipts from customers.' },
        { title: 'Financial Reporting', description: 'Generates real-time financial statements, helping businesses make informed decisions.' },
        { title: 'Compliance and Audit Trail', description: 'Ensures that all transactions are compliant with financial regulations and standards.' },
      ],
      subsections: `ERP Examples in Finance and Accounting

Microsoft Dynamics 365 Business Central
• Overview: Business Central is a cloud-based ERP solution designed for small to medium-sized businesses, offering comprehensive financial management tools.
• Example Use Case: A small business automates its invoicing process using Business Central, reducing the time spent on manual data entry and minimizing errors.

Oracle NetSuite
• Overview: Oracle NetSuite is another cloud-based ERP system known for robust financial management capabilities, ideal for businesses with complex financial needs.
• Example Use Case: A growing e-commerce company uses Oracle NetSuite to manage financial operations across multiple regions and currencies.

Case Example
Consider a mid-sized manufacturing company that was struggling with outdated financial software. By implementing Microsoft Dynamics 365 Business Central, the company was able to centralize its financial data, automate its reporting processes, and gain real-time visibility into its cash flow.

Benefits
Implementing an ERP system for finance and accounting offers several key benefits.`,
      image: '/About-Uganda/Container/Figure/Image.png',
    },
    {
      tabName: 'Supply chain management',
      contentTitle: 'Supply chain management: ERP examples for enhanced efficiency',
      body1: 'Supply chain management demands tight coordination of sourcing, inventory control, warehousing, and transportation channels.',
      body2: 'An integrated ERP links procurement directly with production schedules and distributor demands to ensure perfect order fulfillment rates.',
      points: [
        { title: 'Demand Forecasting', description: 'Predicts stock needs based on historical sales data and seasonal branch trends.' },
        { title: 'Inventory Management', description: 'Real-time tracking of raw materials and finished goods across multiple warehouse hubs.' },
      ],
      image: '/About-Uganda/Container/Figure/Image.png',
    },
  ],
};

async function main() {
  // 1. Add to sections library
  const existingLib = await sql`SELECT id FROM sections WHERE type = 'uganda-insights'`;
  if (existingLib.length === 0) {
    const libId = crypto.randomUUID();
    const hash = crypto.createHash('sha256').update('uganda-insights').digest('hex');
    await sql`INSERT INTO sections (id, type, name, identity_hash, content_json, created_at, updated_at) 
      VALUES (${libId}, 'uganda-insights', 'Uganda Insights', ${hash}, ${sql.json(defaultUgandaInsightsContent)}, NOW(), NOW())`;
    console.log(`Added Uganda Insights to sections library.`);
  }

  // 2. Query Uganda Template ID
  const existingTemplate = await sql`SELECT id FROM templates WHERE slug = 'uganda-template'`;
  if (existingTemplate.length > 0) {
    const templateId = existingTemplate[0].id;
    // Check if section already exists in template_sections
    const existingSection = await sql`SELECT id FROM template_sections WHERE template_id = ${templateId} AND type = 'uganda-insights'`;
    if (existingSection.length === 0) {
      const sectionId = crypto.randomUUID();
      // Appending as index 6
      await sql`INSERT INTO template_sections (id, template_id, type, content_json, style_json, settings_json, responsive_json, animation_json, order_index, created_at, updated_at) 
        VALUES (${sectionId}, ${templateId}, 'uganda-insights', ${sql.json(defaultUgandaInsightsContent)}, '{}', '{}', '{}', '{}', 6, NOW(), NOW())`;
      console.log(`Inserted uganda-insights into template_sections for Uganda Template`);
    }
  }

  await sql.end();
}

main().catch(console.error);
