import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const updatedContent = {
  deviceImage: '/About-Europe/rcs-carousel-benefits-highlight 1.png',
  badgeText: 'RCS FOR BUSINESS',
  title: 'Getting started with Albino is easier than ever',
  description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page so quickly with Albino.',
  buttonText: 'Meet our team',
  buttonUrl: '/contact-us',
  cards: [
    { title: 'Trusted Branding', description: 'Trusted branding' },
    { title: 'Verified Sender ID', description: 'Verified sender ID' },
    { title: 'Richer Media', description: 'Richer media' },
    { title: 'Time-Saving Actions', description: 'Time-saving actions' },
  ],
};

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-product-showcase'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    delete updated.features; // Delete old features key
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-product-showcase'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      ...updatedContent,
    };
    delete updated.features; // Delete old features key
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  // Update master sections library
  const sections = await sql`SELECT id, content_json FROM sections WHERE type = 'europe-product-showcase'`;
  for (const s of sections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    delete updated.features; // Delete old features key
    await sql`UPDATE sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated sections library item ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
