import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const newDefaultContent = {
  slides: [
    {
      image: '/About-Europe/image 144.png',
      logo: '/About-Europe/Rectangle 4326.png',
      title: 'Innovative Medical Products, Inc. CT Manufacturing & Distribution Company',
      stats: [
        { value: '79%', title: 'Read Rate' },
        { value: '3.5x', title: 'Rich SMS campaigns' },
      ],
      ctaText: 'Read the customer story',
      ctaUrl: '/contact-us',
    },
    {
      image: '/About-Europe/image 144.png',
      logo: '/About-Europe/Rectangle 4326.png',
      title: 'Thor – CT Manufacturing & Distribution Company',
      stats: [
        { value: '79%', title: 'Read Rate' },
        { value: '3.5x', title: 'Rich SMS campaigns' },
      ],
      ctaText: 'Read the customer story',
      ctaUrl: '/contact-us',
    },
  ],
  showNavigation: true,
  showPagination: true,
  backgroundColor: '#ffffff',
};

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id FROM template_sections WHERE type = 'europe-case-study-slider'`;
  for (const s of tSections) {
    await sql`UPDATE template_sections SET content_json = ${sql.json(newDefaultContent)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id FROM page_sections WHERE type = 'europe-case-study-slider'`;
  for (const s of pSections) {
    await sql`UPDATE page_sections SET content = ${sql.json(newDefaultContent)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  // Update master sections library
  const sections = await sql`SELECT id FROM sections WHERE type = 'europe-case-study-slider'`;
  for (const s of sections) {
    await sql`UPDATE sections SET content_json = ${sql.json(newDefaultContent)} WHERE id = ${s.id}`;
    console.log(`Updated sections library item ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
