import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const updatedContent = {
  image: '/About-Europe/image%20144.png',
  smallTitle: 'ESS AI',
  title: 'Monitor everything, so your brand is prepared for anything',
  description: 'Stay ahead of trends, safeguard your brand health, and uncover what your audience really cares about. Talkwalker by Hootsuite tracks billions of conversations and turns them into your competitive edge.',
  buttonText: 'Meet our team',
  buttonUrl: '/contact-us',
};

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-promo-cta'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-promo-cta'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      ...updatedContent,
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  // Update master sections library
  const sections = await sql`SELECT id, content_json FROM sections WHERE type = 'europe-promo-cta'`;
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
