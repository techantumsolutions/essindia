'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HighlightPanel {
  title: string;
  description: string;
  image?: string;
}

interface BlogAuthor {
  name: string;
  avatar: string;
}

interface BlogPost {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  topic: string;
  industries: string[];
  author: BlogAuthor;
}

interface BlogDetailContent {
  badgeText?: string;
  headingText?: string;
  subheadingText?: string;
  bgImage?: string;
  category?: string;
  title?: string;
  authorName?: string;
  authorAvatar?: string;
  date?: string;
  image?: string;
  description?: string;
  contentHtml?: string;

  // Diagram
  diagramTitle1?: string;
  diagramDesc1?: string;
  diagramTitle2?: string;
  diagramDesc2?: string;
  diagramTitle3?: string;
  diagramDesc3?: string;
  diagramSub1?: string;
  diagramSub2?: string;
  diagramSub3?: string;

  // Panels
  highlights?: HighlightPanel[];
  conclusionHtml?: string;
}

interface BlogDetailSectionProps {
  content?: BlogDetailContent;
}

const defaultRelatedBlogs: BlogPost[] = [
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
  }
];

export function BlogDetailSection({ content }: BlogDetailSectionProps) {
  // Read fields with mockup defaults
  const badge = content?.badgeText || 'Latest Blogs';
  const heroHeading = content?.headingText || 'Explore our knowledge hub';
  const heroSubheading = content?.subheadingText || 'Everything journalists, analysts, and partners need to cover ESS — from brand assets to company facts.';
  const bgImage = content?.bgImage;

  const category = content?.category || 'Technology';
  const title = content?.title || 'How Power BI Services Help Fix Multi-System Data Mismatches';
  const authorName = content?.authorName || 'Jason Francisco';
  const authorAvatar = content?.authorAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason';
  const date = content?.date || 'May 15, 2026';
  const hasImage = content ? !!content.image : true;
  const image = content?.image || '/blog-1.png';
  const description = content?.description || 'In most enterprise environments, data flows from CRM platforms, local databases, and legacy solutions. If not managed properly, this leads to contradictory reports, duplicate customer records, and mismatched financial data.';

  const contentHtml = content?.contentHtml || `
    <p class="text-slate-600 leading-relaxed mb-6">
      Today, businesses generate more data than ever. From CRM platforms to local databases, enterprise systems are constantly producing information. However, when these systems operate in silos, they often create contradictory reports, duplicate customer records, and mismatched financial data.
    </p>
    <p class="text-slate-600 leading-relaxed mb-8">
      Software platforms that do not communicate share duplicate or conflicting information, which hampers executive decision-making. This is where Power BI services come in. Rather than working with disconnected reports, businesses can use Power BI to design single-source validation models that automatically reconcile differences across multiple systems.
    </p>
    <p class="text-slate-600 leading-relaxed mb-8">
      In this blog, we will discuss how Power BI services help automate data validation, resolve multi-system data discrepancies, and establish a single source of truth for your business.
    </p>
  `;

  // Diagram Defaults
  const diagTitle1 = content?.diagramTitle1 || 'System disagreement';
  const diagDesc1 = content?.diagramDesc1 || 'Conflicting data across systems';
  const diagTitle2 = content?.diagramTitle2 || 'Business Logic Reconciliation';
  const diagDesc2 = content?.diagramDesc2 || 'Reconcile conflicting calculation logic';
  const diagTitle3 = content?.diagramTitle3 || 'System alignment';
  const diagDesc3 = content?.diagramDesc3 || 'Consistent data across all systems';

  const diagSub1 = content?.diagramSub1 || 'Establish clear data ownership';
  const diagSub2 = content?.diagramSub2 || 'Reconcile conflicting calculation logic';
  const diagSub3 = content?.diagramSub3 || 'Enhance customer data standards';

  // Panels Defaults
  const highlights = content?.highlights || [
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
  ];

  const conclusionHtml = content?.conclusionHtml || `
    <h3 class="text-xl font-bold text-slate-800 mb-4 mt-8">Conclusion</h3>
    <p class="text-slate-600 leading-relaxed mb-6">
      Managing multi-system data flows requires smart tooling. By leveraging Power BI's robust modeling and integration layers, companies can eliminate data discrepancies, streamline reporting, and make decisions with absolute confidence.
    </p>
    <p class="text-slate-600 leading-relaxed">
      If you are ready to resolve your data mismatches and establish a single source of truth, reach out to our team of Business Intelligence experts today.
    </p>
  `;

  // Related Blogs State
  const [relatedBlogs, setRelatedBlogs] = React.useState<BlogPost[]>([]);

  React.useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Filter out current blog
            const filtered = data.filter((b: BlogPost) => b.slug !== content?.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            setRelatedBlogs(filtered.slice(0, 3));
          } else {
            setRelatedBlogs(defaultRelatedBlogs);
          }
        } else {
          setRelatedBlogs(defaultRelatedBlogs);
        }
      } catch (err) {
        setRelatedBlogs(defaultRelatedBlogs);
      }
    }
    fetchRelated();
  }, [content]);

  return (
    <section className="bg-white min-h-screen">
      {/* Premium Hero Banner */}
      <div
        className="relative  pt-40 pb-20 text-center px-4 overflow-hidden"
        style={bgImage ? {
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : undefined}
      >
        <div className="absolute inset-0 opacity-10" />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.href = '/blog'}
            className="px-5 py-1.5 rounded-full bg-white text-[#0A2E2A] text-xs font-bold shadow-md uppercase tracking-wider  border border-slate-100 flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            {badge}
          </motion.button>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-1 font-extralight"
          >
            {heroHeading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm  text-slate-200/90 max-w-2xl font-light leading-relaxed mb-4"
          >
            {heroSubheading}
          </motion.p>
        </div>
      </div>

      {/* Article Container */}
      <div className="max-w-7xl mx-auto px-6 mt-6  pb-6">
        <article className="space-y-10">

          {/* Header Info */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-[#4b6bfb] text-[#fff] rounded-[10px] text-xs font-normal  tracking-wider">
              {category}
            </span>
            <h2 className="text-3xl  font-black text-slate-800 leading-tight">
              {title}
            </h2>
            <div className="flex items-center gap-4 pt-2">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full border border-slate-100 bg-slate-50"
              />
              <div>
                <p className="text-sm font-bold text-slate-700">{authorName}</p>
                <p className="text-xs text-slate-400">{date}</p>
              </div>
            </div>
          </div>

          {/* Large Featured Image */}
          {hasImage && image && (
            <div className="w-full text-center md:w-1/2 mx-auto rounded-[32px] overflow-hidden aspect-[16/10] shadow-md border border-slate-100 bg-slate-100">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/blog-1.png';
                }}
              />
            </div>
          )}

          {/* Intro Description */}
          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          {/* Key Highlights (Column Layout) */}
          <div className="my-16 space-y-12">
            {highlights.map((panel, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                  {panel.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                  {panel.description}
                </p>
                {panel.image && (
                  <div className="w-full md:w-1/2 mx-auto rounded-[24px] overflow-hidden aspect-[16/10] shadow-sm border border-slate-100 bg-slate-50">
                    <img
                      src={panel.image}
                      alt={panel.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: conclusionHtml }} />
          </div>

        </article>

        {/* Divider */}
        <div className="my-20 border-t border-slate-100" />

        {/* Latest Blogs Footer Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider">Latest Blog</h3>
            <button
              onClick={() => window.location.href = '/blog'}
              className="text-[#103D38] hover:text-[#0A2E2A] text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer group hover:underline"
            >
              View Portfolio
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map(blog => {
              return (
                <div
                  key={blog.slug}
                  className="flex flex-col group cursor-pointer bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  onClick={() => window.location.href = `/blog/${blog.slug}`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/blog-1.png';
                      }}
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-[#103D38] transition-colors line-clamp-2">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={blog.author.avatar}
                        alt={blog.author.name}
                        className="w-6 h-6 rounded-full bg-slate-50"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-700">{blog.author.name}</p>
                        <p className="text-[8px] text-slate-400">{blog.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
