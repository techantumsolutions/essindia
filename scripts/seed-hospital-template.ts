import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding Hospital Management Template...');

  const templateName = 'Hospital Management';
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
    description: 'Hospital Management template with hero, overview, features, regulatory, and tech specs.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'hospital-hero',
      content: {
        badge: "Hospital Management",
        title: "Smart Hospital<br />Management System (HMS)<br />for Connected Healthcare",
        subtitle: "A comprehensive healthcare solution that integrates clinical, financial, and operational systems to deliver better patient care, streamline workflows, and ensure regulatory compliance across medical institutions.",
        primaryCta: { label: "Get started", url: "#" },
        secondaryCta: { label: "Explore features", url: "#" },
        image: "/Hospital Management/Rectangle 197.png"
      },
      order: 10
    },
    {
      type: 'hospital-overview',
      content: {
        heading: "Hospital Management Systems (HMS)",
        description: "Modern healthcare is primarily driven by efficient hospital systems where accurate data, seamless operations, and patient-centric care take center stage. ebizframeRx HMS is a scalable, AI-powered healthcare management solution designed to streamline hospital operations, improve clinical outcomes, and enhance patient care.",
        cards: [
          {
            title: "ebizframeRx",
            description: "ebizframeRx is highly configurable and seamlessly integrates different hospital operations such as patient care, IPD/OPD, billing, and pharmacy under a single platform. It is a highly robust and reliable system designed to meet the demands of modern healthcare institutions.",
            image: "/Hospital Management/Rectangle 196.png"
          },
          {
            title: "ebizframeRx HMS",
            description: "ebizframeRx HMS is a comprehensive Hospital Management ERP Solution for mid-to-large multi-speciality hospitals. Our solution leverages cutting-edge technology to automate workflows, optimize resource utilization, and ensure better care management.",
            image: "/Hospital Management/Rectangle 197.png"
          },
          {
            title: "ebizframeRx",
            description: "ebizframeRx offers a comprehensive hospital information system (HIS) for managing complete lifecycle operations starting from patient admission to discharge. It enables clinical and financial workflows through automated data exchange.",
            image: "/Hospital Management/Rectangle 198.png"
          }
        ]
      },
      order: 20
    },
    {
      type: 'hospital-features',
      content: {
        heading: "Salient Features of\nebizframeRx HMS",
        description: "ebizframeRx HMS is a comprehensive workflow management software tailored to streamline hospital operations, improve profitability, and enhance patient care delivery with automated, responsive, and data-driven solutions.",
        features: [
          { label: "High Performance & Scalability" },
          { label: "User friendly administration" },
          { label: "Portable across a variety of platforms" },
          { label: "Auto logging of transactions" },
          { label: "Seamless integration with financial HIS" },
          { label: "Comprehensive connectivity" },
          { label: "HIPAA and HL7 compliant" }
        ],
        image1: "/Hospital Management/Frame 269.png"
      },
      order: 30
    },
    {
      type: 'hospital-regulatory',
      content: {
        heading: "Regulatory Standards\nCompliance",
        description: "ebizframeRx is highly compliant and adheres to all global standards including HIPAA, HL7, and ICD-10. This ensures interoperability, robust data exchange, and regulatory alignment for hospital operations. The core architecture uses advanced security protocols to keep sensitive healthcare data safe and confidential.",
        points: [
          { label: "Enhanced Clinical Data Exchange" },
          { label: "High Availability & Scalability" },
          { label: "Role-Based Access Control (RBAC)" },
          { label: "Stringent Data Security Policies" },
          { label: "Centralized Access Management" },
          { label: "Comprehensive Auditing Systems" }
        ],
        image1: "/Hospital Management/Frame 270.png"
      },
      order: 40
    },
    {
      type: 'hospital-tech-specs',
      content: {
        heading: "Technical Specifications\nof ebizframeRx HMS",
        description: "ebizframeRx is built on modern, scalable architectures specifically tailored for enterprise hospital operations. The core technological stack guarantees reliable, seamless, and lightning-fast responsiveness under high concurrency, making it easy to integrate with a multitude of medical devices and other digital health platforms.",
        specs: [
          { label: "Tiered Application Architecture Specifications" },
          { label: "IIS 8.0 Application Server" },
          { label: "My SQL DB & Database Server" },
          { label: "HTML5, CSS3, JavaScript Web\nApplication Development" },
          { label: "Auto-scaled Backend Application" },
          { label: "AI/ML Powered Data Analytics &\nReport UI" },
          { label: "Windows 2019 Enterprise\nServer and above" },
          { label: "Sub-millisecond latency on UI queries" }
        ],
        image1: "/Hospital Management/Frame 271.png"
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
