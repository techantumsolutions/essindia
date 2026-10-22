import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections, categories } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Landing Page 1 Template...');

  const templateName = 'Landing Page Template 1';
  const slug = slugify(templateName);

  // 1. Get or create Landing Page category
  let category = await db.query.categories.findFirst({
    where: (c, { eq }) => eq(c.slug, 'landing-page'),
  });

  if (!category) {
    const [newCategory] = await db.insert(categories).values({
      name: 'Landing Page',
      slug: 'landing-page',
      description: 'Landing page templates',
      status: 'active',
    }).returning();
    category = newCategory;
    console.log('✅ Created "Landing Page" category.');
  }

  // 2. Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });

  if (existingTemplate) {
    console.log(`ℹ️ Template "${templateName}" already exists. Deleting it to recreate...`);
    await db.delete(templateSections).where(eq(templateSections.templateId, existingTemplate.id));
    await db.delete(templates).where(eq(templates.id, existingTemplate.id));
  }

  // 3. Create Template
  const [newTemplate] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'A comprehensive corporate landing page with 12 modular, high-fidelity sections.',
    status: 'active',
    categoryId: category.id,
    previewThumbnail: '/Landing page1/assets/Frame 1618872987.png',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // 4. Sections Data
  const sections = [
    {
      type: 'landing1-hero',
      content: {
        title: 'Tackling The Lack Of Clear ERP Information, One Guide At A Time.',
        primaryCtaText: 'Book Free Demo',
        primaryCtaUrl: '/contact',
        secondaryCtaText: 'Watch Product Tour',
        secondaryCtaUrl: '#',
        image: '/Landing page1/assets/RecehTok Crypto.jpg',
      },
      order: 10
    },
    {
      type: 'landing1-value',
      content: {
        value1: '1000+',
        title1: 'Customers',
        value2: '30+',
        title2: 'Years Experience',
        value3: '25+',
        title3: 'Industries'
      },
      order: 20
    },
    {
      type: 'landing1-challenges',
      content: {
        badge: 'THE CHALLENGE',
        title: 'Business challenges slowing your growth?',
        description: 'Most mid-market enterprises lose 20-30% of productivity to the same six problems. ESS ERP is built to eliminate them.',
        challenges: [
          { iconType: 'manual', title: 'Manual Operations', desc: 'Teams waste hours on repetitive data entry, reconciliations and spreadsheets that never agree.', solution: 'Solved by ESS ERP' },
          { iconType: 'disconnected', title: 'Disconnected Systems', desc: 'Finance, sales and inventory live in silos. Data doesn\'t flow, and neither do decisions.', solution: 'Solved by ESS ERP' },
          { iconType: 'reports', title: 'No Real-Time Reports', desc: 'Leadership waits days for month-end reports. By the time you see the numbers, they\'re history.', solution: 'Solved by ESS ERP' },
          { iconType: 'inventory', title: 'Inventory Issues', desc: 'Stockouts, overstock and dead inventory tie up working capital and erode customer trust.', solution: 'Solved by ESS ERP' },
          { iconType: 'approval', title: 'Approval Delays', desc: 'Paper-based approvals delay purchase orders, leaves and expenses across departments.', solution: 'Solved by ESS ERP' },
          { iconType: 'visibility', title: 'Poor Customer Visibility', desc: 'No single view of every customer touchpoint — sales, service, payments and complaints.', solution: 'Solved by ESS ERP' }
        ]
      },
      order: 30
    },
    {
      type: 'landing1-showcase',
      content: {
        title: '7 Modules One Powerful Manufacturing Software',
        tabs: [
          {
            name: 'Production Planning',
            title: 'Production Planning',
            desc: 'The Production Planning Module In Our Manufacturing ERP Software Runs On An Intelligent MRP Engine That Responds To Real-Time Demand, Machine Capacity, And Material Availability, Ensuring Your Shop Floor Stays Efficient And On Track Without Constant Manual Effort.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'CRM',
            title: 'Customer Relationship Management',
            desc: 'Manage leads, pipeline opportunities, and client communication metrics natively connected with sales order booking workflows.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'HRMS',
            title: 'Human Resource Management System',
            desc: 'Unify payroll, attendance tracking, appraisal evaluations, and leave management seamlessly across all operational sites.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'Finance Management',
            title: 'Finance & Accounts Management',
            desc: 'Automate accounting entries, manage cash flow metrics, run multi-company balance sheets, and handle audits with zero spreadsheet dependencies.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'Inventory Management',
            title: 'Smart Inventory & Warehousing',
            desc: 'Real-time multi-location stock tracking, barcode/RFID integrations, minimum-stock notifications, and automated supply orders.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'Sales',
            title: 'Sales & Dispatch Control',
            desc: 'Manage sales orders, check credit limits, automate billing, and schedule delivery dispatches from a single clean screen.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          },
          {
            name: 'Purchase',
            title: 'Strategic Purchase Management',
            desc: 'Track vendor quotations, automate purchase orders, handle multi-currency conversions, and audit supplier performance lists.',
            image: '/Landing page1/assets/Frame 1618872978.png',
            primaryCtaText: 'Read More',
            primaryCtaUrl: '#',
            secondaryCtaText: 'Get free Demo',
            secondaryCtaUrl: '/contact'
          }
        ]
      },
      order: 40
    },
    {
      type: 'landing1-intro',
      content: {
        badge: 'HOW ESS ERP SOLVES IT',
        titlePart1: 'One Platform. ',
        titlePart2: 'Complete Business Control.',
        description: 'Connect every department on a single source of truth. Data flows automatically across modules — no double entry, no reconciliations, no surprises.',
        image: '/Landing page1/assets/image 381.png',
        ctaText: 'Explore ERP Modules',
        ctaUrl: '#features',
        introModules: [
          { name: 'Finance', iconType: 'finance' },
          { name: 'Sales', iconType: 'sales' },
          { name: 'Inventory', iconType: 'inventory' },
          { name: 'Manufacturing', iconType: 'mfg' },
          { name: 'CRM', iconType: 'crm' },
          { name: 'HR', iconType: 'hr' },
          { name: 'Projects', iconType: 'projects' },
          { name: 'Analytics', iconType: 'analytics' }
        ]
      },
      order: 60
    },
    {
      type: 'landing1-features',
      content: {
        badge: 'AI INSIDE',
        title: 'AI Built Into Every Business Process',
        description: 'ESS ERP isn\'t an ERP with AI bolted on. Intelligence is woven through finance, sales, inventory and operations — so every team works faster and smarter.',
        features: [
          { icon: '/Landing page1/assets/bot_svgrepo.com.png', title: 'AI Copilot', desc: 'Ask anything in plain English and get instant answers, reports and actions.' },
          { icon: '/Landing page1/assets/growth_svgrepo.com.png', title: 'Predictive Analytics', desc: 'Forecast demand, revenue and churn weeks before they happen.' },
          { icon: '/Landing page1/assets/lines-graph-file_svgrepo.com.png', title: 'Smart Reports', desc: 'Auto-generated narratives explain every variance for you.' },
          { icon: '/Landing page1/assets/voice-scan_svgrepo.com.png', title: 'Document AI', desc: 'Extract data from invoices, POs and GRNs with 99% accuracy.' },
          { icon: '/Landing page1/assets/git-merge_svgrepo.com.png', title: 'Approval Automation', desc: 'Route approvals intelligently and clear bottlenecks in seconds.' },
          { icon: '/Landing page1/assets/analytics-graph-chart_svgrepo.com.png', title: 'Forecasting', desc: 'ML-driven budgets and cash flow projections you can trust.' },
          { icon: '/Landing page1/assets/message-square-01_svgrepo.com.png', title: 'Chat Assistant', desc: 'Conversational support built into every screen, 24x7.' },
          { icon: '/Landing page1/assets/search-alt_svgrepo.com.png', title: 'Natural Language Search', desc: 'Find any record, transaction or insight by just asking.' }
        ],
        ctaText: 'See AI Copilot in Action',
        ctaUrl: '#'
      },
      order: 80
    },
    {
      type: 'landing1-suite',
      content: {
        badge: 'INDUSTRIES',
        title: 'Everything Your Business Runs On, In One Suite',
        description: '13 Deeply Integrated Modules, Use What You Need Today, Switch On The Rest As You Scale-Without Ever Migrating Data.',
        modules: [
          {
            name: 'Finance',
            desc: 'Capture leads, manage opportunities, and track every customer interaction in one place. Build stronger relationships and close deals with confidence.',
            image: '/Landing page1/assets/Clip path group.png'
          },
          {
            name: 'CRM',
            desc: 'Capture leads, manage opportunities, and track every customer interaction in one place. Build stronger relationships and close deals with confidence.',
            image: '/Landing page1/assets/Group.png',
            highlighted: true
          },
          {
            name: 'Sales',
            desc: 'Create quotations, process sales orders, manage pricing, and track deliveries effortlessly. Streamline your complete sales cycle from inquiry to invoice.',
            image: '/Landing page1/assets/Frame 1618872982.png'
          },
          {
            name: 'Manufacturing',
            desc: 'Plan production, manage BOMs, routing, work orders, and shop-floor activities with ease. Improve efficiency through real-time production planning.',
            image: '/Landing page1/assets/Frame 1618872983.png'
          },
          {
            name: 'Inventory',
            desc: 'Track inventory across multiple warehouses with batch and serial control. Maintain accurate stock levels through real-time inventory management.',
            image: '/Landing page1/assets/Frame 1618872984.png'
          },
          {
            name: 'Business Intelligence',
            desc: 'Turn business data into actionable insights with interactive dashboards and reports. Monitor KPIs and make faster, data-driven decisions across your organization.',
            image: '/Landing page1/assets/Frame 1618872981.png'
          }
        ],
        ctaText: 'Explore More',
        ctaUrl: '/contact'
      },
      order: 85
    },
    {
      type: 'landing1-industries',
      content: {
        badge: 'INDUSTRIES',
        title: 'Built For Every Industry',
        description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
        image: '/Landing page1/assets/Frame 1618872987.png',
        industries: [
          { icon: '/Landing page1/assets/factory_svgrepo.com.png', name: 'Manufacturing' },
          { icon: '/Landing page1/assets/bag-3_svgrepo.com.png', name: 'Retail' },
          { icon: '/Landing page1/assets/tshirt_svgrepo.com.png', name: 'Textile' },
          { icon: '/Landing page1/assets/food_svgrepo.com.png', name: 'Food' },
          { icon: '/Landing page1/assets/car_svgrepo.com.png', name: 'Automobile' },
          { icon: '/Landing page1/assets/logistics-delivery-cart_svgrepo.com.png', name: 'Logistics' },
          { icon: '/Landing page1/assets/heart-health_svgrepo.com.png', name: 'Healthcare' },
          { icon: '/Landing page1/assets/helmet-industry-business-construction-engineer-worker-engineering_svgrepo.com.png', name: 'Construction' },
          { icon: '/Landing page1/assets/education-cap-student-graduation-university_svgrepo.com.png', name: 'Education' },
          { icon: '/Landing page1/assets/load-balancer-network_svgrepo.com.png', name: 'Distribution' },
          { icon: '/Landing page1/assets/pharmacy_svgrepo.com.png', name: 'Pharma' },
          { icon: '/Landing page1/assets/chemical-lab_svgrepo.com.png', name: 'Chemical' }
        ]
      },
      order: 87
    },
    {
      type: 'landing1-stats',
      content: {
        badge: 'CUSTOMER SUCCESS',
        title: 'Numbers that define three decades of trust',
        stats: [
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 2.png', value: '1000+', title: 'Customers' },
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 3.png', value: '30+', title: 'Years' },
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 4.png', value: '25+', title: 'Industries' },
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 5.png', value: '98%', title: 'Customer Satisfaction' },
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 6.png', value: '40%', title: 'Productivity Increase' },
          { icon: '/Landing page1/assets/4e9956a6-9465-4067-84fd-9a36765c1941 7.png', value: '24x7', title: 'Support' }
        ]
      },
      order: 88
    },
    {
      type: 'landing1-process',
      content: {
        badge: 'IMPLEMENTATION',
        title: 'From kickoff to go-live in weeks, not months',
        description: 'A proven 7-step methodology refined over 30 years and 1000+ deployments — with a dedicated team beside you at every stage.',
        process: [
          { title: 'Requirement Analysis', description: 'We map your processes, pain points and goals.', icon: '/Landing page1/assets/search-alt_svgrepo.com.png' },
          { title: 'Business Consulting', description: 'Experts benchmark your workflows against industry best practice.', icon: '/Landing page1/assets/light-bulb_svgrepo.com.png' },
          { title: 'Solution Design', description: 'A tailored blueprint with modules, configs and integrations.', icon: '/Landing page1/assets/light-bulb_svgrepo.com.png' },
          { title: 'Implementation', description: 'Rapid deployment with data migration and testing.', icon: '/Landing page1/assets/rocket-launch_svgrepo.com.png' },
          { title: 'Training', description: 'Role-based training for every team, on-site and online.', icon: '/Landing page1/assets/graduation-cap_svgrepo.com.png' },
          { title: 'Go Live', description: 'Controlled cutover with parallel-run safety net.', icon: '/Landing page1/assets/check-circle_svgrepo.com.png' },
          { title: 'Support', description: '24×7 support, upgrades and continuous optimization.', icon: '/Landing page1/assets/support_svgrepo.com.png' }
        ]
      },
      order: 100
    },
    {
      type: 'landing1-integration',
      content: {
        badge: 'INTEGRATION',
        title: 'Apps & Integration',
        description: "We understand the hussle of replacing the long used tools in your process. That's why we integrate tools you use in your day-to-day work.",
        image: '/Landing page1/assets/apps intigtation.png'
      },
      order: 105
    },
    {
      type: 'landing1-works',
      content: {
        badge: 'OUR WORKS',
        title: 'Built For Every Industry',
        description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
        works: [
          {
            category: 'Category Name',
            title: "Ghana's leading Producer of Wood Products opts ebizframe ERP",
            date: 'December 18, 2025',
            image: '/Landing page1/assets/image 103.png',
            link: '#'
          },
          {
            category: 'Category Name',
            title: 'Top Cosmetics Manufacturers in DRC opts for ebizframe ERP',
            date: 'December 18, 2025',
            image: '/Landing page1/assets/image 103-1.png',
            link: '#'
          },
          {
            category: 'Category Name',
            title: 'Thika Motors, Kenya chooses ebizframe ERP for their country wide operations',
            date: 'December 18, 2025',
            image: '/Landing page1/assets/image 103-2.png',
            link: '#'
          }
        ]
      },
      order: 108
    },
    {
      type: 'landing1-brands',
      content: {
        badge: 'CLIENTS',
        title: 'Our Key Clients For Manufacturing ERP',
        description: 'Trusted By The Best In The Industry',
        logos: [
          '/Landing page1/assets/SVG.png',
          '/Landing page1/assets/SVG-1.png',
          '/Landing page1/assets/SVG-2.png',
          '/Landing page1/assets/SVG-3.png',
          '/Landing page1/assets/SVG-4.png',
          '/Landing page1/assets/SVG-5.png',
          '/Landing page1/assets/SVG-6.png',
          '/Landing page1/assets/SVG-7.png',
          '/Landing page1/assets/SVG-8.png'
        ]
      },
      order: 109
    },
    {
      type: 'landing1-testimonials',
      content: {
        badge: 'TESTIMONIALS',
        title: 'Built For Every Industry',
        description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
        testimonials: [
          {
            avatar: '/Landing page1/assets/unsplash_OhKElOkQ3RE.png',
            name: 'James Pattinson',
            designation: 'Operations Director',
            rating: 4,
            quote: '"Lobortis leo pretium facilisis amet nisl at nec. Scelerisque risus tortor donec ipsum consequat semper consequat adipiscing ultrices."'
          },
          {
            avatar: '/Landing page1/assets/unsplash_WMD64tMfc4k.png',
            name: 'Greg Stuart',
            designation: 'Supply Chain Head',
            rating: 5,
            quote: '"Vestibulum, cum nam non amet consectetur morbi aenean condimentum eget. Ultricies integer nunc neque accumsan laoreet. Viverra nibh ultrices."'
          },
          {
            avatar: '/Landing page1/assets/unsplash_6anudmpILw4.png',
            name: 'Trevor Mitchell',
            designation: 'Managing Director',
            rating: 3,
            quote: '"Ut tristique viverra sed porttitor senectus. A facilisis metus pretium ut habitant lorem. Velit vel bibendum eget aliquet sem nec, id sed. Tincidunt."'
          }
        ]
      },
      order: 110
    },
    {
      type: 'landing1-faq',
      content: {
        badge: "FAQ'S",
        title: 'Frequently Asked Questions',
        description: 'Get the information you need with our frequently asked questions.',
        faqs: [
          {
            question: 'How long does an ESS ERP implementation take?',
            answer: "Most mid-market deployments go live in 6–12 weeks. The exact timeline depends on the number of modules, data migration volume and custom workflows. Our 7-step methodology includes a parallel-run safety net so there's zero disruption at cutover."
          },
          {
            question: 'Is ESS ERP cloud-based or on-premise',
            answer: 'Both options are available. We offer secure cloud hosting on AWS/Azure, as well as on-premise deployments for enterprises with strict compliance or local network requirements.'
          },
          {
            question: 'Which industries does ESS ERP support?',
            answer: 'We support Manufacturing, Retail, Chemicals, Automotive, Cosmetics, Pharmaceuticals, Steel, Logistics, Food & Beverage, and more with pre-built configurations.'
          },
          {
            question: 'How does the AI Copilot actually work?',
            answer: 'The AI Copilot integrates with your data to automate routine data entry, generate instant compliance reports, predict inventory shortages, and answer business queries using natural language.'
          },
          {
            question: 'Can ESS ERP integrate with our existing tools?',
            answer: 'Yes! We offer rich REST APIs and pre-built connectors for popular tools like Salesforce, HubSpot, QuickBooks, Tally, Gmail, Slack, and various logistics APIs.'
          },
          {
            question: 'Can we start with a few modules and add more later?',
            answer: 'Absolutely. You can start with core modules like Inventory and CRM, and easily scale up to Production Planning, HRMS, and advanced analytics as your business grows.'
          },
          {
            question: 'Do you provide training and support?',
            answer: 'Yes, we provide comprehensive role-based training (on-site and remote), 24x7 support coverage, regular system updates, and a dedicated account manager.'
          }
        ]
      },
      order: 130
    },
    {
      type: 'landing1-cta',
      content: {
        badge: 'GET STARTED',
        title: 'Ready to Transform Your Business?',
        description: "Book a free, no-pressure session with an ERP expert. We'll map your processes, show you a live demo tailored to your industry, and quantify your ROI.",
        whatWeGet: [
          'Free Consultation',
          'Live Demo',
          'Industry Expert',
          'ROI Assessment',
          'No Obligation'
        ],
        icon: '',
        contactTitle: 'Prefer to talk now?',
        mobileNumber: '+91 80 0000 0000',
        form: {
          title: 'Schedule your free demo',
          disclaimerText: 'I agree to the Privacy Policy and consent to be contacted about ESS ERP.',
          buttonText: 'Schedule Free Demo',
          note: 'Your data is secure and never shared.'
        }
      },
      order: 120
    }
  ];

  // 5. Insert Sections
  for (const section of sections) {
    await db.insert(templateSections).values({
      templateId: newTemplate.id,
      type: section.type,
      contentJson: section.content,
      orderIndex: section.order,
    });
    console.log(`✅ Seeded ${section.type} section`);
  }

  console.log('✨ Seeding completed successfully! Landing Page Template 1 is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
