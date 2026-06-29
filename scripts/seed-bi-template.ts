import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Business Intelligence Template...');

  const templateName = 'Business Intelligence';
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
    description: 'Business Intelligence template page containing Power BI hero block, dashboards details, use cases and interactive sections.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'bi-hero',
      content: {
        bgColor: '#f3f6fc',
        badgeBgColor: '#5e35b1',
        badgeBorderColor: 'transparent',
        badgeText: 'Power BI consulting for enterprise teams',
        badgeTextColor: '#ffffff',
        title: 'Turn scattered\nbusiness data into\nreal-time decisions.',
        titleColor: '#301c5c',
        description: 'ESS India helps enterprises design Power BI dashboards, predictive analytics, KPI reporting, and AI-driven insights that simplify decisions across departments.',
        descriptionColor: '#4b5563',
        button1BgColor: '#ffca28',
        button1BorderColor: '#ffca28',
        button1Text: 'Book your Demo',
        button1TextColor: '#000000',
        button1Url: '#',
        button2BgColor: '#5e35b1',
        button2BorderColor: '#5e35b1',
        button2Text: 'Case studies',
        button2TextColor: '#ffffff',
        button2Url: '#',
        image: '/Business intilligence/Frame 211.png'
      },
      order: 10
    },
    {
      type: 'bi-intro',
      content: {
        badge: 'From raw data to actionable insights — instantly.',
        title: 'AI-Driven BI That Reveals Revenue Leakage, Expiry Risks &\nHidden Profit Opportunities',
        description: 'Identify slow-moving stock, revenue gaps, expiry risks, and operational inefficiencies with\nAI-powered Business Intelligence.'
      },
      order: 20
    },
    {
      type: 'bi-insights',
      content: {
        title: 'Turning Business Data Into Clear, Actionable Insights',
        items: [
          {
            icon: 'database',
            text: 'We turn scattered business data into clear, reliable, and actionable insights—so you understand what is happening, why it is happening, and what to do next on time.'
          },
          {
            icon: 'file-warning',
            text: 'Many organizations struggle with slow decision-making because data is spread across CRM, ERP, accounting systems, and spreadsheets, making reports hard to trust and insights slow to act on.'
          },
          {
            icon: 'trending-up',
            text: 'We solve this by analyzing your past and current data across systems and building custom BI dashboards tailored to your goals—using pre-built KPIs and dashboards to reduce implementation time and cost.'
          },
          {
            icon: 'shield-check',
            text: 'This creates a single source of truth that is continuously updated and easy to trust.'
          },
          {
            icon: 'users',
            text: 'Our BI services are built for leaders and teams in sales, finance, operations, and management who need fast, accurate insights to make confident decisions.'
          }
        ],
        rightImage: '/Business intilligence/image 44.png'
      },
      order: 30
    },
    {
      type: 'bi-tabs',
      content: {
        tabs: [
          {
            tabName: 'Leadership (CEOs / Directors)',
            tabDesc: 'Drive strategy. Lead with clarity.',
            heading: 'For CEOs: Strategic Clarity in Seconds',
            subheading: "Know Where You're Growing. Know Where You're Bleeding.",
            questions: [
              'Which business unit is truly profitable?',
              'Are we growing revenue or margin?',
              'Which products should we scale or stop?',
              'What will next quarter look like if trends continue?',
              'Where are we losing money without realizing it?'
            ],
            image: '/Business intilligence/image 50.png'
          },
          {
            tabName: 'Finance (CFOs)',
            tabDesc: 'Optimize performance. Maximize value.',
            heading: 'For CFOs: Real-Time Cash Flow & Margin Analysis',
            subheading: 'Pinpoint Revenue Leakage and Reduce Holding Costs.',
            questions: [
              'What is the real margin after discounts and schemes?',
              'How much inventory is blocked or slow-moving?',
              'Where is capital blocked at distributor levels?',
              'What is the cost of holding excess stocks?',
              'Are we optimizing our tax and compliance reporting?'
            ],
            image: '/Business intilligence/image 50.png'
          },
          {
            tabName: 'Sales Directors',
            tabDesc: 'Grow revenue. Strengthen pipeline.',
            heading: 'For Sales Directors: Route-to-Market Optimization',
            subheading: 'Track Distributor Performance and Sales Executive Efficiency.',
            questions: [
              'Which distributors fail to meet sales targets?',
              'How effective are our regional promotion schemes?',
              'Are sales reps visiting planned routes daily?',
              'What is the order fill rate across trade channels?',
              'Which products have the highest sales velocity?'
            ],
            image: '/Business intilligence/image 50.png'
          }
        ]
      },
      order: 40
    },
    {
      type: 'bi-highlight-strip',
      content: {
        items: [
          {
            icon: 'wand',
            text: 'Our AI-driven dashboards give you a 360° executive view across **sales, operations, finance, and inventory** – in real time.'
          },
          {
            icon: 'shield-check',
            text: 'Make strategic decisions with confidence, not assumptions.'
          }
        ]
      },
      order: 50
    },
    {
      type: 'bi-business-impact',
      content: {
        title: 'Business Impact',
        subtitle: "We don't build dashboards first. We start with business problems.",
        description: 'From identifying business challenges to measuring measurable outcomes, our AI-driven approach transforms raw data into meaningful business decisions. We focus on solving real business problems first – delivering actionable insights, smarter decisions, and measurable financial impact.',
        steps: [
          {
            number: '01',
            dotColor: '#f26522',
            cardBg: '#fff9f6',
            borderColor: 'rgba(242, 101, 34, 0.15)',
            icon: '/Business intilligence/Group.png',
            title: 'Problem',
            description: 'Identify the business gap',
            accentColor: '#f26522'
          },
          {
            number: '02',
            dotColor: '#fbb03b',
            cardBg: '#fffdf4',
            borderColor: 'rgba(251, 176, 59, 0.15)',
            icon: '/Business intilligence/question_svgrepo.com.png',
            title: 'Question',
            description: 'Ask the right question',
            accentColor: '#fbb03b'
          },
          {
            number: '03',
            dotColor: '#6b7a99',
            cardBg: '#f7f8fa',
            borderColor: 'rgba(107, 122, 153, 0.15)',
            icon: '/Business intilligence/idea_svgrepo.com.png',
            title: 'Insight',
            description: 'Generate real-time insight',
            accentColor: '#6b7a99'
          },
          {
            number: '04',
            dotColor: '#6f42c1',
            cardBg: '#faf8fe',
            borderColor: 'rgba(111, 66, 193, 0.15)',
            icon: '/Business intilligence/security_svgrepo.com.png',
            title: 'Decision',
            description: 'Enable confident decision',
            accentColor: '#6f42c1'
          },
          {
            number: '05',
            dotColor: '#00a699',
            cardBg: '#f4fbfb',
            borderColor: 'rgba(0, 166, 153, 0.15)',
            icon: '/Business intilligence/analytics-reference_svgrepo.com.png',
            title: 'Financial Impact',
            description: 'Measure financial outcome',
            accentColor: '#00a699'
          }
        ]
      },
      order: 60
    },
    {
      type: 'bi-architecture',
      content: {
        title: 'Business Intelligence Architecture',
        description: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
        image: '/Business intilligence/1cda2c6dff9b61013b46587de886637aad3247ff.png'
      },
      order: 70
    },
    {
      type: 'bi-empowerment',
      content: {
        title: 'How Business Intelligence Empowers Leaders?',
        subtitle: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
        cards: [
          {
            icon: '/Business intilligence/checklist-check-list-list_svgrepo.com.png',
            title: 'Faster, Confident Decision-Making',
            description: 'Leaders get clear answers when they need them, without questioning the numbers. Decisions are made quickly on trusted insights, enabling teams to act early, reduce risk, and capture opportunities.'
          },
          {
            icon: '/Business intilligence/handshake-deal_svgrepo.com.png',
            title: 'A Single Source of Truth Everyone Can Trust',
            description: 'Everyone works from the same accurate data, eliminating conflicting numbers and repeated validations. Teams spend less time reconciling reports and more time taking action, improving alignment and speed.'
          },
          {
            icon: '/Business intilligence/analytics-graph_svgrepo.com.png',
            title: 'Clear Visibility Into Business Health',
            description: 'Leaders see the full picture of performance in one place, without digging through multiple reports. Risks are identified early, strengths stand out, and decisions are made with clarity on where to focus.'
          },
          {
            icon: '/Business intilligence/analytics-graphic_svgrepo.com.png',
            title: 'Better Alignment and Accountability Across Teams',
            description: 'Teams stay aligned around shared goals with clear visibility into performance. Progress and ownership are easy to track, accountability improves, and issues are addressed early.'
          },
          {
            icon: 'Clock',
            title: 'Less Time Spent on Reporting, More Time on Strategy',
            description: 'Manual reporting is reduced, and updates reach leaders on time without follow-ups. Teams spend less time preparing reports and more time analyzing data, planning actions, and executing strategy.'
          },
          {
            icon: '/Business intilligence/statistics_svgrepo.com.png',
            title: 'Improved Profitability and Operational Control',
            description: 'Leaders gain clear visibility into costs, margins, and performance. Inefficiencies surface early, resources are used better, and opportunities are acted on faster, strengthening margins and control.'
          }
        ]
      },
      order: 80
    },
    {
      type: 'bi-industries',
      content: {
        title: 'Industries We Empower',
        description: 'At ESS India, we deliver industry-driven digital solutions that help businesses streamline operations, improve visibility, and accelerate growth. Our ERP, automation, and business intelligence platforms are designed to adapt to the unique workflows and operational challenges of different industries, including FMCG, Retail, Pharma, Manufacturing, and Trading & Distribution. By combining deep domain expertise with scalable technology, we enable organizations to optimize resources, enhance decision-making, and achieve long-term business transformation with confidence.',
        industries: [
          {
            title: 'FMCG',
            image: '/Business intilligence/Rectangle 140.png',
            description: 'Optimize supply chains, inventory, and distribution for faster-moving consumer markets.'
          },
          {
            title: 'Retail',
            image: '/Business intilligence/Rectangle 142.png',
            description: 'Deliver smarter retail operations with better customer insights and sales management.'
          },
          {
            title: 'Pharma',
            image: '/Business intilligence/Rectangle 141.png',
            description: 'Ensure compliance, streamline production, and improve operational efficiency in pharma businesses.'
          },
          {
            title: 'Trading & Distribution',
            image: '/Business intilligence/Rectangle 143.png',
            description: 'Manage procurement, warehousing, and distribution with complete business visibility.'
          }
        ]
      },
      order: 90
    },
    {
      type: 'bi-industry-services',
      content: {
        title: 'Tailored Services Across Industries',
        subtitle: 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.',
        tabs: [
          {
            tabName: 'Retail',
            tabTitle: 'Protect Margin.\nPrevent Stock-Outs.',
            image: '/Business intilligence/Rectangle 150.png',
            points: [
              'Detect slow & dead stock',
              'Prevent stock-out losses',
              'Optimize store replenishment',
              'Improve category margins',
              'Compare branch performance'
            ],
            buttonText: 'Case studies',
            buttonUrl: '#'
          },
          {
            tabName: 'FMCG / Distribution',
            tabTitle: 'Optimize Routes.\nTrack Distributor Sales.',
            image: '/Business intilligence/Rectangle 140.png',
            points: [
              'Track route efficiency & frequency',
              'Monitor distributor sales targets',
              'Identify product leakage & returns',
              'Measure campaign performance',
              'Optimize stock dispatch schedules'
            ],
            buttonText: 'Case studies',
            buttonUrl: '#'
          },
          {
            tabName: 'Pharma / Healthcare',
            tabTitle: 'Track Batch Expiry.\nEnsure Compliance.',
            image: '/Business intilligence/Rectangle 141.png',
            points: [
              'Monitor batch numbers & expiry dates',
              'Track compliance & audit logs',
              'Optimize temperature-sensitive dispatch',
              'Measure regional sales rep targets',
              'Reduce returns of expired stock'
            ],
            buttonText: 'Case studies',
            buttonUrl: '#'
          },
          {
            tabName: 'Manufacturing',
            tabTitle: 'Monitor Production.\nReduce Wastage.',
            image: '/Business intilligence/Rectangle 143.png',
            points: [
              'Track machine cycle time & output',
              'Monitor batch wastage & scrap rates',
              'Analyze supply bottleneck timings',
              'Track preventative maintenance schedules',
              'Optimize raw materials inventory'
            ],
            buttonText: 'Case studies',
            buttonUrl: '#'
          }
        ]
      },
      order: 100
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

  console.log('✨ Seeding completed successfully! Business Intelligence template is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
