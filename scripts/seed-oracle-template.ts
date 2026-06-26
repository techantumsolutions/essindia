import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Migration-Oracle Database Upgrade & Optimization Template...');

  const templateName = 'Migration-Oracle Database Upgrade & Optimization';
  const slug = slugify(templateName);

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });

  if (existingTemplate) {
    console.log(`ℹ️ Template "${templateName}" already exists. Deleting it to recreate...`);
    await db.delete(templateSections).where(eq(templateSections.templateId, existingTemplate.id));
    await db.delete(templates).where(eq(templates.id, existingTemplate.id));
  }

  // Create Template
  const [newTemplate] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'Migration-Oracle Database Upgrade & Optimization template page containing customizable Hero banner, Partner trust strip, Why upgrade benefits grid, and 5-step Migration flow.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'oracle-hero',
      content: {
        bgColor: '#091E2E',
        badgeBgColor: '#ffffff',
        badgeBorderColor: 'transparent',
        badgeText: 'Oracle Forms to Oracle APEX Migration',
        badgeTextColor: '#2b2a6c',
        title: 'Oracle Forms to\nOracle APEX Migration',
        titleColor: '#ffffff',
        description: "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylife AI's XDO Framework",
        descriptionColor: '#ffffff',
        button1BgColor: '#2e2a72',
        button1BorderColor: '#2e2a72',
        button1Text: 'Get started',
        button1TextColor: '#ffffff',
        button1Url: '#',
        button2BgColor: '#ffffff',
        button2BorderColor: '#ffffff',
        button2Text: 'Explore ROI Calculator',
        button2TextColor: '#2e2a72',
        button2Url: '#',
        image: '/migration-orcl datebase upgrade and optimization/mygration-orcl datebase upgrade and optimization.png'
      },
      order: 10
    },
    {
      type: 'oracle-partner',
      content: {
        image1: '/migration-orcl datebase upgrade and optimization/1704524759_oracle erp-min 1.png',
        text1: 'TRUSTED\nORACLE PARTNER',
        title2: '25+',
        description2: 'YEARS OF\nEXPERTISE',
        image3: '/migration-orcl datebase upgrade and optimization/db-copy_svgrepo.com.png',
        text3: 'ZERO-DOWNTIME\nMIGRATION EXPERTISET'
      },
      order: 20
    },
    {
      type: 'oracle-why-upgrade',
      content: {
        image: '/migration-orcl datebase upgrade and optimization/21c 1.png',
        title: 'WHY UPGRADE YOUR ORACLE DATABASE?',
        description: 'A modern database environment strengthens your entire ERP foundation.',
        points: [
          'End-of-life risks in legacy Oracle database versions',
          'Security patching requirements for unsupported Oracle databases',
          'Performance limitations in older Oracle database environments',
          'Compliance mandates for enterprise database systems',
          'Compatibility requirements for cloud infrastructure and modern platforms'
        ]
      },
      order: 30
    },
    {
      type: 'oracle-migration-flow',
      content: {
        title: '',
        steps: [
          {
            number: '01',
            image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 1.png',
            title: 'Oracle Database Version Upgrade (11g → 19c / 21c)',
            description: 'Controlled database version migration with rollback strategy.'
          },
          {
            number: '02',
            image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 2.png',
            title: 'Oracle Database Performance Tuning',
            description: 'Query optimization, indexing strategy, and workload balancing.'
          },
          {
            number: '03',
            image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 3.png',
            title: 'Security Hardening',
            description: 'Patch management, user access controls, and compliance alignment.'
          },
          {
            number: '04',
            image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 4.png',
            title: 'Backup & Disaster Recovery Validation',
            description: 'Data protection and business continuity planning.'
          },
          {
            number: '05',
            image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 5.png',
            title: 'High Availability Configuration',
            description: 'Clustering and failover readiness for mission-critical systems.'
          }
        ]
      },
      order: 40
    },
    {
      type: 'oracle-framework',
      content: {
        title: 'OUR ORACLE DATABASE UPGRADE FRAMEWORK',
        subtitle: 'Other vendors say "migrations" but deliver headaches. Here\'s why we\'re different.',
        cards: [
          {
            image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor.png',
            title: 'Database Health Assessment',
            description: 'Comprehensive evaluation of database performance, stability, and existing system architecture.'
          },
          {
            image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-1.png',
            title: 'Compatibility & Risk Analysis',
            description: 'Identify compatibility gaps, dependencies, and potential upgrade risks before execution.'
          },
          {
            image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-2.png',
            title: 'Structured Upgrade Execution',
            description: 'Planned and secure upgrade process with minimal downtime and controlled implementation.'
          },
          {
            image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-3.png',
            title: 'Post-Upgrade Performance Monitoring',
            description: 'Continuous monitoring and optimization to ensure improved performance and system reliability.'
          }
        ]
      },
      order: 50
    },
    {
      type: 'oracle-cta',
      content: {
        title: 'Future-Ready Oracle Database Strategy',
        description: 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.',
        buttonText: 'Explore Your Upgrade Roadmap',
        buttonUrl: '/contact'
      },
      order: 60
    }
  ];

  // Insert Sections
  for (const section of sections) {
    await db.insert(templateSections).values({
      templateId: newTemplate.id,
      type: section.type,
      contentJson: section.content,
      orderIndex: section.order,
    });
    console.log(`✅ Seeded ${section.type} section`);
  }

  console.log('✨ Seeding completed successfully! Oracle Database Migration template is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
