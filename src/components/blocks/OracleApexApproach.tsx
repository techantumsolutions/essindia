'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ApproachItem {
  image: string;
  title: string;
}

interface TabItem {
  tabName: string;
  items: ApproachItem[];
}

interface OracleApexApproachContent {
  title?: string;
  tag?: string;
  description?: string;
  tabs?: TabItem[];
}

export function OracleApexApproach({ content }: { content?: OracleApexApproachContent }) {
  const title = content?.title || 'COMPREHENSIVE ORACLE FORMS MIGRATION ASSESSMENT';
  const titleColor = '#000000';
  const tag = content?.tag || 'OUR STRATEGIC MIGRATION APPROACH';
  const subtitleColor = '#27256B';
  const description = content?.description || 'Unlike tool-only migration models, our approach combines technical precision with business transformation.';

  const defaultTabs: TabItem[] = [
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
  ];

  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : defaultTabs;
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeTab = tabs[activeTabIndex] || tabs[0];

  return (
    <section className="py-14 bg-white font-sans relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-3 mb-10">
          <h2 
            className="text-lg sm:text-xl font-bold tracking-wider uppercase" 
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          <h3 
            className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase"
            style={{ color: subtitleColor }}
          >
            {tag}
          </h3>
          {description && (
            <p className="text-base text-slate-500 font-light leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Tab Selection Bar */}
        <div className="border-b border-slate-200 mb-10 overflow-x-auto">
          <div className="flex min-w-max md:grid md:grid-cols-4 divide-x divide-slate-200">
            {tabs.map((tab, index) => {
              const isActive = index === activeTabIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTabIndex(index)}
                  className="flex-1 text-center py-4 px-3 text-xs sm:text-sm font-extrabold tracking-wide uppercase transition-all duration-300 relative cursor-pointer outline-none focus:outline-none"
                  style={{ color: isActive ? subtitleColor : '#64748B' }}
                >
                  <span className="block max-w-xs mx-auto">
                    {tab.tabName}
                  </span>
                  
                  {/* Active Indicator Underline */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: subtitleColor }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards Grid with AnimatePresence for transitions */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {activeTab.items && activeTab.items.map((item, idx) => (
                <div 
                  key={idx}
                  className="flex flex-col items-center text-center space-y-4 group"
                >
                  {/* Image Container */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow duration-300 bg-slate-50">
                    <Image
                      src={item.image.replace(/\\/g, '/')}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  
                  {/* Label Text */}
                  <span 
                    className="text-sm sm:text-base font-bold leading-snug px-2"
                    style={{ color: subtitleColor }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
