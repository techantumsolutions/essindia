'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import * as LucideIcons from 'lucide-react';

const defaultTabs = [
  { iconImage: '', label: 'Tab 1', sections: [] },
  { iconImage: '', label: 'Tab 2', sections: [] },
];

export default function ManufacturingIconRow({ content }: { content?: any }) {
  const tabs = content?.tabs || content?.icons || defaultTabs;
  const [activeTab, setActiveTab] = useState(0);

  const currentTab = tabs[activeTab];
  const activeSections = currentTab?.sections || [];

  return (
    <>
      <section className="bg-[#f4f4fc] py-14 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex overflow-x-auto lg:overflow-x-visible lg:flex-nowrap justify-start lg:justify-center gap-3 pb-4 snap-x snap-mandatory hide-scrollbar">
            {tabs.map((item: any, i: number) => {
              const isActive = i === activeTab;
              const imgUrl = item.iconImage || item.image || item.icon;
              const itemTitle = item.label || item.title;
              return (
                <motion.div
                  key={i}
                  onClick={() => setActiveTab(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`relative w-[130px] shrink-0 lg:flex-1 snap-start aspect-square lg:aspect-auto lg:h-[130px] flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer rounded-xl ${isActive
                    ? 'bg-[#27256b] border-2 border-[#1ea0f0] text-[#FFD600] shadow-lg'
                    : 'bg-white border border-slate-200 hover:border-[#27256b]/30 hover:shadow-md text-[#27256b]'
                    }`}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={itemTitle}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (() => {
                    const iconName = item.iconName || item.lucideIcon;
                    const LucideIcon = iconName ? (LucideIcons as any)[iconName] : null;
                    return LucideIcon ? (
                      <LucideIcon strokeWidth={1.5} className="w-10 h-10" />
                    ) : null;
                  })()}
                  <span
                    className={`text-[12px] font-semibold uppercase ${isActive ? 'text-[#FFD600]' : 'text-[#27256b]'}`}
                  >
                    {itemTitle}
                  </span>

                  {/* Active Indicator Triangle */}
                  {isActive && (
                    <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#27256b]" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Render active tab sections */}
      <div className="w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeSections.map((section: any, idx: number) => (
              <SectionRenderer 
                key={`${activeTab}-${idx}`} 
                section={{ 
                  id: `tab-${activeTab}-sec-${idx}`, 
                  type: section.type, 
                  content: section.content || section.contentJson || {} 
                }} 
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
