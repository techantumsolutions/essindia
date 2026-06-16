import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Intelligent ERP Automation Template';



  const sectionsData = [
    { 
      name: 'Manufacturing Hero 01', 
      type: 'mfg-hero',
      defaultContent: {
        badge: 'Lorem ipsum ERP',
        title: 'Loremipsum <br />Loremipsum <br />Lorem ipsum <br />Loremipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        primaryCta: { label: 'Lorem ipsum', link: '/about' },
        secondaryCta: { label: 'Lorem ipsum', link: '/contact' },
        image: '/Modules-manufacturing/Banner-image.png'
      }
    },
    { 
      name: 'Manufacturing Icons Row', 
      type: 'mfg-icons',
      defaultContent: {
        icons: [
          { iconName: 'LineChart', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'Factory', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'Monitor', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'LayoutDashboard', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'Coins', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'Layers', iconImage: '', label: 'Lorem ipsum' },
          { iconName: 'Users', iconImage: '', label: 'Lorem ipsum' },
        ]
      }
    },
    { 
      name: 'Manufacturing Connect Demand', 
      type: 'mfg-demand',
      defaultContent: {
        title: 'Lorem demand, Lorem,<br />ipsum, incididunt ,<br />commodo ,  adipiscing.',
        paragraph1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        paragraph2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    },
    { 
      name: 'Manufacturing Process Flow', 
      type: 'mfg-process',
      defaultContent: {
        sectionTitle: 'Process ipsum',
        sectionSubtitle: 'Lorem ipsum dolor sit amet, consectetur.',
        sectionDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliquip',
        processes: [
          { image: '/Modules-manufacturing/Production flow-1.png', label: 'DEMAND', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
          { image: '/Modules-manufacturing/Production flow-2.png', label: 'PLAN', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
          { image: '/Modules-manufacturing/Production flow-3.png', label: 'EXECUTE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
          { image: '/Modules-manufacturing/Production flow-4.png', label: 'IMPROVE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' }
        ]
      }
    },
    { 
      name: 'Manufacturing Efficiency Dash', 
      type: 'mfg-efficiency',
      defaultContent: {
        sectionTitle: 'Lorem ipsum',
        sectionSubtitle: 'Lorem Efficiency dolor sit amet,<br />Consectetur ipsum',
        description: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: '/Modules-manufacturing/Eifficiency.png',
        metrics: [
          'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
          'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'
        ]
      }
    },
    { 
      name: 'Manufacturing Operating Models', 
      type: 'mfg-models',
      defaultContent: {
        sectionTitle: 'Lorem ipsum',
        sectionSubtitle: 'Lorem ipsum dolor sit amet, consectetur.<br />ipsum dolor sit models.',
        sectionDescription: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        models: [
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-1.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-2.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-3.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-4.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-5.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-6.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-7.png' },
          { title: 'Lorem ipsum', desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.', image: '/Modules-manufacturing/industries-8.png' }
        ]
      }
    },
  ];

  // Update or insert sections
  const targetSections = [];
  for (const s of sectionsData) {
    const existingSection = await db.query.sections.findFirst({
      where: eq(sections.name, s.name)
    });

    if (existingSection) {
      console.log(`Section "${s.name}" already exists. Updating contentJson...`);
      const [updated] = await db.update(sections)
        .set({ contentJson: s.defaultContent })
        .where(eq(sections.id, existingSection.id))
        .returning();
      targetSections.push(updated);
    } else {
      const hash = crypto.randomBytes(16).toString('hex');
      const [created] = await db.insert(sections).values({
        name: s.name,
        type: s.type,
        variant: 'default',
        identityHash: hash,
        contentJson: s.defaultContent,
        status: 'published',
      }).returning();
      console.log(`Created new section "${s.name}".`);
      targetSections.push(created);
    }
  }

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: eq(templates.name, templateName)
  });

  let templateId;

  if (existingTemplate) {
    console.log(`Template "${templateName}" already exists. Updating template sections...`);
    templateId = existingTemplate.id;
    // We will clear existing templateSections and recreate them to ensure they have the new contentJson
    await db.delete(templateSections).where(eq(templateSections.templateId, templateId));
  } else {
    const slug = slugify(templateName) + '-' + Date.now();
    const [template] = await db.insert(templates).values({
      name: templateName,
      slug: slug,
      description: 'A premium manufacturing template featuring ERP automation sections.',
      status: 'active',
    }).returning();
    templateId = template.id;
  }

  await db.insert(templateSections).values(
    targetSections.map((s, i) => ({
      templateId: templateId,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant || 'default',
      contentJson: sectionsData[i].defaultContent,
      orderIndex: i,
    }))
  );

  console.log('Template created/updated with ID:', templateId);
  console.log('Sections added to library:', targetSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));
