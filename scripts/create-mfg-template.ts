import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';

async function main() {
  const sectionsData = [
    { name: 'Manufacturing Hero 01', type: 'mfg-hero' },
    { name: 'Manufacturing Icons Row', type: 'mfg-icons' },
    { name: 'Manufacturing Connect Demand', type: 'mfg-demand' },
    { name: 'Manufacturing Process Flow', type: 'mfg-process' },
    { name: 'Manufacturing Efficiency Dash', type: 'mfg-efficiency' },
    { name: 'Manufacturing Operating Models', type: 'mfg-models' },
  ];

  const createdSections = [];
  for (const s of sectionsData) {
    const hash = crypto.randomBytes(16).toString('hex');
    const [created] = await db.insert(sections).values({
      name: s.name,
      type: s.type,
      variant: 'default',
      identityHash: hash,
      contentJson: {},
      status: 'published',
    }).returning();
    createdSections.push(created);
  }

  const templateName = 'Intelligent ERP Automation Template';
  const slug = slugify(templateName) + '-' + Date.now();
  
  const [template] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'A premium manufacturing template featuring ERP automation sections.',
    status: 'active',
  }).returning();

  await db.insert(templateSections).values(
    createdSections.map((s, i) => ({
      templateId: template.id,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant,
      contentJson: {},
      orderIndex: i,
    }))
  );

  console.log('Template created with ID:', template.id);
  console.log('Sections added to library:', createdSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));
