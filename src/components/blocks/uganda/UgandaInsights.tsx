'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FormattedText } from '@/components/ui/FormattedText';
import { safeImageUrl } from '@/lib/utils';

interface PointItem {
  title: string;
  description: string;
}

interface TabItem {
  tabName: string;
  contentTitle: string;
  body1?: string;
  body2?: string;
  points?: PointItem[];
  subsections?: string; // Rich text / markdown / paragraph block text
  image?: string;
}

export interface UgandaInsightsContent {
  tag?: string;
  title?: string;
  description?: string;
  tabs?: TabItem[];
}

const DEFAULT_TABS: TabItem[] = [
  {
    tabName: 'Understanding ERP Software',
    contentTitle: 'Understanding ERP Software and its role in real-life',
    body1: 'Enterprise Resource Planning (ERP) software is the backbone of modern business operations, integrating core functions like finance, HR, manufacturing, and supply chain into a single system.',
    body2: 'By breaking down data silos, a modern ERP system provides a single source of truth that helps teams make faster, more accurate operational decisions.',
    points: [
      { title: 'Centralized Database', description: 'Eliminates departmental silos by keeping all records in a single, accessible repository.' },
      { title: 'Process Automation', description: 'Streamlines repetitive manual workflows to reduce human errors and cycle times.' },
    ],
    image: '/About-Uganda/Container/Figure/Image.png',
  },
  {
    tabName: 'Finance and accounting',
    contentTitle: 'Finance and accounting: ERP examples for streamlined operations',
    body1: 'Finance and accounting are at the heart of any business, and an efficient ERP system can make a significant impact on these critical functions. ERP systems centralize financial data, automate routine tasks, and ensure compliance with financial regulations, allowing businesses to focus on strategy and growth rather than getting bogged down in manual processes. By looking at ERP examples within finance and accounting, we can see how these systems help businesses achieve greater accuracy and efficiency.',
    body2: 'Importance of Finance and Accounting in ERP: For businesses, maintaining accurate financial records, managing cash flow, and ensuring regulatory compliance are non-negotiable. As ERP examples in finance and accounting show, a tailored ERP system integrates all financial activities—from accounts payable and receivable to financial reporting and tax management. This integration not only improves accuracy but also provides real-time insights into the financial health of the business.',
    points: [
      { title: 'Automated Invoicing and Billing', description: 'Reduces manual data entry, speeds up payment cycles, and minimizes errors.' },
      { title: 'General Ledger Management', description: 'Consolidates all financial data into one system, enabling easy access and reporting.' },
      { title: 'Accounts Payable and Receivable', description: 'Automates tracking and management of payments to suppliers and receipts from customers.' },
      { title: 'Financial Reporting', description: 'Generates real-time financial statements, helping businesses make informed decisions.' },
      { title: 'Compliance and Audit Trail', description: 'Ensures that all transactions are compliant with financial regulations and standards.' },
    ],
    subsections: `ERP Examples in Finance and Accounting

Microsoft Dynamics 365 Business Central
• Overview: Business Central is a cloud-based ERP solution designed for small to medium-sized businesses, offering comprehensive financial management tools.
• Example Use Case: A small business automates its invoicing process using Business Central, reducing the time spent on manual data entry and minimizing errors.

Oracle NetSuite
• Overview: Oracle NetSuite is another cloud-based ERP system known for robust financial management capabilities, ideal for businesses with complex financial needs.
• Example Use Case: A growing e-commerce company uses Oracle NetSuite to manage financial operations across multiple regions and currencies.

Case Example
Consider a mid-sized manufacturing company that was struggling with outdated financial software. By implementing Microsoft Dynamics 365 Business Central, the company was able to centralize its financial data, automate its reporting processes, and gain real-time visibility into its cash flow.

Benefits
Implementing an ERP system for finance and accounting offers several key benefits.`,
    image: '/About-Uganda/Container/Figure/Image.png',
  },
  {
    tabName: 'Supply chain management',
    contentTitle: 'Supply chain management: ERP examples for enhanced efficiency',
    body1: 'Supply chain management demands tight coordination of sourcing, inventory control, warehousing, and transportation channels.',
    body2: 'An integrated ERP links procurement directly with production schedules and distributor demands to ensure perfect order fulfillment rates.',
    points: [
      { title: 'Demand Forecasting', description: 'Predicts stock needs based on historical sales data and seasonal branch trends.' },
      { title: 'Inventory Management', description: 'Real-time tracking of raw materials and finished goods across multiple warehouse hubs.' },
    ],
    image: '/About-Uganda/Container/Figure/Image.png',
  },
];

