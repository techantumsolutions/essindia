import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections, sections } from '../src/lib/db/schema';

const allowedKeys = [
  'bgColor',
  'badgeBgColor',
  'badgeText',
  'badgeTextColor',
  'title',
  'titleColor',
  'description',
  'descriptionColor',
  'primaryButtonBgColor',
  'primaryButtonText',
  'primaryButtonTextColor',
  'primaryButtonUrl',
  'secondaryButtonBgColor',
  'secondaryButtonText',
  'secondaryButtonTextColor',
  'secondaryButtonUrl',
  'image'
];

async function patch() {
  console.log('Patching and cleaning mfg-hero schema...');

  const migrateContent = (content: any) => {
    if (!content) return false;
    let changed = false;

    // Migrate old fields
    if (content.badge !== undefined) {
      content.badgeText = content.badge;
      changed = true;
    }
    if (content.primaryCta) {
      content.primaryButtonText = content.primaryCta.label || 'Lorem ipsum';
      content.primaryButtonUrl = content.primaryCta.link || '/about';
      changed = true;
    }
    if (content.secondaryCta) {
      content.secondaryButtonText = content.secondaryCta.label || 'Lorem ipsum';
      content.secondaryButtonUrl = content.secondaryCta.link || '/contact';
      changed = true;
    }

    // Seed default colors if missing
    if (!content.bgColor) { content.bgColor = '#27256b'; changed = true; }
    if (!content.badgeBgColor) { content.badgeBgColor = '#391781'; changed = true; }
    if (!content.badgeTextColor) { content.badgeTextColor = '#ffffff'; changed = true; }
    if (!content.titleColor) { content.titleColor = '#ffffff'; changed = true; }
    if (!content.descriptionColor) { content.descriptionColor = 'rgba(255,255,255,0.8)'; changed = true; }
    if (!content.primaryButtonBgColor) { content.primaryButtonBgColor = '#FFD600'; changed = true; }
    if (!content.primaryButtonTextColor) { content.primaryButtonTextColor = '#29245C'; changed = true; }
    if (!content.secondaryButtonBgColor) { content.secondaryButtonBgColor = '#ffffff'; changed = true; }
    if (!content.secondaryButtonTextColor) { content.secondaryButtonTextColor = '#29245C'; changed = true; }

    // Clean up extraneous fields
    for (const key of Object.keys(content)) {
      if (!allowedKeys.includes(key)) {
        delete content[key];
        changed = true;
      }
    }

    return changed;
  };

  // Sections Library
  const allLibrarySections = await db.query.sections.findMany({
    where: (s, { eq }) => eq(s.type, 'mfg-hero')
  });

  for (const s of allLibrarySections) {
    let content = s.contentJson as any;
    if (migrateContent(content)) {
      await db.update(sections).set({ contentJson: content }).where(eq(sections.id, s.id));
      console.log(`Patched library section ${s.id}`);
    }
  }

  // Template Sections
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'mfg-hero')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (migrateContent(content)) {
      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  // Page Sections
  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'mfg-hero')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (migrateContent(content)) {
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
