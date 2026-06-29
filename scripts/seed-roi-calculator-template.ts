import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import { templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';

async function seed() {
  console.log('🚀 Seeding BI ROI Calculator Template...');

  const templateName = 'BI ROI Calculator';
  const slug = slugify(templateName);

  // Check if template already exists
  const existingTemplate = await db.query.templates.findFirst({
    where: (t, { eq }) => eq(t.slug, slug),
  });

  if (existingTemplate) {
    console.log(`ℹ️ Template "${templateName}" already exists. Deleting it to recreate...`);
    await db.delete(templateSections).where(eq(templateSections.templateId, existingTemplate.id));
    await db.delete(templates).where(eq(templates.id, existingTemplate.id));
  }

  // Create Template
  const [newTemplate] = await db.insert(templates).values({
    name: templateName,
    slug: slug,
    description: 'BI ROI Calculator template page containing Hero banner, Explanation, Formula details, and Usage, limitations, and FAQs.',
    status: 'active',
  }).returning();

  console.log(`✅ Created Template: ${newTemplate.name} (${newTemplate.id})`);

  // Sections Data
  const sections = [
    {
      type: 'roi-hero',
      content: {
        bgColor: '#13444f',
        badgeBgColor: '#ffffff',
        badgeBorderColor: 'transparent',
        badgeText: 'Return on Investment',
        badgeTextColor: '#2b2a6c',
        title: 'What is ROI and How to Calculate Return on Investment',
        titleColor: '#ffffff',
        description: 'In business world, decision-making is a complex task that requires precise and reliable information. One of the most commonly used metrics for short-term investment decision-making is the return on investment (ROI).',
        descriptionColor: '#ffffff',
        button1BgColor: '#ffffff',
        button1BorderColor: '#ffffff',
        button1Text: 'Find an advisor',
        button1TextColor: '#2b2a6c',
        button1Url: '#',
        button2BgColor: '#ffffff',
        button2BorderColor: '#ffffff',
        button2Text: 'ROI calculator',
        button2TextColor: '#2b2a6c',
        button2Url: '#',
        image: '/BI-ROI caluculator/image 123.png'
      },
      order: 10
    },
    {
      type: 'roi-explanation',
      content: {
        image: '/BI-ROI caluculator/image 124.png',
        title: 'What is ROI?',
        paragraphs: [
          'Calculating Return on Investment (ROI) involves knowing the income generated as a result of the investment over a given period and the expenses associated with that investment.',
          'The formula consists of subtracting the investment expenses from the income and dividing that result by the initial investment expenses, and finally, multiplying the result by 100 to get the percentage value of ROI.'
        ],
        formulaText: 'ROI = [(Income – Investment) / Investment] * 100',
        cards: [
          { description: 'The numerator indicates the benefits obtained from the investment, and the denominator the investment expenses.' },
          { description: 'Marketing investments are accounted for as expenses. Therefore, the term investment expense is used interchangeably as investment.' },
          { description: 'A positive ROI indicates that the investment has been profitable, while a negative ROI indicates that the investment has been unprofitable.' }
        ]
      },
      order: 20
    },
    {
      type: 'roi-formula',
      content: {
        title: 'How to calculate ROI',
        paragraphs: [
          'To calculate ROI, it is necessary to determine the net income or profit generated from the investment and divide it by the total cost incurred. The resulting figure is then multiplied by 100 to express it as a percentage. Here\'s the formula:',
          'ROI = (Net Income / Total Cost) x 100',
          'For instance, if an investment of $10,000 yields a net income of $2,000, the ROI can be calculated as follows:',
          'ROI = ($2,000 / $10,000) x 100 = 20%',
          'This indicates that the investment generated a return of 20 cents for every dollar invested.',
          'It\'s worth noting that there are variations of the ROI formula that may be used depending on the specific context or industry. Some variations include:',
          'ROI = (Net Income – Initial Investment) / Initial Investment x 100',
          'This formula calculates the ROI based on the initial investment rather than the total cost.',
          'ROI = (Current Value of Investment – Initial Investment) / Initial Investment x 100',
          'This formula considers the current value of the investment rather than the net income.',
          'Regardless of the formula used, the fundamental principle of ROI remains the same: it measures the financial return of an investment relative to its cost.'
        ],
        image1: '',
        image2: ''
      },
      order: 30
    },
    {
      type: 'roi-usage',
      content: {
        usageTitle: 'How and when to use ROI',
        usageParagraphs: [
          'ROI is a valuable decision-making tool. Use it to evaluate the potential profitability of different investment decisions, such as a new product line, marketing campaign or equipment upgrade. Calculate ROI before making significant financial commitments to compare options and forecast which will yield the highest rate of return. Additionally, you can track ROI after an investment to measure its ongoing performance and success in terms of capital gains.',
          'Improving customer experiences: Salesforce provides businesses with tools to improve customer experiences, such as customer service, support, and loyalty programs. These tools can help businesses build relationships with customers and increase customer satisfaction.'
        ],
        usageImage: '/BI-ROI caluculator/Frame 297.png',
        limitationsTitle: 'Limitations of ROI',
        limitationsDescription: 'ROI is a very useful tool for decision-making, but it has some limitations that are important to consider:',
        limitations: [
          { text: 'Benefit estimates are based on future projections. These projections are uncertain, meaning that ROI cannot predict with certainty the future performance of an investment.' },
          { text: 'ROI does not take risk into account, nor does it consider the possibility that an investment may lose money.' }
        ],
        faqTitle: 'ROI FAQ\'s',
        faqs: [
          {
            question: 'ROI FAQ\'s text block',
            answer: 'ROI is a valuable decision-making tool. Use it to evaluate the potential profitability of different investment decisions, such as a new product line, marketing campaign or equipment upgrade. Calculate ROI before making significant financial commitments to compare options and forecast which will yield the highest rate of return. Additionally, you can track ROI after an investment to measure its ongoing performance and success in terms of capital gains.\n\nImproving customer experiences: Salesforce provides businesses with tools to improve customer experiences, such as customer service, support, and loyalty programs. These tools can help businesses build relationships with customers and increase customer satisfaction.'
          }
        ]
      },
      order: 40
    }
  ];

  // Insert Sections
  for (const section of sections) {
    await db.insert(templateSections).values({
      templateId: newTemplate.id,
      type: section.type,
      contentJson: section.content,
      orderIndex: section.order,
    });
    console.log(`✅ Seeded ${section.type} section`);
  }

  console.log('✨ Seeding completed successfully! BI ROI Calculator template is now available.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
