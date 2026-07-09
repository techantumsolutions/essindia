import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  const sections = await sql`SELECT id, type, content_json FROM sections WHERE type = 'europe-feature-cards'`;
  console.log('Sections table:');
  console.log(JSON.stringify(sections, null, 2));

  await sql.end();
}

main().catch(console.error);
