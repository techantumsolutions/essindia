import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

const newCards = [
  {
    image: '/About-Europe/Rectangle 4326.png',
    title: 'Production Management',
    description: 'Manage production with real-time work order tracking, advanced scheduling, and live monitoring, helping identify bottlenecks, optimize resource allocation, and ensure smooth, timely execution of manufacturing processes across all stages.',
  },
  {
    image: '/About-Europe/Rectangle 4342.png',
    title: 'Financial Management',
    description: 'Manage finances with integrated data, real-time budget tracking, and automated reporting, providing clear insights into cash flow, expenses, and profitability while enabling better financial control and faster decision-making.',
  },
  {
    image: '/About-Europe/Rectangle 4343.png',
    title: 'Reporting and Analytics',
    description: 'Generate real-time reports and customizable dashboards with key performance indicators, enabling data-driven insights, better decision-making, and complete visibility across all business operations and modules.',
  },
  {
    image: '/About-Europe/Rectangle 4344.png',
    title: 'Inventory Control',
    description: 'Track raw materials, work-in-progress, and finished goods with real-time visibility, automated reorder alerts, and accurate stock data, ensuring optimal inventory levels, reduced shortages, and efficient material management.',
  },
];

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-feature-cards'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      cards: newCards
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-feature-cards'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      cards: newCards
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
