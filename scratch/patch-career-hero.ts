import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections, sections } from '../src/lib/db/schema';

const allowedKeys = [
  'bgImage',
  'ctaText',
  'title',
  'description'
];

async function patch() {
  console.log('Patching career-hero schema...');

  const migrateContent = (content: any) => {
    if (!content) return false;
    let changed = false;

    if (content.subtitle !== undefined) {
      content.description = content.subtitle;
      changed = true;
    }

    for (const key of Object.keys(content)) {
      if (!allowedKeys.includes(key)) {
        delete content[key];
        changed = true;
      }
    }

    return changed;
  };

  const types = ['career-hero'];

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

  console.log('Done patching career-hero!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
