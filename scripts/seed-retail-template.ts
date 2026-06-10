/**
 * Seeds the "Retail ERP Template" and its sections into the database,
 * and populates the Section Library.
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as schema from '../src/lib/db/schema';
import { generateSectionIdentityHash } from '../src/lib/cms/utils';

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
  console.log('--- START SEEDING RETAIL ERP TEMPLATE & LIBRARY ---');

  const slug = 'retail-erp-template';

  // 1. Clean up existing template
  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template with slug "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
    console.log('Old template deleted.');
  }

  // 2. Insert new Retail ERP Template
  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'Retail ERP Template',
      slug,
      description: 'A premium Retail ERP landing page template with 7 dynamic CMS blocks.',
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Successfully created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  // 3. Define content payload for all 7 sections
  const sectionsData = [
    {
      type: 'retail-hero',
      orderIndex: 0,
      contentJson: {
        badge: 'Retail Solutions',
        title: 'Unify Your Retail Operations & POS Systems',
        subtitle: 'Integrate billing, stock, inventory, and analytics in real time across all brick-and-mortar storefronts.',
        ctaText: 'Book Free Demo',
        ctaLink: '/demo',
        imagePath: '/industry-solution-Retail/banner-image.png',
      },
    },
    {
      type: 'retail-nurture',
      orderIndex: 1,
      contentJson: {
        title: 'Nurture customer trust with seamless omni-channel retail planning.',
        paragraphs: [
          'Running a retail operation requires real-time coordination between warehouse stocks, billing counters, and customer reward systems. Without integration, sales mismatches and stockout scenarios are inevitable.',
          'Our Retail ERP brings central control back into your hands, letting store managers sync orders, track returns, and manage invoices with absolute ease.',
        ],
        images: [
          '/industry-solution-Retail/industry-1.png',
          '/industry-solution-Retail/industry-2.png',
          '/industry-solution-Retail/industry-3.png',
        ],
        whyTitle: 'Why Choose ebizframe Retail?',
        whyParagraph: 'It is built specifically for retail scale, allowing multiple Point of Sales (POS) branches to share unified item codes, discount criteria, and tax setups dynamically.',
        whyImagePath: '/industry-solution-Retail/img-2.png',
      },
    },
    {
      type: 'retail-features',
      orderIndex: 2,
      contentJson: {
        title: 'Engineered for Agile Retail Process Planning',
        subtitle: 'Maximize inventory turn rates and keep checkout queues moving with optimized circular process flow.',
        bgImage: '/industry-solution-Retail/BG-Features.png',
        centerImage: '/industry-solution-Retail/process_ERP_Retail.png',
        leftFeatures: [
          { description: 'Automated replenishment alerts based on historical sales curves and inventory safety targets.' },
          { description: 'Unified barcodes and SKU databases mapped dynamically across global outlets.' },
          { description: 'Integrated loyalty portals to track user reward points and issue promo vouchers instantly.' },
          { description: 'Consolidated tax auditing supporting GST and international VAT rates.' },
        ],
        rightFeatures: [
          { description: 'Multi-warehouse dispatch controllers to sync high-velocity retail deliveries.' },
          { description: 'Comprehensive returns management with automated audit trails for broken or returned goods.' },
          { description: 'Real-time cost audits per branch to track operating margins dynamically.' },
          { description: 'Scalable web api hooks to connect online storefronts and marketplace inventory.' },
        ],
      },
    },
    {
      type: 'retail-operations',
      orderIndex: 3,
      contentJson: {
        title: 'Complete Retail Operations Control',
        subtitle: 'From POS to Head Office',
        paragraph: 'Take complete command of your retail landscape. Our ERP covers every touchpoint of retail operations, offering real-time visibility and central control.',
        operations: [
          { title: 'Point of Sales (POS)', description: 'High-velocity billing system with offline capabilities.', iconImage: '/industry-solution-Retail/Icon-.png' },
          { title: 'Promotions & Discounts', description: 'Set dynamic pricing and cross-store loyalty discounts.', iconImage: '/industry-solution-Retail/Icon-1.png' },
          { title: 'Merchandising & SKUs', description: 'Manage categories, variants, and product collections.', iconImage: '/industry-solution-Retail/Icon-2.png' },
          { title: 'Inventory Control', description: 'Real-time stock levels and automated purchase order flows.', iconImage: '/industry-solution-Retail/Icon-3.png' },
          { title: 'Billing Reconciliations', description: 'Automatic ledger entries matching cash registers.', iconImage: '/industry-solution-Retail/Icon-4.png' },
          { title: 'Multi-store Analytics', description: 'Compare margins, footfall, and top-selling SKUs.', iconImage: '/industry-solution-Retail/Icon-5.png' },
          { title: 'Loyalty Program', description: 'Track client profile purchase history and lifetime values.', iconImage: '/industry-solution-Retail/Icon-6.png' },
          { title: 'Procurement Planning', description: 'Auto-procure stock based on inventory levels.', iconImage: '/industry-solution-Retail/Icon-7.png' },
          { title: 'Vendor Portals', description: 'Collaborate directly with suppliers on delivery schedules.', iconImage: '/industry-solution-Retail/Icon-8.png' },
          { title: 'Supply Logistics', description: 'Coordinate internal warehouse transfers.', iconImage: '/industry-solution-Retail/Icon-10.png' },
          { title: 'Financial Ledgers', description: 'Instant accounting logs matching sales cashflows.', iconImage: '/industry-solution-Retail/Icon-11.png' },
          { title: 'Shift Reconciliations', description: 'Reconcile register cash at the end of each worker shift.', iconImage: '/industry-solution-Retail/Icon-12.png' },
        ],
      },
    },
    {
      type: 'retail-mobile-dashboard',
      orderIndex: 4,
      contentJson: {
        modules: [
          {
            title: 'Real-time Store POS Dashboards',
            features: [
              'Track counter sales hourly from anywhere',
              'Monitor payment method distribution (Cash, Card, UPI)',
              'Instant void transaction alerts',
              'Manager approval code overrides',
              'Cash drawer opening logs',
              'Offline register sync status indicators',
            ],
          },
          {
            title: 'Central Stock Control System',
            features: [
              'Automated inter-branch transfers',
              'Low inventory trigger points',
              'Batch number & expiry trackers',
              'Barcoding print controllers',
            ],
          },
          {
            title: 'Loyalty & Customer Profiles',
            features: [
              'Instant phone number lookup at POS',
              'Automatic loyalty tier calculations',
              'Store credit balance sheet tracking',
              'Campaign response logs',
            ],
          },
        ],
      },
    },
    {
      type: 'retail-clients',
      orderIndex: 5,
      contentJson: {
        title: 'Trusted by Growing Retail Brands Globally',
        logos: [
          '/industry-solution-Retail/image 37.png',
          '/industry-solution-Retail/image 45.png',
          '/industry-solution-Retail/image 46.png',
          '/industry-solution-Retail/image 47.png',
          '/industry-solution-Retail/image 48.png',
        ],
      },
    },
    {
      type: 'retail-why-erp',
      orderIndex: 6,
      contentJson: {
        title: 'Why ebizframe ERP?',
        paragraph: 'ebizframe ERP is a complete cloud-based ERP software solution which covers Sales, Procurement, Manufacturing, Finance, HR, Project Management, Quality, Plant Maintenance and much more. Thus ebizframe caters to all your business management needs in a single unified system, eliminating data silos. With its highly modular architecture, robust database, and ease-of-use, it is uniquely positioned to deliver tangible value. ebizframe empowers businesses to scale rapidly, adapt to shifting market conditions and maintain peak operational efficiency without complex custom coding.',
        imagePath: '/industry-solution-Retail/process_ERP_Retail.png',
      },
    },
  ];

  // 4. Insert each section into the library AND the template
  for (const section of sectionsData) {
    const sectionName = section.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const identityHash = generateSectionIdentityHash(section.type, sectionName, section.contentJson);

    let librarySectionId: string;
    
    // Check if it's already in the section library
    const existingLib = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.identityHash, identityHash))
      .limit(1);

    if (existingLib.length === 0) {
      // Add to Section Library
      const [newLibSection] = await db.insert(schema.sections).values({
        identityHash,
        name: sectionName,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        status: 'active',
        version: 1,
      }).returning();
      
      librarySectionId = newLibSection.id;

      await db.insert(schema.sectionVersions).values({
        sectionId: librarySectionId,
        version: 1,
        contentJson: section.contentJson,
      });
      console.log(`Added "${sectionName}" to Section Library.`);
    } else {
      librarySectionId = existingLib[0].id;
      console.log(`Section "${sectionName}" already exists in Section Library.`);
    }

    // Link it to the template
    const inserted = await db
      .insert(schema.templateSections)
      .values({
        templateId: newTemplate.id,
        sectionLibraryId: librarySectionId,
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

    console.log(`Inserted template section "${section.type}" at order ${section.orderIndex} (ID: ${inserted[0].id})`);
  }

  console.log('--- SEEDING RETAIL ERP TEMPLATE & LIBRARY COMPLETED SUCCESSFULLY ---');
  await client.end();
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
