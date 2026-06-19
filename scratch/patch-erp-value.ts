import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching erp-value schema...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-value')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.subheading !== undefined) {
        content.description = content.subheading;
        delete content.subheading;
      }
      if (content.ctaButton) {
        content.badgeText = content.ctaButton.label || '';
        content.badgeUrl = content.ctaButton.url || '#';
        delete content.ctaButton;
      }
      if (content.valueCards) {
        content.values = content.valueCards.map((v: any) => ({
          image: v.image,
          title: v.title,
          description: v.desc || v.description || ''
        }));
        delete content.valueCards;
      }

      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-value')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.subheading !== undefined) {
        content.description = content.subheading;
        delete content.subheading;
      }
      if (content.ctaButton) {
        content.badgeText = content.ctaButton.label || '';
        content.badgeUrl = content.ctaButton.url || '#';
        delete content.ctaButton;
      }
      if (content.valueCards) {
        content.values = content.valueCards.map((v: any) => ({
          image: v.image,
          title: v.title,
          description: v.desc || v.description || ''
        }));
        delete content.valueCards;
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
