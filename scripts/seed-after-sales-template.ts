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
      type: 'ass-process',
      content: {
        title: 'End-to-End After-Sales Service Journy',
        steps: [
          { image: '/App-After Sales Service/Process 1.png', title: 'Customer Complaint', description: 'Customer raises a complaint through the app, web, or support channel.' },
          { image: '/App-After Sales Service/Process 2.png', title: 'Assignment', description: 'The system auto-assigns the complaint to the most suitable technician.' },
          { image: '/App-After Sales Service/Process 3.png', title: 'Technician Visit', description: 'Technician is notified, visits the site, and inspects the reported issue.' },
          { image: '/App-After Sales Service/Process 4.png', title: 'Resolution', description: 'Technician resolves the issue and updates the status in real-time.' },
          { image: '/App-After Sales Service/Process 5.png', title: 'Feedback', description: 'Customer shares feedback and rates the service experience.' }
        ]
      },
      order: 50
    },
    {
      type: 'ass-enterprise',
      content: {
        title: 'Marketing runs on content.\nESS automates how it\'s made.',
        description: 'Solutions for every marketer',
        image: '/App-After Sales Service/ChatGPT Image Jun 17, 2026, 05_47_51 PM 1.png',
        cards: [
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 1.png', title: 'Product Marketer', description: '' },
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 3.png', title: 'Content Marketer', description: '' },
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 6.png', title: 'Field Marketer', description: '' },
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 2.png', title: 'Brand Marketer', description: '' },
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 5.png', title: 'PR Marketer', description: '' },
          { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 4.png', title: 'Performance Marketer', description: '' }
        ]
      },
      order: 60
    },
    {
      type: 'ass-stats',
      content: {
        stats: [
          { value: '100%', label: 'increase in customer Satisfaction' },
          { value: '80%', label: 'increase in field productivity' },
          { value: '60%', label: 'Reduction in inventory carrying costs' }
        ]
      },
      order: 70
    },
    {
      type: 'ass-why-choose',
      content: {
        badgeText: 'Apps & integrations',
        title: 'Simplify Scheduling.\nAccelerate Productivity.',
        description: 'Integrate Calendly with your business tools to automate meeting management, reduce back-and-forth communication, and create a more efficient workflow.',
        image: '/App-After Sales Service/Frame 295.png'
      },
      order: 80
    },
    {
      type: 'ass-features-grid',
      content: {
        title: 'Simplify Scheduling. Accelerate Productivity.',
        categories: [
          {
            name: 'Popular',
            items: [
              { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-1.png', title: 'Salesforce', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-3.png', title: 'Typeform', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-4.png', title: 'Claude', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-8.png', title: 'Stripe', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-11.png', title: 'Greenhouse', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-12.png', title: 'Gong', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Extensions & Apps',
            items: [
              { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-3.png', title: 'Typeform', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Calendars',
            items: [
              { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Sales & CRM',
            items: [
              { image: '/App-After Sales Service/Image-1.png', title: 'Salesforce', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Video Conferencing',
            items: [
              { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Marketing',
            items: [
              { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Recruiting & ATS',
            items: [
              { image: '/App-After Sales Service/Image-11.png', title: 'Greenhouse', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Payments',
            items: [
              { image: '/App-After Sales Service/Image-8.png', title: 'Stripe', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Analytics',
            items: [
              { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-12.png', title: 'Gong', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'API & Connectors',
            items: [
              { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'AI Assistants',
            items: [
              { image: '/App-After Sales Service/Image-4.png', title: 'Claude', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Email Messaging',
            items: [
              { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Embed Calendly',
            items: [
              { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Security & Compliance',
            items: [
              { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Google Suite',
            items: [
              { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Microsoft Suite',
            items: [
              { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
              { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          },
          {
            name: 'Other Integrations',
            items: [
              { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' }
            ]
          }
        ]
      },
      order: 90
    },
    {
      type: 'ass-experience',
      content: {
        title: 'Improve Customer Experience and Loyalty with our After-Sales Service App',
        mediaUrl: '/App-After Sales Service/Rectangle 193.png',
        videoUrl: ''
      },
      order: 100
    },
    {
      type: 'ass-cta',
      content: {
        bgColor: '#eff3f8',
        title: 'Future-Ready Oracle Database Strategy',
        titleColor: '#5b45b2',
        description: 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.',
        descriptionColor: '#374151',
        buttonText: 'Explore Your Upgrade Roadmap',
        buttonUrl: '#',
        buttonBgColor: '#fcc42c',
        buttonTextColor: '#000000'
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
