'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpTab {
  id: string;
  title: string;
  contentImage: string;
  contentHeading: string;
  contentParagraphs: string[];
  illustrationUrl?: string;
}

interface ErpFeaturesTabContent {
  heading?: string;
  subheading?: string;
  tabs?: ErpTab[];
}

interface ErpFeaturesTabProps {
  content?: ErpFeaturesTabContent;
}

export function ErpFeaturesTab({ content }: ErpFeaturesTabProps) {
  const heading = content?.heading || 'Choosing the Right ERP Solution for Modern Businesses';
  const subheading = content?.subheading || 'Select standard version or customizable version';
  const tabs = content?.tabs || [
    {
      id: 'standard',
      contentImage: '/ErpOverview/featureTav1.png',
      title: 'STANDARD VERSION OR WITH CUSTOMIZATION',
      contentHeading: 'FOR STANDARD VERSION OR WITH CUSTOMIZATION',
      contentParagraphs: [
        'Our standard ERP edition offers an immediately deployable software suite built around best practices in supply chain, invoicing, core accounting, and materials procurement.',
        'It is designed to get your business up and running in record time while preserving options to configure fields, triggers, and reports to match your unique organizational flow.',
      ],
    },
    {
      id: 'global',
      contentImage: '/ErpOverview/ERP-2.png',
      title: 'GLOBAL STANDARD EDITION',
      contentHeading: 'GLOBAL STANDARD EDITION',
      contentParagraphs: [
        'A global-scale ERP suite engineered for multi-national operations, multi-currency ledgers, and consolidated international accounting reporting.',
        'Built with multi-company hierarchy, global supply logistics controllers, and international taxation audit support out-of-the-box.',
      ],
    },
    {
      id: 'commerce',
      contentImage: '/ErpOverview/ERP-3.png',
      title: 'COMMERCE ENGINE SPECIAL EDITION',
      contentHeading: 'COMMERCE ENGINE SPECIAL EDITION',
      contentParagraphs: [
        'Omnichannel e-commerce integration with high-velocity dispatch control, real-time stock synching, and automated order fulfillment systems.',
        'Designed to bridge warehouses directly with digital web store fronts, retail POS networks, and direct delivery APIs.',
      ],
    },
    {
      id: 'enterprise',
      contentImage: '/ErpOverview/ERP-4.png',
      title: 'ENTERPRISE SPECIFICATIONS',
      contentHeading: 'ENTERPRISE SPECIFICATIONS',
      contentParagraphs: [
        'Our most comprehensive ERP suite offering advanced process engineering, dedicated database scaling, and high-fidelity customization frameworks.',
        'Perfect for conglomerates requiring strict compliance controls, infinite modularity, and deep API integrations across corporate portfolios.',
      ],
    },
    {
      id: 'multisite',
      contentImage: '/ErpOverview/ERP-5.png',
      title: 'MULTI-SITE SYSTEM EDITION',
      contentHeading: 'MULTI-SITE SYSTEM EDITION',
      contentParagraphs: [
        'Synchronized multi-facility operations, consolidated material tracking, inter-branch ledger reconciliations, and centralized warehousing management.',
        'Enables transparent control over dozens of brick-and-mortar locations, distribution hubs, or secondary factory setups.',
      ],
    },
  ];

  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || 'standard');
  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  return (
    <section className="relative w-full py-16 bg-[#462294] text-white overflow-hidden border-b border-slate-900">
      {/* Background radial glowing effects */}
      {/* <div className="absolute top-1/4 -left-1/4 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-1/4 w-150 h-150 rounded-full bg-indigo-500/10 blur-[120px] -z-10" /> */}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-4xl lg:text[42px] font-extrabold text-white">
              {heading}
            </h2>
          </MotionSection>
          
          <MotionSection variant="fadeUp" delay={0.15}>
            <p className="text-purple-200 text-lg font-light leading-relaxed">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Dynamic Comparison Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#3b1c7d] p-8 lg:p-20 rounded-[40px] border border-gray-300 shadow-2xl relative overflow-hidden">
          
          {/* Left Column: Sidebar Selector Buttons */}
          <div className="lg:col-span-5 justify-center items-center flex flex-col gap-3.5 w-full">
            {tabs.map((tab, idx) => {
              const isActive = tab.id === activeTabId;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full text-left px-6 py-5 rounded-full transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-between group border text-xs md:text-sm tracking-wider font-extrabold ${
                    isActive
                      ? 'bg-[#FFD54F] text-[#4B2A63] border-[#FFD54F] shadow-lg shadow-[#FFD54F]/10'
                      : 'bg-white border-white/10 text-[#462294] hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="truncate pr-4">{tab.title}</span>
                  {/* <span className={`transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1 opacity-60'}`}>
                    →
                  </span> */}
                </motion.button>
              );
            })}
          </div>

          {/* Right Column: Tab Content Pane with Rotating SVG Hub */}
          <div className="lg:col-span-7 w-full">
            <div className="">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-16 -mt-16 pointer-events-none" />

                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className=""
                >
                  <div className="mb-6">
                    <img src={activeTab?.contentImage || 'ErpOverview/featureTav1.png'} alt={activeTab.contentHeading} />
                  </div>
                  {/* text and paragraphs */}
                  <div className="">
                    <h3 className="text-xl md:text-3xl font-light text-white tracking-tight leading-10">
                      {activeTab.contentHeading}
                    </h3>
                    
                    <div className="space-y-4">
                      {activeTab.contentParagraphs.map((para, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-purple-100 text-[13px] md:text-sm font-light leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                </motion.div>
             
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
