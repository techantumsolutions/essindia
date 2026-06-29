import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding App Overview Mobile App Template...');

  const templateName = 'App-App Overview Mobile';
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
    description: 'Mobile App Overview template with Hero, Mobility Solutions, and Interactive Workspace.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'aom-hero',
      content: {
        bgColor: '#0f172a',
        badgeBgColor: '#ffffff',
        badgeBorderColor: 'transparent',
        badgeText: 'Enterprise Mobility Solutions',
        badgeTextColor: '#2a2b6a',
        title: 'Empowering Businesses Through Enterprise Mobility',
        titleColor: '#ffffff',
        description: 'Empower your workforce with intelligent mobile applications that streamline operations, improve collaboration, and enable real-time business access from anywhere.',
        descriptionColor: '#cbd5e1',
        button1BgColor: '#1a1f4e',
        button1BorderColor: '#1a1f4e',
        button1Text: 'Get started',
        button1TextColor: '#ffffff',
        button1Url: '/contact-us',
        button2BgColor: '#ffffff',
        button2BorderColor: '#ffffff',
        button2Text: 'Explore ROI Calculator',
        button2TextColor: '#2a2b6a',
        button2Url: '#',
        image: '/App- App over view (mobile app)/f3273dba-dc3e-435a-bf5b-2c68d5a7ccd1 1.png'
      },
      order: 10
    },
    {
      type: 'aom-solutions',
      content: {
        title: 'Enterprise Mobility Solutions',
        description: 'Modern businesses rely on Enterprise Mobility Solutions to empower teams with real-time access, seamless collaboration, and efficient business operations from anywhere. At ESS Mobile Apps, we build intelligent, workflow-driven mobile applications using modern PWA technology, delivering seamless experiences across iOS, Android, and Windows platforms.',
        image: '/App- App over view (mobile app)/image 78.png',
        items: [
          {
            icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
            title: 'Mobile SFA',
            description: 'Sales Force Automation app to streamline field sales operations and improve team productivity.'
          },
          {
            icon: '/App- App over view (mobile app)/crm-crm_svgrepo.com.png',
            title: 'ebizframe CRM',
            description: 'Smart CRM application to manage customer interactions, sales activities, and team performance efficiently.'
          }
        ]
      },
      order: 20
    },
    {
      type: 'aom-workspace',
      content: {
        title: 'Explore every mobile business application from one intelligent workspace.',
        categories: [
          {
            name: 'SALES OPERATIONS',
            tabs: [
              {
                label: 'SFA',
                desc: 'Sales force automation',
                icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
                contentTitle: 'ESS Mobile SFA',
                contentDescription: 'Increase SFA productivity by equipping your sales team with real-time customer data, order booking status, material availability, and automated workflow procedures.',
                contentImage: '/App- App over view (mobile app)/dashboard 1.png',
                benefits: ['Lead Management', 'Order Booking', 'Activity Scheduling', 'Route Planning'],
                ctaText: 'Get started',
                ctaUrl: '#'
              },
              {
                label: 'CRM',
                desc: 'Customer relationship hub',
                icon: '/App- App over view (mobile app)/crm-crm_svgrepo.com.png',
                contentTitle: 'ESS CRM',
                contentDescription: 'Mobile Sales Force Automation (SFA) App is an Enterprise Mobility Solution. The sales team uses this app for Attendance, Order Booking, Customer Registration, Customer Order Payment follow-up, Route / Tour Plan, Stock inquiry, Stock Request, Sales Return, Collection, Day Close Activity, Van Sales, and more. Meanwhile, sales managers can track their salesmen\'s locations along with an overview of their activities.',
                contentImage: '/App- App over view (mobile app)/dashboard 1.png',
                benefits: ['Lead Management', 'Customer Tracking', 'Activity Scheduling', 'Sales Pipeline Visibility', 'Performance Analytics', 'Mobile Accessibility'],
                ctaText: 'Get started',
                ctaUrl: '#'
              },
              {
                label: 'Van Sales',
                desc: 'Direct store delivery',
                icon: '/App- App over view (mobile app)/van-facing-left_svgrepo.com.png',
                contentTitle: 'ESS Van Sales',
                contentDescription: 'Optimize route deliveries and store execution with real-time pricing, print invoice on the go, stock replenishment, and payment collection tracking.',
                contentImage: '/App- App over view (mobile app)/dashboard 1.png',
                benefits: ['Invoice Printing', 'Route Delivery', 'Payment Collection', 'Inventory Sync'],
                ctaText: 'Get started',
                ctaUrl: '#'
              }
            ]
          },
          {
            name: 'FIELD OPERATIONS',
            tabs: [
              {
                label: 'Field Force',
                desc: 'Field service execution',
                icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
                contentTitle: 'Field Force Management',
                contentDescription: 'Manage onsite operations, assign tickets automatically to executives, capture client feedback, and track expense limits efficiently.',
                contentImage: '/App- App over view (mobile app)/dashboard 1.png',
                benefits: ['Task Assignment', 'On-site Inspections', 'Expense Recording'],
                ctaText: 'Get started',
                ctaUrl: '#'
              }
            ]
          },
          {
            name: 'OPERATIONAL MANAGEMENT',
            tabs: [
              {
                label: 'Inventory App',
                desc: 'Store warehouse tracking',
                icon: '/App- App over view (mobile app)/van-facing-left_svgrepo.com.png',
                contentTitle: 'Warehouse Inventory Management',
                contentDescription: 'Scan barcodes, perform stock counts, register material movements, and streamline shipping operations instantly.',
                contentImage: '/App- App over view (mobile app)/dashboard 1.png',
                benefits: ['Stock Audit', 'Barcode Scanning', 'Warehouse Dispatch'],
                ctaText: 'Get started',
                ctaUrl: '#'
              }
            ]
          }
        ]
      },
      order: 30
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
