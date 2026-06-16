import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './src/lib/db';
import { templates, templateSections } from './src/lib/db/schema';
import { slugify } from './src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Judicial Automation Template...');

  const templateName = 'Judicial Automation';
  const slug = slugify(templateName);

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });

  if (existingTemplate) {
    console.log(`ℹ️ Template "${templateName}" already exists. Deleting it to recreate...`);
    // Drizzle cascade delete handles template_sections if configured, but let's delete explicitly
    await db.delete(templateSections).where(eq(templateSections.templateId, existingTemplate.id));
    await db.delete(templates).where(eq(templates.id, existingTemplate.id));
  }

  // Create Template
  const [newTemplate] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'Judicial Automation template with hero, overview, and features sections.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'judicial-hero',
      content: {
        badge: "Judicial Automation",
        title: "Intelligent IT & Judicial<br />Automation Solutions",
        subtitle: "Streamline legal operations, modernize enterprise infrastructure, and optimize business performance with secure, scalable, and technology-driven solutions from ESS.",
        primaryCta: { label: "Get started", url: "#" },
        image: "/Judicial Automation/More solutions-Judicial Automation.png"
      },
      order: 10
    },
    {
      type: 'judicial-overview',
      content: {
        heading: "Judicial Automation",
        description: "ebizframeJustice is an advanced Judicial Automation solution designed to help courts and legal departments streamline case management, hearing schedules, court workflows, event notifications, and legal processes efficiently. Built to support different court scheduling models, the platform also enables the creation of strong e-justice networks while providing powerful search capabilities and access to over 1,00,000 judgments from the Supreme Court, High Courts, tribunals, commissions along with central and state acts and rules for faster and more convenient legal research.",
        cards: [
          {
            title: "Court-wise Databases",
            description: "Supreme Court and high court decisions on all areas of law, especially on the above subjects, till the present date. ebizframeJustice also covers the decisions of major Tribunals and Commissions like ITAT, SAT, CAT, TDSAT, CERC, APTEL, State and National Consumer Redressal Forums.",
            image: "/Judicial Automation/Rectangle 196.png"
          },
          {
            title: "Statutory Information",
            description: "More than 2,000 state and Central Acts & Rules, Regulations, the Notifications & Circulars from law enforcement authorities under these acts, which include CBDT, CBEC, CLB, RBI, SEBI, MCA, FEMA, etc. along with statutory forms as well as various deeds, and agreements and legal maxims.",
            image: "/Judicial Automation/Rectangle 197.png"
          }
        ]
      },
      order: 20
    },
    {
      type: 'judicial-features',
      content: {
        heading: "ebizframeJustice – Key features",
        description: "ebizframeJustice makes available most of the elegant, sophisticated and context specific search features. ebizframeJustice is born out of the understanding that Law is a serious subject and getting to relevant results in the shortest time and most convenient way is essential to the law professionals.",
        sideImage: "/Judicial Automation/image 78.png",
        features: [
          {
            title: "Intuitive & Sophisticated Search",
            description: "on Full Text, Subject, Section/Act, Title, Key-Words & Key-Phrases, and Statutes referred, Coram of Judges, Name of the Court, Date of Decision, and Equivalent Citations etc.",
            icon: "/Judicial Automation/Container/search_svgrepo.com.png"
          },
          {
            title: "Backward & Forward links",
            description: "to the judgment (to the extent feasible) through hyperlinks.",
            icon: "/Judicial Automation/Container/Vector.png"
          },
          {
            title: "Store your expertise with ebizframejustice",
            description: "by attaching notes, reminders, and keywords - and search them in consonance with a search on the database at any later time.",
            icon: "/Judicial Automation/Container/server_svgrepo.com.png"
          },
          {
            title: "Assisted Querying using ebizframejustice",
            description: "When you can't do your research yourself, send your query to Jura Assistant and our team of researchers will provide answers. (Conditions and charges apply)",
            icon: "/Judicial Automation/Container/query_svgrepo.com.png"
          },
          {
            title: "Tamper-proof",
            description: "printing of results such that the results cannot be altered when being printed.",
            icon: "/Judicial Automation/Container/print_svgrepo.com.png"
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

  console.log('✨ Seeding completed successfully! Template is now available in Admin Dashboard.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
