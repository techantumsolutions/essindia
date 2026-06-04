import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Career Page Template';

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.name, templateName)
  });

  if (existingTemplate) {
    console.log(`Template "${templateName}" already exists with ID:`, existingTemplate.id);
    console.log('Deleting existing template to recreate it with fields...');
    await db.delete(templates).where(eq(templates.slug, existingTemplate.slug));
  }

  const sectionsData = [
    { 
      name: 'Career Hero Section', 
      type: 'career-hero',
      contentJson: {
        title: 'Join us to shape the future of\nemployment',
        subtitle: "We're building a culture at ESS where amazing people (like you) can do their best work.\nIf you're ready to accelerate your career and transform the employment landscape, we'd\nlove for you to come work with us!",
        ctaText: 'Careers',
        bgImage: '/Career-Page/Career.png'
      }
    },
    { 
      name: 'Career Why Join', 
      type: 'career-why-join',
      contentJson: {
        title: 'Why Join ESS?',
        subtitle: 'With offices in 30 global locations and customers\nspread across 35+ countries.',
        mapImage: '/Career-Page/Group 1.png',
        stats: [
          { value: '500+', label: 'Team Members' },
          { value: '12+', label: 'Global Offices' },
          { value: '35+', label: 'Countries Represented' },
          { value: '95%', label: 'Employee Retention' },
        ]
      }
    },
    { 
      name: 'Career Global Offices', 
      type: 'career-offices',
      contentJson: {
        title: '35+ offices globally',
        subtitle: 'With offices in 30 global locations and customers\nspread across 35+ countries.',
        countries: [
          { countryCode: 'at' },
          { countryCode: 'fr' },
          { countryCode: 'ie' },
          { countryCode: 'pt' },
          { countryCode: 'es' },
          { countryCode: 'be' },
          { countryCode: 'de' },
          { countryCode: 'pl' },
          { countryCode: 'ro' },
          { countryCode: 'gb' },
          { countryCode: 'au' },
          { countryCode: 'my' },
          { countryCode: 'il' },
          { countryCode: 'ca' },
          { countryCode: 'us' },
          { countryCode: 'in' },
          { countryCode: 'sg' },
          { countryCode: 'ma' },
        ]
      }
    },
    { 
      name: 'Career Product Experience', 
      type: 'career-experience',
      contentJson: {
        title: 'Get hands-on experience on cutting\nedge enterprise software products.',
        subtitle: 'We believe great engineers deserve more than a desk\nand a deadline.',
        products: [
          { name: 'Aviation Software', icon: '/Career-Page/aprs_svgrepo.com.png' },
          { name: 'Global Payroll', icon: '/Career-Page/global-payroll 1.png' },
          { name: 'ERP Software', icon: '/Career-Page/erp-software 1.png' },
          { name: 'Logistics Software', icon: '/Career-Page/logistics-software 1.png' },
        ]
      }
    },
    { 
      name: 'Career Perks & Benefits', 
      type: 'career-perks',
      contentJson: {
        title: 'Perks & Benefits',
        subtitle: 'We care about our people so they can take care of our clients',
        perks: [
          { text: "Health & Wellness Benefits" },
          { text: "Performance Bonuses" },
          { text: "Life Skill Certification Support" },
          { text: "International Project Exposure" },
          { text: "Flexible Work Arrangements" },
          { text: "Fast-Track Growth Path" }
        ]
      }
    },
    { 
      name: 'Career Life Beyond Code', 
      type: 'career-life',
      contentJson: {
        title: 'Life Beyond the Code',
        subtitle: "From team celebrations to social events, here's a glimpse of the moments we share together.",
        image1: '/Career-Page/image 88.png',
        image2: '/Career-Page/image 89.png',
        image3: '/Career-Page/image 90.png',
        largeImage: '/Career-Page/image 91.png',
        largeImageTitle: 'London Outdoor event - 2023',
        largeImageSubtitle: 'Annual team gathering and celebration',
        smallImage: '/Career-Page/image 92.png'
      }
    },
    { 
      name: 'Career Open Positions', 
      type: 'career-positions',
      contentJson: {
        title: 'Open Positions',
        subtitle: 'Find your perfect role and help us shape the future of enterprise software.',
        positions: [
          {
            title: 'Technical Writer / Documentation Specialist',
            department: 'Product',
            description: 'Develop clear and comprehensive technical documentation, user guides, and API documentation for our products.',
            type: 'Full-Time',
            experience: '0-2 Years',
            location: 'Remote',
          },
          {
            title: 'Technical Content Developer',
            department: 'Marketing',
            description: 'Write and manage content that explains complex technical topics in an accessible way for the wider audience.',
            type: 'Full-Time',
            experience: '0-2 Years',
            location: 'Hybrid',
          },
          {
            title: 'Python Backend Developer',
            department: 'Engineering',
            description: 'Build scalable backend systems and APIs using Python and related frameworks. Ensure high performance and responsiveness.',
            type: 'Full-Time',
            experience: '2-5 Years',
            location: 'In-office',
          }
        ]
      }
    },
    { 
      name: 'Career CTA Section', 
      type: 'career-cta',
      contentJson: {
        title: 'Ready To Start Your Career Journey?',
        subtitle: 'Join our team and be part of an innovative culture that values your growth and contributions.',
        ctaText: 'Join Us'
      }
    },
  ];

  const targetSections = [];
  for (const s of sectionsData) {
    const existingSection = await db.query.sections.findFirst({
      where: eq(sections.name, s.name)
    });

    if (existingSection) {
      console.log(`Section "${s.name}" already exists. Using existing ID.`);
      
      // Update existing section with content schema
      await db.update(sections)
        .set({ contentJson: s.contentJson })
        .where(eq(sections.id, existingSection.id));
        
      targetSections.push(existingSection);
    } else {
      const hash = crypto.randomBytes(16).toString('hex');
      const [created] = await db.insert(sections).values({
        name: s.name,
        type: s.type,
        variant: 'default',
        identityHash: hash,
        contentJson: s.contentJson,
        status: 'published',
      }).returning();
      console.log(`Created new section "${s.name}".`);
      targetSections.push(created);
    }
  }

  const slug = slugify(templateName) + '-' + Date.now();
  
  const [template] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'A dedicated template for the careers page, featuring jobs, perks, and company culture.',
    status: 'active',
  }).returning();

  await db.insert(templateSections).values(
    targetSections.map((s, i) => ({
      templateId: template.id,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant || 'default',
      contentJson: sectionsData[i].contentJson,
      orderIndex: i,
    }))
  );

  console.log('Template created with ID:', template.id);
  console.log('Sections added to library:', targetSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));
