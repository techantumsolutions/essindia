import 'dotenv/config';
import { inArray } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { sections, templateSections, pageSections } from '../src/lib/db/schema';

const typeMapping: Record<string, string> = {
  'AboutUsHero': 'about-us-hero',
  'AboutUsCompanyIntro': 'about-us-company-intro',
  'AboutUsMissionVision': 'about-us-mission-vision',
  'AboutUsServicesOverview': 'about-us-services-overview',
  'AboutUsTransformationSection': 'about-us-transformation-section',
  'AboutUsWhyEss': 'about-us-why-ess',
  'AboutUsCta': 'about-us-cta',
};

async function patch() {
  console.log('Patching About Us types...');
  
  const oldTypes = Object.keys(typeMapping);

  // Patch section library
  for (const oldType of oldTypes) {
    const newType = typeMapping[oldType];
    await db.update(sections).set({ type: newType }).where(inArray(sections.type, [oldType]));
    console.log(`Updated sections from ${oldType} to ${newType}`);
  }

  // Patch template_sections
  for (const oldType of oldTypes) {
    const newType = typeMapping[oldType];
    await db.update(templateSections).set({ type: newType }).where(inArray(templateSections.type, [oldType]));
    console.log(`Updated templateSections from ${oldType} to ${newType}`);
  }

  // Patch page_sections
  for (const oldType of oldTypes) {
    const newType = typeMapping[oldType];
    await db.update(pageSections).set({ type: newType }).where(inArray(pageSections.type, [oldType]));
    console.log(`Updated pageSections from ${oldType} to ${newType}`);
  }

  console.log('Done!');
  process.exit(0);
}

patch().catch(err => {
  console.error(err);
  process.exit(1);
});
