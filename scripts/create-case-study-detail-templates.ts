import 'dotenv/config';
import { db } from '../src/lib/db';
import { pages, pageSections, templates, templateSections, sections, categories } from '../src/lib/db/schema';
import { defaultCaseStudies } from '../src/lib/case-studies-data';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('Starting Case Study Details template seeding...');

  try {
    // 1. Ensure the 'case-study-detail' section exists in section_library
    const type = 'case-study-detail';
    const name = 'Case Study Detail';
    const identityHash = crypto.createHash('sha256').update(type + name).digest('hex');
    
    let section = await db.query.sections.findFirst({
      where: eq(sections.identityHash, identityHash),
    });

    if (!section) {
      const [newSection] = await db.insert(sections).values({
        name,
        type,
        identityHash,
        contentJson: {},
        status: 'published',
      }).returning();
      section = newSection;
      console.log('Created section: Case Study Detail');
    } else {
      console.log('Section "Case Study Detail" already exists.');
    }

    // 2. Ensure "Case Study Details Template" exists
    let template = await db.query.templates.findFirst({
      where: eq(templates.slug, 'case-study-details-template'),
    });

    if (template) {
      console.log('Template already exists. Cleared old template sections.');
      await db.delete(templateSections).where(eq(templateSections.templateId, template.id));
    } else {
      // Find category
      let category = await db.query.categories.findFirst({
        where: eq(categories.slug, 'case-studies'),
      });
      if (!category) {
         const [c] = await db.insert(categories).values({ name: 'Case Studies', slug: 'case-studies' }).returning();
         category = c;
      }

      const [newTemplate] = await db.insert(templates).values({
        name: 'Case Study Details Template',
        slug: 'case-study-details-template',
        description: 'Standard template for individual case studies',
        categoryId: category.id,
        status: 'active'
      }).returning();
      template = newTemplate;
      console.log('Created template: Case Study Details Template');
    }

    // Add section to template with default content so preview looks exactly like mockup
    const defaultTemplateContent = {
      title: 'Leading Retail Chain in DRC opts for ebizframe ERP',
      titleColor: '#ffffff',
      bgColor: 'linear-gradient(135deg, #1e2445 0%, #292048 100%)',
      badgeBgColor: '#ffffff',
      badgeBorderColor: '#7c3aed',
      badgeText: 'Caetrory Name',
      badgeTextColor: '#7c3aed',
      date: 'December 18, 2025',
      dateColor: '#ffffff',
      description: 'About the Client The client is a wholesaler & retailer of FMCG products. They have been doing this business for the past 20 years. The company started its operations in a small shop and has now grown into a large trading house with three branches in Accra. They supply products such as rice, sugar, edible oil, detergent, etc.',
      descriptionColor: '#e2e8f0',
      image: '/Case-studies details/right_card.png',
      overviewTitle: 'Overview',
      overviewParagraphs: [
        'The client is a well-established wholesaler and retailer of FMCG products with over 20 years of experience in the industry. What began as a small neighborhood shop has steadily evolved into a large and trusted trading business known for its strong customer relationships, reliable service, and consistent market presence. Through dedication, operational efficiency, and a deep understanding of customer needs, the company has built a solid reputation in the FMCG sector.',
        'Over the years, the business has expanded significantly and now operates through three major branches located across Accra. This expansion reflects the company\'s continuous growth and increasing demand for its products within the market. By maintaining strong supplier networks and efficient distribution practices, the company has been able to serve a wide customer base ranging from retailers and supermarkets to local businesses and individual consumers.',
        'The company supplies a wide range of essential FMCG products including rice, sugar, edible oil, detergents, and other daily-use consumer goods. Their focus on product availability, competitive pricing, and dependable delivery has helped them become a preferred partner for many customers. With decades of industry experience and a growing operational network, the company continues to strengthen its position as a leading FMCG trading business in the region.'
      ],
      overviewImages: [
        '/Case-studies details/image 105.png',
        '/Case-studies details/image 106.png',
        '/Case-studies details/image 107.png'
      ],
      challengeTitle: 'The Challenge',
      challengeDescription: '<p>They had been using locally developed software for several years. The company has grown multifold over the last few years. However, in the absence of an integrated system, they were facing a lot of difficulties in managing their operations. They felt the need to integrate their business functions with a comprehensive ERP Software solution in Ghana. One of the major challenges that the firm was facing was that there was no integration between disparate departments; they were unable to access data from multiple locations or when on the move. There was no proper control on inventory and neither were they able to generate MIS. After evaluating various options, they decided to go ahead with ebizframe because they felt that ERP System Ghana was the right solution for all their business needs.</p>',
      challengeImage: '/Case-studies details/image 108.png',
      solutionsTitle: 'ESS Solution Choice',
      solutionsDescription: 'ebizframe ERP is to be implemented for the following functions',
      solutionModules: [
        { name: 'Finance', icon: '/Case-studies details/finance-strategy_svgrepo.com.png' },
        { name: 'Sales', icon: '/Case-studies details/sales--connect_1_.png' },
        { name: 'Materials Management', icon: '/Case-studies details/Frame 216.png' }
      ],
      resultsTitle: 'The Results',
      resultsSubtitle: 'The client is expecting the following benefits from ebizframe :',
      resultsItems: [
        'Integrated Solution',
        'Financial Reporting',
        'Tighter control and process orientation with workflow',
        'Better visibility for top management with online user based Dashboards',
        'Better coordination between different departments and branches'
      ],
      resultsCtaDescription: '<p>For more information on how <a href="/contact-us">ebizframe</a> can help you transform your business, please leave your contact details in the contact form or mail us at <a href="mailto:marketing@essindia.com">marketing@essindia.com</a>.</p>'
    };

    await db.insert(templateSections).values({
      templateId: template.id,
      sectionLibraryId: section.id,
      type: section.type,
      orderIndex: 0,
      contentJson: defaultTemplateContent
    });

    // 3. Find the "Case Studies" root page
    let rootPage = await db.query.pages.findFirst({
      where: eq(pages.slug, 'studies')
    });
    
    if (!rootPage) {
      console.log('Case Studies root page not found. Creating it...');
      const parentTemplate = await db.query.templates.findFirst({
        where: eq(templates.slug, 'case-studies-template')
      });
      const [newRootPage] = await db.insert(pages).values({
        title: 'Case Studies',
        slug: 'studies',
        fullPath: '/case-studies',
        templateId: parentTemplate?.id || null,
        status: 'published',
        pageType: 'standard'
      }).returning();
      rootPage = newRootPage;
      console.log('Created Case Studies root page.');
    }

    // 4. Generate the 9 case studies
    for (let i = 0; i < defaultCaseStudies.length; i++) {
      const cs = defaultCaseStudies[i];
      console.log(`Processing: ${cs.title}...`);

      let page = await db.query.pages.findFirst({
        where: and(eq(pages.slug, cs.slug), eq(pages.parentId, rootPage.id)),
      });

      if (page) {
        await db.delete(pageSections).where(eq(pageSections.pageId, page.id));
        console.log(`  Page already exists. Cleared old sections.`);
      } else {
        const [newPage] = await db.insert(pages).values({
          title: cs.title,
          slug: cs.slug,
          fullPath: `/case-studies/${cs.slug}`,
          parentId: rootPage.id,
          templateId: template.id,
          status: 'published',
          pageType: 'standard'
        }).returning();
        page = newPage;
        console.log(`  Created new page.`);
      }

      const finalContent = {
        ...cs,
        bgColor: cs.bgColor || 'linear-gradient(135deg, #1e2445 0%, #292048 100%)',
        badgeBgColor: cs.badgeBgColor || '#ffffff',
        badgeBorderColor: cs.badgeBorderColor || '#7c3aed',
        badgeText: cs.badgeText || cs.topic || cs.industry || 'Caetrory Name',
        badgeTextColor: cs.badgeTextColor || '#7c3aed',
        date: cs.date || 'December 18, 2025',
        dateColor: cs.dateColor || '#ffffff',
        title: cs.title,
        titleColor: cs.titleColor || '#ffffff',
        description: cs.description || 'No description provided.',
        descriptionColor: cs.descriptionColor || '#e2e8f0',
        image: cs.image || '/Case-studies details/right_card.png',
        overviewTitle: cs.overviewTitle || 'Overview',
        overviewParagraphs: cs.overviewParagraphs || [
          'The client is a well-established wholesaler and retailer of FMCG products with over 20 years of experience in the industry. What began as a small neighborhood shop has steadily evolved into a large and trusted trading business known for its strong customer relationships, reliable service, and consistent market presence. Through dedication, operational efficiency, and a deep understanding of customer needs, the company has built a solid reputation in the FMCG sector.',
          'Over the years, the business has expanded significantly and now operates through three major branches located across Accra. This expansion reflects the company\'s continuous growth and increasing demand for its products within the market. By maintaining strong supplier networks and efficient distribution practices, the company has been able to serve a wide customer base ranging from retailers and supermarkets to local businesses and individual consumers.',
          'The company supplies a wide range of essential FMCG products including rice, sugar, edible oil, detergents, and other daily-use consumer goods. Their focus on product availability, competitive pricing, and dependable delivery has helped them become a preferred partner for many customers. With decades of industry experience and a growing operational network, the company continues to strengthen its position as a leading FMCG trading business in the region.'
        ],
        overviewImages: cs.overviewImages && cs.overviewImages.length > 0 ? cs.overviewImages : [
          '/Case-studies details/image 105.png',
          '/Case-studies details/image 106.png',
          '/Case-studies details/image 107.png'
        ],
        challengeTitle: cs.challengeTitle || 'The Challenge',
        challengeDescription: cs.challengeDescription || cs.challengeHtml || '<p>They had been using locally developed software for several years. The company has grown multifold over the last few years. However, in the absence of an integrated system, they were facing a lot of difficulties in managing their operations. They felt the need to integrate their business functions with a comprehensive ERP Software solution in Ghana. One of the major challenges that the firm was facing was that there was no integration between disparate departments; they were unable to access data from multiple locations or when on the move. There was no proper control on inventory and neither were they able to generate MIS. After evaluating various options, they decided to go ahead with ebizframe because they felt that ERP System Ghana was the right solution for all their business needs.</p>',
        challengeImage: cs.challengeImage || '/Case-studies details/image 108.png',
        solutionsTitle: cs.solutionsTitle || 'ESS Solution Choice',
        solutionsDescription: cs.solutionsDescription || cs.solutionHtml || 'ebizframe ERP is to be implemented for the following functions',
        solutionModules: (cs.solutionModules && cs.solutionModules.length > 0) ? cs.solutionModules : [
          { name: 'Finance', icon: '/Case-studies details/finance-strategy_svgrepo.com.png' },
          { name: 'Sales', icon: '/Case-studies details/sales--connect_1_.png' },
          { name: 'Materials Management', icon: '/Case-studies details/Frame 216.png' }
        ],
        resultsTitle: cs.resultsTitle || 'The Results',
        resultsSubtitle: cs.resultsSubtitle || cs.resultsHtml || 'The client is expecting the following benefits from ebizframe :',
        resultsItems: (cs.resultsItems && cs.resultsItems.length > 0) ? cs.resultsItems : [
          'Integrated Solution',
          'Financial Reporting',
          'Tighter control and process orientation with workflow',
          'Better visibility for top management with online user based Dashboards',
          'Better coordination between different departments and branches'
        ],
        resultsCtaDescription: cs.resultsCtaDescription || '<p>For more information on how <a href="/contact-us">ebizframe</a> can help you transform your business, please leave your contact details in the contact form or mail us at <a href="mailto:marketing@essindia.com">marketing@essindia.com</a>.</p>'
      };

      // Add the case-study-detail section with the dummy content
      await db.insert(pageSections).values({
        pageId: page.id,
        sectionLibraryId: section.id,
        type: section.type,
        name: 'Case Study Detail',
        orderIndex: 0,
        content: finalContent
      });
    }

    console.log('Successfully seeded all 9 Case Studies!');

  } catch (error) {
    console.error('Failed to seed case studies:', error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
}).finally(() => process.exit(0));
