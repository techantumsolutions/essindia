import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

async function main() {
  // Update template_sections
  const tSections = await sql`SELECT id, content_json FROM template_sections WHERE type = 'europe-hero'`;
  for (const s of tSections) {
    const updated = {
      ...s.content_json,
      primaryButtonText: 'Try for free',
      primaryButtonBgColor: '#231f61',
      primaryButtonBorderColor: '#231f61',
      secondaryButtonText: 'Talk to an expert',
      secondaryButtonBgColor: '#f5c234',
      secondaryButtonBorderColor: '#f5c234',
      secondaryButtonTextColor: '#231f61',
      titleColor: '#816191',
      badgeBorderColor: '#8b5cf6',
      badgeTextColor: '#2b2657',
      subtitle: '',
      description: '30 years of enterprise technology transformation. We help European organizations navigate complexity, modernize operations, and build capabilities that endure through AI-powered innovation and intelligent automation.',
      descriptionColor: '#556877',
      backgroundGradient: 'radial-gradient(circle at center, #ffffff 40%, #f6f1fc 100%)',
      sectionPaddingBottom: 'pb-20'
    };
    await sql`UPDATE template_sections SET content_json = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated template section ${s.id}`);
  }

  // Update page_sections
  const pSections = await sql`SELECT id, content FROM page_sections WHERE type = 'europe-hero'`;
  for (const s of pSections) {
    const updated = {
      ...s.content,
      primaryButtonText: 'Try for free',
      primaryButtonBgColor: '#231f61',
      primaryButtonBorderColor: '#231f61',
      secondaryButtonText: 'Talk to an expert',
      secondaryButtonBgColor: '#f5c234',
      secondaryButtonBorderColor: '#f5c234',
      secondaryButtonTextColor: '#231f61',
      titleColor: '#816191',
      badgeBorderColor: '#8b5cf6',
      badgeTextColor: '#2b2657',
      subtitle: '',
      description: '30 years of enterprise technology transformation. We help European organizations navigate complexity, modernize operations, and build capabilities that endure through AI-powered innovation and intelligent automation.',
      descriptionColor: '#556877',
      backgroundGradient: 'radial-gradient(circle at center, #ffffff 40%, #f6f1fc 100%)',
      sectionPaddingBottom: 'pb-20'
    };
    await sql`UPDATE page_sections SET content = ${sql.json(updated)} WHERE id = ${s.id}`;
    console.log(`Updated page section ${s.id}`);
  }

  await sql.end();
}

main().catch(console.error);
