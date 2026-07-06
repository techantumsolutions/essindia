/**
 * Seeds the "ebizframe ERP for Europe" landing page template with 8 CMS sections.
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
  console.log('--- START SEEDING EBIZFRAME ERP FOR EUROPE TEMPLATE ---');

  const slug = 'ebizframe-erp-for-europe';

  // Get or create Landing Page category
  let category = await db.query.categories.findFirst({
    where: eq(schema.categories.slug, 'landing-page'),
  });

  if (!category) {
    const [newCategory] = await db
      .insert(schema.categories)
      .values({
        name: 'Landing Page',
        slug: 'landing-page',
        description: 'Landing page templates',
      })
      .returning();
    category = newCategory;
    console.log('Created "Landing Page" category.');
  }

  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template with slug "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
  }

  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'ebizframe ERP for Europe',
      slug,
      description: 'Landing page template for ebizframe ERP in Europe with 8 configurable CMS sections.',
      categoryId: category.id,
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  const sectionsData = [
    {
      type: 'europe-hero',
      name: 'Europe Hero',
      orderIndex: 0,
      contentJson: {
        badgeBgColor: '#ffffff',
        badgeBorderColor: '#e2e8f0',
        badgeText: 'ebizframe ERP for Europe',
        badgeTextColor: '#4B2A63',
        title: 'Built on Experience.\nDriven by Outcomes.',
        titleColor: '#1e293b',
        subtitle: 'Enterprise ERP for European businesses',
        subtitleColor: '#64748b',
        description:
          'ebizframe ERP helps European enterprises unify operations, ensure regulatory compliance, and scale with confidence across markets — backed by 30+ years of global delivery expertise.',
        descriptionColor: '#64748b',
        primaryButtonText: 'Book Free Demo',
        primaryButtonTextColor: '#ffffff',
        primaryButtonBgColor: '#4B2A63',
        primaryButtonBorderColor: '#4B2A63',
        primaryButtonUrl: '/contact',
        secondaryButtonText: 'Explore Solutions',
        secondaryButtonTextColor: '#1e293b',
        secondaryButtonBgColor: '#fbbf24',
        secondaryButtonBorderColor: '#fbbf24',
        secondaryButtonUrl: '/solutions',
        backgroundGradient:
          'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.10) 0%, transparent 50%), #ffffff',
        heroIllustration: '/industry-solution-Retail/banner-image.png',
        enableIllustration: true,
        enableAnimation: true,
        containerWidth: '7xl',
        sectionPaddingTop: 'pt-40',
        sectionPaddingBottom: 'pb-14',
        textAlignment: 'center',
      },
    },
    {
      type: 'europe-feature-cards',
      name: 'Europe Feature Cards',
      orderIndex: 1,
      contentJson: {
        cards: [
          {
            image: '/industry-solution-Retail/industry-1.png',
            title: 'Production Management',
            description: 'Plan, schedule, and monitor manufacturing operations with real-time visibility across plants and production lines.',
            buttonText: 'Learn More',
            buttonLink: '/solutions',
          },
          {
            image: '/industry-solution-Retail/industry-2.png',
            title: 'Financial Management',
            description: 'Unify accounting, budgeting, and compliance with multi-currency support tailored for European regulatory frameworks.',
            buttonText: 'Learn More',
            buttonLink: '/solutions',
          },
          {
            image: '/industry-solution-Retail/industry-3.png',
            title: 'Supply Chain & Logistics',
            description: 'Optimize procurement, warehousing, and distribution with end-to-end traceability across your European network.',
            buttonText: 'Learn More',
            buttonLink: '/solutions',
          },
          {
            image: '/industry-solution-Retail/img-2.png',
            title: 'Business Intelligence',
            description: 'Turn operational data into actionable insights with dashboards designed for finance, operations, and leadership teams.',
            buttonText: 'Learn More',
            buttonLink: '/solutions',
          },
        ],
      },
    },
    {
      type: 'europe-dark-showcase',
      name: 'Europe Dark Showcase',
      orderIndex: 2,
      contentJson: {
        badgeText: 'ebizframe ERP',
        badgeBgColor: 'rgba(255,255,255,0.1)',
        badgeTextColor: '#ffffff',
        title: 'One Platform. Complete Enterprise Control.',
        titleColor: '#ffffff',
        description:
          'See how ebizframe ERP unifies finance, operations, and analytics in a single intelligent platform built for European enterprises.',
        descriptionColor: '#cbd5e1',
        primaryButtonText: 'Request Demo',
        primaryButtonTextColor: '#0f172a',
        primaryButtonBgColor: '#ffffff',
        primaryButtonBorderColor: '#ffffff',
        primaryButtonUrl: '/contact',
        secondaryButtonText: 'View Features',
        secondaryButtonTextColor: '#ffffff',
        secondaryButtonBgColor: 'transparent',
        secondaryButtonBorderColor: '#ffffff',
        secondaryButtonUrl: '/solutions',
        slides: [
          { image: '/industry-solution-Retail/banner-image.png', alt: 'ERP Dashboard' },
          { image: '/industry-solution-Retail/process_ERP_Retail.png', alt: 'Process Overview' },
          { image: '/Business intilligence/image 44.png', alt: 'BI Dashboard' },
        ],
        enableSlider: true,
        autoplay: true,
        autoplayInterval: 5000,
        backgroundColor: '#0d0720',
        theme: 'dark',
        textAlignment: 'center',
      },
    },
    {
      type: 'europe-global-presence',
      name: 'Europe Global Presence',
      orderIndex: 3,
      contentJson: {
        image: '/Career-Page/Group 1.png',
        subtitle: 'Global Presence',
        subtitleColor: '#fbbf24',
        title: 'Discover why over 200,000 businesses trust ebizframe ERP',
        titleColor: '#ffffff',
        description:
          'With offices across Europe, Asia, and the Americas, ESS delivers localized expertise backed by a proven global ERP platform.',
        descriptionColor: '#cbd5e1',
        statistics: [
          { number: '30+', label: 'Years Experience' },
          { number: '15+', label: 'Global Offices' },
          { number: '200,000+', label: 'Businesses Served' },
          { number: '35+', label: 'Countries' },
        ],
        backgroundColor: '#0d0720',
        theme: 'dark',
        textAlignment: 'left',
      },
    },
    {
      type: 'europe-case-study-slider',
      name: 'Europe Case Study Slider',
      orderIndex: 4,
      contentJson: {
        slides: [
          {
            thumbnail: '/portfolio-1.png',
            companyName: 'Global Manufacturing Co.',
            industry: 'Manufacturing',
            description: 'Streamlined production planning and financial consolidation across 12 European facilities.',
            metric1: '70% Faster processing',
            metric2: '40% Cost reduction',
            buttonText: 'View case study',
            buttonLink: '/case-studies',
          },
          {
            thumbnail: '/portfolio-2.png',
            companyName: 'Retail Enterprise Group',
            industry: 'Retail',
            description: 'Unified POS, inventory, and loyalty systems across 200+ retail outlets in Europe.',
            metric1: '3x Inventory turnover',
            metric2: '99.9% Uptime',
            buttonText: 'View case study',
            buttonLink: '/case-studies',
          },
          {
            thumbnail: '/portfolio-3.png',
            companyName: 'Pharma Solutions Ltd.',
            industry: 'Pharmaceuticals',
            description: 'Achieved end-to-end regulatory compliance with batch traceability and quality management.',
            metric1: '100% Compliance',
            metric2: '50% Faster audits',
            buttonText: 'View case study',
            buttonLink: '/case-studies',
          },
        ],
        autoplay: false,
        loop: true,
        showNavigation: true,
        showPagination: true,
        backgroundColor: '#f2f6f9',
      },
    },
    {
      type: 'europe-promo-cta',
      name: 'Europe Promotional CTA',
      orderIndex: 5,
      contentJson: {
        smallTitle: 'Webinar',
        smallTitleColor: '#3b82f6',
        title: 'Monitor everything that matters to your European operations',
        titleColor: '#1e293b',
        description:
          'Join our experts for a live session on how ebizframe ERP helps European enterprises achieve operational excellence, compliance, and growth.',
        descriptionColor: '#64748b',
        buttonText: 'Register Now',
        buttonTextColor: '#ffffff',
        buttonBgColor: '#4B2A63',
        buttonBorderColor: '#4B2A63',
        buttonUrl: '/contact',
        backgroundColor: '#e8eef5',
        textAlignment: 'center',
      },
    },
    {
      type: 'europe-product-showcase',
      name: 'Europe Product Showcase',
      orderIndex: 6,
      contentJson: {
        deviceImage: '/industry-solution-Retail/banner-image.png',
        badgeText: 'Mobile App',
        badgeBgColor: '#dbeafe',
        badgeTextColor: '#2563eb',
        title: 'Getting started with ebizframe is easier than ever',
        titleColor: '#1e293b',
        description:
          'Access your entire ERP from any device. Manage approvals, track inventory, and view analytics — wherever your European operations take you.',
        descriptionColor: '#64748b',
        buttonText: 'Download App',
        buttonTextColor: '#ffffff',
        buttonBgColor: '#4B2A63',
        buttonUrl: '/contact',
        features: [
          { title: 'Real-time Dashboards', description: 'Monitor KPIs across finance, operations, and sales.' },
          { title: 'Mobile Access', description: 'Approve workflows and view reports on the go.' },
          { title: 'Multi-language Support', description: 'Built for European markets with localization.' },
          { title: 'Secure Cloud', description: 'Enterprise-grade security and compliance.' },
        ],
        backgroundColor: '#f0f4f8',
        textAlignment: 'left',
      },
    },
    {
      type: 'europe-reports',
      name: 'Europe Insights Reports',
      orderIndex: 7,
      contentJson: {
        sectionTitle: "Learn why we're the trusted ERP leader in Europe",
        sectionTitleColor: '#1e293b',
        cards: [
          {
            image: '/portfolio-1.png',
            category: 'Analyst Report',
            title: 'IDC MarketScape for Enterprise ERP Platforms in Europe',
            link: '/resources',
          },
          {
            image: '/portfolio-2.png',
            category: 'Whitepaper',
            title: 'Digital Transformation Roadmap for European Manufacturers',
            link: '/resources',
          },
          {
            image: '/portfolio-3.png',
            category: 'Case Study',
            title: 'How a European Retail Chain Unified 200+ Stores with ebizframe',
            link: '/case-studies',
          },
        ],
        textAlignment: 'center',
      },
    },
  ];

  for (const section of sectionsData) {
    const identityHash = generateSectionIdentityHash(section.type, section.name, section.contentJson);

    let librarySectionId: string;

    const existingLib = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.identityHash, identityHash))
      .limit(1);

    if (existingLib.length > 0) {
      librarySectionId = existingLib[0].id;
      await db
        .update(schema.sections)
        .set({ contentJson: section.contentJson, status: 'published' })
        .where(eq(schema.sections.id, librarySectionId));
      console.log(`Updated library section: ${section.name}`);
    } else {
      const [lib] = await db
        .insert(schema.sections)
        .values({
          identityHash,
          name: section.name,
          type: section.type,
          variant: 'default',
          contentJson: section.contentJson,
          status: 'published',
          version: 1,
        })
        .returning();
      librarySectionId = lib.id;

      await db.insert(schema.sectionVersions).values({
        sectionId: librarySectionId,
        version: 1,
        contentJson: section.contentJson,
      });
      console.log(`Created library section: ${section.name}`);
    }

    await db.insert(schema.templateSections).values({
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
    });
  }

  console.log('--- EBIZFRAME ERP FOR EUROPE TEMPLATE SEEDED SUCCESSFULLY ---');
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
