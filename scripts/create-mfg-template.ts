import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const templateName = 'Intelligent ERP Automation Template';

  // Extract nested section contents so we can use them inside mfg-icons
  const demandContent = {
    title: 'Lorem demand, Lorem,<br />ipsum, incididunt ,<br />commodo ,  adipiscing.',
    paragraph1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    paragraph2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  };
  
  const processContent = {
    sectionTitle: 'Process ipsum',
    sectionSubtitle: 'Lorem ipsum dolor sit amet, consectetur.',
    sectionDescription: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliquip',
    processes: [
      { image: '/Modules-manufacturing/Production flow-1.png', label: 'DEMAND', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
      { image: '/Modules-manufacturing/Production flow-2.png', label: 'PLAN', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
      { image: '/Modules-manufacturing/Production flow-3.png', label: 'EXECUTE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
      { image: '/Modules-manufacturing/Production flow-4.png', label: 'IMPROVE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' }
    ]
  };

  const efficiencyContent = {
    sectionTitle: 'Lorem ipsum',
    sectionSubtitle: 'Lorem Efficiency dolor sit amet,<br />Consectetur ipsum',
    description: 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image: '/Modules-manufacturing/Eifficiency.png',
    metrics: [
      'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum',
      'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum', 'Lorem ipsum'
    ]
  };

  const modelsContent = {
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
  };

  const sectionsData = [
    { 
      name: 'Manufacturing Hero 01', 
      type: 'mfg-hero',
      defaultContent: {
        bgColor: '#27256b',
        badgeBgColor: '#391781',
        badgeText: 'Lorem ipsum ERP',
        badgeTextColor: '#ffffff',
        title: 'Loremipsum <br />Loremipsum <br />Lorem ipsum <br />Loremipsum',
        titleColor: '#ffffff',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
        descriptionColor: 'rgba(255,255,255,0.8)',
        primaryButtonBgColor: '#FFD600',
        primaryButtonText: 'Lorem ipsum',
        primaryButtonTextColor: '#29245C',
        primaryButtonUrl: '/about',
        secondaryButtonBgColor: '#ffffff',
        secondaryButtonText: 'Lorem ipsum',
        secondaryButtonTextColor: '#29245C',
        secondaryButtonUrl: '/contact',
        image: '/Modules-manufacturing/Banner-image.png'
      }
    },
    { 
      name: 'Manufacturing Icons Row', 
      type: 'mfg-icons',
      defaultContent: {
        tabs: [
          { 
            iconName: 'LineChart', iconImage: '', 
            label: 'SALES', 
            sections: [
              { type: 'mfg-demand', content: demandContent },
              { type: 'mfg-process', content: processContent },
              { type: 'mfg-efficiency', content: efficiencyContent },
              { type: 'mfg-models', content: modelsContent }
            ] 
          },
          { iconName: 'Factory', iconImage: '', label: 'MANUFACTURING', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
          { iconName: 'Monitor', iconImage: '', label: 'FIXED ASSETS', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
          { iconName: 'LayoutDashboard', iconImage: '', label: 'CORPORATE PORTAL', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
          { iconName: 'Coins', iconImage: '', label: 'FINANCE', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
          { iconName: 'Layers', iconImage: '', label: 'MATERIALS', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
          { iconName: 'Users', iconImage: '', label: 'HUMAN CAPITAL', sections: [
            { type: 'mfg-demand', content: demandContent },
            { type: 'mfg-process', content: processContent },
            { type: 'mfg-efficiency', content: efficiencyContent },
            { type: 'mfg-models', content: modelsContent }
          ] },
        ]
      }
    },
    { 
      name: 'Manufacturing Connect Demand', 
      type: 'mfg-demand',
      defaultContent: demandContent
    },
    { 
      name: 'Manufacturing Process Flow', 
      type: 'mfg-process',
      defaultContent: processContent
    },
    { 
      name: 'Manufacturing Efficiency Dash', 
      type: 'mfg-efficiency',
      defaultContent: efficiencyContent
    },
    { 
      name: 'Manufacturing Operating Models', 
      type: 'mfg-models',
      defaultContent: modelsContent
    },
  ];

  // Update or insert sections in the global library
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

  // ONLY add hero and icons to the template directly
  const templateSectionsToInsert = targetSections.filter(s => s.type === 'mfg-hero' || s.type === 'mfg-icons');

  await db.insert(templateSections).values(
    templateSectionsToInsert.map((s, i) => ({
      templateId: templateId,
      sectionLibraryId: s.id,
      type: s.type,
      variant: s.variant || 'default',
      contentJson: sectionsData.find(sd => sd.type === s.type)?.defaultContent || {},
      orderIndex: i,
    }))
  );

  console.log('Template created/updated with ID:', templateId);
  console.log('Sections added to library:', targetSections.map(s => s.id));
}

main().catch(console.error).finally(() => process.exit(0));
