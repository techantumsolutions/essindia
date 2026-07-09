'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [activeTabIdx, setActiveTabIdx] = useState(1); // Default to Finance and accounting tab
  const activeTab = tabs[activeTabIdx] || tabs[0];

  return (
    <section className="w-full py-14 bg-white flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {tag && (
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
              {tag}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-[34px] font-bold text-[#1d1b4b] mb-4 tracking-tight leading-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Sidebar Tabs Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mt-6">
          {/* Left Vertical Menu */}
          <div className="w-full lg:w-1/4 flex flex-col border-l border-slate-200 divide-y divide-slate-100 lg:divide-y-0">
            {tabs.map((tab, idx) => {
              const isActive = idx === activeTabIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTabIdx(idx)}
                  className={`text-left px-5 py-4 text-xs sm:text-sm transition-all duration-200 border-l-2 -ml-[2px] font-medium leading-snug ${
                    isActive
                      ? 'border-[#1d1b4b] text-[#1d1b4b] font-bold bg-[#f8fafc]/80'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  {tab.tabName}
                </button>
              );
            })}
          </div>

          {/* Right Active Content Panel */}
          <div className="w-full lg:w-3/4 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {/* Content Title */}
                {activeTab.contentTitle && (
                  <h3 className="text-xl sm:text-[28px] font-extrabold text-[#1d1b4b] leading-tight tracking-tight">
                    {activeTab.contentTitle}
                  </h3>
                )}

                {/* Body Paragraphs */}
                {activeTab.body1 && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeTab.body1}
                  </p>
                )}
                {activeTab.body2 && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeTab.body2}
                  </p>
                )}

                {/* Points checklist */}
                {activeTab.points && activeTab.points.length > 0 && (
                  <ul className="space-y-4 pt-2">
                    {activeTab.points.map((p, pidx) => (
                      <li key={pidx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-900 mt-2" />
                        <div>
                          <strong className="text-slate-950 font-bold">{p.title}:</strong>{' '}
                          <span className="text-slate-600">{p.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subsections Rich text */}
                {activeTab.subsections && (
                  <div className="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed space-y-6 border-t border-slate-100 pt-6">
                    {activeTab.subsections}
                  </div>
                )}

                {/* Mockup Dashboard Image */}
                {activeTab.image && (
                  <div className="relative w-full aspect-[16/9] max-w-4xl rounded-xl overflow-hidden border border-slate-150 shadow-sm mt-8">
                    <Image
                      src={activeTab.image}
                      alt={activeTab.contentTitle || 'Dashboard detail'}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                      priority
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
