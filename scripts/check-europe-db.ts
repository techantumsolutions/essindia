import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  const tSections = await sql`SELECT id, type, content_json FROM template_sections WHERE type = 'europe-hero'`;
  console.log('Template sections for europe-hero:');
  console.log(JSON.stringify(tSections, null, 2));

  const pSections = await sql`SELECT id, type, content FROM page_sections WHERE type = 'europe-hero'`;
  console.log('Page sections for europe-hero:');
  console.log(JSON.stringify(pSections, null, 2));

  await sql.end();
}

main().catch(console.error);
