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
  console.log('Force cleaning retail-hero schema...');

  // Also clean the Section Library entries!
  const allLibrarySections = await db.query.sections.findMany({
    where: (s, { eq }) => eq(s.type, 'retail-hero')
  });

  for (const s of allLibrarySections) {
    let content = s.contentJson as any;
    if (content) {
      let changed = false;
      for (const key of Object.keys(content)) {
        if (!allowedKeys.includes(key)) {
          delete content[key];
          changed = true;
        }
      }
      if (changed) {
        await db.update(sections).set({ contentJson: content }).where(eq(sections.id, s.id));
        console.log(`Cleaned library section ${s.id}`);
      }
    }
  }
  
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'retail-hero')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content) {
      let changed = false;
      for (const key of Object.keys(content)) {
        if (!allowedKeys.includes(key)) {
          delete content[key];
          changed = true;
        }
      }
      if (changed) {
        await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
        console.log(`Cleaned template_section ${s.id}`);
      }
    }
  }

  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'retail-hero')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content) {
      let changed = false;
      for (const key of Object.keys(content)) {
        if (!allowedKeys.includes(key)) {
          delete content[key];
          changed = true;
        }
      }
      if (changed) {
        await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
        console.log(`Cleaned page_section ${s.id}`);
      }
    }
  }

  console.log('Done cleaning!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
