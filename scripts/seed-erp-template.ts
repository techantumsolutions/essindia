/**
 * Seeds the "ERP Overview Template" and its 6 ordered sections into the database.
 * Aligns perfectly with our premium responsive CMS block components.
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as schema from '../src/lib/db/schema';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required to seed the template.');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('--- START SEEDING ERP TEMPLATE ---');

  const slug = 'erp-overview-template';

  // 1. Clean up existing template with same slug to ensure idempotency
  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template with slug "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
    console.log('Old template deleted (cascade deletes its sections).');
  }

  // 2. Insert new premium ERP Overview Template
  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'ERP Overview Template',
      slug,
      description: 'A premium, high-fidelity ERP Solutions landing page template consisting of 6 fully dynamic CMS blocks.',
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Successfully created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  // 3. Define content payload for all 6 sections
  const sectionsData = [
    {
      type: 'erp-hero',
      orderIndex: 0,
      contentJson: {
        badge: 'WHY ESS ERP',
        title: "It's all about Streamline, Automate, and Accelerate for Business Fitness",
        subtitle: 'Simply connect business processes, increase agility with our user-friendly and result-oriented software',
        primaryCta: { label: 'RPA PORTAL', url: '/rpa' },
        secondaryCta: { label: 'ERP OFFERINGS', url: '/erp-offerings' },
        image: '/why-ess-main.png',
      },
    },
    {
      type: 'erp-intro',
      orderIndex: 1,
      contentJson: {
        heading: 'Optimizing operations with real-time visibility',
        bodyParagraphs: [
          'ERP systems have become essential to run, scale, and transform business operations. A modern ERP unifies diverse functions—from finance and inventory management to manufacturing planning and HR—into a singular ecosystem.',
          'This integration eliminates data silos, helping businesses maintain accuracy, improve compliance, and streamline operations to keep pace with an evolving market.',
        ],
      },
    },
    {
      type: 'erp-modules',
      orderIndex: 2,
      contentJson: {
        heading: 'ERP Modules',
        subheading: 'Choose standard version or customizable version of our technology. ERP modules contribute to business growth in the following ways',
        modules: [
          { title: 'FINANCE & TAX AUDIT', desc: 'Ensure compliance, gain audits and financial security.', iconColor: 'emerald', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'SUPPLY CHAIN & PROCUREMENT', desc: 'Ensure seamless supply chain, reduce storage cost, ready parts dynamically.', iconColor: 'blue', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'CUSTOMER RELATIONSHIP MANAGEMENT', desc: 'Ensure customer success, track lead pipeline, close deals faster.', iconColor: 'purple', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'PROJECT MANAGEMENT', desc: 'Manage projects efficiently, keep track of budgets and deliver on time.', iconColor: 'orange', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'MANUFACTURING PLANNING', desc: 'Optimize factory floors, automate billing materials, increase production capacity.', iconColor: 'teal', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'BI & ANALYTICS', desc: 'Generate executive dashboards, forecast sales, get real-time operational reports.', iconColor: 'pink', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'QUALITY ASSURANCE', desc: 'Ensure high-quality standards in manufacturing and operations.', iconColor: 'indigo', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { title: 'HR & PAYROLL', desc: 'Manage attendance, payroll generation, track appraisals, and recruitment.', iconColor: 'green', ctaLabel: 'READ MORE', ctaUrl: '#' },
        ],
      },
    },
    {
      type: 'erp-features',
      orderIndex: 3,
      contentJson: {
        heading: 'Choosing the Right ERP Solution for Modern Businesses',
        subheading: 'Select standard version or customizable version',
        tabs: [
          {
            id: 'standard',
            title: 'STANDARD VERSION OR WITH CUSTOMIZATION',
            contentHeading: 'FOR STANDARD VERSION OR WITH CUSTOMIZATION',
            contentParagraphs: [
              'Our standard ERP edition offers an immediately deployable software suite built around best practices in supply chain, invoicing, core accounting, and materials procurement.',
              'It is designed to get your business up and running in record time while preserving options to configure fields, triggers, and reports to match your unique organizational flow.',
            ],
          },
          {
            id: 'global',
            title: 'GLOBAL STANDARD EDITION',
            contentHeading: 'GLOBAL STANDARD EDITION',
            contentParagraphs: [
              'A global-scale ERP suite engineered for multi-national operations, multi-currency ledgers, and consolidated international accounting reporting.',
              'Built with multi-company hierarchy, global supply logistics controllers, and international taxation audit support out-of-the-box.',
            ],
          },
          {
            id: 'commerce',
            title: 'COMMERCE ENGINE SPECIAL EDITION',
            contentHeading: 'COMMERCE ENGINE SPECIAL EDITION',
            contentParagraphs: [
              'Omnichannel e-commerce integration with high-velocity dispatch control, real-time stock synching, and automated order fulfillment systems.',
              'Designed to bridge warehouses directly with digital web store fronts, retail POS networks, and direct delivery APIs.',
            ],
          },
          {
            id: 'enterprise',
            title: 'ENTERPRISE SPECIFICATIONS',
            contentHeading: 'ENTERPRISE SPECIFICATIONS',
            contentParagraphs: [
              'Our most comprehensive ERP suite offering advanced process engineering, dedicated database scaling, and high-fidelity customization frameworks.',
              'Perfect for conglomerates requiring strict compliance controls, infinite modularity, and deep API integrations across corporate portfolios.',
            ],
          },
          {
            id: 'multisite',
            title: 'MULTI-SITE SYSTEM EDITION',
            contentHeading: 'MULTI-SITE SYSTEM EDITION',
            contentParagraphs: [
              'Synchronized multi-facility operations, consolidated material tracking, inter-branch ledger reconciliations, and centralized warehousing management.',
              'Enables transparent control over dozens of brick-and-mortar locations, distribution hubs, or secondary factory setups.',
            ],
          },
        ],
      },
    },
    {
      type: 'erp-value',
      orderIndex: 4,
      contentJson: {
        heading: 'ERP Advances Business Value',
        subheading: 'Enterprise Resource Planning systems contribute to operational efficiency. ERP contributes in business growth in the following ways',
        ctaButton: { label: 'WHAT UNIQUE VALUE ESS ERP BRINGS?', url: '#' },
        valueCards: [
          { title: 'Efficiency', desc: 'Minimize duplicate records and data entry, automate processes for maximum efficiency.', image: '/service-rpa.png' },
          { title: 'Integrated Information', desc: 'All database is integrated, no more siloed files, single source of truth.', image: '/service-oracle.png' },
          { title: 'Reporting', desc: 'Flexible custom reports, automated analytics, real-time metrics.', image: '/service-bi.png' },
          { title: 'Customer Service', desc: 'Get real-time customer history, improve response time, enhance customer satisfaction.', image: '/service-ems.png' },
          { title: 'Decision making', desc: 'Real-time updates across departments help management make faster, smarter decisions.', image: '/why-ess-main.png' },
          { title: 'Profitability', desc: 'Lower inventory carrying cost, reduce scrap, automate billing.', image: '/service-erp.png' },
        ],
      },
    },
    {
      type: 'erp-transform',
      orderIndex: 5,
      contentJson: {
        heading: 'Transform Your Business',
        subheading: 'Learn how modern ERP automates workflows and drives efficiency across departments.',
        items: [
          { title: 'OPERATIONAL EXCELLENCE', desc: 'ESS ERP system optimizes your workflows by automating manual entries and integrating sales, inventory, and finance. Real-time updates eliminate bottlenecks and ensure operational flow.' },
          { title: 'MANAGERIAL EFFECTIVENESS', desc: 'With unified dashboards, department heads can monitor performance indices, forecast stock demands, and manage resources dynamically from a single screen.' },
          { title: 'STRATEGIC INVESTMENT', desc: 'Our ERP is built on scalable modern tech, making it a future-proof asset. It expands alongside your business volumes, maintaining efficiency at any scale.' },
        ],
      },
    },
  ];

  // 4. Insert each section in loop
  for (const section of sectionsData) {
    const inserted = await db
      .insert(schema.templateSections)
      .values({
        templateId: newTemplate.id,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        styleJson: {},
        settingsJson: {},
        responsiveJson: {},
        animationJson: {},
        orderIndex: section.orderIndex,
      })
      .returning();

    console.log(`Inserted section "${section.type}" at order ${section.orderIndex} (ID: ${inserted[0].id})`);
  }

  console.log('--- SEEDING ERP TEMPLATE COMPLETED SUCCESSFULLY ---');
  await client.end();
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
