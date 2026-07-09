import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  const pages = await sql`SELECT id, title, full_path FROM pages WHERE full_path = '/'`;
  if (pages.length === 0) {
    console.log('No homepage found');
    await sql.end();
    return;
  }
  const homeId = pages[0].id;
  const sections = await sql`SELECT id, type, content FROM page_sections WHERE page_id = ${homeId} ORDER BY order_index`;
  console.log(JSON.stringify(sections.map(s => ({ type: s.type, keys: Object.keys(s.content) })), null, 2));
  await sql.end();
}

main().catch(console.error);
