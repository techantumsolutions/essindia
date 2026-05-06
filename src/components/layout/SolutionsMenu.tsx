'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';

// Hardcoded initial data structure mirroring the screenshot, to be replaced by API data
const solutionsData = {
  tabs: [
    { id: 'erp', label: 'ERP Software' },
    { id: 'bi', label: 'Business Intelligence (BI)' },
    { id: 'rpa', label: 'Robotic Process Automation (RPA)' },
    { id: 'mobile', label: 'Mobile Applications' },
    { id: 'custom', label: 'Custom Solutions' },
  ],
  categories: {
    erp: [
      { id: 'overview', label: 'ERP Overview', desc: 'Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.' },
      { id: 'modules', label: 'Modules', desc: 'Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.' },
      { id: 'industry', label: 'Industry Solutions', desc: 'Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.' },
      { id: 'integrations', label: 'Integrations', desc: 'Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.' },
    ]
  },
  subCategories: {
    'erp-industry': [
      'Corrugated Boxes', 'Trading', 'Flour Mills', 'Retail',
      'Process manufacturing', 'Oil&Gas', 'FMCG', 'Engineering',
      'Discrete Manufacturing', 'Discrete', 'Construction', 'Printing & publications',
      'Food & Beverages', 'Chemical'
    ]
  }
};

export function SolutionsMenuContent() {
  const [activeTab, setActiveTab] = React.useState('erp');
  const [activeCategory, setActiveCategory] = React.useState('industry');

  return (
    <NavigationMenuContent>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-[1000px] bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-100"
      >
        {/* Top Tabs */}
        <div className="flex items-center gap-10 border-b border-slate-50 px-12 pt-6">
          {solutionsData.tabs.map(tab => (
            <button
              key={tab.id}
              onMouseEnter={() => setActiveTab(tab.id)}
              className={cn(
                "pb-4 text-[11px] font-bold transition-colors relative tracking-[0.05em] uppercase cursor-pointer",
                activeTab === tab.id ? "text-[#4B2A63]" : "text-slate-600 hover:text-[#4B2A63]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4B2A63] rounded-t-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex min-h-[350px]">
          {/* Left Column (Categories) */}
          <div className="w-[30%] border-r border-slate-50 p-6">
            <div className="flex flex-col gap-1">
              {(solutionsData.categories[activeTab as keyof typeof solutionsData.categories] || []).map(cat => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  className={cn(
                    "text-left p-4 rounded-xl transition-all cursor-pointer",
                    activeCategory === cat.id ? "bg-[#F3EFFF] translate-x-1" : "hover:bg-slate-50 hover:translate-x-1"
                  )}
                >
                  <h4 className={cn("text-[12px] font-bold tracking-tight", activeCategory === cat.id ? "text-[#4B2A63]" : "text-slate-800")}>
                    {cat.label}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-normal">
                    {cat.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (Sub-categories grid) */}
          <div className="w-[60%] p-4">
            <div className="grid grid-cols-4 gap-y-2 gap-x-2">
              {(solutionsData.subCategories[`${activeTab}-${activeCategory}` as keyof typeof solutionsData.subCategories] || []).map((item, i) => (
                <NavigationMenuLink key={i} render={<Link href={`/solutions/${activeTab}/${activeCategory}/${item.toLowerCase().replace(/\s+/g, '-')}`} />} className="block">
                  <span className="text-[13px] text-slate-500 hover:text-[#4B2A63] transition-colors cursor-pointer font-normal block p-2 rounded-lg hover:bg-slate-50">
                    {item}
                  </span>
                </NavigationMenuLink>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </NavigationMenuContent>
  );
}
