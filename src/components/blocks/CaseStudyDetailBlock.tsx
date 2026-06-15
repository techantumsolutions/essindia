'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface OverviewImage {
  image: string;
}

interface SolutionModule {
  iconImage: string;
  label: string;
}

interface ResultItem {
  text: string;
}

export interface CaseStudyDetailContent {
  // Hero
  badge?: string;
  date?: string;
  title?: string;
  authors?: Author[];
  
  // Overview
  overviewTitle?: string;
  overviewText?: string;
  overviewImages?: OverviewImage[];
  
  // Challenge
  challengeTitle?: string;
  challengeText?: string;
  challengeImage?: string;
  
  // Solution
  solutionTitle?: string;
  solutionSubtitle?: string;
  solutionModules?: SolutionModule[];
  
  // Results
  resultsTitle?: string;
  resultsText?: string;
  resultsItems?: ResultItem[];
  
  contactText?: string;
  contactEmail?: string;
}

interface CaseStudyDetailBlockProps {
  content?: CaseStudyDetailContent;
}

export function CaseStudyDetailBlock({ content }: CaseStudyDetailBlockProps) {
  // Default values based on the screenshot
  const badge = content?.badge || 'ebizframe';
  const date = content?.date || 'December 10, 2025';
  const title = content?.title || 'Leading Retail Chain in DRC opts for ebizframe ERP';
  const authors = content?.authors || [
    { name: 'Benjamin Thomson', role: 'Chief Executive Officer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin' },
    { name: 'Chloe Brown', role: 'Head Of Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe' },
    { name: 'Andrew Wilson', role: 'Lead Consultant', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrew' }
  ];

  const overviewTitle = content?.overviewTitle || 'Overview';
  const overviewText = content?.overviewText || 'The client is a leading retail chain operating in the Democratic Republic of Congo (DRC) with a history spanning over 20 years. They have a wide retail network of 22 stores across various cities and regions in DRC. The client deals in a vast range of products, catering to the diverse needs of their customer base.\n\nThe company was previously using disparate software systems to manage its diverse operations. This approach resulted in data silos and manual data transfers between systems, which was time-consuming, prone to errors, and inefficient. The client also faced challenges in generating timely and accurate reports due to the lack of integration between their various systems. This hindered their ability to make informed business decisions.\n\nTo overcome these challenges, the client decided to replace its existing systems with a comprehensive, integrated ERP solution. They wanted an ERP system that could streamline their business processes, improve operational efficiency, and provide real-time visibility into their operations.';
  const overviewImages = content?.overviewImages || [
    { image: '/Case-studies details/image 105.png' },
    { image: '/Case-studies details/image 106.png' },
    { image: '/Case-studies details/image 107.png' }
  ];

  const challengeTitle = content?.challengeTitle || 'The Challenge';
  const challengeText = content?.challengeText || 'The client had been using locally developed software for several years. The software had grown over time but lack of integration resulted in the absence of an integrated system, meaning that they were facing a lot of difficulties in managing their operations. They felt the need to upgrade their existing infrastructure to a comprehensive ERP software solution in Africa. One of the major challenges that the firm was facing was that there was no integration between the disparate departments, they were unable to access data from multiple locations at either of the shops. There was no proper control on inventory and neither were they able to consolidate data. After evaluating various options, they decided to go ahead with ebizframe because of the fact that ebizframe is built on the best in class ERP software framework.';
  const challengeImage = content?.challengeImage || '/Case-studies details/image 104.png';

  const solutionTitle = content?.solutionTitle || 'ESS Solution Choice';
  const solutionSubtitle = content?.solutionSubtitle || 'ebizframe ERP is being implemented for the following functions:';
  const solutionModules = content?.solutionModules || [
    { iconImage: '/Case-studies details/Container/finance-strategy_svgrepo.com.png', label: 'Finance' },
    { iconImage: '/Case-studies details/Container/finance-strategy_svgrepo.com.png', label: 'Sales' },
    { iconImage: '/Case-studies details/Container/finance-strategy_svgrepo.com.png', label: 'Materials Management' }
  ];

  const resultsTitle = content?.resultsTitle || 'The Results';
  const resultsText = content?.resultsText || 'ebizframe expects to provide the following benefits for the retail chain:';
  const resultsItems = content?.resultsItems || [
    { text: 'Integrated System' },
    { text: 'Real Time Reporting' },
    { text: 'Tight Inventory Control across multiple locations' },
    { text: 'Better visibility for top management with drilldown to transactional records' },
    { text: 'Seamless communication flow across different departments' }
  ];

  const contactText = content?.contactText || 'For more information on how ebizframe can help you transform your business, please leave your contact details or contact ESS at';
  const contactEmail = content?.contactEmail || 'marketing@essindia.com.';

  // State for fetching More Stories
  const [moreStories, setMoreStories] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchMoreStories() {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) {
          const data = await res.json();
          // Filter out the current page if possible, just take first 3 for now
          setMoreStories(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch case studies', err);
      }
    }
    fetchMoreStories();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-28 text-left px-4 overflow-hidden bg-gradient-to-br from-[#0d1538] via-[#1a1e4a] to-[#2c2055]">
        <div className="absolute inset-0 opacity-40 bg-[url('/Case-studies/banner.png')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          <div className="col-span-1 lg:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-white text-[#1a1e4a] text-xs font-bold shadow-md">
                {badge}
              </span>
              <span className="text-white/80 text-sm font-medium">{date}</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-light text-white leading-tight mb-8"
            >
              {title}
            </motion.h1>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-xl space-y-4"
            >
              {authors.map((author, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full border border-slate-200" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{author.name}</h4>
                    <p className="text-xs text-slate-500">{author.role}</p>
                  </div>
                  {idx === 0 && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* Overview */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-[#1a1e4a] mb-6">{overviewTitle}</h2>
              <div className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-line text-[15px]">
                {overviewText}
              </div>
            </div>
            
            {overviewImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {overviewImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <img src={img.image} alt="Overview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Challenge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-[#1a1e4a] mb-6">{challengeTitle}</h2>
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">
                {challengeText}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <img src={challengeImage} alt="The Challenge" className="w-full h-auto" />
            </div>
          </div>

          {/* Solution */}
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-black text-[#1a1e4a] mb-4">{solutionTitle}</h2>
              <p className="text-slate-600 text-[15px]">{solutionSubtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              {solutionModules.map((module, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-48 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mb-4 text-[#1a1e4a]">
                    <img src={module.iconImage} alt={module.label} className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">{module.label}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-[#1a1e4a] mb-6">{resultsTitle}</h2>
            <p className="text-slate-600 text-[15px] mb-6">{resultsText}</p>
            
            <ul className="space-y-4 max-w-3xl">
              {resultsItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-yellow-50/50 border border-yellow-100/50">
                  <div className="bg-yellow-400 rounded-full p-1 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-10 mt-10 border-t border-slate-200">
              <p className="text-slate-700 text-lg">
                {contactText} <a href={`mailto:${contactEmail}`} className="font-bold text-[#1a1e4a] hover:underline">{contactEmail}</a>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* More Stories */}
      <section className="bg-slate-50 py-24 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1e4a]">More Stories</h2>
            <Button variant="outline" className="border-[#1a1e4a] text-[#1a1e4a] hover:bg-[#1a1e4a] hover:text-white rounded-full px-8 h-12 w-fit">
              View All Case Studies <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreStories.length > 0 ? moreStories.map((story) => (
              <div 
                key={story.slug}
                onClick={() => window.location.href = story.fullPath}
                className="group cursor-pointer bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs text-[#859bfc] font-medium tracking-wider">{story.badge || 'ebizframe'}</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-[#1a1e4a] leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                    {story.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">{story.date}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1a1e4a] text-slate-400 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              // Skeletons if loading or none
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm h-96">
                  <div className="h-48 bg-slate-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
