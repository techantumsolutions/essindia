import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching retail-hero schema...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'retail-hero')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.badge !== undefined) {
        content.badgeText = content.badge;
        delete content.badge;
      }
      if (content.subtitle !== undefined) {
        content.description = content.subtitle;
        delete content.subtitle;
      }
      if (content.ctaText !== undefined) {
        content.buttonText = content.ctaText;
        delete content.ctaText;
      }
      if (content.ctaLink !== undefined) {
        content.buttonUrl = content.ctaLink;
        delete content.ctaLink;
      }
      if (content.imagePath !== undefined) {
        content.image = content.imagePath;
        delete content.imagePath;
      }
      
      // Seed default colors if missing
      if (!content.bgColor) content.bgColor = '#f3f5ff';
      if (!content.badgeBgColor) content.badgeBgColor = '#61459a';
      if (!content.badgeTextColor) content.badgeTextColor = '#ffffff';
      if (!content.titleColor) content.titleColor = '#8873b3';
      if (!content.descriptionColor) content.descriptionColor = '#818183';
      if (!content.buttonBgColor) content.buttonBgColor = '#fbbf24';
      if (!content.buttonTextColor) content.buttonTextColor = '#472393';

      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'retail-hero')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      if (content.badge !== undefined) {
        content.badgeText = content.badge;
        delete content.badge;
      }
      if (content.subtitle !== undefined) {
        content.description = content.subtitle;
        delete content.subtitle;
      }
      if (content.ctaText !== undefined) {
        content.buttonText = content.ctaText;
        delete content.ctaText;
      }
      if (content.ctaLink !== undefined) {
        content.buttonUrl = content.ctaLink;
        delete content.ctaLink;
      }
      if (content.imagePath !== undefined) {
        content.image = content.imagePath;
        delete content.imagePath;
      }
      
      // Seed default colors if missing
      if (!content.bgColor) content.bgColor = '#f3f5ff';
      if (!content.badgeBgColor) content.badgeBgColor = '#61459a';
      if (!content.badgeTextColor) content.badgeTextColor = '#ffffff';
      if (!content.titleColor) content.titleColor = '#8873b3';
      if (!content.descriptionColor) content.descriptionColor = '#818183';
      if (!content.buttonBgColor) content.buttonBgColor = '#fbbf24';
      if (!content.buttonTextColor) content.buttonTextColor = '#472393';

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
