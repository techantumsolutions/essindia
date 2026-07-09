'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface WorkspaceTab {
  label: string;
  desc: string;
  icon: string;
  contentTitle: string;
  contentDescription: string;
  contentImage: string;
  benefits?: string[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
}

interface WorkspaceCategory {
  name: string;
  tabs: WorkspaceTab[];
}

interface AomWorkspaceContent {
  title?: string;
  categories?: WorkspaceCategory[];
}

export function AomWorkspace({ content }: { content?: AomWorkspaceContent }) {
  const ctaUrl = (content as any)?.ctaUrl || '';
  const ctaFormType = ((content as any)?.ctaFormType || '') as CtaFormType;
  const { handleClick: handleCtaClick, modalNode } = useCtaAction(ctaUrl, ctaFormType);
  const title = content?.title || 'Explore every mobile business application from one intelligent workspace.';

  const defaultCategories: WorkspaceCategory[] = [
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
    },
    {
      name: 'FIELD OPERATIONS',
      tabs: [
        {
          label: 'Field Force',
          desc: 'Field service execution',
          icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
          contentTitle: 'Field Force Management',
          contentDescription: 'Manage onsite operations, assign tickets automatically to executives, capture client feedback, and track expense limits efficiently.',
          contentImage: '/App- App over view (mobile app)/dashboard 1.png',
          benefits: ['Task Assignment', 'On-site Inspections', 'Expense Recording'],
          ctaText: 'Get started',
          ctaUrl: '#'
        }
      ]
    },
    {
      name: 'OPERATIONAL MANAGEMENT',
      tabs: [
        {
          label: 'Inventory App',
          desc: 'Store warehouse tracking',
          icon: '/App- App over view (mobile app)/van-facing-left_svgrepo.com.png',
          contentTitle: 'Warehouse Inventory Management',
          contentDescription: 'Scan barcodes, perform stock counts, register material movements, and streamline shipping operations instantly.',
          contentImage: '/App- App over view (mobile app)/dashboard 1.png',
          benefits: ['Stock Audit', 'Barcode Scanning', 'Warehouse Dispatch'],
          ctaText: 'Get started',
          ctaUrl: '#'
        }
      ]
    }
  ];

  const categories = content?.categories || defaultCategories;

  // Track expanded categories (accordion)
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({
    0: true, // Expand first by default
    1: false,
    2: false
  });

  // Track active tab selection
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [activeTabIdx, setActiveTabIdx] = useState(1); // Default to CRM in SALES OPERATIONS

  const toggleCategory = (idx: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const selectTab = (catIdx: number, tabIdx: number) => {
    setActiveCategoryIdx(catIdx);
    setActiveTabIdx(tabIdx);
  };

  // Safe tab selection lookup
  const currentCategory = categories[activeCategoryIdx] || categories[0] || { tabs: [] };
  const currentTab = currentCategory.tabs[activeTabIdx] || currentCategory.tabs[0] || {
    contentTitle: '',
    contentDescription: '',
    contentImage: '',
    benefits: [],
    ctaText: 'Get started',
    ctaUrl: '#'
  };

  return (
    <section className="py-14 px-6 bg-[#f8fafc] border-b">
      <div className="container mx-auto max-w-7xl">
        
        {/* Title */}
        <h2 className="text-[#0a1128] text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-3xl mx-auto mb-12 text-center leading-tight tracking-tight">
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column Navigation Accordion */}
          <div className="w-full lg:w-[320px] bg-white border border-slate-100 rounded-3xl p-5 shadow-md flex-shrink-0 space-y-4">
            {categories.map((category, catIdx) => {
              const isOpen = !!expandedCategories[catIdx];
              const arrowIcon = isOpen 
                ? '/App- App over view (mobile app)/arrow-up-square_svgrepo.com.png'
                : '/App- App over view (mobile app)/Page-1.png';

              return (
                <div key={catIdx} className="space-y-2 border-b border-slate-50 last:border-b-0 pb-3 last:pb-0">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(catIdx)}
                    className="w-full flex items-center justify-between py-2 text-[#0a1128] font-black text-[13px] tracking-wider uppercase text-left group hover:text-indigo-600 transition-colors"
                  >
                    <span>{category.name}</span>
                    <div className="w-5 h-5 relative shrink-0">
                      <Image
                        src={arrowIcon}
                        alt="toggle"
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>

                  {/* Tabs list inside this Category */}
                  {isOpen && (
                    <div className="space-y-1 pl-1">
                      {category.tabs.map((tab, tabIdx) => {
                        const isSelected = activeCategoryIdx === catIdx && activeTabIdx === tabIdx;
                        return (
                          <button
                            key={tabIdx}
                            onClick={() => selectTab(catIdx, tabIdx)}
                            className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 border-l-4 ${
                              isSelected
                                ? 'bg-indigo-50/60 border-indigo-600 text-[#0a1128]'
                                : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {tab.icon && (
                              <div className={`w-8 h-8 relative p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-indigo-100/70 text-indigo-700' : 'bg-slate-50 border border-slate-100'
                              }`}>
                                <Image
                                  src={tab.icon}
                                  alt={tab.label}
                                  fill
                                  className="object-contain p-1.5"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold">{tab.label}</div>
                              <div className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{tab.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column Tab Content Panel */}
          <div className="flex-1 w-full bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-md flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[480px]">
            
            {/* Left side content inside card */}
            <div className="flex-1 space-y-6 text-left w-full">
              <div>
                <h3 className="text-[#0a1128] text-2xl font-extrabold mb-3">
                  {currentTab.contentTitle}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {currentTab.contentDescription}
                </p>
              </div>

              {/* Benefits badge chips */}
              {currentTab.benefits && currentTab.benefits.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0a1128]">
                    Benefits:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTab.benefits.map((benefit, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/80 rounded-full hover:bg-slate-100 transition-colors"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              {currentTab.ctaText && (
                <div className="pt-2">
                  <Link
                    href={currentTab.ctaUrl || '#'}
                    className="inline-block px-8 py-3 rounded-full text-xs font-black text-white bg-[#1a1f4e] hover:bg-[#2d326e] shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {currentTab.ctaText}
                  </Link>
                </div>
              )}
            </div>

            {/* Right side mockup screenshot inside card */}
            {currentTab.contentImage && (
              <div className="w-full md:w-[320px] lg:w-[400px] aspect-[4/3] md:aspect-auto md:h-[300px] relative shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
                <Image
                  src={currentTab.contentImage}
                  alt={currentTab.contentTitle || ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
