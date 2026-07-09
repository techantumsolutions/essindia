import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-hero'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      primaryButtonUrl: '/contact-us',
      secondaryButtonUrl: '/contact-us'
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-hero'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      primaryButtonUrl: '/contact-us',
      secondaryButtonUrl: '/contact-us'
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
