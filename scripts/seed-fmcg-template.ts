import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding BI Industry Solutions FMCG Template...');

  const templateName = 'BI-Industry Solutions FMCG';
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
    description: 'BI Industry Solutions FMCG page template with Hero, Logos, Overview, and Persona Tabs.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'fmcg-hero',
      content: {
        bgColor: '#4b4685',
        badgeBgColor: '#7142D7',
        badgeBorderColor: '#7167be',
        badgeText: 'FMCG',
        badgeTextColor: '#ffffff',
        title: 'optimize inventory\nmaximize sales',
        titleColor: '#ffffff',
        description: 'Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.',
        descriptionColor: '#ffffff',
        buttonBgColor: '#fcc42c',
        buttonBorderColor: '#fcc42c',
        buttonText: 'Book your Demo',
        buttonTextColor: '#2b2a6c',
        buttonUrl: '#',
        image: '/BI-industy solution-FMGC/2b58cf43-2428-4667-ac1c-680abeb784a1 1.png'
      },
      order: 10
    },
    {
      type: 'fmcg-logos',
      content: {
        logos: [
          { image: '/BI-industy solution-FMGC/1704524770_microsoft erp-min 1.png', alt: 'Microsoft Dynamics' },
          { image: '/BI-industy solution-FMGC/1704524759_oracle erp-min 1.png', alt: 'Oracle E-Business Suite' },
          { image: '/BI-industy solution-FMGC/1704524802_salesforce erp-min 1.png', alt: 'Salesforce CRM' },
          { image: '/BI-industy solution-FMGC/1704524792_sage erp-min 1.png', alt: 'Sage ERP' },
          { image: '/BI-industy solution-FMGC/1704524780_infor erp-min 1.png', alt: 'Infor ERP' },
          { image: '/BI-industy solution-FMGC/1711797804_SAP LOGO 1.png', alt: 'SAP ERP' }
        ]
      },
      order: 20
    },
    {
      type: 'fmcg-overview',
      content: {
        title: 'FMCG Business Intelligence Services | Powered by AI',
        paragraphs: [
          'We deliver Business Intelligence services built specifically for FMCG businesses, enabling leaders to clearly see sales, inventory, distribution, and supply chain performance. Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.',
          'FMCG teams often face delayed decisions because sales, inventory, and distribution data is spread across distributors, POS systems, ERP platforms, accounting tools, and spreadsheets. As a result, teams rely on manually compiled reports; numbers do not always match across departments, and insights arrive too late to act in fast-moving markets.',
          'We address this by working closely with your teams to unify historical and live FMCG data into a single source of truth. Using proven FMCG KPIs and pre-built dashboards where applicable, we deliver custom BI solutions faster and at lower cost.'
        ],
        image: '/BI-industy solution-FMGC/image 53.png'
      },
      order: 30
    },
    {
      type: 'fmcg-tabs',
      content: {
        title: 'FMCG BI Personas',
        tabs: [
          {
            tabName: 'FMCG CEO',
            heading: 'FMCG CEO',
            subheading: 'Drive Overall Profitability and Brand Market Share',
            questions: [
              'How can we increase our overall FMCG operating margins?',
              'Which product categories are gaining market share and which are lagging?',
              'How is our new product launch performing across different states?',
              'Are we meeting our sustainability and governance targets?',
              'Where should we allocate capital for maximum ROI next quarter?'
            ],
            image: '/BI-industy solution-FMGC/image 54.png'
          },
          {
            tabName: 'FMCG CFO',
            heading: 'FMCG CFO',
            subheading: 'How Much Profit Is Lost in Schemes and Inventory?',
            questions: [
              'What is the real margin after discounts and trade schemes?',
              'How much inventory is slow-moving or aging?',
              'What is the cost of holding excess stock?',
              'Is capital blocked at distributor or warehouse level?',
              'Where are we losing margin without visibility?'
            ],
            image: '/BI-industy solution-FMGC/image 54.png'
          },
          {
            tabName: 'Sales Director',
            heading: 'Sales Director',
            subheading: 'Optimize Route-to-Market and Sales Executive Performance',
            questions: [
              'Which distributors are consistently failing to meet sales targets?',
              'How effective are our trade promotion schemes by region?',
              'Are sales representatives visiting their planned routes daily?',
              'What is the order fill rate across modern trade vs general trade?',
              'Which stock-keeping units (SKUs) have the highest velocity?'
            ],
            image: '/BI-industy solution-FMGC/image 54.png'
          },
          {
            tabName: 'Supply Chain Head',
            heading: 'Supply Chain Head',
            subheading: 'Improve Order Fill Rates and Logistics Efficiencies',
            questions: [
              'What is our on-time-in-full (OTIF) delivery rate to distributors?',
              'Where are the bottlenecks in our warehouse dispatch workflow?',
              'How can we reduce transport cost per case for key lanes?',
              'Which raw material suppliers are causing production delays?',
              'How accurate are our demand forecasts compared to actual sales?'
            ],
            image: '/BI-industy solution-FMGC/image 54.png'
          }
        ]
      },
      order: 40
    },
    {
      type: 'fmcg-action',
      content: {
        title: 'AI in BI | From Data to Action',
        description: 'Our BI solution is powered by EVA, an AI-powered assistant embedded into our BI dashboards. It empowers users by allowing them to interact and communicate directly with their data. Users can ask questions in plain English and instantly receive clear, actionable insights. You can also attach external files such as PDFs and industry reports to provide additional context.',
        cards: [
          {
            badge: '01',
            title: 'What Changed',
            description: 'AI instantly highlights unusual shifts in sales, inventory, or performance.',
            image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 2.png',
            badgeBorderColor: '#ff9800',
            badgeTextColor: '#ff9800',
            badgeBgColor: '#fff8f0'
          },
          {
            badge: '02',
            title: 'Why It Changed',
            description: 'AI explains the key factors driving those changes, such as demand, pricing, or supply issues.',
            image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 3.png',
            badgeBorderColor: '#2196f3',
            badgeTextColor: '#2196f3',
            badgeBgColor: '#f0f8ff'
          },
          {
            badge: '03',
            title: 'What To Do Next',
            description: 'AI suggests actionable insights so leaders can respond quickly and confidently.',
            image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 4.png',
            badgeBorderColor: '#4caf50',
            badgeTextColor: '#4caf50',
            badgeBgColor: '#f1f9f1'
          }
        ]
      },
      order: 50
    },
    {
      type: 'fmcg-impact',
      content: {
        title: 'FMCG BI That Delivers Measurable Financial Impact',
        cards: [
          {
            image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 1.png',
            title: 'Reduce stock-outs by 20–40%'
          },
          {
            image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 2.png',
            title: 'Cut slow-moving inventory by 10–15%'
          },
          {
            image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 3.png',
            title: 'Improve scheme and promotion ROI'
          },
          {
            image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 4.png',
            title: 'Increase secondary sales across markets'
          },
          {
            image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 5.png',
            title: 'Release working capital from excess inventory'
          }
        ]
      },
      order: 60
    },
    {
      type: 'fmcg-challenges',
      content: {
        title: 'Why Smart FMCG Leaders Still Make Slow Decisions',
        cards: [
          {
            icon: '/BI-industy solution-FMGC/data_svgrepo.com.png',
            title: 'Store Sales Data Arrives Late',
            description: 'Daily store sales data is often available only after business hours or the next day. By the time leadership reviews performance, the opportunity to correct low sales or stock issues has already passed.'
          },
          {
            icon: '/BI-industy solution-FMGC/analytics-board-bussiness_svgrepo.com.png',
            title: 'Sales And Inventory Data Don’t Match',
            description: 'Sales data from POS systems, and inventory data from warehouses or stores frequently show different numbers. Teams spend time verifying data instead of acting on it, slowing down decision-making.'
          },
          {
            icon: '/BI-industy solution-FMGC/announcement-marketing-outline-2_svgrepo.com.png',
            title: 'Limited SKU-Level Inventory Visibility',
            description: 'Retailers lack a clear view of inventory at the individual SKU and store level. This leads to fast-moving products going out of stock in some locations while excess inventory builds in others.'
          },
          {
            icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-3.png',
            title: 'Forecasts Miss Real-Time Demand Changes',
            description: 'Demand forecasts rely heavily on historical data and do not adjust quickly to promotions, local events, or sudden changes in customer behavior. As a result, stock planning becomes inaccurate.'
          },
          {
            icon: '/BI-industy solution-FMGC/product_svgrepo.com.png',
            title: 'Manual Sales and Inventory Reporting',
            description: 'Sales and inventory reports are often created manually using spreadsheets. This process is time-consuming, error-prone, and delays access to critical performance insights.'
          },
          {
            icon: '/BI-industy solution-FMGC/favorite-chart_svgrepo.com.png',
            title: 'Supply Issues Identified After Stockouts',
            description: 'Supply or distribution problems are usually discovered only after products are already unavailable on shelves. This results in lost sales and poor customer experience.'
          }
        ]
      },
      order: 70
    },
    {
      type: 'fmcg-empower',
      content: {
        title: 'How Business Intelligence Empowers Leaders?',
        subtitle: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
        cards: [
          {
            icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-1.png',
            title: 'Real-Time Store Sales Visibility',
            description: 'Business Intelligence brings store sales data from POS systems into live dashboards. FMCG leaders can monitor performance during the day and take action before sales opportunities are lost.'
          },
          {
            icon: '/BI-industy solution-FMGC/analytics_svgrepo.com.png',
            title: 'Single Source of Sales and Inventory Data',
            description: 'Business Intelligence unifies sales and inventory data into one consistent view. This removes confusion between teams and enables faster, more confident decisions.'
          },
          {
            icon: '/BI-industy solution-FMGC/box_svgrepo.com.png',
            title: 'SKU-Level Inventory Visibility Across Markets',
            description: 'Business Intelligence provides clear visibility into inventory at SKU and market levels. Leaders can quickly identify slow-moving products, stock gaps, and excess inventory.'
          },
          {
            icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-2.png',
            title: 'Real-Time Demand Forecasting',
            description: 'Business Intelligence continuously updates forecasts using current sales trends and demand signals. This helps FMCG teams respond quickly to market changes instead of relying only on past data.'
          },
          {
            icon: '/BI-industy solution-FMGC/my-qr-code_svgrepo.com.png',
            title: 'Automated Sales and Inventory Reporting',
            description: 'Business Intelligence automates reporting across systems and eliminates manual spreadsheets. Teams get timely, accurate insights without delays or errors.'
          },
          {
            icon: '/BI-industy solution-FMGC/supply-chain-optimization-02_svgrepo.com.png',
            title: 'Early Detection of Supply Issues',
            description: 'Business Intelligence monitors supply and distribution data continuously. Potential disruptions and stock risks become visible before stockouts occur.'
          }
        ]
      },
      order: 80
    },
    {
      type: 'fmcg-use-cases',
      content: {
        title: 'Business Intelligence Use Cases Across FMCG Operations',
        subtitle: 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.',
        tabs: [
          {
            tabName: 'Stock-Out & Availability',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'Stock-Out & Availability',
            heading: 'Are You Losing Sales Due to Stock-Outs?',
            points: [
              'Prevent stock-outs at high-demand outlets',
              'Identify gaps in distributor and outlet coverage',
              'Ensure availability of fast-moving SKUs',
              'Reduce lost sales due to poor replenishment',
              'Maintain consistent on-shelf availability'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          },
          {
            tabName: 'Primary vs Secondary Sales',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'Primary vs Secondary Sales',
            heading: 'Unify Primary and Secondary Sales Pipelines',
            points: [
              'Compare factory dispatches with retail off-take data',
              'Identify high-performing regions and distributor sales trends',
              'Track inventory levels at distributor warehouses',
              'Optimize dispatch planning based on distributor sales velocity',
              'Identify slow-moving items in distributor supply chains'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          },
          {
            tabName: 'Scheme & Promotion Analysis',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'Scheme & Promotion Analysis',
            heading: 'Measure Trade Promotion Effectiveness',
            points: [
              'Analyze scheme ROI by product category and geographic area',
              'Compare sales uplift during promotional periods against base sales',
              'Verify if distributors are passing discounts to retailers',
              'Identify discount schemes that drive maximum volume growth',
              'Optimize promotional spend allocations for future schemes'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          },
          {
            tabName: 'SKU Performance & Movement',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'SKU Performance & Movement',
            heading: 'Optimize SKU Portfolio Performance',
            points: [
              'Identify high-margin, high-velocity SKUs (Stars)',
              'Track sales contribution of new product introductions (NPI)',
              'Monitor slow-moving and dead stock across regions',
              'Rationalize low-performing SKUs to reduce inventory cost',
              'Ensure product mix matches local regional preferences'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          },
          {
            tabName: 'Distributor Performance',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'Distributor Performance',
            heading: 'Monitor and Support Distributor Performance',
            points: [
              'Track distributor order fill rates and dispatch cycles',
              'Monitor outstanding payments and distributor credit limits',
              'Evaluate sales executive performance at distributor levels',
              'Identify underperforming distributors with high inventory levels',
              'Support high-potential distributors with targeted schemes'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          },
          {
            tabName: 'Demand Forecasting',
            image: '/BI-industy solution-FMGC/Rectangle 150.png',
            tag: 'Demand Forecasting',
            heading: 'Improve Demand Forecasting Accuracy',
            points: [
              'Incorporate secondary sales trends into demand models',
              'Adjust forecasts for seasonal trends, festivals, and school terms',
              'Collaborate on sales expectations with regional managers',
              'Reduce safety stock requirements at main factories',
              'Improve production scheduling alignment with market demand'
            ],
            buttonText: 'Case Studies',
            buttonUrl: '/case-studies'
          }
        ]
      },
      order: 90
    },
    {
      type: 'fmcg-integrations',
      content: {
        title: 'Data Sources We Integrate',
        subtitle: 'Each industry card now states the operational value clearly instead of burying it in broad text.',
        cards: [
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Google Products' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Pricing Software' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Accounting Software' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'CRM' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'MIS Reports' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'SCM Software' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'POS' },
          { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'External Data' }
        ]
      },
      order: 100
    },
    {
      type: 'fmcg-faq',
      content: {
        title: 'Frequently Asked Questions',
        subtitle: 'Get the information you need with our frequently asked questions.',
        faqs: [
          {
            question: 'What is Business Intelligence (BI)?',
            answer: 'Business Intelligence is how leaders turn raw data into clear, decision-ready insights. It connects data from across the business, explains what is happening and why, and highlights where attention is needed, so decisions are based on facts, not assumptions.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'Which industries can benefit from Business Intelligence?',
            answer: 'Our BI solution caters extensively to FMCG, Retail, Manufacturing, Logistics, Healthcare, and Corporate Management, helping optimize routes, reduce stock-outs, and analyze sales performance.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'Is Business Intelligence mobile-friendly?',
            answer: 'Yes! Our BI dashboards are completely responsive and accessible across all devices, including laptops, tablets, and smartphones, so you can track operations on the go.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'Can Business Intelligence be customized to specific business needs?',
            answer: 'Absolutely. We design and tailor custom dashboards, metric calculations, and automated reports to fit the unique operational goals and data infrastructure of your business.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'What types of data sources does BI support?',
            answer: 'We integrate with a wide variety of data sources, including ERP systems (SAP, Oracle, Sage), POS terminals, CRM software, pricing engines, warehouse databases, and external flat files (CSV, Excel).',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'Can Business Intelligence tell what happened, why it happened, and what steps we should take next?',
            answer: 'Yes, powered by EVA, our AI-powered assistant, the BI platform analyzes historical data to detect anomalies, explains key contributors, and automatically recommends action steps.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          },
          {
            question: 'How soon can I start seeing measurable ROI from this BI solution?',
            answer: 'Most organizations witness direct financial returns, such as reduced inventory holding costs and improved promotion ROI, within the first 4 to 8 weeks of full integration.',
            arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
          }
        ]
      },
      order: 110
    },
    {
      type: 'fmcg-cta',
      content: {
        title: 'Enable Digital Transformation of Your Business with Our Wide Range of IT Services',
        buttonText: 'TALK TO OUR EXPERTS',
        buttonUrl: '/contact'
      },
      order: 120
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
