require('dotenv').config();
const postgres = require('postgres');

async function fixBrands() {
  const sql = postgres(process.env.DATABASE_URL);
  
  try {
    // Get all sections of type trusted-brands from template_sections
    const templateSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'trusted-brands'`;
    for (const sec of templateSections) {
      if (sec.content_json && Array.isArray(sec.content_json.brands)) {
        sec.content_json.brands = sec.content_json.brands.map(b => {
          const newB = { ...b };
          delete newB.name;
          return newB;
        });
        await sql`UPDATE template_sections SET content_json = ${sec.content_json} WHERE id = ${sec.id}`;
      }
    }
    console.log(`Updated ${templateSections.length} template_sections`);

    // Get all sections of type trusted-brands from page_sections
    const pageSections = await sql`SELECT id, content FROM page_sections WHERE type = 'trusted-brands'`;
    for (const sec of pageSections) {
      if (sec.content && Array.isArray(sec.content.brands)) {
        sec.content.brands = sec.content.brands.map(b => {
          const newB = { ...b };
          delete newB.name;
          return newB;
        });
        await sql`UPDATE page_sections SET content = ${sec.content} WHERE id = ${sec.id}`;
      }
    }
    console.log(`Updated ${pageSections.length} page_sections`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

fixBrands();
