import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching erp-hero to flattened structure...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-hero')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      const newContent = {
        bgColor: '#fdfeff',
        badgeText: content.badge || 'ERP Overview',
        badgeColor: '#ffffff',
        titleText: content.title || "It's all about Streamline, Automate, and Accelerate for Business Fitness",
        titleColor: '#000000',
        descriptionText: content.subtitle || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software',
        descriptionColor: '#000000',
        button1Text: content.primaryCta?.label || 'RPA PORTAL',
        button1Color: '#ffffff',
        button1BgColor: '#462294',
        button1Url: content.primaryCta?.url || '/rpa',
        button2Text: content.secondaryCta?.label || 'ERP OFFERINGS',
        button2Color: '#ffffff',
        button2BgColor: '#0f172a',
        button2Url: content.secondaryCta?.url || '/erp-offerings',
        image: content.image || '/BANNER-IMMAGE-LEFT.png',
      };

      await db.update(templateSections).set({ contentJson: newContent }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'erp-hero')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      const newContent = {
        bgColor: '#fdfeff',
        badgeText: content.badge || 'ERP Overview',
        badgeColor: '#ffffff',
        titleText: content.title || "It's all about Streamline, Automate, and Accelerate for Business Fitness",
        titleColor: '#000000',
        descriptionText: content.subtitle || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software',
        descriptionColor: '#000000',
        button1Text: content.primaryCta?.label || 'RPA PORTAL',
        button1Color: '#ffffff',
        button1BgColor: '#462294',
        button1Url: content.primaryCta?.url || '/rpa',
        button2Text: content.secondaryCta?.label || 'ERP OFFERINGS',
        button2Color: '#ffffff',
        button2BgColor: '#0f172a',
        button2Url: content.secondaryCta?.url || '/erp-offerings',
        image: content.image || '/BANNER-IMMAGE-LEFT.png',
      };

      await db.update(pageSections).set({ contentJson: newContent }).where(eq(pageSections.id, s.id));
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
