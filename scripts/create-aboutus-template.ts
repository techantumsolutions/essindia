/**
 * Seeds the "About Us" template and its 7 sections into the database,
 * and populates the Section Library.
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as schema from '../src/lib/db/schema';
import { generateSectionIdentityHash } from '../src/lib/cms/utils';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required to seed the template.');
  process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

async function main() {
  console.log('--- START SEEDING ABOUT US TEMPLATE & LIBRARY ---');

  const slug = 'about-us';

  // 1. Clean up existing template with the same slug to ensure idempotency
  const existing = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    console.log(`Found existing template with slug "${slug}". Deleting to re-create...`);
    await db.delete(schema.templates).where(eq(schema.templates.slug, slug));
    console.log('Old template deleted (cascade deletes its sections).');
  }

  // 2. Insert new "About Us" template
  const [newTemplate] = await db
    .insert(schema.templates)
    .values({
      name: 'About Us',
      slug,
      description: 'Standard About Us template containing Hero, Company Intro, Mission & Vision, Services, Technology Upgradation, Why ESS, and Call-to-Action blocks.',
      status: 'active',
      usageCount: 0,
    })
    .returning();

  console.log(`Successfully created template: "${newTemplate.name}" (ID: ${newTemplate.id})`);

  // 3. Define content payload for all 7 sections based on AboutUs components
  const sectionsData = [
    {
      type: 'about-us-hero',
      orderIndex: 0,
      contentJson: {
        title: "Empowering Global Enterprises Through Digital Excellence",
        subtitle: "Our Legacy & Future",
        description: "At Eastern Software Solutions, we build technology solutions that drive transformation, create long-term value, and shape the future of business.",
        items: [
          { title: "30+", description: "Years Experience" },
          { title: "25+", description: "Industry Verticals" },
          { title: "1000+", description: "Global Customers" },
          { title: "SOC 2", description: "Compliance" }
        ]
      }
    },
    {
      type: 'about-us-company-intro',
      orderIndex: 1,
      contentJson: {
        title: "Eastern Software Solutions",
        subtitle: "Who We Are",
        description: "Founded in 1990, Eastern Software Solutions (ESS) is a leading provider of enterprise software solutions. Over three decades, we have partnered with businesses worldwide to streamline operations, drive growth, and deliver measurable outcomes.",
        image: "/why-ess-main.png",
        items: [
          {
            title: "Business-First Implementation",
            description: "We construct software solutions that adapt to your business processes, not the other way around.",
            icon: "layers"
          },
          {
            title: "Faster Deployment, Product-Focused",
            description: "Our modular approach allows us to deploy faster, minimizing downtime and accelerating ROI.",
            icon: "zap"
          },
          {
            title: "Global Expertise with Local Support",
            description: "With operations across India and globally, we provide 24/7 support to keep your business running smoothly.",
            icon: "globe"
          }
        ]
      }
    },
    {
      type: 'about-us-mission-vision',
      orderIndex: 2,
      contentJson: {
        title: "Our Purpose & Direction",
        subtitle: "Mission & Vision",
        items: [
          {
            title: "Our Mission",
            description: "To provide world-class software solutions and services to our clients, enabling them to achieve their business goals. We strive to build long-term relationships with our clients based on trust, integrity, and mutual respect.",
            icon: "target",
            subItems: [
              "Focus on delivering measurable business value",
              "Commitment to continuous innovation and quality",
              "Customer-centric approach to software development"
            ]
          },
          {
            title: "Our Vision",
            description: "To be a leading global IT solutions provider, recognized for our technical excellence, customer centricity, and commitment to quality. We aim to empower businesses with innovative technology solutions that drive growth and efficiency.",
            icon: "eye",
            subItems: [
              "Leadership through technological excellence",
              "Foster a culture of collaboration and continuous learning",
              "Partner with clients to drive sustainable business growth"
            ]
          }
        ]
      }
    },
    {
      type: 'about-us-services-overview',
      orderIndex: 3,
      contentJson: {
        title: "Core Offerings & Solutions",
        subtitle: "Services Overview",
        items: [
          {
            title: "Smarter Decisions Through Data",
            description: "BI Dashboards with integrated AI to transform data into actionable decisions and insights.",
            icon: "data"
          },
          {
            title: "Intelligent Process Automation",
            description: "RPA solutions to automate repetitive tasks and optimize enterprise workflows.",
            icon: "automation"
          },
          {
            title: "Enterprise Mobility Simplified",
            description: "Custom mobile solutions to streamline field operations and keep teams connected.",
            icon: "mobility"
          }
        ]
      }
    },
    {
      type: 'about-us-transformation-section',
      orderIndex: 4,
      contentJson: {
        title: "D2K Migration or Technology Upgradation Services",
        subtitle: "Legacy to Modernity",
        items: [
          {
            title: "D2K Migration Services",
            description: "Deceptively simple migration of your legacy systems to advanced D2K structures with near-zero data loss.",
            icon: "database"
          },
          {
            title: "Technology Upgradation",
            description: "Upgrade your tech stack to latest frameworks to enhance execution speed, stability, and future scalability.",
            icon: "upgrade"
          },
          {
            title: "System Integration",
            description: "Connecting various software layers and third-party APIs to operate as a single unified enterprise ecosystem.",
            icon: "integration"
          },
          {
            title: "Custom Development",
            description: "Tailor-made software systems and workflows engineered from scratch to cater to unique operational demands.",
            icon: "custom"
          }
        ]
      }
    },
    {
      type: 'about-us-why-ess',
      orderIndex: 5,
      contentJson: {
        title: "Why Businesses Trust ESS",
        subtitle: "Our Core Strengths",
        items: [
          {
            title: "Business-First Implementation",
            description: "We work closely with your teams to understand unique workflows and design systems to deliver customized business solutions.",
            icon: "business"
          },
          {
            title: "Faster Deployment, Product-Focused",
            description: "Our modular tools and framework accelerate execution, helping you achieve faster time-to-market and return on investment.",
            icon: "deployment"
          },
          {
            title: "Global Expertise with Local Support",
            description: "Our experience across geographies enables us to deploy and support systems for modern business operations around the world.",
            icon: "global"
          },
          {
            title: "Designed for Securing Digital Future",
            description: "With state-of-the-art security frameworks (including SOC 2 and GDPR compliance), we build trust at every layer.",
            icon: "security"
          },
          {
            title: "Continuous Technology Upgrades",
            description: "We help you transition smoothly to new technology versions, ensuring you always run on the latest, most secure codebase.",
            icon: "upgrades"
          },
          {
            title: "Product Model Reduction",
            description: "We simplify complex IT portfolios, eliminating redundant systems and reducing overall licensing and operational costs.",
            icon: "reduction"
          }
        ]
      }
    },
    {
      type: 'about-us-cta',
      orderIndex: 6,
      contentJson: {
        title: "Schedule Your Free Demo",
        subtitle: "Start Your Journey",
        description: "Get in touch with our solutions experts today to schedule a customized walkthrough of our enterprise systems and find out how we can help your business grow.",
        buttonText: "Schedule Demo",
        buttonLink: "/demo"
      }
    }
  ];

  // 4. Insert each section into the library AND the template
  for (const section of sectionsData) {
    const sectionName = section.type.replace(/([A-Z])/g, ' $1').trim();
    const identityHash = generateSectionIdentityHash(section.type, sectionName, section.contentJson);

    let librarySectionId: string;
    
    // Check if it's already in the section library
    const existingLib = await db
      .select()
      .from(schema.sections)
      .where(eq(schema.sections.identityHash, identityHash))
      .limit(1);

    if (existingLib.length === 0) {
      // Add to Section Library
      const [newLibSection] = await db.insert(schema.sections).values({
        identityHash,
        name: sectionName,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        status: 'active',
        version: 1,
      }).returning();
      
      librarySectionId = newLibSection.id;

      await db.insert(schema.sectionVersions).values({
        sectionId: librarySectionId,
        version: 1,
        contentJson: section.contentJson,
      });
      console.log(`Added "${sectionName}" to Section Library.`);
    } else {
      librarySectionId = existingLib[0].id;
      console.log(`Section "${sectionName}" already exists in Section Library.`);
    }

    // Link it to the template
    const inserted = await db
      .insert(schema.templateSections)
      .values({
        templateId: newTemplate.id,
        sectionLibraryId: librarySectionId,
        type: section.type,
        variant: 'default',
        contentJson: section.contentJson,
        styleJson: {},
        settingsJson: {},
        responsiveJson: {},
        animationJson: {},
        orderIndex: section.orderIndex,
      })
      .returning();

    console.log(`Inserted template section "${section.type}" at order ${section.orderIndex} (ID: inserted: ${inserted[0].id})`);
  }

  console.log('--- SEEDING ABOUT US TEMPLATE & LIBRARY COMPLETED SUCCESSFULLY ---');
  await client.end();
}

main().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
