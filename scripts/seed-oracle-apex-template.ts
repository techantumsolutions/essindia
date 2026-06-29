import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Migration-Oracle Forms to Oracle APEX Template...');

  const templateName = 'Migration-Oracle Forms to Oracle APEX';
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
    description: 'Migration-Oracle Forms to Oracle APEX template containing customizable Hero banner and other sections.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'oracle-apex-hero',
      content: {
        bgColor: '#351570',
        badgeBgColor: '#ffffff',
        badgeBorderColor: 'transparent',
        badgeText: 'Oracle Forms to Oracle APEX Migration',
        badgeTextColor: '#351570',
        title: 'Oracle Forms to\nOracle APEX Migration',
        titleTextColor: '#ffffff',
        description: "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylift AI's XDO Framework",
        descriptionTextColor: '#ffffff',
        button1BgColor: 'transparent',
        button1BorderColor: '#ffffff',
        button1Text: 'Get started',
        button1TextColor: '#ffffff',
        button1Url: '#',
        button2BgColor: '#ffffff',
        button2BorderColor: '#ffffff',
        button2Text: 'Explore ROI Calculator',
        button2TextColor: '#351570',
        button2Url: '#',
        image: '/Migration-Oracle Forms to Oracle APEX/ChatGPT Image Jun 25, 2026, 11_52_29 AM 1.png'
      },
      order: 10
    },
    {
      type: 'oracle-apex-intro',
      content: {
        title: 'Strategic Modernization for Enterprise Critical Systems',
        paragraphs: [
          'Many enterprises across France, Europe, the United States, and India continue to run business-critical operations on legacy Oracle Forms environments. While stable, these systems limit scalability, integration capability, user experience, and cloud readiness.',
          '<strong>Modernization today requires more than code conversion.</strong>',
          'We help enterprises migrate Oracle Forms applications to Oracle APEX, transforming legacy systems into high-performance, web-based enterprise platforms aligned with modern business requirements.'
        ],
        buttonText: 'Plan Your Migration',
        buttonUrl: '#'
      },
      order: 20
    },
    {
      type: 'oracle-apex-why-migrate',
      content: {
        title: 'WHY ENTERPRISES ARE MIGRATING ORACLE FORMS TO ORACLE APEX',
        description: 'The objective is not just platform replacement — it is operational optimization.',
        tagText: 'Modern • Secure • Cloud-Native',
        points: [
          'Client-server limitations restrict scalability',
          'Increasing maintenance complexity',
          'Limited integration with modern platforms',
          'Aging user interface impacting productivity',
          'Cloud migration challenges'
        ],
        image: '/Migration-Oracle Forms to Oracle APEX/43cf0cf615146177fa1157dd0ba4a24f1252918e.png'
      },
      order: 30
    },
    {
      type: 'oracle-apex-deliverables',
      content: {
        leftTitle: 'WHAT WE DELIVER',
        leftItems: [
          { icon: '/Migration-Oracle Forms to Oracle APEX/Frame 267.png', text: 'Complete Oracle Forms to Oracle APEX migration' },
          { icon: '/Migration-Oracle Forms to Oracle APEX/database-02_svgrepo.com.png', text: 'Secure and optimized Database migration' },
          { icon: '/Migration-Oracle Forms to Oracle APEX/web-design_svgrepo.com.png', text: 'Modernized Web UI/UX design' },
          { icon: '/Migration-Oracle Forms to Oracle APEX/statistic-up_svgrepo.com.png', text: 'Enhanced analytics and reporting' },
          { icon: '/Migration-Oracle Forms to Oracle APEX/cloud-upload_svgrepo.com.png', text: 'Seamless Cloud deployment' }
        ],
        rightTitle: 'BUSINESS IMPACT',
        rightItems: [
          { icon: '/Migration-Oracle Forms to Oracle APEX/settings_svgrepo.com.png', text: 'Reduced maintenance overhead' },
          { icon: 'Eye', text: 'Improved operational visibility' },
          { icon: '/migration-orcl datebase upgrade and optimization/performance_svgrepo.com.png', text: 'Enhanced system performance' },
          { icon: '/migration-orcl datebase upgrade and optimization/network-solid_svgrepo.com.png', text: 'Scalable digital architecture' },
          { icon: '/Migration-Oracle Forms to Oracle APEX/boost-for-reddit_svgrepo.com.png', text: 'Future-ready ERP foundation' }
        ]
      },
      order: 40
    },
    {
      type: 'oracle-apex-approach',
      content: {
        title: 'COMPREHENSIVE ORACLE FORMS MIGRATION ASSESSMENT',
        tag: 'OUR STRATEGIC MIGRATION APPROACH',
        description: 'Unlike tool-only migration models, our approach combines technical precision with business transformation.',
        tabs: [
          {
            tabName: 'COMPREHENSIVE ORACLE FORMS MIGRATION ASSESSMENT',
            items: [
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Forms module analysis' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'PL/SQL logic evaluation' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Dependency and impact mapping' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Workflow review aligned to business processes' }
            ]
          },
          {
            tabName: 'ARCHITECTURE REDESIGN FOR FUTURE SCALABILITY',
            items: [
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Three-tier architecture model' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'RESTful API integration endpoints' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Modern web grid modernization' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Decoupled frontend & backend services' }
            ]
          },
          {
            tabName: 'STRUCTURED MIGRATION EXECUTION',
            items: [
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Step-by-step schema deployment' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'Automated business logic translation' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Data reconciliation and validation' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Parallel testing and verification' }
            ]
          },
          {
            tabName: 'PERFORMANCE & USER EXPERIENCE OPTIMIZATION',
            items: [
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Page loading speed optimization' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'Responsive layouts for mobile/tablet' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Caching & statement tuning' },
              { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'User feedback & interface polish' }
            ]
          }
        ]
      },
      order: 50
    },
    {
      type: 'oracle-apex-cta',
      content: {
        bgColor: '#f0f2f7',
        title: 'Begin Your Modernization Assessment',
        titleColor: '#5c3ea3',
        description: 'Engage with our experts to evaluate your Oracle Forms transformation roadmap and build a scalable digital foundation.',
        descriptionColor: '#374151',
        buttonText: 'Get start Now',
        buttonBgColor: '#ffca28',
        buttonTextColor: '#000000',
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

  console.log('✨ Seeding completed successfully! Oracle APEX Migration template is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
