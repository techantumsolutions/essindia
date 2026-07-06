require('dotenv').config();
const postgres = require('postgres');

async function removeContactMap() {
  const sql = postgres(process.env.DATABASE_URL);
  try {
    const res1 = await sql`DELETE FROM template_sections WHERE type = 'contact-map'`;
    console.log(`Deleted rows from template_sections`);

    const res2 = await sql`DELETE FROM page_sections WHERE type = 'contact-map'`;
    console.log(`Deleted rows from page_sections`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sql.end();
  }
}

removeContactMap();
