import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
const client = postgres(connectionString || '', { prepare: false });
const db = drizzle(client, { schema });

const SEED_RPA_CONTENTS: Record<string, any> = {
  'rpa-hero': {
    bgColor: 'linear-gradient(135deg, #a2b6cb 0%, #6e849d 100%)',
    badgeBgColor: '#ffffff',
    badgeText: 'Robotic Process Automation',
    badgeTextColor: '#27256b',
    title: 'Robotic Process Automation Solutions',
    titleColor: '#ffffff',
    description: 'ESS brings decades of business process improvement experience to help organizations identify automation opportunities, develop RPA workflows, and maintain a digital workforce that improves efficiency, accuracy, and long-term growth.',
    descriptionColor: '#f1f5f9',
    button1BgColor: '#27256b',
    button1Text: 'Book your Demo',
    button1TextColor: '#ffffff',
    button1Url: '#',
    button2BgColor: '#ffffff',
    button2BorderColor: '#ffffff',
    button2Text: 'Case studies',
    button2TextColor: '#27256b',
    button2Url: '#',
    image: '/RPA-Robotic Process Automation (RPA)/de84036c921d93c37b98e83bda27549bc7ae4a96.png'
  },
  'rpa-overview': {
    title: 'Robotic Process Automation Solutions',
    description: 'At ESS, we help businesses streamline operations through intelligent RPA solutions tailored to their unique workflows and existing systems. From identifying automation opportunities to implementing scalable processes, we focus on improving efficiency, accuracy, visibility, and operational consistency. Whether organizations are beginning their automation journey or expanding across departments, our expert team ensures every solution integrates smoothly, delivers measurable business impact, and supports long-term digital transformation with confidence.',
    subtitle: 'A successful RPA Journey Starts with Selecting the Right Implementation Partner',
    autoScroll: true,
    cards: [
      {
        icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png',
        title: '500+',
        description: 'Automated Processes'
      },
      {
        icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png',
        title: '1M+',
        description: 'Automated Transactions'
      },
      {
        icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png',
        title: '1000+',
        description: 'Saved Manhours'
      }
    ],
    logos: [
      { image: '/RPA-Robotic Process Automation (RPA)/image 58.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 59.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 60.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 61.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 62.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 63.png' }
    ]
  },
  'rpa-industries': {
    title: 'Empowering Industries through Intelligent RPA',
    description: 'RPA helps organizations optimize workflows, improve compliance, accelerate digital transformation, and reimagine repetitive business processes across sectors.',
    industries: [
      {
        title: 'Retail',
        description: 'Streamline billing, returns, inventory updates, and customer service workflows through Robotic Process Automation...',
        icon: '/RPA-Robotic Process Automation (RPA)/front-store-with-awning_svgrepo.com.png'
      },
      {
        title: 'Manufacturing',
        description: 'With RPA, automation of supply chain tasks like invoice processing, order fulfillment, and BOM...',
        icon: '/RPA-Robotic Process Automation (RPA)/industrial-robot-factory_svgrepo.com.png'
      },
      {
        title: 'Logistics',
        description: 'Track shipments, manage invoicing, and synchronize warehousing systems seamlessly with RPA service...',
        icon: '/RPA-Robotic Process Automation (RPA)/delivery-truck-box-delivery_svgrepo.com.png'
      },
      {
        title: 'Automobile',
        description: 'Automate procurement, dealer communications, and compliance reporting using RPA solutions...',
        icon: '/RPA-Robotic Process Automation (RPA)/car-roof-box_svgrepo.com.png'
      },
      {
        title: 'FMCG',
        description: 'Leverage RPA to power demand forecasting, manage distributor billing, and handle large-scale invoicing...',
        icon: '/RPA-Robotic Process Automation (RPA)/groceries-grocery_svgrepo.com.png'
      },
      {
        title: 'Trading',
        description: 'Speed up reporting cycles, strengthen compliance, and automate order management for seamless business...',
        icon: '/RPA-Robotic Process Automation (RPA)/construction-crane_svgrepo.com.png'
      },
      {
        title: 'Hospitality',
        description: 'Automate reservation handling, deliver enhanced guest experiences, and optimize back-office operations...',
        icon: '/RPA-Robotic Process Automation (RPA)/hospital_svgrepo.com.png'
      },
      {
        title: 'BFSI',
        description: 'Enhance compliance, accelerate fraud detection, and make claims processing faster and more reliable....',
        icon: '/RPA-Robotic Process Automation (RPA)/bank-building-city_svgrepo.com.png'
      },
      {
        title: 'Pharmaceutical',
        description: 'Use RPA to reduce manual errors in regulatory reporting, manage lab data effectively, and optimize...',
        icon: '/RPA-Robotic Process Automation (RPA)/medical-record-medical-hospital-pharmacy-healthcare_svgrepo.com.png'
      },
      {
        title: 'Telecom',
        description: 'Optimize billing, customer onboarding, and service request handling, leveraging robotic process automation processes',
        icon: '/RPA-Robotic Process Automation (RPA)/tower-with-signal_svgrepo.com.png'
      },
      {
        title: 'Healthcare',
        description: 'Improve patient data accuracy, streamline claim processing, and ensure regulatory compliance',
        icon: '/RPA-Robotic Process Automation (RPA)/healthcare-ambulance_svgrepo.com.png'
      },
      {
        title: 'Tourism',
        description: 'Automate bookings, cancellations, and administrative tasks to create a hassle-free travel experience',
        icon: '/RPA-Robotic Process Automation (RPA)/outdoor-trip-traveling_svgrepo.com.png'
      }
    ]
  },
  'rpa-solutions': {
    title: 'Our Most Popular AI Powered RPA BOTs',
    description: 'Our Most Popular AI Powered RPA BOTs are designed to automate repetitive business processes, improve operational speed, and enhance workflow accuracy across departments.',
    solutions: [
      { title: 'Invoice Automation BOT' },
      { title: 'Reports Reconciliation BOT' },
      { title: 'Sales Order Processing BOT' },
      { title: 'Bank Statements Reconciliation BOT' },
      { title: 'IT Backup Monitoring Validating BOT' },
      { title: 'Debtor\'s Statement Reconciliation BOT' },
      { title: 'CV Screening and Shortlisting BOT' },
      { title: 'HSN Code Reconciliation BOT' }
    ],
    image: '/RPA-Robotic Process Automation (RPA)/AI bot.png'
  },
  'rpa-frameworks': {
    title: 'ESS brings expertise on frameworks',
    autoScroll: true,
    logos: [
      { image: '/RPA-Robotic Process Automation (RPA)/image 64.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 65.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 66.png' },
      { image: '/RPA-Robotic Process Automation (RPA)/image 67.png' }
    ]
  },
  'rpa-benefits': {
    title: 'Benefits of RPA',
    subtitle: 'Robotic Process Automation (RPA) helps businesses automate repetitive tasks, reduce manual errors, and improve operational efficiency.',
    benefits: [
      { title: '0% error rate in the automated process', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 164.png' },
      { title: 'Great reductions in cycle times', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 165.png' },
      { title: 'Can utilize manpower for more productive tasks', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 166.png' },
      { title: 'Up to 80% cost reduction', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 167.png' },
      { title: 'Non-intrusive solution framework', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 168.png' },
      { title: 'Reduced cost of operations', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 169.png' }
    ]
  },
  'rpa-cta': {
    title: 'Download Our eBook - 50+ Industry Specific RPA Use Cases',
    buttonText: 'Download Now',
    buttonUrl: '#'
  }
};

async function main() {
  console.log('🚀 Fixing RPA page sections data...');

  // 1. Get RPA page
  const rpaPage = await db.query.pages.findFirst({
    where: (p, { eq }) => eq(p.slug, 'robotic-process-automation')
  });

  if (!rpaPage) {
    console.error('❌ RPA page not found in pages table');
    process.exit(1);
  }

  console.log(`✅ Found RPA page: ${rpaPage.title} (${rpaPage.id})`);

  // Get template ID
  const rpaTemplate = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.slug, 'robotic-process-automation')
  });

  if (rpaTemplate) {
    await db.update(schema.pages)
      .set({ templateId: rpaTemplate.id })
      .where(eq(schema.pages.id, rpaPage.id));
    console.log(`✅ Linked page to template: ${rpaTemplate.name} (${rpaTemplate.id})`);
  }

  // 2. Fetch page sections
  const pSecs = await db.select().from(schema.pageSections).where(eq(schema.pageSections.pageId, rpaPage.id));
  console.log(`Found ${pSecs.length} sections for RPA page.`);

  for (const section of pSecs) {
    const defaultContent = SEED_RPA_CONTENTS[section.type];
    if (defaultContent) {
      // Merge current content (if any) over the default content
      const currentContent = (section.content as Record<string, any>) || {};
      const mergedContent = { ...defaultContent, ...currentContent };

      // Update in DB
      await db.update(schema.pageSections)
        .set({ content: mergedContent })
        .where(eq(schema.pageSections.id, section.id));
      console.log(`✅ Restored content for section "${section.type}" (ID: ${section.id})`);
    } else {
      console.log(`ℹ️ No seed contents for section "${section.type}"`);
    }
  }

  console.log('🎉 RPA page sections data restored successfully!');
  await client.end();
}

main().catch(console.error);