export function UgandaInsights({ content }: { content?: UgandaInsightsContent }) {
  const tag = content?.tag || 'Insights';
  const title = content?.title || 'Leverage our expertise';
  const description = content?.description || 'Looking for more information that can help you grow your business? Make sure you check out our Insights. You are also welcome to sign up for our newsletter, find the link at the bottom of the page.';
  const tabs = content?.tabs && content.tabs.length > 0 ? content.tabs : DEFAULT_TABS;

  const [activeTabIdx, setActiveTabIdx] = useState(0); // Default to first tab
  const activeTab = tabs[activeTabIdx] || tabs[0];
  const tabsRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = React.useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  React.useEffect(() => {
    checkScrollState();
    const timer = setTimeout(checkScrollState, 150);
    window.addEventListener('resize', checkScrollState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [tabs, checkScrollState]);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-14 bg-white flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          {tag && (
            <FormattedText content={tag} as="span" className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3" />
          )}
          {title && (
            <FormattedText content={title} as="h2" className="text-2xl sm:text-[34px] font-bold text-[#1d1b4b] mb-4 tracking-tight leading-tight" />
          )}
          {description && (
            <FormattedText content={description} className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto" />
          )}
        </div>

        {/* Horizontal Navigation Tabs with Left & Right Arrow Buttons */}
        <div className="relative flex items-center gap-2 mb-10 w-full max-w-7xl mx-auto">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center shadow-sm text-slate-700 shrink-0 transition-all duration-200 ${
              canScrollLeft ? 'opacity-100 scale-100 cursor-pointer' : 'opacity-0 pointer-events-none scale-90'
            }`}
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Horizontal Scrollable Tabs Track */}
          <div
            ref={tabsRef}
            onScroll={checkScrollState}
            className="flex-1 flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 border-b border-slate-200"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {tabs.map((tab, idx) => {
              const isActive = idx === activeTabIdx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTabIdx(idx)}
                  className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1d1b4b] text-white shadow-md shadow-[#1d1b4b]/20 scale-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <FormattedText content={tab.tabName} as="span" />
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center shadow-sm text-slate-700 shrink-0 transition-all duration-200 ${
              canScrollRight ? 'opacity-100 scale-100 cursor-pointer' : 'opacity-0 pointer-events-none scale-90'
            }`}
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Active Content Panel - Left Content, Right Image */}
        <div className="w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTabIdx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className={`grid grid-cols-1 ${safeImageUrl(activeTab.image) ? 'lg:grid-cols-2' : ''} gap-8 items-start`}
            >
              {/* Left Column: Content */}
              <div className="space-y-6">
                {/* Content Title */}
                {activeTab.contentTitle && (
                  <FormattedText content={activeTab.contentTitle} as="h3" className="text-xl sm:text-[28px] font-extrabold text-[#1d1b4b] leading-tight tracking-tight" />
                )}

                {/* Body Paragraphs */}
                {activeTab.body1 && (
                  <FormattedText content={activeTab.body1} className="text-xs sm:text-sm text-slate-700 leading-relaxed" />
                )}
                {activeTab.body2 && (
                  <FormattedText content={activeTab.body2} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium" />
                )}

                {/* Points checklist */}
                {activeTab.points && activeTab.points.length > 0 && (
                  <ul className="space-y-4 pt-2">
                    {activeTab.points.map((p, pidx) => (
                      <li key={pidx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-900 mt-2" />
                        <div>
                          <FormattedText content={p.title} as="strong" className="text-slate-950 font-bold mr-1" />
                          <FormattedText content={p.description} as="span" className="text-slate-600" />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subsections Rich text */}
                {activeTab.subsections && (
                  <FormattedText content={activeTab.subsections} className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6 border-t border-slate-100 pt-6" />
                )}
              </div>

              {/* Right Column: Mockup Dashboard Image */}
              {safeImageUrl(activeTab.image) && (
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden lg:sticky lg:top-24">
                  <Image
                    src={safeImageUrl(activeTab.image)}
                    alt={activeTab.contentTitle || 'Dashboard detail'}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default UgandaInsights;
