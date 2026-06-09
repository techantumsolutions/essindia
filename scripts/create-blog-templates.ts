import 'dotenv/config';
import { db } from '../src/lib/db';
import { sections, templates, templateSections } from '../src/lib/db/schema';
import { slugify } from '../src/lib/cms/utils';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('--- SEEDING BLOG TEMPLATES ---');

  // Define Templates Data
  const templatesData = [
    {
      name: 'Blog List Template',
      description: 'Template for the main blog and resource listing page, featuring customizable headers, topics and industries filters, and load more pagination.',
      sections: [
        {
          name: 'Blog List Section',
          type: 'blog-list-block',
          contentJson: {
            badgeText: 'Latest Blogs',
            headingText: 'Press & Media Resources',
            subheadingText: 'Everything journalists, analysts, and partners need to cover ESS — from brand assets to company facts. Everything journalists, analysts, and partners need to cover ESS— from brand assets to company facts.',
            bgImage: ''
          }
        }
      ]
    },
    {
      name: 'Blog Detail Template',
      description: 'Template for a specific blog post detail view, featuring customizable article content, a business reconciliation diagram, and highlight panels.',
      sections: [
        {
          name: 'Blog Detail Content',
          type: 'blog-detail-block',
          contentJson: {
            badgeText: 'Latest Blogs',
            headingText: 'Explore our knowledge hub',
            subheadingText: 'Everything journalists, analysts, and partners need to cover ESS — from brand assets to company facts.',
            bgImage: '',
            category: 'Technology',
            title: 'How Power BI Services Help Fix Multi-System Data Mismatches',
            authorName: 'Jason Francisco',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
            date: 'May 15, 2026',
            image: '/blog-1.png',
            description: 'In most enterprise environments, data flows from CRM platforms, local databases, and legacy solutions. If not managed properly, this leads to contradictory reports, duplicate customer records, and mismatched financial data.',
            contentHtml: '<p class="text-slate-600 leading-relaxed mb-6">Today, businesses generate more data than ever. From CRM platforms to local databases, enterprise systems are constantly producing information. However, when these systems operate in silos, they often create contradictory reports, duplicate customer records, and mismatched financial data.</p><p class="text-slate-600 leading-relaxed mb-8">Software platforms that do not communicate share duplicate or conflicting information, which hampers executive decision-making. This is where Power BI services come in. Rather than working with disconnected reports, businesses can use Power BI to design single-source validation models that automatically reconcile differences across multiple systems.</p><p class="text-slate-600 leading-relaxed mb-8">In this blog, we will discuss how Power BI services help automate data validation, resolve multi-system data discrepancies, and establish a single source of truth for your business.</p>',
            
            // Diagram
            diagramTitle1: 'System disagreement',
            diagramDesc1: 'Conflicting data across systems',
            diagramTitle2: 'Business Logic Reconciliation',
            diagramDesc2: 'Reconcile conflicting calculation logic',
            diagramTitle3: 'System alignment',
            diagramDesc3: 'Consistent data across all systems',
            diagramSub1: 'Establish clear data ownership',
            diagramSub2: 'Reconcile conflicting calculation logic',
            diagramSub3: 'Enhance customer data standards',

            // Key Highlights Panels
            highlights: [
              {
                title: 'Contradictory Data From Multiple Sources',
                description: 'Your BI database may compile sales numbers, but duplicate entries and mismatched records create confusion. Power BI resolves this by building single-source validation models.'
              },
              {
                title: 'Reduce Manual Reporting Errors',
                description: 'Automated data cleaning schedules map raw inputs to validated dimensions, reducing human errors that commonly plague manual spreadsheets.'
              },
              {
                title: 'Standardize Inconsistent Data',
                description: 'Convert mismatched values, formats, and currencies across different legacy platforms to unified, standardized business definitions.'
              },
              {
                title: 'Provide Real-Time Business Insights',
                description: 'Financial and operational teams access live dashboards rather than waiting for end-of-month manual reconciliation cycles.'
              }
            ],
            conclusionHtml: '<h3 class="text-xl font-bold text-slate-800 mb-4 mt-8">Conclusion</h3><p class="text-slate-600 leading-relaxed mb-6">Managing multi-system data flows requires smart tooling. By leveraging Power BI\'s robust modeling and integration layers, companies can eliminate data discrepancies, streamline reporting, and make decisions with absolute confidence.</p><p class="text-slate-600 leading-relaxed">If you are ready to resolve your data mismatches and establish a single source of truth, reach out to our team of Business Intelligence experts today.</p>'
          }
        }
      ]
    }
  ];

  for (const tData of templatesData) {
    // Check if template already exists
    const existingTemplate = await db.query.templates.findFirst({
      where: eq(templates.name, tData.name)
    });

    if (existingTemplate) {
      console.log(`Template "${tData.name}" already exists. Recreating it...`);
      // Delete existing template sections first due to cascade referencing if applicable
      await db.delete(templates).where(eq(templates.id, existingTemplate.id));
    }

    // Insert section library definitions first
    const targetSections = [];
    for (const s of tData.sections) {
      const existingSection = await db.query.sections.findFirst({
        where: eq(sections.name, s.name)
      });

      if (existingSection) {
        console.log(`Section "${s.name}" already exists in library. Updating content JSON.`);
        await db.update(sections)
          .set({ contentJson: s.contentJson })
          .where(eq(sections.id, existingSection.id));
        targetSections.push(existingSection);
      } else {
        const hash = crypto.randomBytes(16).toString('hex');
        const [created] = await db.insert(sections).values({
          name: s.name,
          type: s.type,
          variant: 'default',
          identityHash: hash,
          contentJson: s.contentJson,
          status: 'published',
        }).returning();
        console.log(`Created new section "${s.name}".`);
        targetSections.push(created);
      }
    }

    // Insert Template
    const templateSlug = slugify(tData.name) + '-' + Date.now();
    const [template] = await db.insert(templates).values({
      name: tData.name,
      slug: templateSlug,
      description: tData.description,
      status: 'active',
    }).returning();

    // Map Section Instances to Template
    await db.insert(templateSections).values(
      targetSections.map((s, i) => ({
        templateId: template.id,
        sectionLibraryId: s.id,
        type: s.type,
        variant: s.variant || 'default',
        contentJson: tData.sections[i].contentJson,
        orderIndex: i,
      }))
    );

    console.log(`Successfully created Template "${tData.name}" with ID:`, template.id);
  }

  console.log('\n--- TEMPLATE SEEDING COMPLETED SUCCESSFULLY ---');
}

main().catch(console.error).finally(() => process.exit(0));
