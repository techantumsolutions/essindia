'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSectionDefinition } from '@/lib/cms/section-registry';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';
import { mergeSchemaWithContent } from './field-utils';
import type { JsonValue } from './field-utils';

export interface PageSection {
  id: string;
  type: string;
  variant: string | null;
  name: string | null;
  content: Record<string, unknown>;
  orderIndex: number;
  isActive: boolean;
}

const BLOG_DETAIL_TABS: Record<string, string[]> = {
  basic: ['title', 'category', 'industries', 'authorName', 'authorAvatar', 'date', 'image', 'description', 'contentHtml'],
  hero: ['badgeText', 'headingText', 'subheadingText', 'bgImage'],
  highlights: ['highlights', 'conclusionHtml']
};

const TESTIMONIALS_TABS: Record<string, string[]> = {
  hero: [
    'bgColor',
    'badgeBgColor',
    'badgeText',
    'badgeTextColor',
    'title',
    'titleColor',
    'description',
    'descriptionColor',
    'bgImage'
  ],
  testimonials: ['testimonials']
};

const CASE_STUDY_DETAIL_TABS: Record<string, string[]> = {
  hero: [
    'bgColor',
    'badgeBgColor',
    'badgeBorderColor',
    'badgeText',
    'badgeTextColor',
    'date',
    'dateColor',
    'title',
    'titleColor',
    'description',
    'descriptionColor',
    'image'
  ],
  overview: ['overviewTitle', 'overviewParagraphs', 'overviewImages'],
  challenge: ['challengeTitle', 'challengeDescription', 'challengeImage'],
  ess: ['solutionsTitle', 'solutionsDescription', 'solutionModules'],
  results: ['resultsTitle', 'resultsSubtitle', 'resultsItems', 'resultsCtaDescription']
};

