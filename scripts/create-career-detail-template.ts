import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Career Detail Template';

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
      name: 'Job Detail Hero', 
      type: 'job-detail-hero',
      contentJson: {
        backLinkText: 'Back to Careers',
        backLinkUrl: '/careers',
        tags: ['Engineering', 'Full-time'],
        jobTitle: 'Microsoft .NET Backend Developer',
        meta: [
          { icon: 'MapPin', text: 'India' },
          { icon: 'Clock', text: '3-5 years' },
          { icon: 'Briefcase', text: 'Full-time' },
          { icon: 'Building', text: 'Engineering' }
        ]
      }
    },
    { 
      name: 'Job Detail Content', 
      type: 'job-detail-content',
      contentJson: {
        aboutTitle: 'About the Role',
        aboutText: 'We are seeking a highly skilled Senior Software Engineer with expertise in .NET Core to design, develop, and maintain robust backend services. The ideal candidate will have strong experience in building scalable APIs, working with Entity Framework Core, and writing efficient LINQ queries. Additional responsibilities include implementing caching strategies, performance tuning, and ensuring security best practices.',
        sections: [
          {
            title: 'Key Responsibilities',
            items: [
              'Write clean, scalable, and maintainable code using C#, .NET Core, ASP.NET Core MVC, and Web API',
              'Implement data access layers using Entity Framework Core (EF Core) and write optimized LINQ queries',
              'Design and develop RESTful APIs for backend services',
              'Ensure application performance, scalability, and security',
              'Implement caching strategies and optimize application performance',
              'Collaborate with cross-functional teams including QA and DevOps',
              'Participate in code reviews and enforce best practices',
              'Troubleshoot and resolve technical issues in production environments'
            ]
          },
          {
            title: 'Requirements',
            items: [
              'Strong experience with C#, .NET Core, ASP.NET Core MVC, and Web API',
              'Proficiency in Entity Framework Core and LINQ for data manipulation',
              'Solid understanding of relational databases such as MS SQL Server or MySQL',
              'Ability to write efficient queries and optimize database performance',
              'Knowledge of asynchronous programming and dependency injection',
              'Familiarity with unit testing frameworks (xUnit, NUnit, or MSTest)',
              'Understanding of Git and version control workflows',
              'Experience with caching mechanisms (e.g., MemoryCache, Redis)',
              'Knowledge of security best practices in API development'
            ]
          },
          {
            title: 'Nice to Have',
            items: [
              'Experience with Microservices architecture',
              'Knowledge of Docker and containerization',
              'Familiarity with Azure or other cloud platforms',
              'Exposure to CI/CD pipelines'
            ]
          },
          {
            title: 'What We Offer',
            items: [
              'Competitive salary & bonus structure',
              'Corporate medical cover for employees and immediate dependents',
              '14 days of paid holidays plus yearly defined calendar holidays',
              'Wiki-Wednesdays (Knowledge sessions across Deep Tech, Trends & more)',
              'Wellness sessions & Friday-Fundays',
              'Quarterly team building days - work hard, play hard!'
            ]
          }
        ],
        formHeader: 'Apply Now',
        formSubheader: 'Join our team',
        submitText: 'Submit Application'
      }
    }
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
    description: 'A detailed page template for a specific job posting, including job description and application form.',
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
