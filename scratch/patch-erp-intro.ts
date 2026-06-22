import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching erp-intro fields...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-intro')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.heading) {
        content.title = content.heading;
        delete content.heading;
      }
      if (content.bodyParagraphs && Array.isArray(content.bodyParagraphs)) {
        content.description = content.bodyParagraphs.join('\n\n');
        delete content.bodyParagraphs;
      }
      
      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-intro')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.heading) {
        content.title = content.heading;
        delete content.heading;
      }
      if (content.bodyParagraphs && Array.isArray(content.bodyParagraphs)) {
        content.description = content.bodyParagraphs.join('\n\n');
        delete content.bodyParagraphs;
      }

      await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
      console.log(`Patched page_section ${s.id}`);
    }
  }

  console.log('Done patching!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