const DEFAULT_CASE_STUDY_CONTENT: Record<string, any> = {
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
  challengeDescription: '<p>The retail chain was previously using locally developed software. As the company grew exponentially in the last few years, due to lack of a unified system across all their branches, they started facing a lot of difficulties in managing operations. To ensure they met their business objectives, they identified the need to implement a robust and comprehensive ERP software solution. One of the major challenges they faced was related to delayed order fulfillment, discrepancies in stock levels, and inability to track goods in transit accurately.</p>',
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

const DEFAULT_BLOG_CONTENT: Record<string, any> = {
  title: '',
  category: '',
  authorName: '',
  authorAvatar: '',
  date: '',
  image: '',
  description: '',
  contentHtml: '',
  badgeText: '',
  headingText: '',
  subheadingText: '',
  bgImage: '',
  highlights: [{ title: '', content: '', icon: '' }],
  conclusionHtml: ''
};

const DEFAULT_BLOG_LIST_CONTENT: Record<string, any> = {
  badgeText: 'Latest Blogs',
  headingText: 'Press & Media Resources',
  subheadingText: 'Everything journalists, analysts, and partners need to cover ESS — from brand assets to company facts.',
  bgImage: '',
  topics: [
    'Business Intelligence',
    'ERP Solutions',
    'IoT Solutions',
    'Mobile App Solutions',
    'CRM Solutions',
    'Sales Force Automation',
    'After-Sales Service App'
  ],
  industries: [
    'FMCG',
    'Pharma',
    'Manufacturing',
    'Retail',
    'Electronics'
  ]
};

const DEFAULT_TESTIMONIALS_CONTENT: Record<string, any> = {
  bgColor: '#0d0720',
  badgeBgColor: '#ffffff',
  badgeText: 'Testimonials',
  badgeTextColor: '#0d0720',
  title: 'Trusted by Businesses Worldwide',
  titleColor: '#ffffff',
  description: 'Empowering enterprises across industries with scalable digital solutions and intelligent automation. Trusted by growing businesses and enterprise teams across multiple countries for delivering innovation, efficiency, and measurable business outcomes.',
  descriptionColor: '#cbd5e1',
  bgImage: '',
  testimonials: [{ topic: 'ERP Solutions', industry: 'FMCG', companyName: '', quote: '', authorAvatar: '', authorName: '', authorTitle: '' }]
};

const DEFAULT_CONTACT_HERO_CONTENT: Record<string, any> = {
  bgColor: '#000000',
  badgeBgColor: '#ffffff',
  badgeText: 'Contact Our Team',
  badgeTextColor: '#5C2B6A',
  title: 'How can we help you\nsucceed?',
  titleColor: '#ffffff',
  description: 'Have questions about our platform or need a custom solution? Our experts are here to help your business scale with Finspring.',
  descriptionColor: '#d1d5db',
};

const DEFAULT_JOB_DETAIL_HERO_CONTENT: Record<string, any> = {
  bgColor: '#e4e4e7',
  buttonText: 'Back to Careers',
  buttonTextColor: '#64748b',
  buttonArrowColor: '#64748b',
  tag1BgColor: '#ffffff',
  tag1Text: 'Engineering',
  tag1TextColor: '#1e293b',
  tag2BgColor: '#ffffff',
  tag2Text: 'Full-time',
  tag2TextColor: '#1e293b',
  titleText: 'Microsoft .NET Backend Developer',
  titleTextColor: '#0f172a',
  items: [
    { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'India' },
    { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: '3-5 years' },
    { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'Full-time' },
    { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'Engineering' }
  ],
};

const DEFAULT_JOB_DETAIL_CONTENT: Record<string, any> = {
  aboutTitle: 'About the Role',
  aboutText: 'We are seeking a highly skilled Senior Software Engineer with expertise in .NET Core to design, develop, and maintain robust backend services.',
  sections: [
    {
      title: 'Key Responsibilities',
      items: [
        'Write clean, scalable, and maintainable code',
        'Design and develop RESTful APIs for backend services'
      ]
    }
  ],
  formHeader: 'Apply Now',
  formSubheader: 'Join our team',
};

const DEFAULT_ASS_HERO_CONTENT: Record<string, any> = {
  bgColor: '#161f38',
  badgeBgColor: '#ffffff',
  badgeBorderColor: '#ffffff',
  badgeText: 'After Sales Service',
  badgeTextColor: '#2a2b6a',
  title: 'Transform Customer\nSupport with Smart\nAfter-Sales Service',
  titleColor: '#ffffff',
  description: 'Digitize service operations, improve field productivity, and deliver faster customer resolution with a connected after-sales platform.',
  descriptionColor: '#cbd5e1',
  button1BgColor: '#2a2b6a',
  button1BorderColor: '#2a2b6a',
  button1Text: 'Request Demo',
  button1TextColor: '#ffffff',
  button1Url: '/contact-us',
  button2BgColor: '#ffffff',
  button2BorderColor: '#ffffff',
  button2Text: 'Explore Features',
  button2TextColor: '#2a2b6a',
  button2Url: '#features',
  image: '/App-After Sales Service/002b2026-6c0c-4820-958f-344b26611bc6 1.png'
};

const DEFAULT_ASS_EXPERIENCE_CONTENT: Record<string, any> = {
  title: 'Improve Customer Experience and Loyalty with our After-Sales Service App',
  mediaUrl: '/App-After Sales Service/Rectangle 193.png',
  videoUrl: ''
};

const DEFAULT_ASS_CTA_CONTENT: Record<string, any> = {
  bgColor: '#eff3f8',
  title: 'Future-Ready Oracle Database Strategy',
  titleColor: '#5b45b2',
  description: 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.',
  descriptionColor: '#374151',
  buttonText: 'Explore Your Upgrade Roadmap',
  buttonUrl: '#',
  buttonBgColor: '#fcc42c',
  buttonTextColor: '#000000'
};

const DEFAULT_AOM_HERO_CONTENT: Record<string, any> = {
  bgColor: '#0f172a',
  badgeBgColor: '#ffffff',
  badgeBorderColor: 'transparent',
  badgeText: 'Enterprise Mobility Solutions',
  badgeTextColor: '#2a2b6a',
  title: 'Empowering Businesses Through Enterprise Mobility',
  titleColor: '#ffffff',
  description: 'Empower your workforce with intelligent mobile applications that streamline operations, improve collaboration, and enable real-time business access from anywhere.',
  descriptionColor: '#cbd5e1',
  button1BgColor: '#1a1f4e',
  button1BorderColor: '#1a1f4e',
  button1Text: 'Get started',
  button1TextColor: '#ffffff',
  button1Url: '/contact-us',
  button2BgColor: '#ffffff',
  button2BorderColor: '#ffffff',
  button2Text: 'Explore ROI Calculator',
  button2TextColor: '#2a2b6a',
  button2Url: '#',
  image: '/App- App over view (mobile app)/f3273dba-dc3e-435a-bf5b-2c68d5a7ccd1 1.png'
};

const DEFAULT_AOM_SOLUTIONS_CONTENT: Record<string, any> = {
  title: 'Enterprise Mobility Solutions',
  description: 'Modern businesses rely on Enterprise Mobility Solutions to empower teams with real-time access, seamless collaboration, and efficient business operations from anywhere. At ESS Mobile Apps, we build intelligent, workflow-driven mobile applications using modern PWA technology, delivering seamless experiences across iOS, Android, and Windows platforms.',
  image: '/App- App over view (mobile app)/image 78.png',
  items: [
    {
      icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
      title: 'Mobile SFA',
      description: 'Sales Force Automation app to streamline field sales operations and improve team productivity.'
    },
    {
      icon: '/App- App over view (mobile app)/crm-crm_svgrepo.com.png',
      title: 'ebizframe CRM',
      description: 'Smart CRM application to manage customer interactions, sales activities, and team performance efficiently.'
    }
  ]
};

const DEFAULT_AOM_WORKSPACE_CONTENT: Record<string, any> = {
  title: 'Explore every mobile business application from one intelligent workspace.',
  categories: [
    {
      name: 'SALES OPERATIONS',
      tabs: [
        {
          label: 'SFA',
          desc: 'Sales force automation',
          icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
          contentTitle: 'ESS Mobile SFA',
          contentDescription: 'Increase SFA productivity by equipping your sales team with real-time customer data, order booking status, material availability, and automated workflow procedures.',
          contentImage: '/App- App over view (mobile app)/dashboard 1.png',
          benefits: ['Lead Management', 'Order Booking', 'Activity Scheduling', 'Route Planning'],
          ctaText: 'Get started',
          ctaUrl: '#'
        },
        {
          label: 'CRM',
          desc: 'Customer relationship hub',
          icon: '/App- App over view (mobile app)/crm-crm_svgrepo.com.png',
          contentTitle: 'ESS CRM',
          contentDescription: 'Mobile Sales Force Automation (SFA) App is an Enterprise Mobility Solution. The sales team uses this app for Attendance, Order Booking, Customer Registration, Customer Order Payment follow-up, Route / Tour Plan, Stock inquiry, Stock Request, Sales Return, Collection, Day Close Activity, Van Sales, and more. Meanwhile, sales managers can track their salesmen\'s locations along with an overview of their activities.',
          contentImage: '/App- App over view (mobile app)/dashboard 1.png',
          benefits: ['Lead Management', 'Customer Tracking', 'Activity Scheduling', 'Sales Pipeline Visibility', 'Performance Analytics', 'Mobile Accessibility'],
          ctaText: 'Get started',
          ctaUrl: '#'
        },
        {
          label: 'Van Sales',
          desc: 'Direct store delivery',
          icon: '/App- App over view (mobile app)/van-facing-left_svgrepo.com.png',
          contentTitle: 'ESS Van Sales',
          contentDescription: 'Optimize route deliveries and store execution with real-time pricing, print invoice on the go, stock replenishment, and payment collection tracking.',
          contentImage: '/App- App over view (mobile app)/dashboard 1.png',
          benefits: ['Invoice Printing', 'Route Delivery', 'Payment Collection', 'Inventory Sync'],
          ctaText: 'Get started',
          ctaUrl: '#'
        }
      ]
    }
  ]
};

const DEFAULT_FMCG_HERO_CONTENT: Record<string, any> = {
  bgColor: '#4b4685',
  badgeBgColor: '#7142D7',
  badgeBorderColor: '#7167be',
  badgeText: 'FMCG',
  badgeTextColor: '#ffffff',
  title: 'optimize inventory\nmaximize sales',
  titleColor: '#ffffff',
  description: 'Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.',
  descriptionColor: '#ffffff',
  buttonBgColor: '#fcc42c',
  buttonBorderColor: '#fcc42c',
  buttonText: 'Book your Demo',
  buttonTextColor: '#2b2a6c',
  buttonUrl: '#',
  image: '/BI-industy solution-FMGC/2b58cf43-2428-4667-ac1c-680abeb784a1 1.png'
};

const DEFAULT_FMCG_LOGOS_CONTENT: Record<string, any> = {
  logos: [
    { image: '/BI-industy solution-FMGC/1704524770_microsoft erp-min 1.png', alt: 'Microsoft Dynamics' },
    { image: '/BI-industy solution-FMGC/1704524759_oracle erp-min 1.png', alt: 'Oracle E-Business Suite' },
    { image: '/BI-industy solution-FMGC/1704524802_salesforce erp-min 1.png', alt: 'Salesforce CRM' },
    { image: '/BI-industy solution-FMGC/1704524792_sage erp-min 1.png', alt: 'Sage ERP' },
    { image: '/BI-industy solution-FMGC/1704524780_infor erp-min 1.png', alt: 'Infor ERP' },
    { image: '/BI-industy solution-FMGC/1711797804_SAP LOGO 1.png', alt: 'SAP ERP' }
  ]
};

const DEFAULT_FMCG_OVERVIEW_CONTENT: Record<string, any> = {
  title: 'FMCG Business Intelligence Services | Powered by AI',
  paragraphs: [
    'We deliver Business Intelligence services built specifically for FMCG businesses, enabling leaders to clearly see sales, inventory, distribution, and supply chain performance. Our AI-powered BI helps answer three critical questions: what is happening, why it is happening, and what to do next, so decisions are made on time.',
    'FMCG teams often face delayed decisions because sales, inventory, and distribution data is spread across distributors, POS systems, ERP platforms, accounting tools, and spreadsheets. As a result, teams rely on manually compiled reports; numbers do not always match across departments, and insights arrive too late to act in fast-moving markets.',
    'We address this by working closely with your teams to unify historical and live FMCG data into a single source of truth. Using proven FMCG KPIs and pre-built dashboards where applicable, we deliver custom BI solutions faster and at lower cost.'
  ],
  image: '/BI-industy solution-FMGC/image 53.png'
};

const DEFAULT_FMCG_TABS_CONTENT: Record<string, any> = {
  title: 'FMCG BI Personas',
  tabs: [
    {
      tabName: 'FMCG CEO',
      heading: 'FMCG CEO',
      subheading: 'Drive Overall Profitability and Brand Market Share',
      questions: [
        'How can we increase our overall FMCG operating margins?',
        'Which product categories are gaining market share and which are lagging?',
        'How is our new product launch performing across different states?',
        'Are we meeting our sustainability and governance targets?',
        'Where should we allocate capital for maximum ROI next quarter?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'FMCG CFO',
      heading: 'FMCG CFO',
      subheading: 'How Much Profit Is Lost in Schemes and Inventory?',
      questions: [
        'What is the real margin after discounts and trade schemes?',
        'How much inventory is slow-moving or aging?',
        'What is the cost of holding excess stock?',
        'Is capital blocked at distributor or warehouse level?',
        'Where are we losing margin without visibility?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'Sales Director',
      heading: 'Sales Director',
      subheading: 'Optimize Route-to-Market and Sales Executive Performance',
      questions: [
        'Which distributors are consistently failing to meet sales targets?',
        'How effective are our trade promotion schemes by region?',
        'Are sales representatives visiting their planned routes daily?',
        'What is the order fill rate across modern trade vs general trade?',
        'Which stock-keeping units (SKUs) have the highest velocity?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    },
    {
      tabName: 'Supply Chain Head',
      heading: 'Supply Chain Head',
      subheading: 'Improve Order Fill Rates and Logistics Efficiencies',
      questions: [
        'What is our on-time-in-full (OTIF) delivery rate to distributors?',
        'Where are the bottlenecks in our warehouse dispatch workflow?',
        'How can we reduce transport cost per case for key lanes?',
        'Which raw material suppliers are causing production delays?',
        'How accurate are our demand forecasts compared to actual sales?'
      ],
      image: '/BI-industy solution-FMGC/image 54.png'
    }
  ]
};

const DEFAULT_FMCG_ACTION_CONTENT: Record<string, any> = {
  title: 'AI in BI | From Data to Action',
  description: 'Our BI solution is powered by EVA, an AI-powered assistant embedded into our BI dashboards. It empowers users by allowing them to interact and communicate directly with their data. Users can ask questions in plain English and instantly receive clear, actionable insights. You can also attach external files such as PDFs and industry reports to provide additional context.',
  cards: [
    {
      badge: '01',
      title: 'What Changed',
      description: 'AI instantly highlights unusual shifts in sales, inventory, or performance.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 2.png',
      badgeBorderColor: '#ff9800',
      badgeTextColor: '#ff9800',
      badgeBgColor: '#fff8f0'
    },
    {
      badge: '02',
      title: 'Why It Changed',
      description: 'AI explains the key factors driving those changes, such as demand, pricing, or supply issues.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 3.png',
      badgeBorderColor: '#2196f3',
      badgeTextColor: '#2196f3',
      badgeBgColor: '#f0f8ff'
    },
    {
      badge: '03',
      title: 'What To Do Next',
      description: 'AI suggests actionable insights so leaders can respond quickly and confidently.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 4.png',
      badgeBorderColor: '#4caf50',
      badgeTextColor: '#4caf50',
      badgeBgColor: '#f1f9f1'
    }
  ]
};

const DEFAULT_FMCG_IMPACT_CONTENT: Record<string, any> = {
  title: 'FMCG BI That Delivers Measurable Financial Impact',
  cards: [
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 1.png',
      title: 'Reduce stock-outs by 20–40%'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 2.png',
      title: 'Cut slow-moving inventory by 10–15%'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 3.png',
      title: 'Improve scheme and promotion ROI'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 4.png',
      title: 'Increase secondary sales across markets'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 5.png',
      title: 'Release working capital from excess inventory'
    }
  ]
};

const DEFAULT_FMCG_CHALLENGES_CONTENT: Record<string, any> = {
  title: 'Why Smart FMCG Leaders Still Make Slow Decisions',
  cards: [
    {
      icon: '/BI-industy solution-FMGC/data_svgrepo.com.png',
      title: 'Store Sales Data Arrives Late',
      description: 'Daily store sales data is often available only after business hours or the next day. By the time leadership reviews performance, the opportunity to correct low sales or stock issues has already passed.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics-board-bussiness_svgrepo.com.png',
      title: 'Sales And Inventory Data Don’t Match',
      description: 'Sales data from POS systems, and inventory data from warehouses or stores frequently show different numbers. Teams spend time verifying data instead of acting on it, slowing down decision-making.'
    },
    {
      icon: '/BI-industy solution-FMGC/announcement-marketing-outline-2_svgrepo.com.png',
      title: 'Limited SKU-Level Inventory Visibility',
      description: 'Retailers lack a clear view of inventory at the individual SKU and store level. This leads to fast-moving products going out of stock in some locations while excess inventory builds in others.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-3.png',
      title: 'Forecasts Miss Real-Time Demand Changes',
      description: 'Demand forecasts rely heavily on historical data and do not adjust quickly to promotions, local events, or sudden changes in customer behavior. As a result, stock planning becomes inaccurate.'
    },
    {
      icon: '/BI-industy solution-FMGC/product_svgrepo.com.png',
      title: 'Manual Sales and Inventory Reporting',
      description: 'Sales and inventory reports are often created manually using spreadsheets. This process is time-consuming, error-prone, and delays access to critical performance insights.'
    },
    {
      icon: '/BI-industy solution-FMGC/favorite-chart_svgrepo.com.png',
      title: 'Supply Issues Identified After Stockouts',
      description: 'Supply or distribution problems are usually discovered only after products are already unavailable on shelves. This results in lost sales and poor customer experience.'
    }
  ]
};

const DEFAULT_FMCG_EMPOWER_CONTENT: Record<string, any> = {
  title: 'How Business Intelligence Empowers Leaders?',
  subtitle: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
  cards: [
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-1.png',
      title: 'Real-Time Store Sales Visibility',
      description: 'Business Intelligence brings store sales data from POS systems into live dashboards. FMCG leaders can monitor performance during the day and take action before sales opportunities are lost.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com.png',
      title: 'Single Source of Sales and Inventory Data',
      description: 'Business Intelligence unifies sales and inventory data into one consistent view. This removes confusion between teams and enables faster, more confident decisions.'
    },
    {
      icon: '/BI-industy solution-FMGC/box_svgrepo.com.png',
      title: 'SKU-Level Inventory Visibility Across Markets',
      description: 'Business Intelligence provides clear visibility into inventory at SKU and market levels. Leaders can quickly identify slow-moving products, stock gaps, and excess inventory.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-2.png',
      title: 'Real-Time Demand Forecasting',
      description: 'Business Intelligence continuously updates forecasts using current sales trends and demand signals. This helps FMCG teams respond quickly to market changes instead of relying only on past data.'
    },
    {
      icon: '/BI-industy solution-FMGC/my-qr-code_svgrepo.com.png',
      title: 'Automated Sales and Inventory Reporting',
      description: 'Business Intelligence automates reporting across systems and eliminates manual spreadsheets. Teams get timely, accurate insights without delays or errors.'
    },
    {
      icon: '/BI-industy solution-FMGC/supply-chain-optimization-02_svgrepo.com.png',
      title: 'Early Detection of Supply Issues',
      description: 'Business Intelligence monitors supply and distribution data continuously. Potential disruptions and stock risks become visible before stockouts occur.'
    }
  ]
};

const DEFAULT_FMCG_USE_CASES_CONTENT: Record<string, any> = {
  title: 'Business Intelligence Use Cases Across FMCG Operations',
  subtitle: 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.',
  tabs: [
    {
      tabName: 'Stock-Out & Availability',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Stock-Out & Availability',
      heading: 'Are You Losing Sales Due to Stock-Outs?',
      points: [
        'Prevent stock-outs at high-demand outlets',
        'Identify gaps in distributor and outlet coverage',
        'Ensure availability of fast-moving SKUs',
        'Reduce lost sales due to poor replenishment',
        'Maintain consistent on-shelf availability'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Primary vs Secondary Sales',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Primary vs Secondary Sales',
      heading: 'Unify Primary and Secondary Sales Pipelines',
      points: [
        'Compare factory dispatches with retail off-take data',
        'Identify high-performing regions and distributor sales trends',
        'Track inventory levels at distributor warehouses',
        'Optimize dispatch planning based on distributor sales velocity',
        'Identify slow-moving items in distributor supply chains'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Scheme & Promotion Analysis',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Scheme & Promotion Analysis',
      heading: 'Measure Trade Promotion Effectiveness',
      points: [
        'Analyze scheme ROI by product category and geographic area',
        'Compare sales uplift during promotional periods against base sales',
        'Verify if distributors are passing discounts to retailers',
        'Identify discount schemes that drive maximum volume growth',
        'Optimize promotional spend allocations for future schemes'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'SKU Performance & Movement',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'SKU Performance & Movement',
      heading: 'Optimize SKU Portfolio Performance',
      points: [
        'Identify high-margin, high-velocity SKUs (Stars)',
        'Track sales contribution of new product introductions (NPI)',
        'Monitor slow-moving and dead stock across regions',
        'Rationalize low-performing SKUs to reduce inventory cost',
        'Ensure product mix matches local regional preferences'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Distributor Performance',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Distributor Performance',
      heading: 'Monitor and Support Distributor Performance',
      points: [
        'Track distributor order fill rates and dispatch cycles',
        'Monitor outstanding payments and distributor credit limits',
        'Evaluate sales executive performance at distributor levels',
        'Identify underperforming distributors with high inventory levels',
        'Support high-potential distributors with targeted schemes'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    },
    {
      tabName: 'Demand Forecasting',
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      tag: 'Demand Forecasting',
      heading: 'Improve Demand Forecasting Accuracy',
      points: [
        'Incorporate secondary sales trends into demand models',
        'Adjust forecasts for seasonal trends, festivals, and school terms',
        'Collaborate on sales expectations with regional managers',
        'Reduce safety stock requirements at main factories',
        'Improve production scheduling alignment with market demand'
      ],
      buttonText: 'Case Studies',
      buttonUrl: '/case-studies'
    }
  ]
};

const DEFAULT_FMCG_INTEGRATIONS_CONTENT: Record<string, any> = {
  title: 'Data Sources We Integrate',
  subtitle: 'Each industry card now states the operational value clearly instead of burying it in broad text.',
  cards: [
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Google Products' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Pricing Software' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'Accounting Software' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'CRM' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'MIS Reports' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'SCM Software' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'POS' },
    { image: '/BI-industy solution-FMGC/Rectangle 150.png', title: 'External Data' }
  ]
};

const DEFAULT_FMCG_FAQ_CONTENT: Record<string, any> = {
  title: 'Frequently Asked Questions',
  subtitle: 'Get the information you need with our frequently asked questions.',
  faqs: [
    {
      question: 'What is Business Intelligence (BI)?',
      answer: 'Business Intelligence is how leaders turn raw data into clear, decision-ready insights. It connects data from across the business, explains what is happening and why, and highlights where attention is needed, so decisions are based on facts, not assumptions.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Which industries can benefit from Business Intelligence?',
      answer: 'Our BI solution caters extensively to FMCG, Retail, Manufacturing, Logistics, Healthcare, and Corporate Management, helping optimize routes, reduce stock-outs, and analyze sales performance.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Is Business Intelligence mobile-friendly?',
      answer: 'Yes! Our BI dashboards are completely responsive and accessible across all devices, including laptops, tablets, and smartphones, so you can track operations on the go.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Can Business Intelligence be customized to specific business needs?',
      answer: 'Absolutely. We design and tailor custom dashboards, metric calculations, and automated reports to fit the unique operational goals and data infrastructure of your business.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'What types of data sources does BI support?',
      answer: 'We integrate with a wide variety of data sources, including ERP systems (SAP, Oracle, Sage), POS terminals, CRM software, pricing engines, warehouse databases, and external flat files (CSV, Excel).',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'Can Business Intelligence tell what happened, why it happened, and what steps we should take next?',
      answer: 'Yes, powered by EVA, our AI-powered assistant, the BI platform analyzes historical data to detect anomalies, explains key contributors, and automatically recommends action steps.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    },
    {
      question: 'How soon can I start seeing measurable ROI from this BI solution?',
      answer: 'Most organizations witness direct financial returns, such as reduced inventory holding costs and improved promotion ROI, within the first 4 to 8 weeks of full integration.',
      arrowIcon: '/BI-industy solution-FMGC/arrow-right-circle_svgrepo.com.png'
    }
  ]
};

const DEFAULT_FMCG_CTA_CONTENT: Record<string, any> = {
  title: 'Enable Digital Transformation of Your Business with Our Wide Range of IT Services',
  buttonText: 'TALK TO OUR EXPERTS',
  buttonUrl: '/contact'
};

const DEFAULT_ROI_HERO_CONTENT: Record<string, any> = {
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
};

const DEFAULT_ROI_EXPLANATION_CONTENT: Record<string, any> = {
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
};

const DEFAULT_ROI_FORMULA_CONTENT: Record<string, any> = {
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
  image1: '/BI-ROI caluculator/Frame 297.png',
  image2: ''
};

const DEFAULT_ROI_USAGE_CONTENT: Record<string, any> = {
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
};

const DEFAULT_ORACLE_HERO_CONTENT: Record<string, any> = {
  bgColor: '#091E2E',
  badgeBgColor: '#ffffff',
  badgeBorderColor: 'transparent',
  badgeText: 'Oracle Forms to Oracle APEX Migration',
  badgeTextColor: '#2b2a6c',
  title: 'Oracle Forms to\nOracle APEX Migration',
  titleColor: '#ffffff',
  description: "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylife AI's XDO Framework",
  descriptionColor: '#ffffff',
  button1BgColor: '#2e2a72',
  button1BorderColor: '#2e2a72',
  button1Text: 'Get started',
  button1TextColor: '#ffffff',
  button1Url: '#',
  button2BgColor: '#ffffff',
  button2BorderColor: '#ffffff',
  button2Text: 'Explore ROI Calculator',
  button2TextColor: '#2e2a72',
  button2Url: '#',
  image: '/migration-orcl datebase upgrade and optimization/mygration-orcl datebase upgrade and optimization.png'
};

const DEFAULT_ORACLE_PARTNER_CONTENT: Record<string, any> = {
  image1: '/migration-orcl datebase upgrade and optimization/1704524759_oracle erp-min 1.png',
  text1: 'TRUSTED\nORACLE PARTNER',
  title2: '25+',
  description2: 'YEARS OF\nEXPERTISE',
  image3: '/migration-orcl datebase upgrade and optimization/db-copy_svgrepo.com.png',
  text3: 'ZERO-DOWNTIME\nMIGRATION EXPERTISET'
};

const DEFAULT_ORACLE_WHY_UPGRADE_CONTENT: Record<string, any> = {
  image: '/migration-orcl datebase upgrade and optimization/21c 1.png',
  title: 'WHY UPGRADE YOUR ORACLE DATABASE?',
  description: 'A modern database environment strengthens your entire ERP foundation.',
  points: [
    'End-of-life risks in legacy Oracle database versions',
    'Security patching requirements for unsupported Oracle databases',
    'Performance limitations in older Oracle database environments',
    'Compliance mandates for enterprise database systems',
    'Compatibility requirements for cloud infrastructure and modern platforms'
  ]
};

const DEFAULT_ORACLE_MIGRATION_FLOW_CONTENT: Record<string, any> = {
  title: '',
  steps: [
    {
      number: '01',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 1.png',
      title: 'Oracle Database Version Upgrade (11g → 19c / 21c)',
      description: 'Controlled database version migration with rollback strategy.'
    },
    {
      number: '02',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 2.png',
      title: 'Oracle Database Performance Tuning',
      description: 'Query optimization, indexing strategy, and workload balancing.'
    },
    {
      number: '03',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 3.png',
      title: 'Security Hardening',
      description: 'Patch management, user access controls, and compliance alignment.'
    },
    {
      number: '04',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 4.png',
      title: 'Backup & Disaster Recovery Validation',
      description: 'Data protection and business continuity planning.'
    },
    {
      number: '05',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 5.png',
      title: 'High Availability Configuration',
      description: 'Clustering and failover readiness for mission-critical systems.'
    }
  ]
};

const DEFAULT_ORACLE_FRAMEWORK_CONTENT: Record<string, any> = {
  title: 'OUR ORACLE DATABASE UPGRADE FRAMEWORK',
  subtitle: 'Other vendors say "migrations" but deliver headaches. Here\'s why we\'re different.',
  cards: [
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor.png',
      title: 'Database Health Assessment',
      description: 'Comprehensive evaluation of database performance, stability, and existing system architecture.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-1.png',
      title: 'Compatibility & Risk Analysis',
      description: 'Identify compatibility gaps, dependencies, and potential upgrade risks before execution.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-2.png',
      title: 'Structured Upgrade Execution',
      description: 'Planned and secure upgrade process with minimal downtime and controlled implementation.'
    },
    {
      image: '/migration-orcl datebase upgrade and optimization/Container+BackgroundColor-3.png',
      title: 'Post-Upgrade Performance Monitoring',
      description: 'Continuous monitoring and optimization to ensure improved performance and system reliability.'
    }
  ]
};

const DEFAULT_ORACLE_CTA_CONTENT: Record<string, any> = {
  title: 'Future-Ready Oracle Database Strategy',
  description: 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.',
  buttonText: 'Explore Your Upgrade Roadmap',
  buttonUrl: '/contact'
};

const DEFAULT_BI_HERO_CONTENT: Record<string, any> = {
  bgColor: '#f3f6fc',
  badgeBgColor: '#5e35b1',
  badgeBorderColor: 'transparent',
  badgeText: 'Power BI consulting for enterprise teams',
  badgeTextColor: '#ffffff',
  title: 'Turn scattered\nbusiness data into\nreal-time decisions.',
  titleColor: '#301c5c',
  description: 'ESS India helps enterprises design Power BI dashboards, predictive analytics, KPI reporting, and AI-driven insights that simplify decisions across departments.',
  descriptionColor: '#4b5563',
  button1BgColor: '#ffca28',
  button1BorderColor: '#ffca28',
  button1Text: 'Book your Demo',
  button1TextColor: '#000000',
  button1Url: '#',
  button2BgColor: '#5e35b1',
  button2BorderColor: '#5e35b1',
  button2Text: 'Case studies',
  button2TextColor: '#ffffff',
  button2Url: '#',
  image: '/Business intilligence/Frame 211.png'
};

const DEFAULT_BI_INTRO_CONTENT: Record<string, any> = {
  badge: 'From raw data to actionable insights — instantly.',
  title: 'AI-Driven BI That Reveals Revenue Leakage, Expiry Risks &\nHidden Profit Opportunities',
  description: 'Identify slow-moving stock, revenue gaps, expiry risks, and operational inefficiencies with\nAI-powered Business Intelligence.'
};

const DEFAULT_BI_INSIGHTS_CONTENT: Record<string, any> = {
  title: 'Turning Business Data Into Clear, Actionable Insights',
  items: [
    {
      icon: 'database',
      text: 'We turn scattered business data into clear, reliable, and actionable insights—so you understand what is happening, why it is happening, and what to do next on time.'
    },
    {
      icon: 'file-warning',
      text: 'Many organizations struggle with slow decision-making because data is spread across CRM, ERP, accounting systems, and spreadsheets, making reports hard to trust and insights slow to act on.'
    },
    {
      icon: 'trending-up',
      text: 'We solve this by analyzing your past and current data across systems and building custom BI dashboards tailored to your goals—using pre-built KPIs and dashboards to reduce implementation time and cost.'
    },
    {
      icon: 'shield-check',
      text: 'This creates a single source of truth that is continuously updated and easy to trust.'
    },
    {
      icon: 'users',
      text: 'Our BI services are built for leaders and teams in sales, finance, operations, and management who need fast, accurate insights to make confident decisions.'
    }
  ],
  rightImage: '/Business intilligence/image 44.png'
};

const DEFAULT_BI_TABS_CONTENT: Record<string, any> = {
  tabs: [
    {
      tabName: 'Leadership (CEOs / Directors)',
      tabDesc: 'Drive strategy. Lead with clarity.',
      heading: 'For CEOs: Strategic Clarity in Seconds',
      subheading: "Know Where You're Growing. Know Where You're Bleeding.",
      questions: [
        'Which business unit is truly profitable?',
        'Are we growing revenue or margin?',
        'Which products should we scale or stop?',
        'What will next quarter look like if trends continue?',
        'Where are we losing money without realizing it?'
      ],
      image: '/Business intilligence/image 50.png'
    },
    {
      tabName: 'Finance (CFOs)',
      tabDesc: 'Optimize performance. Maximize value.',
      heading: 'For CFOs: Real-Time Cash Flow & Margin Analysis',
      subheading: 'Pinpoint Revenue Leakage and Reduce Holding Costs.',
      questions: [
        'What is the real margin after discounts and schemes?',
        'How much inventory is blocked or slow-moving?',
        'Where is capital blocked at distributor levels?',
        'What is the cost of holding excess stocks?',
        'Are we optimizing our tax and compliance reporting?'
      ],
      image: '/Business intilligence/image 50.png'
    },
    {
      tabName: 'Sales Directors',
      tabDesc: 'Grow revenue. Strengthen pipeline.',
      heading: 'For Sales Directors: Route-to-Market Optimization',
      subheading: 'Track Distributor Performance and Sales Executive Efficiency.',
      questions: [
        'Which distributors fail to meet sales targets?',
        'How effective are our regional promotion schemes?',
        'Are sales reps visiting planned routes daily?',
        'What is the order fill rate across trade channels?',
        'Which products have the highest sales velocity?'
      ],
      image: '/Business intilligence/image 50.png'
    }
  ]
};

const DEFAULT_BI_HIGHLIGHT_STRIP_CONTENT: Record<string, any> = {
  items: [
    {
      icon: 'wand',
      text: 'Our AI-driven dashboards give you a 360° executive view across **sales, operations, finance, and inventory** – in real time.'
    },
    {
      icon: 'shield-check',
      text: 'Make strategic decisions with confidence, not assumptions.'
    }
  ]
};

const DEFAULT_BI_BUSINESS_IMPACT_CONTENT: Record<string, any> = {
  title: 'Business Impact',
  subtitle: "We don't build dashboards first. We start with business problems.",
  description: 'From identifying business challenges to measuring measurable outcomes, our AI-driven approach transforms raw data into meaningful business decisions. We focus on solving real business problems first – delivering actionable insights, smarter decisions, and measurable financial impact.',
  steps: [
    {
      number: '01',
      dotColor: '#f26522',
      cardBg: '#fff9f6',
      borderColor: 'rgba(242, 101, 34, 0.15)',
      icon: '/Business intilligence/Group.png',
      title: 'Problem',
      description: 'Identify the business gap',
      accentColor: '#f26522'
    },
    {
      number: '02',
      dotColor: '#fbb03b',
      cardBg: '#fffdf4',
      borderColor: 'rgba(251, 176, 59, 0.15)',
      icon: '/Business intilligence/question_svgrepo.com.png',
      title: 'Question',
      description: 'Ask the right question',
      accentColor: '#fbb03b'
    },
    {
      number: '03',
      dotColor: '#6b7a99',
      cardBg: '#f7f8fa',
      borderColor: 'rgba(107, 122, 153, 0.15)',
      icon: '/Business intilligence/idea_svgrepo.com.png',
      title: 'Insight',
      description: 'Generate real-time insight',
      accentColor: '#6b7a99'
    },
    {
      number: '04',
      dotColor: '#6f42c1',
      cardBg: '#faf8fe',
      borderColor: 'rgba(111, 66, 193, 0.15)',
      icon: '/Business intilligence/security_svgrepo.com.png',
      title: 'Decision',
      description: 'Enable confident decision',
      accentColor: '#6f42c1'
    },
    {
      number: '05',
      dotColor: '#00a699',
      cardBg: '#f4fbfb',
      borderColor: 'rgba(0, 166, 153, 0.15)',
      icon: '/Business intilligence/analytics-reference_svgrepo.com.png',
      title: 'Financial Impact',
      description: 'Measure financial outcome',
      accentColor: '#00a699'
    }
  ]
};

const DEFAULT_BI_ARCHITECTURE_CONTENT: Record<string, any> = {
  title: 'Business Intelligence Architecture',
  description: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
  image: '/Business intilligence/1cda2c6dff9b61013b46587de886637aad3247ff.png'
};

const DEFAULT_BI_EMPOWERMENT_CONTENT: Record<string, any> = {
  title: 'How Business Intelligence Empowers Leaders?',
  subtitle: 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.',
  cards: [
    {
      icon: '/Business intilligence/checklist-check-list-list_svgrepo.com.png',
      title: 'Faster, Confident Decision-Making',
      description: 'Leaders get clear answers when they need them, without questioning the numbers. Decisions are made quickly on trusted insights, enabling teams to act early, reduce risk, and capture opportunities.'
    },
    {
      icon: '/Business intilligence/handshake-deal_svgrepo.com.png',
      title: 'A Single Source of Truth Everyone Can Trust',
      description: 'Everyone works from the same accurate data, eliminating conflicting numbers and repeated validations. Teams spend less time reconciling reports and more time taking action, improving alignment and speed.'
    },
    {
      icon: '/Business intilligence/analytics-graph_svgrepo.com.png',
      title: 'Clear Visibility Into Business Health',
      description: 'Leaders see the full picture of performance in one place, without digging through multiple reports. Risks are identified early, strengths stand out, and decisions are made with clarity on where to focus.'
    },
    {
      icon: '/Business intilligence/analytics-graphic_svgrepo.com.png',
      title: 'Better Alignment and Accountability Across Teams',
      description: 'Teams stay aligned around shared goals with clear visibility into performance. Progress and ownership are easy to track, accountability improves, and issues are addressed early.'
    },
    {
      icon: 'Clock',
      title: 'Less Time Spent on Reporting, More Time on Strategy',
      description: 'Manual reporting is reduced, and updates reach leaders on time without follow-ups. Teams spend less time preparing reports and more time analyzing data, planning actions, and executing strategy.'
    },
    {
      icon: '/Business intilligence/statistics_svgrepo.com.png',
      title: 'Improved Profitability and Operational Control',
      description: 'Leaders gain clear visibility into costs, margins, and performance. Inefficiencies surface early, resources are used better, and opportunities are acted on faster, strengthening margins and control.'
    }
  ]
};

const DEFAULT_BI_INDUSTRIES_CONTENT: Record<string, any> = {
  title: 'Industries We Empower',
  description: 'At ESS India, we deliver industry-driven digital solutions that help businesses streamline operations, improve visibility, and accelerate growth. Our ERP, automation, and business intelligence platforms are designed to adapt to the unique workflows and operational challenges of different industries, including FMCG, Retail, Pharma, Manufacturing, and Trading & Distribution. By combining deep domain expertise with scalable technology, we enable organizations to optimize resources, enhance decision-making, and achieve long-term business transformation with confidence.',
  industries: [
    {
      title: 'FMCG',
      image: '/Business intilligence/Rectangle 140.png',
      description: 'Optimize supply chains, inventory, and distribution for faster-moving consumer markets.'
    },
    {
      title: 'Retail',
      image: '/Business intilligence/Rectangle 142.png',
      description: 'Deliver smarter retail operations with better customer insights and sales management.'
    },
    {
      title: 'Pharma',
      image: '/Business intilligence/Rectangle 141.png',
      description: 'Ensure compliance, streamline production, and improve operational efficiency in pharma businesses.'
    },
    {
      title: 'Trading & Distribution',
      image: '/Business intilligence/Rectangle 143.png',
      description: 'Manage procurement, warehousing, and distribution with complete business visibility.'
    }
  ]
};

const DEFAULT_BI_INDUSTRY_SERVICES_CONTENT: Record<string, any> = {
  title: 'Tailored Services Across Industries',
  subtitle: 'BI services deliver value across industries, but its real impact comes from how well insights are aligned with industry-specific challenges, metrics, and decision cycles. Our BI solutions built on Power BI are designed to reflect how each industry actually operates.',
  tabs: [
    {
      tabName: 'Retail',
      tabTitle: 'Protect Margin.\nPrevent Stock-Outs.',
      image: '/Business intilligence/Rectangle 150.png',
      points: [
        'Detect slow & dead stock',
        'Prevent stock-out losses',
        'Optimize store replenishment',
        'Improve category margins',
        'Compare branch performance'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'FMCG / Distribution',
      tabTitle: 'Optimize Routes.\nTrack Distributor Sales.',
      image: '/Business intilligence/Rectangle 140.png',
      points: [
        'Track route efficiency & frequency',
        'Monitor distributor sales targets',
        'Identify product leakage & returns',
        'Measure campaign performance',
        'Optimize stock dispatch schedules'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'Pharma / Healthcare',
      tabTitle: 'Track Batch Expiry.\nEnsure Compliance.',
      image: '/Business intilligence/Rectangle 141.png',
      points: [
        'Monitor batch numbers & expiry dates',
        'Track compliance & audit logs',
        'Optimize temperature-sensitive dispatch',
        'Measure regional sales rep targets',
        'Reduce returns of expired stock'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    },
    {
      tabName: 'Manufacturing',
      tabTitle: 'Monitor Production.\nReduce Wastage.',
      image: '/Business intilligence/Rectangle 143.png',
      points: [
        'Track machine cycle time & output',
        'Monitor batch wastage & scrap rates',
        'Analyze supply bottleneck timings',
        'Track preventative maintenance schedules',
        'Optimize raw materials inventory'
      ],
      buttonText: 'Case studies',
      buttonUrl: '#'
    }
  ]
};

const DEFAULT_RPA_HERO_CONTENT: Record<string, any> = {
  bgColor: 'linear-gradient(135deg, #a2b6cb 0%, #6e849d 100%)',
  badgeBgColor: '#ffffff',
  badgeText: 'Robotic Process Automation',
  badgeTextColor: '#27256b',
  title: 'Robotic Process Automation Solutions',
  titleColor: '#ffffff',
  description: 'ESS brings decades of business process improvement experience to help organizations identify automation opportunities, develop RPA workflows, and maintain a digital workforce that improves efficiency, accuracy, and long-term growth.',
  descriptionColor: '#f1f5f9',
  button1BgColor: '#27256b',
  button1Text: 'Book your Demo',
  button1TextColor: '#ffffff',
  button1Url: '#',
  button2BgColor: '#ffffff',
  button2BorderColor: '#ffffff',
  button2Text: 'Case studies',
  button2TextColor: '#27256b',
  button2Url: '#',
  image: '/RPA-Robotic Process Automation (RPA)/de84036c921d93c37b98e83bda27549bc7ae4a96.png'
};

const DEFAULT_RPA_OVERVIEW_CONTENT: Record<string, any> = {
  title: 'Robotic Process Automation Solutions',
  description: 'At ESS, we help businesses streamline operations through intelligent RPA solutions tailored to their unique workflows and existing systems. From identifying automation opportunities to implementing scalable processes, we focus on improving efficiency, accuracy, visibility, and operational consistency. Whether organizations are beginning their automation journey or expanding across departments, our expert team ensures every solution integrates smoothly, delivers measurable business impact, and supports long-term digital transformation with confidence.',
  subtitle: 'A successful RPA Journey Starts with Selecting the Right Implementation Partner',
  cards: [
    {
      icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png',
      title: '500+',
      description: 'Automated Processes'
    },
    {
      icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png',
      title: '1M+',
      description: 'Automated Transactions'
    },
    {
      icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png',
      title: '1000+',
      description: 'Saved Manhours'
    }
  ],
  logos: [
    { image: '/RPA-Robotic Process Automation (RPA)/image 58.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 59.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 60.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 61.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 62.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 63.png' }
  ]
};

const DEFAULT_RPA_INDUSTRIES_CONTENT: Record<string, any> = {
  title: 'Empowering Industries through Intelligent RPA',
  description: 'RPA helps organizations optimize workflows, improve compliance, accelerate digital transformation, and reimagine repetitive business processes across sectors.',
  industries: [
    {
      title: 'Retail',
      description: 'Streamline billing, returns, inventory updates, and customer service workflows through Robotic Process Automation...',
      icon: '/RPA-Robotic Process Automation (RPA)/front-store-with-awning_svgrepo.com.png'
    },
    {
      title: 'Manufacturing',
      description: 'With RPA, automation of supply chain tasks like invoice processing, order fulfillment, and BOM...',
      icon: '/RPA-Robotic Process Automation (RPA)/industrial-robot-factory_svgrepo.com.png'
    },
    {
      title: 'Logistics',
      description: 'Track shipments, manage invoicing, and synchronize warehousing systems seamlessly with RPA service...',
      icon: '/RPA-Robotic Process Automation (RPA)/delivery-truck-box-delivery_svgrepo.com.png'
    },
    {
      title: 'Automobile',
      description: 'Automate procurement, dealer communications, and compliance reporting using RPA solutions...',
      icon: '/RPA-Robotic Process Automation (RPA)/car-roof-box_svgrepo.com.png'
    },
    {
      title: 'FMCG',
      description: 'Leverage RPA to power demand forecasting, manage distributor billing, and handle large-scale invoicing...',
      icon: '/RPA-Robotic Process Automation (RPA)/groceries-grocery_svgrepo.com.png'
    },
    {
      title: 'Trading',
      description: 'Speed up reporting cycles, strengthen compliance, and automate order management for seamless business...',
      icon: '/RPA-Robotic Process Automation (RPA)/construction-crane_svgrepo.com.png'
    },
    {
      title: 'Hospitality',
      description: 'Automate reservation handling, deliver enhanced guest experiences, and optimize back-office operations...',
      icon: '/RPA-Robotic Process Automation (RPA)/hospital_svgrepo.com.png'
    },
    {
      title: 'BFSI',
      description: 'Enhance compliance, accelerate fraud detection, and make claims processing faster and more reliable....',
      icon: '/RPA-Robotic Process Automation (RPA)/bank-building-city_svgrepo.com.png'
    },
    {
      title: 'Pharmaceutical',
      description: 'Use RPA to reduce manual errors in regulatory reporting, manage lab data effectively, and optimize...',
      icon: '/RPA-Robotic Process Automation (RPA)/medical-record-medical-hospital-pharmacy-healthcare_svgrepo.com.png'
    },
    {
      title: 'Telecom',
      description: 'Optimize billing, customer onboarding, and service request handling, leveraging robotic process automation processes',
      icon: '/RPA-Robotic Process Automation (RPA)/tower-with-signal_svgrepo.com.png'
    },
    {
      title: 'Healthcare',
      description: 'Improve patient data accuracy, streamline claim processing, and ensure regulatory compliance',
      icon: '/RPA-Robotic Process Automation (RPA)/healthcare-ambulance_svgrepo.com.png'
    },
    {
      title: 'Tourism',
      description: 'Automate bookings, cancellations, and administrative tasks to create a hassle-free travel experience',
      icon: '/RPA-Robotic Process Automation (RPA)/outdoor-trip-traveling_svgrepo.com.png'
    }
  ]
};

const DEFAULT_RPA_SOLUTIONS_CONTENT: Record<string, any> = {
  title: 'Our Most Popular AI Powered RPA BOTs',
  description: 'Our Most Popular AI Powered RPA BOTs are designed to automate repetitive business processes, improve operational speed, and enhance workflow accuracy across departments.',
  solutions: [
    { title: 'Invoice Automation BOT' },
    { title: 'Reports Reconciliation BOT' },
    { title: 'Sales Order Processing BOT' },
    { title: 'Bank Statements Reconciliation BOT' },
    { title: 'IT Backup Monitoring Validating BOT' },
    { title: 'Debtor\'s Statement Reconciliation BOT' },
    { title: 'CV Screening and Shortlisting BOT' },
    { title: 'HSN Code Reconciliation BOT' }
  ],
  image: '/RPA-Robotic Process Automation (RPA)/AI bot.png'
};

const DEFAULT_RPA_FRAMEWORKS_CONTENT: Record<string, any> = {
  title: 'ESS brings expertise on frameworks',
  logos: [
    { image: '/RPA-Robotic Process Automation (RPA)/image 64.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 65.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 66.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 67.png' }
  ]
};

const DEFAULT_RPA_BENEFITS_CONTENT: Record<string, any> = {
  title: 'Benefits of RPA',
  subtitle: 'Robotic Process Automation (RPA) helps businesses automate repetitive tasks, reduce manual errors, and improve operational efficiency.',
  benefits: [
    { title: '0% error rate in the automated process', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 164.png' },
    { title: 'Great reductions in cycle times', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 165.png' },
    { title: 'Can utilize manpower for more productive tasks', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 166.png' },
    { title: 'Up to 80% cost reduction', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 167.png' },
    { title: 'Non-intrusive solution framework', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 168.png' },
    { title: 'Reduced cost of operations', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 169.png' }
  ]
};

const DEFAULT_RPA_CAPABILITIES_CONTENT: Record<string, any> = {
  title: 'ESS RPA Offerings / Capabilities',
  description: 'From consulting and design to bot deployment and maintenance, we offer end-to-end RPA capabilities.',
  items: [
    { title: 'RPA Advisory', description: 'Identify and analyze workflows to construct a feasibility roadmap for robotic automation.', icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png' },
    { title: 'Bot Development', description: 'Build resilient software bots using modern RPA tools to mimic user clicks and actions.', icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png' },
    { title: 'System Integration', description: 'Connect software bots smoothly with legacy ERPs, CRMs, web portals, and databases.', icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png' },
    { title: 'Bot Support', description: 'Monitor bot logs daily, manage credential handshakes, and fix run-time errors.', icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png' },
    { title: 'Intelligent Automation', description: 'Fuse RPA with AI models (OCR, Document Parser) to manage unstructured forms.', icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png' },
    { title: 'Process Mining', description: 'Discover automation pipelines by recording real-time actions and tracking paths.', icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png' }
  ]
};

const DEFAULT_RPA_FAQ_CONTENT: Record<string, any> = {
  title: 'Frequently Asked Questions',
  subtitle: 'Got questions? We have answers.',
  faqs: [
    { question: 'What is Robotic Process Automation (RPA)?', answer: 'Robotic Process Automation (RPA) is a technology that uses software robots or "bots" to automate repetitive, rules-based tasks typically performed by humans.' },
    { question: 'What processes are best suited for RPA?', answer: 'Processes that are repetitive, rules-based, high-volume, and use structured data are excellent candidates for RPA. Examples include data entry, invoice processing, claim validation, reconciliation, and automated reporting.' },
    { question: 'Does RPA replace our existing ERP or CRM systems?', answer: 'No, RPA bots interact with your existing systems just like a human user would, typing entries and clicking buttons. It does not replace your ERP/CRM but rather integrates them together.' }
  ]
};

const DEFAULT_RPA_CTA_CONTENT: Record<string, any> = {
  title: 'Download Our eBook - 50+ Industry Specific RPA Use Cases',
  buttonText: 'Download Now',
  buttonUrl: '#'
};

const DEFAULT_ORACLE_APEX_HERO_CONTENT: Record<string, any> = {
  bgColor: '#351570',
  badgeBgColor: '#ffffff',
  badgeBorderColor: 'transparent',
  badgeText: 'Oracle Forms to Oracle APEX Migration',
  badgeTextColor: '#351570',
  title: 'Oracle Forms to\nOracle APEX Migration',
  titleTextColor: '#ffffff',
  description: "Future-Proof Your Business: Migrate Oracle Forms to APEX in 2026 with Skylift AI's XDO Framework",
  descriptionTextColor: '#ffffff',
  button1BgColor: 'transparent',
  button1BorderColor: '#ffffff',
  button1Text: 'Get started',
  button1TextColor: '#ffffff',
  button1Url: '#',
  button2BgColor: '#ffffff',
  button2BorderColor: '#ffffff',
  button2Text: 'Explore ROI Calculator',
  button2TextColor: '#351570',
  button2Url: '#',
  image: '/Migration-Oracle Forms to Oracle APEX/ChatGPT Image Jun 25, 2026, 11_52_29 AM 1.png'
};

const DEFAULT_ORACLE_APEX_INTRO_CONTENT: Record<string, any> = {
  title: 'Strategic Modernization for Enterprise Critical Systems',
  paragraphs: [
    'Many enterprises across France, Europe, the United States, and India continue to run business-critical operations on legacy Oracle Forms environments. While stable, these systems limit scalability, integration capability, user experience, and cloud readiness.',
    '<strong>Modernization today requires more than code conversion.</strong>',
    'We help enterprises migrate Oracle Forms applications to Oracle APEX, transforming legacy systems into high-performance, web-based enterprise platforms aligned with modern business requirements.'
  ],
  buttonText: 'Plan Your Migration',
  buttonUrl: '#'
};

const DEFAULT_ORACLE_APEX_WHY_MIGRATE_CONTENT: Record<string, any> = {
  title: 'WHY ENTERPRISES ARE MIGRATING ORACLE FORMS TO ORACLE APEX',
  description: 'The objective is not just platform replacement — it is operational optimization.',
  tagText: 'Modern • Secure • Cloud-Native',
  points: [
    'Client-server limitations restrict scalability',
    'Increasing maintenance complexity',
    'Limited integration with modern platforms',
    'Aging user interface impacting productivity',
    'Cloud migration challenges'
  ],
  image: '/Migration-Oracle Forms to Oracle APEX/43cf0cf615146177fa1157dd0ba4a24f1252918e.png'
};

const DEFAULT_ORACLE_APEX_DELIVERABLES_CONTENT: Record<string, any> = {
  leftTitle: 'WHAT WE DELIVER',
  leftItems: [
    { icon: '/Migration-Oracle Forms to Oracle APEX/Frame 267.png', text: 'Complete Oracle Forms to Oracle APEX migration' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/database-02_svgrepo.com.png', text: 'Secure and optimized Database migration' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/web-design_svgrepo.com.png', text: 'Modernized Web UI/UX design' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/statistic-up_svgrepo.com.png', text: 'Enhanced analytics and reporting' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/cloud-upload_svgrepo.com.png', text: 'Seamless Cloud deployment' }
  ],
  rightTitle: 'BUSINESS IMPACT',
  rightItems: [
    { icon: '/Migration-Oracle Forms to Oracle APEX/settings_svgrepo.com.png', text: 'Reduced maintenance overhead' },
    { icon: 'Eye', text: 'Improved operational visibility' },
    { icon: '/migration-orcl datebase upgrade and optimization/performance_svgrepo.com.png', text: 'Enhanced system performance' },
    { icon: '/migration-orcl datebase upgrade and optimization/network-solid_svgrepo.com.png', text: 'Scalable digital architecture' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/boost-for-reddit_svgrepo.com.png', text: 'Future-ready ERP foundation' }
  ]
};

const DEFAULT_ORACLE_APEX_APPROACH_CONTENT: Record<string, any> = {
  title: 'COMPREHENSIVE ORACLE FORMS MIGRATION ASSESSMENT',
  tag: 'OUR STRATEGIC MIGRATION APPROACH',
  description: 'Unlike tool-only migration models, our approach combines technical precision with business transformation.',
  tabs: [
    {
      tabName: 'COMPREHENSIVE ORACLE FORMS MIGRATION ASSESSMENT',
      items: [
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Forms module analysis' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'PL/SQL logic evaluation' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Dependency and impact mapping' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Workflow review aligned to business processes' }
      ]
    },
    {
      tabName: 'ARCHITECTURE REDESIGN FOR FUTURE SCALABILITY',
      items: [
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Three-tier architecture model' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'RESTful API integration endpoints' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Modern web grid modernization' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Decoupled frontend & backend services' }
      ]
    },
    {
      tabName: 'STRUCTURED MIGRATION EXECUTION',
      items: [
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Step-by-step schema deployment' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'Automated business logic translation' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Data reconciliation and validation' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'Parallel testing and verification' }
      ]
    },
    {
      tabName: 'PERFORMANCE & USER EXPERIENCE OPTIMIZATION',
      items: [
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4314.png', title: 'Page loading speed optimization' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4315.png', title: 'Responsive layouts for mobile/tablet' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4316.png', title: 'Caching & statement tuning' },
        { image: '/migration-orcl datebase upgrade and optimization/Rectangle 4317.png', title: 'User feedback & interface polish' }
      ]
    }
  ]
};

const DEFAULT_ORACLE_APEX_CTA_CONTENT: Record<string, any> = {
  bgColor: '#f0f2f7',
  title: 'Begin Your Modernization Assessment',
  titleColor: '#5c3ea3',
  description: 'Engage with our experts to evaluate your Oracle Forms transformation roadmap and build a scalable digital foundation.',
  descriptionColor: '#374151',
  buttonText: 'Get start Now',
  buttonBgColor: '#ffca28',
  buttonTextColor: '#000000',
  buttonUrl: '/contact'
};

const EUROPE_COMMON_DEFAULTS = {
  hideSection: false,
  internalName: '',
  anchorId: '',
  backgroundColor: '',
  backgroundImage: '',
  containerWidth: '7xl',
  sectionPaddingTop: 'pt-14',
  sectionPaddingBottom: 'pb-14',
  theme: 'default',
  textAlignment: 'center',
  customClasses: '',
};

const DEFAULT_EUROPE_HERO_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  badgeBgColor: '#ffffff',
  badgeBorderColor: '#e2e8f0',
  badgeText: 'ebizframe ERP for Europe',
  badgeTextColor: '#4B2A63',
  title: 'Built on Experience.\nDriven by Outcomes.',
  titleColor: '#1e293b',
  subtitle: 'Enterprise ERP for European businesses',
  subtitleColor: '#64748b',
  description: 'ebizframe ERP helps European enterprises unify operations, ensure regulatory compliance, and scale with confidence across markets.',
  descriptionColor: '#64748b',
  primaryButtonText: 'Book Free Demo',
  primaryButtonTextColor: '#ffffff',
  primaryButtonBgColor: '#4B2A63',
  primaryButtonBorderColor: '#4B2A63',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'Explore Solutions',
  secondaryButtonTextColor: '#1e293b',
  secondaryButtonBgColor: '#fbbf24',
  secondaryButtonBorderColor: '#fbbf24',
  secondaryButtonUrl: '/solutions',
  backgroundGradient: 'radial-gradient(ellipse at top left, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.10) 0%, transparent 50%), #ffffff',
  heroIllustration: '/industry-solution-Retail/banner-image.png',
  enableIllustration: true,
  enableAnimation: true,
  sectionPaddingTop: 'pt-40',
  sectionPaddingBottom: 'pb-14',
};

const DEFAULT_EUROPE_FEATURE_CARDS_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  textAlignment: 'left',
  cards: [
    { image: '/industry-solution-Retail/industry-1.png', title: 'Production Management', description: 'Plan, schedule, and monitor manufacturing operations with real-time visibility.', buttonText: 'Learn More', buttonLink: '/solutions' },
    { image: '/industry-solution-Retail/industry-2.png', title: 'Financial Management', description: 'Unify accounting, budgeting, and compliance for European regulatory frameworks.', buttonText: 'Learn More', buttonLink: '/solutions' },
    { image: '/industry-solution-Retail/industry-3.png', title: 'Supply Chain & Logistics', description: 'Optimize procurement, warehousing, and distribution across your European network.', buttonText: 'Learn More', buttonLink: '/solutions' },
    { image: '/industry-solution-Retail/img-2.png', title: 'Business Intelligence', description: 'Turn operational data into actionable insights for leadership teams.', buttonText: 'Learn More', buttonLink: '/solutions' },
  ],
};

const DEFAULT_EUROPE_DARK_SHOWCASE_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  badgeText: 'ebizframe ERP',
  badgeBgColor: 'rgba(255,255,255,0.1)',
  badgeTextColor: '#ffffff',
  title: 'One Platform. Complete Enterprise Control.',
  titleColor: '#ffffff',
  description: 'See how ebizframe ERP unifies finance, operations, and analytics in a single intelligent platform.',
  descriptionColor: '#cbd5e1',
  primaryButtonText: 'Request Demo',
  primaryButtonTextColor: '#0f172a',
  primaryButtonBgColor: '#ffffff',
  primaryButtonBorderColor: '#ffffff',
  primaryButtonUrl: '/contact',
  secondaryButtonText: 'View Features',
  secondaryButtonTextColor: '#ffffff',
  secondaryButtonBgColor: 'transparent',
  secondaryButtonBorderColor: '#ffffff',
  secondaryButtonUrl: '/solutions',
  dashboardImage: '/industry-solution-Retail/banner-image.png',
  slides: [
    { image: '/industry-solution-Retail/banner-image.png', alt: 'Dashboard' },
    { image: '/industry-solution-Retail/process_ERP_Retail.png', alt: 'Process Overview' },
  ],
  enableSlider: true,
  autoplay: true,
  autoplayInterval: 5000,
  backgroundColor: '#0d0720',
  theme: 'dark',
};

const DEFAULT_EUROPE_GLOBAL_PRESENCE_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  textAlignment: 'left',
  image: '/Career-Page/Group 1.png',
  subtitle: 'Global Presence',
  subtitleColor: '#fbbf24',
  title: 'Discover why over 200,000 businesses trust ebizframe ERP',
  titleColor: '#ffffff',
  description: 'With offices across Europe, Asia, and the Americas, ESS delivers localized expertise backed by a proven global ERP platform.',
  descriptionColor: '#cbd5e1',
  statistics: [
    { number: '30+', label: 'Years Experience' },
    { number: '15+', label: 'Global Offices' },
    { number: '200,000+', label: 'Businesses Served' },
    { number: '35+', label: 'Countries' },
  ],
  backgroundColor: '#0d0720',
  theme: 'dark',
};

const DEFAULT_EUROPE_CASE_STUDY_SLIDER_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  textAlignment: 'left',
  slides: [
    { thumbnail: '/portfolio-1.png', companyName: 'Global Manufacturing Co.', industry: 'Manufacturing', description: 'Streamlined production planning across 12 European facilities.', metric1: '70% Faster processing', metric2: '40% Cost reduction', buttonText: 'View case study', buttonLink: '/case-studies' },
    { thumbnail: '/portfolio-2.png', companyName: 'Retail Enterprise Group', industry: 'Retail', description: 'Unified POS and inventory across 200+ retail outlets.', metric1: '3x Inventory turnover', metric2: '99.9% Uptime', buttonText: 'View case study', buttonLink: '/case-studies' },
  ],
  autoplay: false,
  loop: true,
  showNavigation: true,
  showPagination: true,
  autoplayInterval: 6000,
  backgroundColor: '#f2f6f9',
};

const DEFAULT_EUROPE_PROMO_CTA_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  smallTitle: 'Webinar',
  smallTitleColor: '#3b82f6',
  title: 'Monitor everything that matters to your European operations',
  titleColor: '#1e293b',
  description: 'Join our experts for a live session on how ebizframe ERP helps European enterprises achieve operational excellence.',
  descriptionColor: '#64748b',
  buttonText: 'Register Now',
  buttonTextColor: '#ffffff',
  buttonBgColor: '#4B2A63',
  buttonBorderColor: '#4B2A63',
  buttonUrl: '/contact',
  backgroundColor: '#e8eef5',
};

const DEFAULT_EUROPE_PRODUCT_SHOWCASE_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  textAlignment: 'left',
  deviceImage: '/industry-solution-Retail/banner-image.png',
  badgeText: 'Mobile App',
  badgeBgColor: '#dbeafe',
  badgeTextColor: '#2563eb',
  title: 'Getting started with ebizframe is easier than ever',
  titleColor: '#1e293b',
  description: 'Access your entire ERP from any device. Manage approvals, track inventory, and view analytics on the go.',
  descriptionColor: '#64748b',
  buttonText: 'Download App',
  buttonTextColor: '#ffffff',
  buttonBgColor: '#4B2A63',
  buttonUrl: '/contact',
  features: [
    { title: 'Real-time Dashboards', description: 'Monitor KPIs across finance, operations, and sales.' },
    { title: 'Mobile Access', description: 'Approve workflows and view reports on the go.' },
    { title: 'Multi-language Support', description: 'Built for European markets with localization.' },
    { title: 'Secure Cloud', description: 'Enterprise-grade security and compliance.' },
  ],
  backgroundColor: '#f0f4f8',
};

const DEFAULT_EUROPE_REPORTS_CONTENT: Record<string, any> = {
  ...EUROPE_COMMON_DEFAULTS,
  sectionTitle: "Learn why we're the trusted ERP leader in Europe",
  sectionTitleColor: '#1e293b',
  cards: [
    { image: '/portfolio-1.png', category: 'Analyst Report', title: 'IDC MarketScape for Enterprise ERP Platforms in Europe', link: '/resources' },
    { image: '/portfolio-2.png', category: 'Whitepaper', title: 'Digital Transformation Roadmap for European Manufacturers', link: '/resources' },
    { image: '/portfolio-3.png', category: 'Case Study', title: 'How a European Retail Chain Unified 200+ Stores', link: '/case-studies' },
  ],
};




interface SectionEditorCardProps {
  section: PageSection;
  schema?: Record<string, unknown> | null;
  index: number;
  total: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onContentChange: (sectionId: string, keyPath: string, value: JsonValue) => void;
  onSave: (section: PageSection) => Promise<void>;
  onDelete: (sectionId: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  isSectionDirty: boolean;
}

export function SectionEditorCard({
  section,
  schema,
  index,
  total,
  isExpanded,
  onToggleExpand,
  onContentChange,
  onSave,
  onDelete,
  onMove,
  isSectionDirty,
}: SectionEditorCardProps) {
  const [saving, setSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>('basic');
  const meta = getSectionDefinition(section.type);

  const mergedContent = React.useMemo(() => {
    let baseSchema = schema as Record<string, JsonValue> | undefined;
    
    // Inject defaults if schema is missing or empty
    if (!baseSchema || Object.keys(baseSchema).length === 0) {
      if (section.type === 'case-study-detail') {
        baseSchema = DEFAULT_CASE_STUDY_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'blog-detail-block') {
        baseSchema = DEFAULT_BLOG_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'blog-list-block') {
        baseSchema = DEFAULT_BLOG_LIST_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'testimonials-block') {
        baseSchema = DEFAULT_TESTIMONIALS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'contact-hero') {
        baseSchema = DEFAULT_CONTACT_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'job-detail-hero') {
        baseSchema = DEFAULT_JOB_DETAIL_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'job-detail-content') {
        baseSchema = DEFAULT_JOB_DETAIL_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'ass-hero') {
        baseSchema = DEFAULT_ASS_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'ass-experience') {
        baseSchema = DEFAULT_ASS_EXPERIENCE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'ass-cta') {
        baseSchema = DEFAULT_ASS_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'aom-hero') {
        baseSchema = DEFAULT_AOM_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'aom-solutions') {
        baseSchema = DEFAULT_AOM_SOLUTIONS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'aom-workspace') {
        baseSchema = DEFAULT_AOM_WORKSPACE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-hero') {
        baseSchema = DEFAULT_FMCG_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-logos') {
        baseSchema = DEFAULT_FMCG_LOGOS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-overview') {
        baseSchema = DEFAULT_FMCG_OVERVIEW_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-tabs') {
        baseSchema = DEFAULT_FMCG_TABS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-action') {
        baseSchema = DEFAULT_FMCG_ACTION_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-impact') {
        baseSchema = DEFAULT_FMCG_IMPACT_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-challenges') {
        baseSchema = DEFAULT_FMCG_CHALLENGES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-empower') {
        baseSchema = DEFAULT_FMCG_EMPOWER_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-use-cases') {
        baseSchema = DEFAULT_FMCG_USE_CASES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-integrations') {
        baseSchema = DEFAULT_FMCG_INTEGRATIONS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-faq') {
        baseSchema = DEFAULT_FMCG_FAQ_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'fmcg-cta') {
        baseSchema = DEFAULT_FMCG_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'roi-hero') {
        baseSchema = DEFAULT_ROI_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'roi-explanation') {
        baseSchema = DEFAULT_ROI_EXPLANATION_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'roi-formula') {
        baseSchema = DEFAULT_ROI_FORMULA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'roi-usage') {
        baseSchema = DEFAULT_ROI_USAGE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-hero') {
        baseSchema = DEFAULT_ORACLE_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-partner') {
        baseSchema = DEFAULT_ORACLE_PARTNER_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-why-upgrade') {
        baseSchema = DEFAULT_ORACLE_WHY_UPGRADE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-migration-flow') {
        baseSchema = DEFAULT_ORACLE_MIGRATION_FLOW_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-framework') {
        baseSchema = DEFAULT_ORACLE_FRAMEWORK_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-cta') {
        baseSchema = DEFAULT_ORACLE_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-hero') {
        baseSchema = DEFAULT_BI_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-intro') {
        baseSchema = DEFAULT_BI_INTRO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-insights') {
        baseSchema = DEFAULT_BI_INSIGHTS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-tabs') {
        baseSchema = DEFAULT_BI_TABS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-highlight-strip') {
        baseSchema = DEFAULT_BI_HIGHLIGHT_STRIP_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-business-impact') {
        baseSchema = DEFAULT_BI_BUSINESS_IMPACT_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-architecture') {
        baseSchema = DEFAULT_BI_ARCHITECTURE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-empowerment') {
        baseSchema = DEFAULT_BI_EMPOWERMENT_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-industries') {
        baseSchema = DEFAULT_BI_INDUSTRIES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'bi-industry-services') {
        baseSchema = DEFAULT_BI_INDUSTRY_SERVICES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-hero') {
        baseSchema = DEFAULT_RPA_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-overview') {
        baseSchema = DEFAULT_RPA_OVERVIEW_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-industries') {
        baseSchema = DEFAULT_RPA_INDUSTRIES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-solutions') {
        baseSchema = DEFAULT_RPA_SOLUTIONS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-frameworks') {
        baseSchema = DEFAULT_RPA_FRAMEWORKS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-benefits') {
        baseSchema = DEFAULT_RPA_BENEFITS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-capabilities') {
        baseSchema = DEFAULT_RPA_CAPABILITIES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-faq') {
        baseSchema = DEFAULT_RPA_FAQ_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'rpa-cta') {
        baseSchema = DEFAULT_RPA_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-hero') {
        baseSchema = DEFAULT_ORACLE_APEX_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-intro') {
        baseSchema = DEFAULT_ORACLE_APEX_INTRO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-why-migrate') {
        baseSchema = DEFAULT_ORACLE_APEX_WHY_MIGRATE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-deliverables') {
        baseSchema = DEFAULT_ORACLE_APEX_DELIVERABLES_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-approach') {
        baseSchema = DEFAULT_ORACLE_APEX_APPROACH_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'oracle-apex-cta') {
        baseSchema = DEFAULT_ORACLE_APEX_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-hero') {
        baseSchema = DEFAULT_EUROPE_HERO_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-feature-cards') {
        baseSchema = DEFAULT_EUROPE_FEATURE_CARDS_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-dark-showcase') {
        baseSchema = DEFAULT_EUROPE_DARK_SHOWCASE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-global-presence') {
        baseSchema = DEFAULT_EUROPE_GLOBAL_PRESENCE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-case-study-slider') {
        baseSchema = DEFAULT_EUROPE_CASE_STUDY_SLIDER_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-promo-cta') {
        baseSchema = DEFAULT_EUROPE_PROMO_CTA_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-product-showcase') {
        baseSchema = DEFAULT_EUROPE_PRODUCT_SHOWCASE_CONTENT as Record<string, JsonValue>;
      } else if (section.type === 'europe-reports') {
        baseSchema = DEFAULT_EUROPE_REPORTS_CONTENT as Record<string, JsonValue>;
      }
    }

    const merged = mergeSchemaWithContent(
      baseSchema,
      section.content as Record<string, JsonValue>
    );

    const finalMerged = { ...merged };
    if (meta?.fieldOrder) {
      meta.fieldOrder.forEach((key) => {
        if (!(key in finalMerged)) {
          // Default arrays for known list fields
          if (['items', 'processes', 'features', 'faqs', 'cards', 'values', 'modules', 'paragraphs', 'leftItems', 'rightItems', 'steps', 'logos', 'stats', 'statistics', 'slides', 'categories', 'tabs', 'benefits', 'industries', 'solutions', 'points', 'topics'].includes(key)) {
            finalMerged[key] = [];
          } else {
            finalMerged[key] = '';
          }
        }
      });
    }

    return finalMerged;
  }, [schema, section.content, section.type]);

  const contentKeys = React.useMemo(() => {
    const keys = Object.keys(mergedContent);
    if ((section.type === 'contact-hero' || section.type === 'job-detail-hero' || section.type === 'job-detail-content' || section.type === 'bi-highlight-strip' || section.type === 'bi-industries' || section.type === 'career-positions' || (section.type.startsWith('rpa-') && section.type !== 'rpa-hero') || section.type.startsWith('ass-') || section.type.startsWith('aom-') || section.type.startsWith('fmcg-') || section.type.startsWith('roi-')) && meta?.fieldOrder) {
      return meta.fieldOrder;
    }
    if (meta?.fieldOrder) {
      return keys.sort((a, b) => {
        const indexA = meta.fieldOrder!.indexOf(a);
        const indexB = meta.fieldOrder!.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }
    return keys;
  }, [mergedContent, meta, section.type]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(section);
    } finally {
      setSaving(false);
    }
  };

  const sectionPreview = getSectionPreview(section.content);

  return (
    <motion.div
      layout
      className={cn(
        'bg-white rounded-2xl border overflow-hidden shadow-sm transition-shadow',
        isExpanded ? 'border-[#4B2A63]/20 shadow-md' : 'border-slate-100',
        isSectionDirty && 'ring-2 ring-amber-200'
      )}
    >
      <div className="flex items-center gap-3 p-4 cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex-1 flex items-center gap-3 text-left min-w-0"
        >
          <span
            className={cn(
              'text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shrink-0',
              meta?.color || 'bg-slate-100 text-slate-500'
            )}
          >
            {meta?.label || section.type}
          </span>
          {section.variant && section.variant !== 'default' && (
            <span className="text-[10px] font-bold text-[#4B2A63] bg-[#4B2A63]/5 px-2 py-0.5 rounded-md shrink-0">
              {section.variant}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <span className="font-semibold text-slate-900 truncate text-sm block">
              {section.name || section.type}
            </span>
            {sectionPreview && !isExpanded && (
              <span className="text-[11px] text-slate-400 truncate block mt-0.5">
                {sectionPreview}
              </span>
            )}
          </div>
          {isSectionDirty && (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 border border-amber-200">
              Modified
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          )}
        </button>
        <div className="flex gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100"
          >
            <div className="p-5 space-y-4">
              {contentKeys.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">
                    No content fields for this section.
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    This section may use default content from the template.
                  </p>
                </div>
              ) : section.type === 'blog-detail-block' || section.type === 'testimonials-block' || section.type === 'case-study-detail' ? (
                <div className="space-y-4">
                  {/* Tabs Navigation */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 rounded-t-xl shrink-0 -mx-5 -mt-5 px-3">
                    {(() => {
                      const tabs = section.type === 'testimonials-block' 
                        ? [
                            { id: 'hero', label: 'Hero Banner' },
                            { id: 'testimonials', label: 'Testimonials' },
                          ]
                        : section.type === 'case-study-detail'
                        ? [
                            { id: 'hero', label: 'Hero Section' },
                            { id: 'overview', label: 'Overview' },
                            { id: 'challenge', label: 'Challenge' },
                            { id: 'ess', label: 'ESS' },
                            { id: 'results', label: 'Results' },
                          ]
                        : [
                            { id: 'basic', label: 'Basic Info' },
                            { id: 'hero', label: 'Hero Banner' },
                            { id: 'highlights', label: 'Highlights & Conclusion' },
                          ];
                      // Fallback tab if currently activeTab is not valid for the switch
                      const tabsMap = section.type === 'testimonials-block' 
                        ? TESTIMONIALS_TABS 
                        : section.type === 'case-study-detail'
                        ? CASE_STUDY_DETAIL_TABS
                        : BLOG_DETAIL_TABS;
                      
                      const validTab = tabsMap[activeTab] 
                        ? activeTab 
                        : (section.type === 'testimonials-block' || section.type === 'case-study-detail' ? 'hero' : 'basic');
                      
                      return tabs.map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            'px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                            validTab === tab.id
                              ? 'border-[#4B2A63] text-[#4B2A63] border-b-[#4B2A63]'
                              : 'border-transparent text-slate-400 hover:text-slate-600'
                          )}
                        >
                          {tab.label}
                        </button>
                      ));
                    })()}
                  </div>

                  {/* Tab Content Fields */}
                  <div className="space-y-4 pt-2">
                    {(() => {
                      const tabsMap = section.type === 'testimonials-block' 
                        ? TESTIMONIALS_TABS 
                        : section.type === 'case-study-detail'
                        ? CASE_STUDY_DETAIL_TABS
                        : BLOG_DETAIL_TABS;
                      
                      const activeKeys = tabsMap[activeTab] || (section.type === 'testimonials-block' || section.type === 'case-study-detail' ? tabsMap.hero : tabsMap.basic);
                      return activeKeys.map((key) => {
                        if (!contentKeys.includes(key)) return null;
                        return (
                          <DynamicFieldRenderer
                            key={key}
                            keyPath={key}
                            fieldKey={key}
                            value={mergedContent[key] as JsonValue}
                            onChange={(kp, val) => onContentChange(section.id, kp, val)}
                            sectionType={section.type}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                contentKeys.map((key) => (
                  <DynamicFieldRenderer
                    key={key}
                    keyPath={key}
                    fieldKey={key}
                    value={mergedContent[key] as JsonValue}
                    onChange={(kp, val) => onContentChange(section.id, kp, val)}
                    sectionType={section.type}
                  />
                ))
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {section.isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                      <Eye className="w-3 h-3" /> Visible
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !isSectionDirty}
                  className="bg-[#4B2A63] text-white rounded-full gap-1.5 px-5"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {saving ? 'Saving…' : 'Save Section'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function getSectionPreview(content: Record<string, unknown>): string | null {
  const keys = ['title', 'heading', 'badge', 'name', 'label', 'sectionTitle'];
  for (const k of keys) {
    const val = content[k];
    if (typeof val === 'string' && val.trim()) return val.slice(0, 60);
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const inner = val as Record<string, unknown>;
      if (typeof inner.title === 'string') return inner.title.slice(0, 60);
      if (typeof inner.text === 'string') return inner.text.slice(0, 60);
    }
  }
  return null;
}
