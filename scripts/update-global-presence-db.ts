import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const updatedContent = {
  image: '/About-Europe/image 141.png',
  subtitle: 'The ESS India Super Network',
  title: 'Discover why over 200,000 businesses trust the Sinch Super Network',
  description: "Meet the network that powers other networks. It's the most direct, secure, and reliable tier-1 network for messaging, voice, and email.",
  statistics: [
    { number: '30+', label: 'Years of Expertise' },
    { number: '15+', label: 'Industry Sectors' },
    { number: '500+', label: 'Enterprise Clients' },
    { number: '98%', label: 'Client Satisfaction' },
  ],
};

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-global-presence'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      ...updatedContent,
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-global-presence'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      ...updatedContent,
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  // Update master sections library
  const sections = await sql`SELECT id, content_json FROM sections WHERE type = 'europe-global-presence'`;
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
