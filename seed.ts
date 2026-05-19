import 'dotenv/config';
import { db } from './src/lib/db';
import { pages, pageSections, seoMetadata } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🚀 Seeding comprehensive homepage data...');

  // 1. Create or Get Homepage
  const existingPage = await db.query.pages.findFirst({
    where: eq(pages.slug, 'index'),
  });

  let pageId: string;
  if (!existingPage) {
    const seo = await db.insert(seoMetadata).values({
      title: 'ESS India - Enterprise ERP & Digital Transformation',
      description: 'Enterprise software solutions, AI automation, and digital transformation for modern businesses.',
    }).returning();
    
    const newPage = await db.insert(pages).values({
      title: 'Home',
      slug: 'index',
      fullPath: '/',
      status: 'published',
      seoId: seo[0].id,
      pageType: 'standard'
    }).returning();
    pageId = newPage[0].id;
    console.log('✅ Created homepage');
  } else {
    pageId = existingPage.id;
    console.log('ℹ️ Homepage already exists');
  }

  // Define all sections for the homepage
  const sections = [
    {
      type: 'hero',
      content: {
        title: "The Digital Transformation Partner For Future-Ready Enterprises.",
        subtitle: "With proven expertise across 25+ industries over the last 35+ years. Helping businesses streamline operations, grow, and stay ahead in the AI-driven world.",
        primaryCta: { label: "Book Free Demo", url: "/demo" },
        secondaryCta: { label: "View Solutions", url: "/solutions" },
        image: "/hero-right.png"
      },
      order: 10
    },
    {
      type: 'trusted-brands',
      content: {
        title: "Trusted by 1,500+ Businesses Across India & Overseas",
        brands: [
          { name: 'Spotify' },
          { name: 'Nike' },
          { name: 'AMD' },
          { name: 'apper' },
          { name: 'logitech' },
          { name: 'LEVI\'S' },
        ]
      },
      order: 20
    },
    {
      type: 'intro',
      content: {
        heading: "We help organizations run, scale, and transform with digital solutions built for real business needs.",
        subheading: "Smarter Operations | AI-driven Growth | Stronger Solutions",
        cta: { label: "Explore More", url: "/about" }
      },
      order: 30
    },
    {
      type: 'services',
      content: {
        heading: "Services we offer",
        subheading: "Manage your operations with guidance that evolves with your business goals.",
        services: [
          {
            title: 'Robotic Process Automation Solutions',
            description: 'Most trusted outcome -driven automation implementation partner of India',
            bgImage: '/service-rpa.png', 
          },
          {
            title: 'ORACLE',
            description: 'Trusted Oracle solutions partner for enterprise-scale transformation.',
            bgImage: '/service-oracle.png', 
          },
          {
            title: 'Business Intelligence',
            description: 'BI Dashboards with integrated AI to transform data into actionable decisions and insights.',
            bgImage: '/service-bi.png',
          },
          {
            title: 'Enterprise Resource Planning (ERP)',
            description: 'Unify your business operations with AI-powered insights and automation for faster, smarter....',
            bgImage: '/service-erp.png',
          },
          {
            title: 'Enterprise Mobility Solutions (EMS)',
            description: 'Smarter mobility for a secure and connected workforce.',
            bgImage: '/service-ems.png',
          },
          {
            title: 'Other solutions',
            description: 'Explore more solutions built to support business growth.',
            bgImage: '/service-bi.png',
          },
        ],
        viewAllCta: { label: "View all solutions", url: "/solutions" }
      },
      order: 40
    },
    {
      type: 'industries',
      content: {
        heading: "Choose the Industry Expert",
        subheading: "Designed for the way your industry works.",
        description: "From manufacturing to services, ESS understands the workflows behind real business operations. We infuse our extensive industry expertise into every solution, tailoring our approach to the specific realities of each industry rather than relying on generic software thinking.",
        industries: [
          { 
            name: 'Manufacturing industry', 
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
            image: '/ind-manufacturing.png' 
          },
          { 
            name: 'HealthCare', 
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
            image: '/ind-healthcare.png' 
          },
          { 
            name: 'Logistics', 
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
            image: '/ind-logistics.png' 
          },
          { 
            name: 'Custom ERP Solution', 
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
            image: '/ind-erp.png' 
          },
        ],
        viewAllCta: { label: "View all INDUSTRIES", url: "/industries" }
      },
      order: 50
    },
    {
      type: 'why-ess',
      content: {
        heading: "Why ESS?",
        subheading: "We pioneer groundbreaking innovations while our competitors struggle to keep pace.",
        reasons: [
          {
            title: 'INDUSTRY EXPERTS',
            description: 'We bring deep knowledge of how industries work, so every solution fit actual operations.',
          },
          {
            title: 'AI-DRIVEN TRANSFORMATION',
            description: 'We support businesses with intelligent solutions to adapt, scale, and stay ready for what comes next.',
          },
          {
            title: 'OUTCOME- FOCUSED APPROACH',
            description: "We don't just implement technology; we deliver proven results.",
          },
          {
            title: 'GLOBAL REACH',
            description: 'We bring experience across geographies and adapt it to your business needs.',
          },
        ]
      },
      order: 60
    },
    {
      type: 'portfolio',
      content: {
        heading: "Real Work. Real Results.",
        subheading: "Explore the ESS story, a legacy of transformation across high-end brands and verticals.",
        projects: [
          {
            title: 'Workflow System Energy',
            tags: ['Oil & gas'],
            image: '/portfolio-1.png',
            link: '#',
          },
          {
            title: 'SaaS for End to-End Analytics',
            tags: ['ecommerce', 'Custom software'],
            image: '/portfolio-2.png',
            link: '#',
          },
          {
            title: 'Workload Management',
            tags: ['Web development', 'Custom software'],
            image: '/portfolio-3.png',
            link: '#',
          },
        ],
        viewAllCta: { label: "View All Work", url: "/portfolio" }
      },
      order: 70
    },
    {
      type: 'blog',
      content: {
        heading: "News, Launches & Product Thinking",
        subheading: "Stay updated on what we're building, learning, and launching.",
        blogs: [
          {
            title: 'Why Are More Finance Departments Adopting RPA for Core Processes?',
            description: 'How RPA Is Reshaping the Way Finance Departments Operate In most finance departments....',
            image: '/blog-1.png',
            link: '#',
          },
          {
            title: 'Which Enterprise IT Solutions Are High-Performing Companies Quietly Investing In?',
            description: 'The Patterns Shaping Enterprise IT Solutions Today Not every business investment is visible. Some of the most.....',
            image: '/blog-2.png',
            link: '#',
          },
          {
            title: 'Is Your Business Ready for Oracle Migration? A Checklist for Decision-Makers',
            description: 'Ready for Oracle Migration? Check This First In our previous blogs, we discussed why businesses should....',
            image: '/blog-3.png',
            link: '#',
          },
        ],
        viewAllCta: { label: "Explore More", url: "/blog" }
      },
      order: 80
    }
  ];

  for (const section of sections) {
    const existingSection = await db.query.pageSections.findFirst({
      where: (ps, { and, eq }) => and(eq(ps.pageId, pageId), eq(ps.type, section.type)),
    });

    if (!existingSection) {
      await db.insert(pageSections).values({
        pageId,
        type: section.type,
        content: section.content,
        orderIndex: section.order,
        isActive: true,
      });
      console.log(`✅ Seeded ${section.type} section`);
    } else {
      console.log(`ℹ️ ${section.type} section already exists`);
    }
  }

  console.log('✨ Seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
