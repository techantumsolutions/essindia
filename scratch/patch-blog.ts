import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching blog sections...');
  
  // Patch template_sections
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'blog')
  });

  for (const s of allTemplateSections) {
    let content = s.contentJson as any;
    if (content && Array.isArray(content.blogs)) {
      content.blogs = content.blogs.map((b: any) => {
        const { link, ...rest } = b;
        return {
          ...rest,
          ctaText: b.ctaText ?? 'Read More',
          ctaUrl: link ?? b.ctaUrl ?? '#'
        };
      });
      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  // Patch page_sections
  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'blog')
  });

  for (const s of allPageSections) {
    let content = s.contentJson as any;
    if (content && Array.isArray(content.blogs)) {
      content.blogs = content.blogs.map((b: any) => {
        const { link, ...rest } = b;
        return {
          ...rest,
          ctaText: b.ctaText ?? 'Read More',
          ctaUrl: link ?? b.ctaUrl ?? '#'
        };
      });
      await db.update(pageSections).set({ contentJson: content }).where(eq(pageSections.id, s.id));
      console.log(`Patched page_section ${s.id}`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
