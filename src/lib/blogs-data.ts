export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  fullPath?: string;
  date: string;
  topic: string;
  industries: string[];
  author: BlogAuthor;
}

export const defaultBlogs: BlogPost[] = [
  {
    title: 'How Power BI Services Fix Multi-System Data Mismatches',
    description: 'In most enterprise environments, data flows from CRM platforms, local databases, and legacy solutions. If not managed properly, this leads to costly reconciliation delays and errors.',
    image: '/blog-1.png',
    slug: 'how-power-bi-services-fix-multi-system-data-mismatches',
    date: 'May 15, 2026',
    topic: 'Business Intelligence',
    industries: ['Industries', 'FMCG'],
    author: {
      name: 'Tracey Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tracey'
    }
  },
  {
    title: 'How RPA Services Eliminate Bottlenecks in High-Volume Operations',
    description: 'Eliminating operational bottlenecks is key for growth. How RPA services enable organizations to scale operations, automate routine tasks, and free up valuable employee time.',
    image: '/service-rpa.png',
    slug: 'how-rpa-services-eliminate-bottlenecks-in-high-volume-operations',
    date: 'Mar 05, 2026',
    topic: 'ERP Solutions',
    industries: ['Manufacturing'],
    author: {
      name: 'Jason Francisco',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason'
    }
  },
  {
    title: 'Reduce Reporting Time by 70% with AI in BI',
    description: 'Reporting doesn\'t have to be a slow, manual process. Learn how integrating artificial intelligence into Business Intelligence dashboards optimize data processing pipeline speed.',
    image: '/service-bi.png',
    slug: 'reduce-reporting-time-by-70-percent-with-ai-in-bi',
    date: 'March 01, 2026',
    topic: 'IoT Solutions',
    industries: ['FMCG'],
    author: {
      name: 'Elizabeth Slavin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth'
    }
  },
  {
    title: 'Web Design Trends in 2026 You Can\'t Ignore If You Want More Traffic',
    description: 'Web design is evolving faster than ever. Stay ahead of your competitors with the top design trends for 2026, focusing on responsive layout strategies and interactive micro-animations.',
    image: '/blog-2.png',
    slug: 'web-design-trends-in-2026-you-cant-ignore-if-you-want-more-traffic',
    date: 'April 15, 2026',
    topic: 'Mobile App Solutions',
    industries: ['Retail'],
    author: {
      name: 'Ernie Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ernie'
    }
  },
  {
    title: 'How Does an After Sales Service App Improve Service Visibility and Response Time',
    description: 'Discover how mobile after-sales service apps enhance customer satisfaction, improve logistics, and reduce field agent response times through automated scheduling.',
    image: '/ind-logistics.png',
    slug: 'how-does-an-after-sales-service-app-improve-visibility',
    date: 'April 08, 2026',
    topic: 'After-Sales Service App',
    industries: ['Electronics'],
    author: {
      name: 'Eric Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eric'
    }
  },
  {
    title: 'Is Your Web Development Company Hurting Your SEO?',
    description: 'Web development and SEO go hand-in-hand. Make sure your developer isn\'t tanking your search engine rankings with heavy script bundle sizes, poor rendering, and lack of markup.',
    image: '/blog-3.png',
    slug: 'is-your-web-development-company-hurting-your-seo',
    date: 'April 02, 2026',
    topic: 'Mobile App Solutions',
    industries: ['Industries'],
    author: {
      name: 'Tracey Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tracey'
    }
  },
  {
    title: 'What Does Business Efficiency Look Like with the Right Enterprise IT Solutions?',
    description: 'Achieving peak operational efficiency requires the right digital foundations. Explore how custom enterprise resource planning (ERP) platforms transform company capabilities.',
    image: '/service-erp.png',
    slug: 'what-does-business-efficiency-look-like',
    date: 'August 20, 2022',
    topic: 'CRM Solutions',
    industries: ['Pharma'],
    author: {
      name: 'Jason Francisco',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason'
    }
  },
  {
    title: 'How do Sales force applications turn manual sales tracking,',
    description: 'Sales force automation removes human errors from client tracking. Learn how custom applications keep sales representatives coordinated in real time with automated logs.',
    image: '/ind-erp.png',
    slug: 'how-do-sales-force-applications-turn-manual-sales-tracking',
    date: 'August 20, 2022',
    topic: 'Sales Force Automation',
    industries: ['Retail'],
    author: {
      name: 'Elizabeth Slavin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth'
    }
  },
  {
    title: 'How Robotic Process Automation Helps FMCG Teams Prevent Inventory',
    description: 'RPA software helps FMCG distribution channels predict demand. Learn how automated inventory tracking prevent stockout issues and shipping delays.',
    image: '/why-ess-main.png',
    slug: 'how-robotic-process-automation-helps-fmcg-teams',
    date: 'August 20, 2022',
    topic: 'ERP Solutions',
    industries: ['FMCG'],
    author: {
      name: 'Ernie Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ernie'
    }
  }
];
