import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching hospital-hero schema...');
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'hospital-hero')
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
      if (content.primaryCta) {
        content.primaryButtonText = content.primaryCta.label || 'Get started';
        content.primaryButtonUrl = content.primaryCta.url || '#';
        delete content.primaryCta;
      }
      if (content.secondaryCta) {
        content.secondaryButtonText = content.secondaryCta.label || 'Explore features';
        content.secondaryButtonUrl = content.secondaryCta.url || '#';
        delete content.secondaryCta;
      }
      
      // Seed default colors if missing
      if (!content.bgColor) content.bgColor = '#320965';
      if (!content.badgeBgColor) content.badgeBgColor = '#ffffff';
      if (!content.badgeTextColor) content.badgeTextColor = '#2a2d7c';
      if (!content.titleColor) content.titleColor = '#ffffff';
      if (!content.descriptionColor) content.descriptionColor = 'rgba(255,255,255,0.9)';
      if (!content.primaryButtonBgColor) content.primaryButtonBgColor = '#ffffff';
      if (!content.primaryButtonTextColor) content.primaryButtonTextColor = '#2a2d7c';
      if (!content.secondaryButtonBgColor) content.secondaryButtonBgColor = 'transparent';
      if (!content.secondaryButtonTextColor) content.secondaryButtonTextColor = '#ffffff';

      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'hospital-hero')
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
      if (content.primaryCta) {
        content.primaryButtonText = content.primaryCta.label || 'Get started';
        content.primaryButtonUrl = content.primaryCta.url || '#';
        delete content.primaryCta;
      }
      if (content.secondaryCta) {
        content.secondaryButtonText = content.secondaryCta.label || 'Explore features';
        content.secondaryButtonUrl = content.secondaryCta.url || '#';
        delete content.secondaryCta;
      }
      
      // Seed default colors if missing
      if (!content.bgColor) content.bgColor = '#320965';
      if (!content.badgeBgColor) content.badgeBgColor = '#ffffff';
      if (!content.badgeTextColor) content.badgeTextColor = '#2a2d7c';
      if (!content.titleColor) content.titleColor = '#ffffff';
      if (!content.descriptionColor) content.descriptionColor = 'rgba(255,255,255,0.9)';
      if (!content.primaryButtonBgColor) content.primaryButtonBgColor = '#ffffff';
      if (!content.primaryButtonTextColor) content.primaryButtonTextColor = '#2a2d7c';
      if (!content.secondaryButtonBgColor) content.secondaryButtonBgColor = 'transparent';
      if (!content.secondaryButtonTextColor) content.secondaryButtonTextColor = '#ffffff';

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
