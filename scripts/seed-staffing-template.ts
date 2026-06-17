import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Staffing Services Template...');

  const templateName = 'Staffing Services';
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
    description: 'Template for Staffing Services and IT Augmentation pages',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  const sections = [
    {
      type: 'staffing-hero',
      content: {
        badge: "Staffing Services",
        title: "Smart IT Outsourcing &\nInfrastructure Management\nSolutions",
        description: "Streamline healthcare operations with an intelligent Hospital Management System designed to improve patient care, automate workflows, enhance clinical efficiency, and deliver real-time access across the healthcare ecosystem.",
        primaryCta: { label: "Talk to our IT Professionals", url: "#contact" },
        image: "/Staffing Services/image 54.png"
      },
      order: 10
    },
    {
      type: 'staffing-augmentation',
      content: {
        heading: "staff-Augmentation",
        paragraph1: "Outsourced IT services help organizations realign focus around core competencies while IT relies on a dependable partner. ESS acts as a seamlessly integrated arm of the organization, providing robust IT environments. Preventive maintenance services keep running business operations with maximized efficiency. Used as a predictable IT optimization solution, it helps optimize internal operations, improve efficiency, and lower costs.",
        paragraph2: "With over 25 years of software development expertise, Eastern Software Solutions offers predictive staff augmentation and customized IT outsourcing services tailored to the client's needs. ESS places IT developers and professionals quickly to meet business demands efficiently. This specific IT team extension supports multiple projects in full-time/ad-hoc/on-demand/outsourced bases, offering ESS a competitive edge to resolve IT bottlenecks while optimizing internal operations with top-tier performance."
      },
      order: 20
    },
    {
      type: 'staffing-technologies',
      content: {
        heading: "The various technologies for which\nESS provides services are:",
        columns: [
          {
            iconImage: "/Staffing Services/analytics-business-chart-finance-graph-money_svgrepo.com.png",
            title: "Business Intelligence (ETL)",
            items: [
              { label: "Manual Testing, JIRA" },
              { label: "PRM Analyst" },
              { label: "WFM Analyst" },
              { label: "Non-ITs" },
              { label: "Talend (BI-DWH)" },
              { label: "Scrum Master" },
              { label: "Java, Microservices" },
              { label: "Solution Engineer" },
            ]
          },
          {
            iconImage: "/Staffing Services/robot_svgrepo.com.png",
            title: "Ui Path, Automation Anywhere",
            items: [
              { label: "Oracle ADF" },
              { label: "Oracle Apex" },
              { label: "UI-React.js" },
              { label: "PMP" },
              { label: "Oracle Developer 2000" },
              { label: "Java" },
              { label: "PL/SQL" },
              { label: "Dev Leads" },
            ]
          },
          {
            iconImage: "/Staffing Services/python-icon-new.png",
            title: "Python",
            items: [
              { label: "Angular" },
              { label: ".Net" },
              { label: "Manual tester (lead)" },
              { label: "Odoo" },
              { label: "Cloud Infra/AWS" },
              { label: "Infra/AWS Infra" },
              { label: "Cloud Engineers" },
              { label: "Automation" },
            ]
          }
        ]
      },
      order: 30
    },
    {
      type: 'staffing-why-ess',
      content: {
        heading: "Why ESS is the perfect partner\nfor your IT Outsourcing needs?",
        description: "ebizframeRx HMS offers a comprehensive healthcare management platform designed to streamline hospital operations, improve patient care, and enhance overall efficiency through integrated, secure, and intelligent healthcare solutions.",
        pills: [
          { label: "Experience with Fortune 10 clients" },
          { label: "Access top IT Talent" },
          { label: "Offshore/Onsite/Global deployment Capabilities" },
          { label: "Shared and dedicated ODC" },
          { label: "Strong Domain Knowledge" },
          { label: "High speed communication" },
          { label: "All hours availability to suit your time zone" }
        ],
        image: "/Staffing Services/image 54.png"
      },
      order: 40
    },
    {
      type: 'staffing-benefits',
      content: {
        heading: "Benefits of IT Staff Augmentation",
        description: "At ESS, we offer staff augmentation services specifically designed to meet your short or long term business needs. Our goal is to provide a seamless extension of your in-house staff without the added burden of hiring and retaining employees. Here are some of the key benefits of IT Staff Augmentation from ESS:",
        cards: [
          {
            title: "Filling the skills gap",
            description: "You may need to bring in a team of specialized experts to handle relatively complex projects. ESS allows you to tap into our talent pool of highly skilled professionals to help you reach your goals. Not only do we have the right talent, we also help you avoid the overhead costs of bringing in new employees.",
            image: "/Staffing Services/Rectangle 196.png"
          },
          {
            title: "Investing in What You Need",
            description: "An ESS IT augmentation setup is structured specifically for you to easily scale your IT workforce based on your business needs. This means you won't have to hire a permanent employee for short-term projects that can be easily handled by the professionals we will assign to your project over an agreed period of time.",
            image: "/Staffing Services/Rectangle 197.png"
          },
          {
            title: "Retaining control over existing staff",
            description: "One major fear of management whenever an external augmentation happens is the loss of control over the internal staff. ESS guarantees this will not be the case. We simply integrate into your existing ecosystem to fill in the gaps without disrupting your workflow. Your permanent staff will focus on what is most important while we handle the specialized projects.",
            image: "/Staffing Services/Rectangle 198.png"
          }
        ]
      },
      order: 50
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

  console.log('✨ Seeding completed successfully! Template is now available in Admin Dashboard.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
