import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections, pageSections } from '../src/lib/db/schema';

async function patch() {
  console.log('Patching Home template services section...');
  
  // Patch template_sections
  const allTemplateSections = await db.query.templateSections.findMany({
    where: (s, { eq }) => eq(s.type, 'services')
  });

  for (const s of allTemplateSections) {
    const content = s.contentJson as any;
    if (content && Array.isArray(content.services)) {
      content.services = content.services.map((srv: any) => ({
        ...srv,
        iconImage: srv.iconImage ?? '',
        ctaText: srv.ctaText ?? 'View more',
        ctaUrl: srv.ctaUrl ?? ''
      }));
      await db.update(templateSections).set({ contentJson: content }).where(eq(templateSections.id, s.id));
      console.log(`Patched template_section ${s.id}`);
    }
  }

  // Patch page_sections
  const allPageSections = await db.query.pageSections.findMany({
    where: (s, { eq }) => eq(s.type, 'services')
  });

  for (const s of allPageSections) {
    const content = s.contentJson as any;
    if (content && Array.isArray(content.services)) {
      content.services = content.services.map((srv: any) => ({
        ...srv,
        iconImage: srv.iconImage ?? '',
        ctaText: srv.ctaText ?? 'View more',
        ctaUrl: srv.ctaUrl ?? ''
      }));
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
