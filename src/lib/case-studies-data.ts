export interface CaseStudyPost {
  slug: string;
  badge: string;
  title: string;
  date: string;
  topic: string;
  industries: string[];
  industry?: string;
  description?: string;
  image: string;
  authors: { name: string; role: string; avatar: string }[];
  overviewHtml: string;
  overviewImages: string[];
  challengeHtml: string;
  challengeImage: string;
  solutionHtml: string;
  solutionModules: { name: string; icon: string }[];
  resultsHtml?: string;
  resultsItems?: string[];
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  dateColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  overviewTitle?: string;
  overviewParagraphs?: string[];
  challengeTitle?: string;
  challengeDescription?: string;
  solutionsTitle?: string;
  solutionsDescription?: string;
  resultsTitle?: string;
  resultsSubtitle?: string;
  resultsCtaDescription?: string;
}

export const defaultCaseStudies: CaseStudyPost[] = [
  {
    slug: 'ghana-leading-producer-wood-products',
    badge: 'ebizframe',
    title: 'Ghana\'s leading Producer of Wood Products opts ebizframe ERP',
    date: 'December 10, 2023',
    topic: 'Manufacturing',
    industries: ['Manufacturing'],
    image: '/Case-studies/image 103.png',
    authors: [
      { name: 'Benjamin Thomson', role: 'Chief Engineer', avatar: '/Case-studies details/image 104.png' },
    ],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'top-cosmetics-manufacturers-drc',
    badge: 'ebizframe',
    title: 'Top Cosmetics Manufacturers in DRC opts for ebizframe ERP',
    date: 'December 10, 2023',
    topic: 'FMCG',
    industries: ['FMCG', 'Manufacturing'],
    image: '/Case-studies/image 103-1.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'thika-motors-kenya-opts-ebizframe',
    badge: 'ebizframe',
    title: 'Thika Motors, Kenya chooses ebizframe ERP for their country wide operations',
    date: 'December 10, 2023',
    topic: 'Retail',
    industries: ['Retail', 'Manufacturing'],
    image: '/Case-studies/image 103-2.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'renowned-car-rental-firm-ebizframe',
    badge: 'ebizframe',
    title: 'Renowned Car Rental firm instates trust in ebizframe',
    date: 'December 10, 2023',
    topic: 'CRM Solutions',
    industries: ['Retail'],
    image: '/Case-studies/image 103-3.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'ebizframe-helps-cotton-garment',
    badge: 'ebizframe',
    title: 'Read how ebizframe helped a cotton garment manufacturer to automate',
    date: 'December 10, 2023',
    topic: 'ERP Solutions',
    industries: ['Manufacturing'],
    image: '/Case-studies/image 103-4.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'ebizframe-success-story-leading-steel',
    badge: 'ebizframe',
    title: 'Read ebizframe\'s success story with leading steel products maker in Uganda',
    date: 'December 10, 2023',
    topic: 'ERP Solutions',
    industries: ['Manufacturing'],
    image: '/Case-studies/image 103-5.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'leading-uganda-sugar-company',
    badge: 'ebizframe',
    title: 'Leading Uganda\'s Sugar Company opts for ebizframe ERP',
    date: 'December 10, 2023',
    topic: 'ERP Solutions',
    industries: ['FMCG', 'Manufacturing'],
    image: '/Case-studies/image 103-6.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  },
  {
    slug: 'leading-retail-chain-drc-opts-ebizframe-erp',
    badge: 'ebizframe',
    title: 'Leading Retail Chain in DRC opts for ebizframe ERP',
    date: 'December 18, 2025',
    topic: 'ERP Solutions',
    industries: ['Retail'],
    image: '/Case-studies details/right_card.png',
    bgColor: 'linear-gradient(135deg, #1e2445 0%, #292048 100%)',
    badgeBgColor: '#ffffff',
    badgeBorderColor: '#7c3aed',
    badgeText: 'Caetrory Name',
    badgeTextColor: '#7c3aed',
    dateColor: '#ffffff',
    titleColor: '#ffffff',
    description: 'About the Client The client is a wholesaler & retailer of FMCG products. They have been doing this business for the past 20 years. The company started its operations in a small shop and has now grown into a large trading house with three branches in Accra. They supply products such as rice, sugar, edible oil, detergent, etc.',
    descriptionColor: '#e2e8f0',
    overviewTitle: 'Overview',
    overviewParagraphs: [
      'The client is a well-established wholesaler and retailer of FMCG products with over 20 years of experience in the industry. What began as a small neighborhood shop has steadily evolved into a large and trusted trading business known for its strong customer relationships, reliable service, and consistent market presence. Through dedication, operational efficiency, and a deep understanding of customer needs, the company has built a solid reputation in the FMCG sector.',
      'Over the years, the business has expanded significantly and now operates through three major branches located across Accra. This expansion reflects the company\'s continuous growth and increasing demand for its products within the market. By maintaining strong supplier networks and efficient distribution practices, the company has been able to serve a wide customer base ranging from retailers and supermarkets to local businesses and individual consumers.',
      'The company supplies a wide range of essential FMCG products including rice, sugar, edible oil, detergents, and other daily-use consumer goods. Their focus on product availability, competitive pricing, and dependable delivery has helped them become a preferred partner for many customers. With decades of industry experience and a growing operational network, the company continues to strengthen its position as a leading FMCG trading business in the region.'
    ],
    challengeTitle: 'The Challenge',
    challengeDescription: '<p>The retail chain was previously using locally developed software. As the company grew exponentially in the last few years, due to lack of a unified system across all their branches, they started facing a lot of difficulties in managing operations. To ensure they met their business objectives, they identified the need to implement a robust and comprehensive ERP software solution. One of the major challenges they faced was related to delayed order fulfillment, discrepancies in stock levels, and inability to track goods in transit accurately.</p>',
    authors: [
      { name: 'Benjamin Thomson', role: 'Head Designer', avatar: '/Case-studies details/image 104.png' },
      { name: 'Grace Taylor', role: 'Project Manager', avatar: '/Case-studies details/image 108.png' },
      { name: 'Andrew Wilson', role: 'System Architect', avatar: '/Case-studies details/image 104.png' },
    ],
    overviewHtml: '<p>The renowned retail chain in Democratic Republic of Congo (DRC) has been operating for over 20 years. They deal in wholesale and retail trade of consumer goods, household items, cosmetics, electronics, home appliances, and various other products.</p><p>With a constantly expanding footprint and a growing product catalog across various segments, managing the supply chain efficiently while retaining competitive edge had become a challenge. Disparate systems, manual processes, and lack of real-time visibility across the expanding network affected decision-making speed and accuracy.</p>',
    overviewImages: [
      '/Case-studies details/image 105.png',
      '/Case-studies details/image 106.png',
      '/Case-studies details/image 107.png'
    ],
    challengeHtml: '<p>The retail chain was previously using locally developed software. As the company grew exponentially in the last few years, due to lack of a unified system across all their branches, they started facing a lot of difficulties in managing operations. To ensure they met their business objectives, they identified the need to implement a robust and comprehensive ERP software solution. One of the major challenges they faced was related to delayed order fulfillment, discrepancies in stock levels, and inability to track goods in transit accurately.</p>',
    challengeImage: '/Case-studies details/Frame 216.png',
    solutionsTitle: 'ESS Solution Choice',
    solutionsDescription: 'ebizframe ERP is to be implemented for the following functions',
    solutionHtml: '<p>ebizframe ERP is being implemented for the following functions:</p>',
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
  },
  {
    slug: 'leading-ghanian-oil-gas',
    badge: 'ebizframe',
    title: 'Leading Ghanian Oil & Gas Engineering Company opts for ebizframe ERP',
    date: 'December 10, 2023',
    topic: 'ERP Solutions',
    industries: ['Manufacturing'],
    image: '/Case-studies/image 103-8.png',
    authors: [],
    overviewHtml: '<p>Overview pending.</p>',
    overviewImages: [],
    challengeHtml: '<p>Challenge pending.</p>',
    challengeImage: '',
    solutionHtml: '<p>Solution pending.</p>',
    solutionModules: [],
    resultsHtml: '<p>Results pending.</p>',
    resultsItems: []
  }
];
