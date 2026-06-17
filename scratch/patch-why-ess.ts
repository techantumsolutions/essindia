import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Removing cta fields from why-ess points...');
  
  // Patch template_sections
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'why-ess')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content && Array.isArray(content.points)) {
      content.points = content.points.map((p: any) => {
        const { ctaText, ctaUrl, ...rest } = p;
        return rest;
      });
      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  // Patch page_sections
  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'why-ess')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content && Array.isArray(content.points)) {
      content.points = content.points.map((p: any) => {
        const { ctaText, ctaUrl, ...rest } = p;
        return rest;
      });
      await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
      console.log(`Patched page_section ${s.id}`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
