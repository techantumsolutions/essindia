import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding After Sales Service Template...');

  const templateName = 'App-After Sales Service';
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
    description: 'After Sales Service application template with all 11 sections.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'ass-hero',
      content: {
        bgColor: '#161f38',
        badgeBgColor: '#ffffff',
        badgeBorderColor: '#ffffff',
        badgeText: 'After Sales Service',
        badgeTextColor: '#2a2b6a',
        title: 'Transform Customer\nSupport with Smart\nAfter-Sales Service',
        titleColor: '#ffffff',
        description: 'Digitize service operations, improve field productivity, and deliver faster customer resolution with a connected after-sales platform.',
        descriptionColor: '#cbd5e1',
        button1BgColor: '#2a2b6a',
        button1BorderColor: '#2a2b6a',
        button1Text: 'Request Demo',
        button1TextColor: '#ffffff',
        button1Url: '/contact-us',
        button2BgColor: '#ffffff',
        button2BorderColor: '#ffffff',
        button2Text: 'Explore Features',
        button2TextColor: '#2a2b6a',
        button2Url: '#features',
        image: '/App-After Sales Service/002b2026-6c0c-4820-958f-344b26611bc6 1.png'
      },
      order: 10
    },
    {
      type: 'ass-intro',
      content: {
        title: 'Upgrade Customer Support with After-Sales Service App',
        paragraphs: [
          'The After-Sales Service App enhances mobile service operations by allowing field teams to offer fast, informed, and personalized support—all from a single platform. This intelligent after-sales service software connects agents, mobile workers, assets, and customers, helping you deliver excellent on-site service seamlessly.',
          'With the After-Sales Service App, your field workforce gets easy access to the right information and step-by-step procedures needed to consistently provide high-quality service. From appointment scheduling to customer feedback, it gives you a complete view of the entire service process.'
        ]
      },
      order: 20
    },
    {
      type: 'ass-functionalities',
      content: {
        badgeIcon: '/App-After Sales Service/Frame.png',
        badgeText: 'Metadata Observability',
        title: 'Functionalities of After-Sales Service App',
        items: [
          { icon: '/App-After Sales Service/layer.png', text: 'Register customer complaints anytime, anywhere' },
          { icon: '/App-After Sales Service/layer.png', text: 'Assign complaints directly to service executives' },
          { icon: '/App-After Sales Service/layer.png', text: 'Access instant updates on complaint status' },
          { icon: '/App-After Sales Service/layer.png', text: 'Record customer feedback on service quality' },
          { icon: '/App-After Sales Service/layer.png', text: 'Create real-time reports on service operations' },
          { icon: '/App-After Sales Service/layer.png', text: 'Mark attendance directly through the app' },
          { icon: '/App-After Sales Service/layer.png', text: 'Track and manage service-related expenses efficiently' }
        ],
        image: '/App-After Sales Service/Frame 296.png'
      },
      order: 30
    },
    {
      type: 'ass-benefits',
      content: {
        title: 'Benefits of\nAfter-Sales Service App',
        image: '/App-After Sales Service/image 117.png',
        leftItems: [
          { icon: '/App-After Sales Service/Frame.png', text: 'Enhance customer satisfaction through faster resolution' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Boost service executive productivity with streamlined tasks' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Boost service executive productivity with streamlined tasks' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Track complaint status with complete transparency' }
        ],
        rightItems: [
          { icon: '/App-After Sales Service/Frame.png', text: 'Ensure service quality with built-in checks' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Send real-time updates directly to customers' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Gain real-time visibility into complaint progress' },
          { icon: '/App-After Sales Service/Frame.png', text: 'Reduce operating costs with digital workflows' }
        ]
      },
      order: 40
    },
    {
      type: 'ass-enterprise',
      content: {
        title: 'Integration & Enterprise Scalability',
        description: 'ebizframe After Sales Service is built to integrate seamlessly with your core ERP and CRM systems, ensuring unified data across operations.',
        cards: [
          { icon: '/App-After Sales Service/Image-10.png', title: 'Seamless ERP Sync', description: 'Real-time sync of parts inventory, customer details, and invoices.' },
          { icon: '/App-After Sales Service/Image-11.png', title: 'Offline Operations', description: 'Keep working even without network coverage; sync automatically when back online.' },
          { icon: '/App-After Sales Service/Image-12.png', title: 'Advanced Security', description: 'Enterprise-grade encryption and role-based access control.' }
        ]
      },
      order: 50
    },
    {
      type: 'ass-stats',
      content: {
        image: '/App-After Sales Service/stats-left.png',
        badgeText: 'Proven Performance',
        title: 'Empower Teams & Optimize Customer Service',
        description: 'Track key metrics, optimize dispatcher workflows, and scale your field service operations with data-driven insights.',
        stats: [
          { value: '45%', label: 'Reduction in Service Cost' },
          { value: '98%', label: 'Customer Satisfaction Score' },
          { value: '2.5x', label: 'Faster SLA Compliance Resolution' }
        ]
      },
      order: 60
    },
    {
      type: 'ass-process',
      content: {
        title: 'How the After Sales Service App Works',
        steps: [
          { image: '/App-After Sales Service/process-1.png', title: 'Raise Ticket', description: 'Customer raises a complaint through app, portal, or call center.' },
          { image: '/App-After Sales Service/process-2.png', title: 'AI Allocation', description: 'Intelligent assignment based on location, skill, and schedule.' },
          { image: '/App-After Sales Service/process-3.png', title: 'On-Site Fix', description: 'Field executive navigates to site, diagnoses, and completes job.' },
          { image: '/App-After Sales Service/process-4.png', title: 'Part Request', description: 'Requisition spare parts directly from local warehouse on the go.' },
          { image: '/App-After Sales Service/process-5.png', title: 'Verify & Close', description: 'Customer provides digital signature, ticket closes automatically.' }
        ]
      },
      order: 70
    },
    {
      type: 'ass-why-choose',
      content: {
        title: 'Why Choose Our After-Sales Service Platform?',
        description: 'Built for enterprises that demand reliability, scalability, and intelligent automation in their service operations.',
        items: [
          { icon: '/App-After Sales Service/Image-9.png', title: 'AI-Powered Routing', description: 'Intelligent complaint assignment based on location, skillset, and workload.' },
          { icon: '/App-After Sales Service/Image-10.png', title: 'Multi-Channel Support', description: 'Accept complaints via app, web portal, email, or phone — all unified.' },
          { icon: '/App-After Sales Service/Image-11.png', title: 'SLA Management', description: 'Define and enforce service-level agreements with automated escalations.' },
          { icon: '/App-After Sales Service/Image-12.png', title: 'Offline Capability', description: 'Field executives can work offline and sync data when connectivity is restored.' },
          { icon: '/App-After Sales Service/Image-13.png', title: 'Custom Workflows', description: 'Design custom service workflows tailored to your business processes.' },
          { icon: '/App-After Sales Service/Image-14.png', title: 'Integration Ready', description: 'Seamlessly integrate with ERP, CRM, and inventory management systems.' }
        ]
      },
      order: 80
    },
    {
      type: 'ass-features-grid',
      content: {
        title: 'Deep Feature Set for Enterprise Operations',
        features: [
          { icon: '/App-After Sales Service/Image-1.png', title: 'Dispatcher Console', description: 'Interactive drag-and-drop calendar map for manual assignment overrides.' },
          { icon: '/App-After Sales Service/Image-2.png', title: 'Mobile Exec App', description: 'Dedicated Android & iOS apps with native navigation, offline support, and push alerts.' },
          { icon: '/App-After Sales Service/Image-3.png', title: 'Parts Inventory', description: 'Manage truck-stock, warehouse inventory, and automated parts replenishment cycles.' },
          { icon: '/App-After Sales Service/Image-4.png', title: 'Contract Management', description: 'Configure warranties, preventive maintenance agreements, and service level contracts.' }
        ]
      },
      order: 90
    },
    {
      type: 'ass-cta',
      content: {
        title: 'Ready to Elevate Your Customer Experience?',
        description: 'Schedule a personalized demo with our field service management experts to see how the ebizframe After-Sales Service App can transform your business.',
        buttonText: 'Schedule a Demo Now',
        buttonUrl: '/contact-us'
      },
      order: 100
    },
    {
      type: 'ass-clients',
      content: {
        title: 'Trusted by Global Enterprise Brands',
        logos: [
          '/App-After Sales Service/logo-1.png',
          '/App-After Sales Service/logo-2.png',
          '/App-After Sales Service/logo-3.png',
          '/App-After Sales Service/logo-4.png',
          '/App-After Sales Service/logo-5.png'
        ]
      },
      order: 110
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

  console.log('✨ Seeding completed successfully! Template is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
