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
  'buttonBgColor',
  'buttonText',
  'buttonTextColor',
  'buttonUrl',
  'image'
];

async function patch() {
  console.log('Patching judicial-hero schema...');

  const migrateContent = (content: any) => {
    if (!content) return false;
    let changed = false;

    if (content.badge !== undefined) {
      content.badgeText = content.badge;
      changed = true;
    }
    if (content.subtitle !== undefined) {
      content.description = content.subtitle;
      changed = true;
    }
    if (content.primaryCta) {
      content.buttonText = content.primaryCta.label || 'Get started';
      content.buttonUrl = content.primaryCta.url || '#';
      changed = true;
    }

    if (!content.bgColor) { content.bgColor = '#9da2c9'; changed = true; }
    if (!content.badgeBgColor) { content.badgeBgColor = '#ffffff'; changed = true; }
    if (!content.badgeTextColor) { content.badgeTextColor = '#2a2d7c'; changed = true; }
    if (!content.titleColor) { content.titleColor = '#ffffff'; changed = true; }
    if (!content.descriptionColor) { content.descriptionColor = 'rgba(255,255,255,0.9)'; changed = true; }
    if (!content.buttonBgColor) { content.buttonBgColor = '#2a2d7c'; changed = true; }
    if (!content.buttonTextColor) { content.buttonTextColor = '#ffffff'; changed = true; }

    for (const key of Object.keys(content)) {
      if (!allowedKeys.includes(key)) {
        delete content[key];
        changed = true;
      }
    }

    return changed;
  };

  const types = ['judicial-hero'];

  for (const type of types) {
    const allLibrarySections = await db.query.sections.findMany({ where: (s, { eq }) => eq(s.type, type) });
    for (const s of allLibrarySections) {
      let content = s.contentJson as any;
      if (migrateContent(content)) await db.update(sections).set({ contentJson: content }).where(eq(sections.id, s.id));
    }

    const allTemplateSections = await db.query.templateSections.findMany({ where: (s, { eq }) => eq(s.type, type) });
    for (const s of allTemplateSections) {
      let content = s.contentJson as any;
      if (migrateContent(content)) await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
    }

    const allPageSections = await db.query.pageSections.findMany({ where: (s, { eq }) => eq(s.type, type) });
    for (const s of allPageSections) {
      let content = s.contentJson as any;
      if (migrateContent(content)) await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
    }
  }

  console.log('Done patching judicial-hero!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
