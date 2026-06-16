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
  resultsHtml: string;
  resultsItems: string[];
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
    date: 'December 10, 2023',
    topic: 'ERP Solutions',
    industries: ['Retail'],
    image: '/Case-studies/image 103-7.png',
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
    solutionHtml: '<p>ebizframe ERP is being implemented for the following functions:</p>',
    solutionModules: [
      { name: 'Finance', icon: '/Case-studies details/Container/finance-strategy_svgrepo.com.png' },
      { name: 'Sales', icon: '/Case-studies details/sales--connect_1_.png' },
      { name: 'Material Management', icon: '/Case-studies details/Container/finance-strategy_svgrepo.com.png' }
    ],
    resultsHtml: '<p>The client is experiencing the following benefits from ebizframe:</p>',
    resultsItems: [
      'Accurate stock balances',
      'Real-time reporting',
      'Tighter security and control over data and workflows',
      'Better visibility for top management with consolidated business reports',
      'Seamless communication across different departments and branches'
    ]
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
