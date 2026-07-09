import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const updatedContent = {
  badgeText: 'AI Services',
  title: 'Built on Experience. Driven\nby Outcomes.',
  description: 'AI adoption in European enterprises is no longer an experiment; it is a competitive necessity. But success depends less on the technology itself and more on how effectively it is applied to real business challenges. At ESS, we deliver AI capabilities that are built around your operations, integrated into your systems, and measured by business outcomes.',
  primaryButtonText: 'Case studies',
  primaryButtonUrl: '/contact-us',
  secondaryButtonText: 'Talk to an expert',
  secondaryButtonUrl: '/contact-us',
  slides: [
    { image: '/industry-solution-Retail/banner-image.png', alt: 'ebizframe ERP Dashboard' },
    { image: '/industry-solution-Retail/process_ERP_Retail.png', alt: 'ERP Process Overview' },
    { image: '/Business intilligence/image 44.png', alt: 'Business Intelligence Dashboard' },
  ],
};

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-dark-showcase'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-dark-showcase'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      ...updatedContent,
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  // Update master sections library
  const sections = await sql`SELECT id, content_json FROM sections WHERE type = 'europe-dark-showcase'`;
  for (const s of sections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    await sql`UPDATE sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated sections library item ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
