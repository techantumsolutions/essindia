import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-feature-cards'`;
  console.log('Template sections:');
  console.log(JSON.stringify(tSections, null, 2));

  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-feature-cards'`;
  console.log('Page sections:');
  console.log(JSON.stringify(pSections, null, 2));

  await sql.end();
}

main().catch(console.error);
