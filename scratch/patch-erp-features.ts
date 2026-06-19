import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching erp-features schema...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-features')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.tabs) {
        content.features = content.tabs.map((tab: any) => {
          return {
            id: tab.id,
            image: tab.contentImage || '/ErpOverview/featureTav1.png',
            title: tab.title || tab.contentHeading || '',
            desc: tab.contentParagraphs && tab.contentParagraphs.length > 0 ? tab.contentParagraphs[0] : '',
            desc2: tab.contentParagraphs && tab.contentParagraphs.length > 1 ? tab.contentParagraphs[1] : '',
            additionalDescriptions: tab.contentParagraphs && tab.contentParagraphs.length > 2 ? tab.contentParagraphs.slice(2) : []
          };
        });
        delete content.tabs;
      }

      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-features')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.tabs) {
        content.features = content.tabs.map((tab: any) => {
          return {
            id: tab.id,
            image: tab.contentImage || '/ErpOverview/featureTav1.png',
            title: tab.title || tab.contentHeading || '',
            desc: tab.contentParagraphs && tab.contentParagraphs.length > 0 ? tab.contentParagraphs[0] : '',
            desc2: tab.contentParagraphs && tab.contentParagraphs.length > 1 ? tab.contentParagraphs[1] : '',
            additionalDescriptions: tab.contentParagraphs && tab.contentParagraphs.length > 2 ? tab.contentParagraphs.slice(2) : []
          };
        });
        delete content.tabs;
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
