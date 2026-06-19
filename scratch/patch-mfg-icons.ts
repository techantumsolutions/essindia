import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templateSections, pageSections, sections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching mfg-icons schema...');

  const migrateContent = (content: any) => {
    if (!content) return false;
    let changed = false;

    if (Array.isArray(content.icons)) {
      content.icons = content.icons.map((i: any) => {
        const migrated = {
          image: i.image || i.iconImage || '',
          title: i.title || i.label || '',
        };
        changed = true;
        return migrated;
      });
    }

    return changed;
  };

  // Sections Library
  const allLibrarySections = await db.query.sections.findMany({
    where: (s, { eq }) => eq(s.type, 'mfg-icons')
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
    where: (s, { eq }) => eq(s.type, 'mfg-icons')
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
    where: (s, { eq }) => eq(s.type, 'mfg-icons')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (migrateContent(content)) {
      await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
      console.log(`Patched page_section ${s.id}`);
    }
  }

  console.log('Done patching mfg-icons!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
