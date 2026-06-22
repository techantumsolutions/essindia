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
        bgColor: '#fdfeff',
        badgeBgColor: '#391781',
        badgeText: 'WHY ESS ERP',
        badgeColor: '#ffffff',
        titleText: "It's all about Streamline, Automate, and Accelerate for Business Fitness",
        titleColor: '#000000',
        titleSecondaryColor: '#462294',
        descriptionText: 'Simply connect business processes, increase agility with our user-friendly and result-oriented software',
        descriptionColor: '#000000',
        button1Text: 'RPA PORTAL',
        button1Color: '#ffffff',
        button1BgColor: '#462294',
        button1Url: '/rpa',
        button2Text: 'ERP OFFERINGS',
        button2Color: '#ffffff',
        button2BgColor: '#0f172a',
        button2Url: '/erp-offerings',
        image: '/why-ess-main.png',
      },
    },
    {
      type: 'erp-intro',
      orderIndex: 1,
      contentJson: {
        title: 'Optimizing operations with real-time visibility',
        description: 'ERP systems have become essential to run, scale, and transform business operations. A modern ERP unifies diverse functions—from finance and inventory management to manufacturing planning and HR—into a singular ecosystem.\n\nThis integration eliminates data silos, helping businesses maintain accuracy, improve compliance, and streamline operations to keep pace with an evolving market.',
      },
    },
    {
      type: 'erp-modules',
      orderIndex: 2,
      contentJson: {
        heading: 'ERP Modules',
        subheading: 'Choose standard version or customizable version of our technology. ERP modules contribute to business growth in the following ways',
        modules: [
          { image: '/ErpOverview/ERP-1.png', title: 'FINANCE & TAX AUDIT', description: 'Ensure compliance, gain audits and financial security.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-2.png', title: 'SUPPLY CHAIN & PROCUREMENT', description: 'Ensure seamless supply chain, reduce storage cost, ready parts dynamically.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-3.png', title: 'CUSTOMER RELATIONSHIP MANAGEMENT', description: 'Ensure customer success, track lead pipeline, close deals faster.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-4.png', title: 'PROJECT MANAGEMENT', description: 'Manage projects efficiently, keep track of budgets and deliver on time.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-5.png', title: 'MANUFACTURING PLANNING', description: 'Optimize factory floors, automate billing materials, increase production capacity.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-6.png', title: 'BI & ANALYTICS', description: 'Generate executive dashboards, forecast sales, get real-time operational reports.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-7.png', title: 'QUALITY ASSURANCE', description: 'Ensure high-quality standards in manufacturing and operations.', ctaLabel: 'READ MORE', ctaUrl: '#' },
          { image: '/ErpOverview/ERP-8.png', title: 'HR & PAYROLL', description: 'Manage attendance, payroll generation, track appraisals, and recruitment.', ctaLabel: 'READ MORE', ctaUrl: '#' },
        ],
      },
    },
    {
      type: 'erp-features',
      orderIndex: 3,
      contentJson: {
        heading: 'Choosing the Right ERP Solution for Modern Businesses',
        subheading: 'Select standard version or customizable version',
        tabs: undefined, // remove old property
        features: [
          {
            id: 'standard',
            image: '/ErpOverview/featureTav1.png',
            title: 'STANDARD VERSION OR WITH CUSTOMIZATION',
            desc: 'Our standard ERP edition offers an immediately deployable software suite built around best practices in supply chain, invoicing, core accounting, and materials procurement.',
            desc2: 'It is designed to get your business up and running in record time while preserving options to configure fields, triggers, and reports to match your unique organizational flow.',
          },
          {
            id: 'global',
            image: '/ErpOverview/ERP-2.png',
            title: 'GLOBAL STANDARD EDITION',
            desc: 'A global-scale ERP suite engineered for multi-national operations, multi-currency ledgers, and consolidated international accounting reporting.',
            desc2: 'Built with multi-company hierarchy, global supply logistics controllers, and international taxation audit support out-of-the-box.',
          },
          {
            id: 'commerce',
            image: '/ErpOverview/ERP-3.png',
            title: 'COMMERCE ENGINE SPECIAL EDITION',
            desc: 'Omnichannel e-commerce integration with high-velocity dispatch control, real-time stock synching, and automated order fulfillment systems.',
            desc2: 'Designed to bridge warehouses directly with digital web store fronts, retail POS networks, and direct delivery APIs.',
          },
          {
            id: 'enterprise',
            image: '/ErpOverview/ERP-4.png',
            title: 'ENTERPRISE SPECIFICATIONS',
            desc: 'Our most comprehensive ERP suite offering advanced process engineering, dedicated database scaling, and high-fidelity customization frameworks.',
            desc2: 'Perfect for conglomerates requiring strict compliance controls, infinite modularity, and deep API integrations across corporate portfolios.',
          },
          {
            id: 'multisite',
            image: '/ErpOverview/ERP-5.png',
            title: 'MULTI-SITE SYSTEM EDITION',
            desc: 'Synchronized multi-facility operations, consolidated material tracking, inter-branch ledger reconciliations, and centralized warehousing management.',
            desc2: 'Enables transparent control over dozens of brick-and-mortar locations, distribution hubs, or secondary factory setups.',
          },
        ],
      },
    },
    {
      type: 'erp-value',
      orderIndex: 4,
      contentJson: {
        heading: 'ERP Advances Business Value',
        description: 'Enterprise Resource Planning Companies are more likely to deploy a full-service suite of ERP technology. ERP modules are available to automate processes that broadly are:',
        badgeText: 'So what benefits do businesses get from ERP Software?',
        values: [
          { title: 'Efficiency', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-1.png' },
          { title: 'Integrated Information', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-2.png' },
          { title: 'Reporting', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-3.png' },
          { title: 'Customer Service', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-4.png' },
          { title: 'Decision making', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-5.png' },
          { title: 'Profitability', description: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-6.png' },
        ],
      },
    },
    {
      type: 'erp-transform',
      orderIndex: 5,
      contentJson: {
        heading: 'Transform Your Business',
        description: 'Learn how modern ERP automates workflows and drives efficiency across departments.',
        items: [
          { title: 'OPERATIONAL EXCELLENCE', description: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.', image: '/ErpOverview/transform-1.png' },
          { title: 'MANAGERIAL EFFECTIVENESS', description: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.', image: '/ErpOverview/transform-2.png' },
          { title: 'STRATEGIC INVESTMENT', description: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.', image: '/ErpOverview/transform-3.png' },
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
